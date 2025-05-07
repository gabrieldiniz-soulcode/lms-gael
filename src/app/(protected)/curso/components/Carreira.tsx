import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { LoaderContext } from "@/contexts/LoaderContext";
import axios from "axios";
import { useSearchParams } from "next/navigation";

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
    const { updateResponses, responses } = useContext(LoaderContext);
    const [carreira, setCarreira] = useState<Course>();

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        function getCourse() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
                headers: {
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    setCarreira(res.data.find((item) => item.id == parseInt(id || "0")));
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.name && user?.database && !responses?.every((value) => value === true)) {
            getCourse();
        }
    }, [user, updateResponses, id, responses]);

    function getImgUrl(url: string) {
        const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/i;
        const match = url.match(regex);
        return match ? match[1] : "";
    }

    function removeHtmlTags(text: string) {
        return text.replace(/<[^>]*>/g, '');
    }

    return (
        carreira
        &&
        <div className="d-flex flex-column">
            <Image src={getImgUrl(carreira?.icon || "")} width={650} height={160} className="w-100 object-fit-contain rounded-top-3" alt="Imagem ilustrativa da carreira" />
            <div className="bg-white d-flex flex-column px-3 py-4 rounded-bottom-3 gap-2">
                <span className="fs-28 fw-700">{carreira.fullname}</span>
                <span>{removeHtmlTags(carreira.summary || "")}</span>
            </div>
        </div>
    )
}