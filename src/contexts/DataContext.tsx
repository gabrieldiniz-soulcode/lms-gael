"use client";

import { createContext, useEffect, useState } from 'react';

type DataContextData = {
    aula: Sequence;
    setAula: (newAula: Sequence) => void;
}

interface Sequence {
    cmid: number,
    module: string;
    complete: boolean;
    data_module: {
        name: string;
        course: number;
        content: string;
    }
}

interface Props {
    children: React.ReactNode;
}

const DataContext = createContext({} as DataContextData);

const DataProvider = ({ children }: Props) => {

    const [aula, setAula] = useState<Sequence>({} as Sequence);

    return (
        <DataContext.Provider value={{ aula, setAula }}>
            {children}
        </DataContext.Provider>
    );
};

export { DataProvider, DataContext };