import Image from "next/image";

export interface Course {
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


export default function Carreira({ icon, fullname, summary }: Course) {

    function getImgUrl(url: string) {
        const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/i;
        const match = url.match(regex);
        return match ? match[1] : "";
    }

    function removeHtmlTags(text: string) {
        return text.replace(/<[^>]*>/g, '');
    }

    return (
        <div className="d-flex flex-column">
            <Image src={getImgUrl(icon || "")} width={650} height={160} className="w-100 object-fit-cover rounded-top-3" alt="Imagem ilustrativa da carreira" />
            <div className="bg-white d-flex flex-column px-3 py-4 rounded-bottom-3 gap-2">
                <span className="fs-28 fw-700">{fullname}</span>
                <span>{removeHtmlTags(summary || "")}</span>
            </div>
        </div>
    )
}