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

export default function Carreiras() {

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const [course, setCourse] = useState<Course[]>();

    useEffect(() => {
        function getCourse() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
                headers: {
                    "username": user?.name,
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    const carreiras = res.data.filter((car) => car.carreira === "sim" && car.inscrito == 1 && parseInt(car?.progresso || "0") > 0 && parseInt(car?.progresso || "0") < 100);
                    setCourse(carreiras);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.name && user?.token && !course) {
            getCourse();
        }
    }, [user, updateResponses, course]);

    return (
        course
        &&
        <div>
            <span className="fs-28 fw-700 text-auxiliary1-project">Carreiras em andamento</span>
            <div className="mt-4">
                <CarrosselCarreiras carreiras={course} progresso={true} />
            </div>
        </div>
    );
}
