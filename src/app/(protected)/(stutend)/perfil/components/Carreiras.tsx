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

export default function PerfilCursos() {
    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const [course, setCourse] = useState<Course[]>([]);

    useEffect(() => {
        function getCourse() {
            api.get("/course", {
                headers: {
                    "username": user?.name,
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    let filtrados: Course[] = [];

                    if (user?.type_render === 'carreira') {
                        // Carreiras em andamento (progresso entre 0 e 100)
                        filtrados = res.data.filter((car) =>
                            car.carreira === "sim" &&
                            car.inscrito === 1 &&
                            parseInt(car?.progresso || "0") > 0 &&
                            parseInt(car?.progresso || "0") < 100
                        );
                    } else {
                        // Cursos individuais em andamento
                        filtrados = res.data.filter((car) =>
                            car.carreira === "não" &&
                            car.inscrito === 1 &&
                            parseInt(car?.progresso || "0") > 0 &&
                            parseInt(car?.progresso || "0") < 100
                        );
                    }

                    setCourse(filtrados);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.name && user?.token && course.length < 1) {
            getCourse();
        }
    }, [user, updateResponses, course]);

    if (course.length === 0) return null;

    return (
        <div>
            <span className="fs-28 fw-700 text-auxiliary2-project">
                {user?.type_render === 'carreira' ? 'Carreiras' : 'Cursos'} em andamento
            </span>
            <div className="mt-4">
                <CarrosselCarreiras carreiras={course} progresso={true} />
            </div>
        </div>
    );
}