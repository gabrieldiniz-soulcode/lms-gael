"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { StaticImageData } from "next/image";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

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
    signIn: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
    signOut: () => void;
    signInByRecoveryPassword: (user: User) => void;
    perfil: Profile;
}

interface Props {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthContextProvider({ children }: Props) {

    const [user, setUser] = useState<User>({} as User);
    const [userLevel, setUserLevel] = useState<number | null>(null);
    const [perfil, setPerfil] = useState<Profile>({} as Profile);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        function checkAuth() {
            const localUser = localStorage.getItem('user');
            const sessionUser = sessionStorage.getItem('user');
            if (sessionUser || localUser) {
                const user = localUser ? JSON.parse(localUser) : JSON.parse(sessionUser || '');

                if (!user.isAdmin && (pathname.includes("/admin"))) {
                    router.push("/");
                }

                if (pathname.includes("/login")) {
                    router.push(user.isAdmin ? "/admin" : "/");
                }
                return;
            }

            if (!localUser && !sessionUser && !pathname.includes("/login") && !pathname.includes("/validar-certificado") && !pathname.includes("/user-logado")) {
                router.push('/login');
                return;
            }
        }

        checkAuth();
    }, [router, pathname, user]);

    async function signIn(email: string, password: string, rememberMe: boolean) {
        const userObj = {} as User;

        try {
            const authResponse = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
                username: email,
                password: password,
                database: process.env.NEXT_PUBLIC_DATABASE
            })

            if (authResponse.data.error) {
                return true;
            }

            console.log(authResponse.data)

            userObj.id = authResponse.data.data.userid;
            userObj.name = authResponse.data.data.username;
            userObj.database = authResponse.data.data.database!;
            userObj.token = authResponse.data.token;
            userObj.isAdmin = authResponse.data.data.isAdmin;


            const decoded: DecodedToken = jwtDecode<DecodedToken>(userObj.token);
            userObj.type_render = decoded.type_render;
            console.log(userObj)
            getPerfil(userObj);

            setUser(userObj);

            const expiry = decoded.exp ? decoded.exp * 1000 : 0;
            const data = {
                user: userObj,
                expiry: expiry
            };

            if (rememberMe) {
                localStorage.setItem('user', JSON.stringify(data));
            } else {
                sessionStorage.setItem('user', JSON.stringify(userObj));
            }

            await fetchUserLevel(userObj.id, userObj.database, userObj.token);

            if (authResponse.data.data.forcepasswordchange == 1) {
                setTimeout(() => {
                    router.push("/perfil/alterar-senha");
                }, 1000);
                return false;
            }

            router.push("/");

            return false;
        }
        catch {
            return true;
        }
    }

    function getPerfil(userObj: User) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            headers: {
                "database": userObj.database,
                "Authorization": `Bearer ${userObj.token}`
            }
        })
            .then((res: ApiResponse) => {
                setPerfil(res.data);
                localStorage.setItem('profile', JSON.stringify(res.data));
                sessionStorage.setItem('profile', JSON.stringify(res.data));
            })
            .catch((err) => {
                console.log(err);
            })
    }


    function signInByRecoveryPassword(user: User) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        fetchUserLevel(user.id, user.database, user.token);
        router.push("/");
    }

    function signOut() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setUserLevel(null);
        router.push("/login");
    }

    function isTokenExpired(token: string) {
        if (!token) return true;
        try {
            const decoded = jwtDecode(token);
            if (!decoded.exp) return true;
            return Date.now() >= decoded.exp * 1000;
        } catch (e) {
            console.error(e);
            return true;
        }
    }

    const fetchUserLevel = useCallback(async (userid: string | number, database: string, token: string) => {
        try {
            const res = await axios.get<UserData[]>(`${process.env.NEXT_PUBLIC_API_URL}/ranking`, {
                headers: {
                    "database": database,
                    "Authorization": `Bearer ${token}`
                }
            });

            const currentUser = res.data.find(item => item.userid === Number(userid));
            if (currentUser && currentUser.level !== undefined) {
                setUserLevel(currentUser.level);
            }
        } catch (err) {
            console.error("Erro ao buscar o nível do usuário:", err);
        }
    }, []);

    const loadUserFromStorage = useCallback(() => {
        const local = localStorage.getItem('user');
        const sessionUser = sessionStorage.getItem('user');
        const profile = localStorage.getItem('profile');
        let userObj = null;

        if (local) {
            const localUser = JSON.parse(local);
            if (localUser?.user) {
                userObj = localUser.user;
                if (isTokenExpired(userObj.token)) {
                    localStorage.removeItem('user');
                    return;
                }
            }
        } else if (sessionUser) {
            userObj = JSON.parse(sessionUser);
            if (isTokenExpired(userObj.token)) {
                sessionStorage.removeItem('user');
                return;
            }
        }

        if (userObj) {
            setPerfil(JSON.parse(profile || '{}'));
            setUser(userObj);
            fetchUserLevel(userObj.id, userObj.database, userObj.token);
        }
    }, [fetchUserLevel]);

    useEffect(() => {
        loadUserFromStorage();
    }, [loadUserFromStorage]);

    return (
        <AuthContext.Provider value={{ user, userLevel, setUserLevel, signOut, signIn, signInByRecoveryPassword, perfil }}>
            {children}
        </AuthContext.Provider>
    );
}