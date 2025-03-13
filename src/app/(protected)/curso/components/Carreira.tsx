import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

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

export default function Carreira() {

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const [carreira, setCarreira] = useState<Course>();

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        function getCourse() {
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/course`, {
                headers: {
                    "username": user?.name,
                    "database": user?.database
                }
            })
                .then((res: ApiResponse) => {
                    setCarreira(res.data.find((item) => item.id == parseInt(search || "0")));
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.name && user?.database) {
            getCourse();
        }
    }, [user, updateResponses, search]);

    function removeHtmlTags(text: string) {
        return text.replace(/<[^>]*>/g, '');
    }

    return (
        carreira
        &&
        <div className="d-flex flex-column">
            <Image src="https://placehold.co/223x288" width={650} height={160} className="w-100 object-fit-cover rounded-top-3" alt="Imagem ilustrativa da carreira" />
            <div className="bg-white d-flex flex-column px-3 py-4 rounded-bottom-3 gap-2">
                <span className="fs-28 fw-700">{carreira.fullname}</span>
                <span>{removeHtmlTags(carreira.summary || "")}</span>
            </div>
        </div>
    )
}