"use client";

import { LoaderContext } from "@/contexts/LoaderContext";
import { useContext } from "react";
import { Spinner } from "react-bootstrap";

interface Props {
    children: React.ReactNode;
}

export default function Loader({ children }: Props) {

    const { isLoading } = useContext(LoaderContext)

    return (
        <>
            <div className={`${isLoading ? 'd-none' : ''}`}>
                {children}
            </div>
            <div className={`d-flex justify-content-center align-items-center ${isLoading ? '' : 'd-none'}`} style={{ height: "86vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        </>
    );
}