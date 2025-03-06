'use client';

import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import CarrosselCarreiras from "./CarrosselCarreiras";

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
}

interface ApiResponse {
    data: Course[];
}

export default function Categorias() {
    const { user } = useContext(AuthContext);
    const [course, setCourse] = useState<Course[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        function getCourse() {
            setLoading(true);
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/course?username=${user?.name}&database=${user?.database}`)
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
                    setLoading(false);
                });
        }

        if (user?.name && user?.database) {
            getCourse();
        }
    }, [user]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
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
