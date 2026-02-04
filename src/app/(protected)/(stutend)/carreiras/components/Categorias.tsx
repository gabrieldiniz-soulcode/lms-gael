import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import CarrosselCarreiras from "@/components/CarrosselCarreiras/CarrosselCarreiras";
import { LoaderContext } from "@/contexts/LoaderContext";
import axios from "axios";

interface Course {
    id: number;
    fullname: string;
    summary?: string;
    visible?: number;
    category: string;
    icon?: string;
    carga: string;
    carreira: string;
    inscrito?: number;
    destaque?: number;
    progresso?: string;
}

interface ApiResponse {
    data: Course[];
}

const FIXED_CATEGORIES = [
    "JORNADA DO CREATOR",
    "SOFTSKILLS",
    "FUNDAMENTOS DE CRIAÇÃO DE GAMES",
] as const;

export default function Categorias() {
    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const [course, setCourse] = useState<Course[][]>();

    useEffect(() => {
        function getCourse() {
            axios
                .get(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
                    headers: {
                        database: user?.database,
                        Authorization: `Bearer ${user?.token}`,
                    },
                })
                .then((res: ApiResponse) => {
                    const cursos = res.data.filter((car) => car.carreira === "sim" && car.inscrito == 1);

                    // pega categorias únicas (preserva ordem original)
                    const categoriasOriginais = [...new Set(cursos.map((curso) => (curso.category ?? "").trim()))];

                    // ordena fixando as 3 primeiras nessa ordem, mantendo o resto como estava
                    const fixedSet = new Set(FIXED_CATEGORIES);
                    const fixedOrdered = FIXED_CATEGORIES.filter((c) => categoriasOriginais.includes(c));
                    const restantes = categoriasOriginais.filter((c) => !fixedSet.has(c));
                    const categoriasOrdenadas = [...fixedOrdered, ...restantes];

                    const cursosPorCategoria = categoriasOrdenadas.map((categoria) => {
                        return cursos.filter((curso) => (curso.category ?? "").trim() === categoria);
                    });

                    setCourse(cursosPorCategoria);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.name && user?.database && !course) {
            getCourse();
        }
    }, [user, updateResponses, course]);

    return (
        course && (
            <div id="carreiras">
                {course.map((categoria, index) => (
                    <div key={index}>
                        <div>
                            <CarrosselCarreiras carreiras={categoria} categoria={categoria[0]?.category} />
                        </div>
                    </div>
                ))}
            </div>
        )
    );
}
