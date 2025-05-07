"use client";

import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import axios from "axios";
import { jwtDecode } from 'jwt-decode';

interface User {
    name: string;
    token: string;
    database: string;
    id: string;
}

type AuthContextData = {
    user: User;
    signIn: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
    signOut: () => void;
    signInByRecoveryPassword: (user: User) => void;
}

interface Props {
    children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthContextProvider({ children }: Props) {

    const [user, setUser] = useState<User>({} as User);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        loadUserFromStorage();
    }, []);

    useEffect(() => {
        function checkAuth() {
            const localUser = localStorage.getItem('user');
            const sessionUser = sessionStorage.getItem('user');
            if (sessionUser && pathname.includes("/login")) {
                router.push('/');
                return;
            }
            if (!localUser && !sessionUser && !pathname.includes("/login") && !pathname.includes("/validar-certificado")) {
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

            userObj.id = authResponse.data.data.userid;
            userObj.name = authResponse.data.data.database;
            userObj.database = authResponse.data.data.database!;
            userObj.token = authResponse.data.token;

            setUser(userObj);

            const decoded = jwtDecode(userObj.token);
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

    function signInByRecoveryPassword(user: User) {
        setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
        router.push("/");
    }

    function signOut() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

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

    function loadUserFromStorage() {
        const local = localStorage.getItem('user');
        const sessionUser = sessionStorage.getItem('user');
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

        if (userObj) setUser(userObj);
    }

    return (
        <AuthContext.Provider value={{ user, signOut, signIn, signInByRecoveryPassword }}>
            {children}
        </AuthContext.Provider>
    );
}