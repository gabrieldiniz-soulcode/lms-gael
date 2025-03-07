"use client";

import { createContext, useState } from 'react';

type LoaderContextData = {
    responses: boolean[];
    setResponses: (value: boolean[]) => void;
    isLoading: boolean;
    setIsLoading: (newIsLoading: boolean) => void;
    updateResponses: () => void;
}

interface Props {
    children: React.ReactNode;
}

const LoaderContext = createContext({} as LoaderContextData);

const LoaderProvider = ({ children }: Props) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [responses, setResponses] = useState<boolean[]>([false]);

    function CheckResponse() {
        const allTrue = responses?.every((value) => value === true);

        if (allTrue) {
            setIsLoading(false)
            window.scrollTo({
                top: 0
            });
        }
    }

    const updateResponses = () => {
        const newReponses = responses;
        const index = newReponses.findIndex((v) => !v);
        newReponses[index] = true;

        setResponses(newReponses);
        CheckResponse();
    };

    return (
        <LoaderContext.Provider value={{ isLoading, setIsLoading, setResponses, responses, updateResponses }}>
            {children}
        </LoaderContext.Provider>
    );
};

export { LoaderProvider, LoaderContext };