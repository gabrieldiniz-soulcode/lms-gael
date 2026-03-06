"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { StaticImageData } from "next/image";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface User {
    name: string;
    token: string;
    database: string;
    id: string;
    type_render?: "curso" | "carreira";
    isAdmin: boolean;
}

interface UserData {
    userid?: number;
    xp_total?: number;
    level?: number;
    user?: UserDetails;
}

interface UserDetails {
    firstname?: string;
    lastname?: string;
    city?: string;
    imagealt?: string | StaticImageData;
}

interface DecodedToken {
    userid: number;
    username: string;
    database: string;
    type_render: "curso" | "carreira";
    iat: number;
    exp: number;
}

interface Profile {
    firstname: string;
    imagealt: string;
}

interface ApiResponse {
    data: Profile;
}

type AuthContextData = {
    user: User;
    userLevel: number | null;
    setUserLevel: (level: number) => void;
    signIn: (email: string, password: string, rememberMe: boolean, origin?: string) => Promise<boolean>;
    signOut: () => void;
    signInByRecoveryPassword: (user: User) => void;
    perfil: Profile;
};

interface Props {
    children: React.ReactNode;
}

type StoredUser = { user: User; expiry: number };

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: Props) {
    const [user, setUser] = useState<User>({} as User);
    const [userLevel, setUserLevel] = useState<number | null>(null);
    const [perfil, setPerfil] = useState<Profile>({} as Profile);

    const router = useRouter();
    const pathname = usePathname();

    function isTokenExpired(token: string) {
        if (!token) return true;
        try {
            const decoded: any = jwtDecode(token);
            if (!decoded?.exp) return true;
            return Date.now() >= decoded.exp * 1000;
        } catch {
            return true;
        }
    }

    function readStoredUser(): StoredUser | null {
        const raw = localStorage.getItem("user") ?? sessionStorage.getItem("user");
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);

            if (parsed?.user?.token) {
                return parsed as StoredUser;
            }

            if (parsed?.token) {
                const decoded: any = jwtDecode(parsed.token);
                const expiry = (decoded?.exp ?? 0) * 1000;
                return { user: parsed as User, expiry };
            }

            return null;
        } catch {
            return null;
        }
    }

    function clearStoredUser() {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
    }

    function saveUser(userObj: User, rememberMe: boolean) {
        const decoded: any = jwtDecode(userObj.token);
        const expiry = (decoded?.exp ?? 0) * 1000;
        const payload: StoredUser = { user: userObj, expiry };

        if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(payload));
            sessionStorage.removeItem("user");
        } else {
            sessionStorage.setItem("user", JSON.stringify(payload));
            localStorage.removeItem("user");
        }
    }

    const fetchUserLevel = useCallback(async (userid: string | number, database: string, token: string) => {
        try {
            const res = await axios.get<UserData[]>(`${process.env.NEXT_PUBLIC_API_URL}/ranking`, {
                headers: {
                    database,
                    Authorization: `Bearer ${token}`,
                },
            });

            const currentUser = res.data.find((item) => item.userid === Number(userid));
            if (currentUser && currentUser.level !== undefined) {
                setUserLevel(currentUser.level);
            }
        } catch (err) {
            console.error("Erro ao buscar o nível do usuário:", err);
        }
    }, []);

    function getPerfil(userObj: User) {
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
                headers: {
                    database: userObj.database,
                    Authorization: `Bearer ${userObj.token}`,
                },
            })
            .then((res: ApiResponse) => {
                setPerfil(res.data);
                localStorage.setItem("profile", JSON.stringify(res.data));
                sessionStorage.setItem("profile", JSON.stringify(res.data));
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const loadUserFromStorage = useCallback(() => {
        const stored = readStoredUser();
        const profile = localStorage.getItem("profile") ?? sessionStorage.getItem("profile");

        if (!stored) return;

        if (isTokenExpired(stored.user.token)) {
            clearStoredUser();
            return;
        }

        if (profile) {
            try {
                setPerfil(JSON.parse(profile));
            } catch { }
        }

        setUser(stored.user);
        fetchUserLevel(stored.user.id, stored.user.database, stored.user.token);
    }, [fetchUserLevel]);

    useEffect(() => {
        loadUserFromStorage();
    }, [loadUserFromStorage]);

    useEffect(() => {
        function checkAuth() {
            const stored = readStoredUser();
            const publicPaths = ["/login", "/validar-certificado", "/user-logado", "/perfil/alterar-senha"];

            if (stored?.user) {
                const u = stored.user;

                if (isTokenExpired(u.token)) {
                    clearStoredUser();
                    if (!publicPaths.some((p) => pathname.includes(p))) {
                        router.replace("/login");
                    }
                    return;
                }

                if (!u.isAdmin && pathname.includes("/admin")) {
                    router.replace("/");
                    return;
                }

                if (u.isAdmin && !pathname.includes("/admin")) {
                    router.replace("/admin");
                    return;
                }

                if (pathname.includes("/login")) {
                    router.replace(u.isAdmin ? "/admin" : "/");
                    return;
                }

                return;
            }

            if (!publicPaths.some((p) => pathname.includes(p))) {
                router.replace("/login");
                return;
            }
        }

        checkAuth();
    }, [router, pathname]);

    async function signIn(email: string, password: string, rememberMe: boolean, origin?: "autoLogin") {
        const userObj = {} as User;

        try {
            const authResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                username: email,
                password,
                database: process.env.NEXT_PUBLIC_DATABASE,
                institution: "Ifood",
            });

            if (authResponse.data.error) {
                return true;
            }

            userObj.id = authResponse.data.data.userid;
            userObj.name = authResponse.data.data.username;
            userObj.database = authResponse.data.data.database!;
            userObj.token = authResponse.data.token;
            userObj.isAdmin = authResponse.data.data.isAdmin;

            const decoded: DecodedToken = jwtDecode<DecodedToken>(userObj.token);
            userObj.type_render = decoded.type_render;

            getPerfil(userObj);
            setUser(userObj);
            saveUser(userObj, rememberMe);

            await fetchUserLevel(userObj.id, userObj.database, userObj.token);

            if (authResponse.data.data.forcepasswordchange == 1) {
                router.replace("/perfil/alterar-senha");
                return false;
            }

            router.replace("/");
            return false;
        } catch {
            if (origin === "autoLogin") {
                router.replace("/login");
                return true;
            }
            return true;
        }
    }

    function signInByRecoveryPassword(userObj: User) {
        setUser(userObj);
        saveUser(userObj, true);
        fetchUserLevel(userObj.id, userObj.database, userObj.token);
        router.replace("/");
    }

    function signOut() {
        clearStoredUser();
        setUserLevel(null);
        router.replace("/login");
    }

    return (
        <AuthContext.Provider value={{ user, userLevel, setUserLevel, signOut, signIn, signInByRecoveryPassword, perfil }}>
            {children}
        </AuthContext.Provider>
    );
}