import Image, { StaticImageData } from "next/image";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { FaRegClock } from "react-icons/fa";
import { IoRadioSharp } from "react-icons/io5";
import { LoaderContext } from "@/contexts/LoaderContext";
import { ProgressBar } from "react-bootstrap";
import { RiPlayMiniLine } from "react-icons/ri";
import axios from "axios";
import bannerYT from "/public/ao_vivo_yt.png";
import placeholder from "/public/placeholder_2.png";
import trofeu from "/public/trofeu.png";
import bannerCelular from "/public/banner_trident_celular.png";
import bannerTablet from "/public/banner_trident_tablet.png";
import bannerDesktop from "/public/banner_trident_desktop.png";

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

interface UserDetails {
    firstname?: string;
    lastname?: string;
    city?: string;
    imagealt?: string | StaticImageData;
}

interface UserData {
    userid?: number;
    xp_total?: number;
    level?: number;
    user?: UserDetails;
}

interface ApiResponse2 {
    data: UserData[];
}

export default function Hero() {
    const [ranking, setRanking] = useState<UserData[]>();
    const [width, setWidth] = useState(90);
    const [course, setCourse] = useState<Course>();

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);

    useEffect(() => {
        function getPerfil() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ranking`, {
                headers: {
                    "database": user.database,
                    "Authorization": `Bearer ${user.token}`
                }
            })
                .then((res: ApiResponse2) => setRanking(res.data))
                .catch((err) => console.log(err));
        }

        if (user?.token && !ranking) getPerfil();
    }, [user, ranking]);

    useEffect(() => {
        setWidth(window?.screen.width > 1580 ? 75 : 65);
    }, []);

    useEffect(() => {
        function getCourse() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
                headers: {
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    let curso;

                    if (user?.type_render === 'carreira') {
                        curso = res.data.find((car) => car.destaque === 1);
                    } else if (user?.type_render === 'curso') {
                        curso = res.data.find((car) => !car.carreira || car.carreira.toUpperCase() !== 'SIM');
                    }


                    setCourse(curso);
                })
                .catch((err) => console.error(err))
                .finally(() => updateResponses());
        }

        if (user?.name && user?.database && !course) {
            getCourse();
        }
    }, [user, updateResponses, course]);

    function verificarImg(userData: UserData): string | StaticImageData {
        if (!userData) {
            userData = { user: { imagealt: placeholder } };
        }

        if (userData?.user?.imagealt !== "") {
            return userData?.user?.imagealt || placeholder;
        }

        return placeholder;
    }

    function removeHtmlTags(text: string) {
        return text.replace(/<[^>]*>/g, '');
    }

    function getImgUrl(url: string) {
        const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/i;
        const match = url.match(regex);
        return match ? match[1] : "";
    }

    return (
        course &&
        <div className="row hero-carreiras">
            <div className="col-xxl-11 p-xxl-0 m-xxl-0 pe-xxl-2">
                <div className="row row-gap-4">
                    <a href="https://discord.gg/F5VXyWnt" target="_blank" className="col-12 d-lg-block d-none px-3.5 ">
                        <Image src={bannerDesktop.src} width={0} height={0} className="w-100 h-auto rounded-3 shadow" alt="Banner Discord" />
                    </a>
                    <a href="https://discord.gg/F5VXyWnt" target="_blank" className="col-12 d-lg-none d-md-block d-none px-2">
                        <Image src={bannerTablet.src} width={0} height={0} className="w-100 h-auto rounded-3 shadow" alt="Banner Discord" />
                    </a>
                    <a href="https://discord.gg/F5VXyWnt" target="_blank" className="col-12 d-md-none d-block px-2">
                        <Image src={bannerCelular.src} width={0} height={0} className="w-100 h-auto rounded-3 shadow" alt="Banner Discord" />
                    </a>
                    <div className="col-xxl-6 col-12 card-hero d-md-block d-none">
                        <div className="d-flex box-shadow-hero rounded-3">
                            <div className="col-5 px-0 rounded-start-3">
                                <Image
                                    src={getImgUrl(course?.icon || "")}
                                    width={0}
                                    height={288}
                                    className="w-100 object-fit-cover rounded-start-3"
                                    alt="Imagem ilustrativa"
                                />
                            </div>
                            <div className="col-7 bg-white d-flex flex-column py-4 px-3 justify-content-between rounded-end-3">
                                <span className="fw-700 fs-21 card-title-hero">{course?.fullname}</span>
                                <span className="card-text-hero">{removeHtmlTags(course?.summary || "")}</span>
                                <div className="d-flex justify-content-between py-4">
                                    <span className="fs-12 d-flex align-items-center">
                                        <FaRegClock className='text-auxiliary1-project me-2' />
                                        {course?.carga} DE ESTUDO
                                    </span>
                                    <a href={user.type_render === 'curso' ? `/cursos/${course.id}` : `/curso?id=${course.id}`}
                                        className="btn btn-primary d-flex align-items-center justify-content-center fs-12 fw-700 px-exxl-4">
                                        {user?.type_render === 'curso' ? 'Acessar Curso' : 'Acessar Carreira'}
                                        <RiPlayMiniLine size={20} strokeWidth={0.5} className="ms-1" />
                                    </a>
                                </div>
                                <div className="d-flex gap-2 align-items-center fs-12 fw-700">
                                    <div className="w-100">
                                        <ProgressBar now={parseInt(course?.progresso || "0")} />
                                    </div>
                                    {course?.progresso || "0"}%
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xxl-6 col-12 card-hero">
                        <a href="https://www.youtube.com/live/L5-731SY_6c?si=Y4Tl1hgFezU-gxTC" target="_blank" className="d-flex text-decoration-none flex-column justify-content-center h-100 rounded-3 box-shadow-hero">
                            <Image src={bannerYT.src} width={0} height={0} className="w-100 h-100 rounded-top-3 overflow-hidden" alt="Banner Youtube" />
                            <span className="py-3 bg-white rounded-bottom-3 text-center fs-21 fw-700">
                                Ao vivo no YouTube
                                <IoRadioSharp size={24} className="ms-2" />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="col-1 d-xxl-block d-none p-0 rounded-3" style={{ overflow: 'hidden' }}>
                <div className="bg-auxiliary1-project p-2 rounded-3">
                    <Image src={trofeu.src} width={trofeu.width} height={trofeu.height} alt="troféu" className="w-100 h-auto px-3 py-2" />
                </div>
                <div className="bg-auxiliary1-project h-100 p-2 rounded-3 mt-3 d-flex flex-column gap-3 align-items-center">
                    <h3 className="text-white text-center mt-exxl-3 mt-4 fs-21 fw-700">Rank</h3>
                    {ranking?.map((item, index) => (
                        <Image key={index} src={verificarImg(item) || ""} width={width} height={width} alt="" className="rounded-circle perfil-ranking-aula1" />
                    ))}
                </div>
            </div>
        </div>
    );
}