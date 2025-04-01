"use client";

import { createContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import axios from "axios";

interface User {
    name: string;
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

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
            username: email,
            password: password,
            database: process.env.NEXT_PUBLIC_DATABASE
        })
            .then((authResponse) => {

                if (authResponse.data.error) {
                    alert('CREDENCIAIS INVÁLIDAS');
                    return;
                }

                userObj.id = authResponse.data.data.userid;
                userObj.name = authResponse.data.data.database;
                userObj.database = authResponse.data.data.database!;
                userObj.token = authResponse.data.token;

                setUser(userObj);

                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(userObj));
                }
                else {
                    sessionStorage.setItem('user', JSON.stringify(userObj));
                }

                if (authResponse.data.data.forcepasswordchange == 1) {
                    router.push("/perfil/alterar-senha");
                    return;
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

        router.push("/login");
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