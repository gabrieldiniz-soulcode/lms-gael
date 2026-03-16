import { api } from "@/shared/api/api";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import CarrosselCarreiras from "@/components/CarrosselCarreiras/CarrosselCarreiras";
import { LoaderContext } from "@/contexts/LoaderContext";
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

export default function CategoriasCursos() {

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const [course, setCourse] = useState<Course[][]>();

    useEffect(() => {
        function getCourse() {
            api.get("/course", {
                headers: {
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    const cursos = res.data.filter((cur) => cur.carreira === "não" && cur.inscrito === 1);
                    const categorias = [...new Set(cursos.map(curso => curso.category))];
                    const cursosPorCategoria = categorias.map(categoria => {
                        return cursos.filter(curso => curso.category === categoria);
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
        course
        &&
        <div id="cursos">
            {
                course.map((categoria, index) => (
                    <div key={index}>
                        <div>
                            <CarrosselCarreiras carreiras={categoria} categoria={categoria[0]?.category} />
                        </div>
                    </div>
                ))
            }

        </div>
    );
}