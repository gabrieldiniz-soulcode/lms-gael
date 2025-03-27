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

export default function Categorias() {

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const [course, setCourse] = useState<Course[][]>();

    useEffect(() => {
        function getCourse() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
                headers: {
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    const cursos = res.data.filter((car) => car.carreira === "sim");
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
        course.map((categoria, index) => (
            <div key={index}>
                <h1 className="fs-28 fw-700 mb-4 mt-5">{categoria[0]?.category}</h1>
                <div>
                    <CarrosselCarreiras carreiras={categoria} />
                </div>
            </div>
        ))
    );
}
