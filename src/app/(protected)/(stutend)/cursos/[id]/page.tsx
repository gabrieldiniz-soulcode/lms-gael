"use client";

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { LoaderContext } from "@/contexts/LoaderContext";
import Ranking from "../../carreiras/components/Ranking";
import { Spinner } from "react-bootstrap";
import SubCurso from "../../curso/components/SubCurso";
import { api } from "@/shared/api/api";
import { useParams } from "next/navigation";

interface Module {
    id: number;
    course: number;
    name: string;
    summary: string;
    summaryformat: number;
    sequence: Sequence[];
    visible: number;
    availability: string | null;
    timemodified: number;
}

interface Sequence {
    cmid: number;
    module: string;
    complete: boolean;
    data_module: {
        name: string;
        course: number;
        content: string;
    };
}


export default function CursoTopicosPage() {
    const [modulos, setModulos] = useState<Module[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const params = useParams();

    const cursoId = params?.id as string;

    useEffect(() => {
        if (!user?.token || !cursoId) return;

        async function getModule() {

            try {
                const res = await api.get<Module[]>("/module", {
                    headers: {
                        course: cursoId
                    }
                });

                setModulos(res.data);

            } catch (err) {
                console.error("Erro ao carregar módulos:", err);
            } finally {
                setLoading(false);
                updateResponses();
            }
        }

        getModule();
    }, [user?.token, cursoId, updateResponses]);

    return (
        <div className="row mb-5 mx-auto curso-content">
            <Link href="/cursos" className="col-12 mt-2 mb-4 text-decoration-none d-flex align-items-center gap-2">
                Voltar para cursos
            </Link>

            {loading ? (
                <div className="w-100 d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="d-flex justify-content-center">

                    <div className="col-xl-8 col-12">
                        <SubCurso subCurso={modulos} carreiraId={cursoId} />
                    </div>
                    <div className="col-xl-4 col-12 d-xl-block d-none">
                        <Ranking />
                    </div>
                </div>
            )}
        </div>
    );
}