import { api } from "@/shared/api/api";
import Image, { StaticImageData } from "next/image";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { FaRegClock } from "react-icons/fa";
import { LoaderContext } from "@/contexts/LoaderContext";
import { ProgressBar } from "react-bootstrap";
import { RiPlayMiniLine } from "react-icons/ri";
import bannerCelular from "/public/ifood/banner_home_desktop.png";
import bannerDesktop from "/public/ifood/banner_home_desktop.png";
import bannerTablet from "/public/ifood/banner_home_desktop.png";
import entregador from "/public/ifood/entregador.png";
import placeholder from "/public/placeholder.png";
import trofeu from "/public/trofeu.png";

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
            api.get("/ranking", {
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
            api.get("/course", {
                headers: {
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    let curso;

                    if (user?.type_render === 'carreira') {
                        curso = res.data.find((car) => car.id === 382);
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
                <div className="row row-gap-4 mt-lg-0 mt-2">
                    <a href="https://www.instagram.com/trident_brasil/" target="_blank" className="col-12 d-lg-block d-none px-3.5 ">
                        <Image src={bannerDesktop.src} width={0} height={0} className="w-100 h-auto rounded-3 shadow" alt="Banner Discord" />
                    </a>
                    <a href="https://www.instagram.com/trident_brasil/" target="_blank" className="col-12 d-lg-none d-md-block d-none px-2">
                        <Image src={bannerTablet.src} width={0} height={0} className="w-100 h-auto rounded-3 shadow" alt="Banner Discord" />
                    </a>
                    <a href="https://www.instagram.com/trident_brasil/" target="_blank" className="col-12 d-md-none d-block px-2">
                        <Image src={bannerCelular.src} width={0} height={0} className="w-100 h-auto rounded-3 shadow" alt="Banner Discord" />
                    </a>
                    <div className="col-xxl-6 col-12 card-hero d-block ">
                        <div className="d-flex box-shadow-hero rounded-3  h-100">
                            <div className="col-5 px-0 rounded-start-3 ">
                                <Image
                                    src={getImgUrl(course?.icon || "")}
                                    width={0}
                                    height={0}
                                    className="w-100   h-100 object-fit-cover rounded-start-3"
                                    alt="Imagem ilustrativa"
                                />
                            </div>

                            <div className="col-7 bg-white d-flex flex-column  py-4 px-3 justify-content-between rounded-end-3">
                                <span className="fw-700 fs-21 text-start ">{course?.fullname}</span>
                                <span className="card-text-hero">{removeHtmlTags(course?.summary || "")}</span>
                                <div className="d-flex flex-column flex-md-row justify-content-between py-md-4 py-2">
                                    <span className="fs-12 d-flex align-items-center my-md-0 my-3">
                                        <FaRegClock className='text-auxiliary1-project me-2' />
                                        {course?.carga} DE ESTUDO
                                    </span>
                                    <a href={user.type_render === 'curso' ? `/cursos/${course.id}` : `/curso?id=${course.id}`}
                                        className="btn btn-primary d-flex align-items-center justify-content-center fs-12 fw-700 px-exxl-4">
                                        {user?.type_render === 'curso' ? 'Acessar Curso' : 'Acessar Carreira'}
                                        <RiPlayMiniLine size={20} strokeWidth={0.5} className="ms-1" />
                                    </a>
                                </div>
                                <div className="d-flex gap-2 align-items-center fs-12 my-2 fw-700">
                                    <div className="w-100">
                                        <ProgressBar now={parseInt(course?.progresso || "0")} />
                                    </div>
                                    {course?.progresso || "0"}%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xxl-6 col-12 card-hero">
                        <div className="hero-ifood-card">
                            <div className="hero-ifood-card__textbox">
                                <p className="hero-ifood-card__text">
                                    Com aulas 100% online, lives com especialistas e uso da Godot Engine, os participantes
                                    aprendem do zero até publicar um game simulador de entrega, acessível, colaborativo e com
                                    foco na direção responsável.
                                </p>
                            </div>

                            <div className="hero-ifood-card__imgwrap">
                                <Image
                                    src={entregador}
                                    alt="Entregador iFood"
                                    width={280}
                                    height={280}
                                    className="hero-ifood-card__img"
                                    priority
                                />
                            </div>
                        </div>
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