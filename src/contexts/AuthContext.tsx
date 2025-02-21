"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import path from "path";
import { createContext, useEffect, useState } from "react";

interface User {
    name: string;
    privatetoken: string;
    token: string;
    database: string;
    id: string;
}

type AuthContextData = {
    user: User;
    signIn: (email: string, password: string, rememberMe: boolean) => void;
    signOut: () => void;
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

            if (sessionUser && pathname === '/login/') {
                router.push('/');
                return;
            }
            if (!localUser && !sessionUser && pathname !== '/login') {
                router.push('/login');
                return;
            }
        }

        checkAuth();
    }, [router, pathname]);

    function signIn(email: string, password: string, rememberMe: boolean) {
        const userObj = {} as User;

        Promise.all([
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/login?username=${email}`),
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/auth?username=${email}&password=${password}&database=${process.env.NEXT_PUBLIC_DATABASE}`)
        ])
            .then(([loginResponse, authResponse]) => {
                if (authResponse.data.message) {
                    alert('CREDENCIAIS INVÁLIDAS');
                    return;
                }

                const u = loginResponse.data.find((item: { base: string }) => item.base == process.env.NEXT_PUBLIC_DATABASE);

                userObj.id = u.id;
                userObj.name = email;
                userObj.database = process.env.NEXT_PUBLIC_DATABASE!;
                userObj.privatetoken = authResponse.data.privatetoken;
                userObj.token = authResponse.data.token;

                setUser(userObj);

                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(userObj));
                }
                else {
                    sessionStorage.setItem('user', JSON.stringify(userObj));
                }

                router.push("/");
            })
            .catch(error => {
                console.error(error);
            });
    }


    function signOut() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
    }

    function loadUserFromStorage() {
        const localUser = localStorage.getItem('user');
        const sessionUser = sessionStorage.getItem('user');

        if (localUser) {
            setUser(JSON.parse(localUser));
        } else if (sessionUser) {
            setUser(JSON.parse(sessionUser));
        }
    }

    return (
        <AuthContext.Provider value={{ user, signOut, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}