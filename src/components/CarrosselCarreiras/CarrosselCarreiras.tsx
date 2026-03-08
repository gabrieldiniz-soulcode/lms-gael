"use client";

import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { useContext, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from "next/navigation";
import { Navigation, Pagination } from 'swiper/modules';

import { FaRegClock } from "react-icons/fa";
import Image from "next/image";
import { ProgressBar } from 'react-bootstrap';
import { RiPlayMiniLine } from "react-icons/ri";
import { AuthContext } from "@/contexts/AuthContext";

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

interface Props {
    carreiras: Course[];
    progresso?: boolean;
    categoria?: string;
}

export default function CarrosselCarreiras({ carreiras, progresso = false, categoria }: Props) {

    const [carreirasFiltradas, setCarreirasFiltradas] = useState<Course[]>([]);
    const { user } = useContext(AuthContext);

    const searchParams = useSearchParams();
    const pathname = usePathname();

    const search = searchParams.get('search');

    useEffect(() => {
        if (!user) return;

        let listaFiltrada = carreiras.filter(c => c.inscrito === 1);

        const searchTerm = search?.toLowerCase() || "";
        const rota = user.type_render === "curso" ? "cursos" : "carreiras";

        if (searchTerm && pathname.includes(rota)) {
            listaFiltrada = listaFiltrada.filter((carreira) =>
                carreira.fullname.toLowerCase().includes(searchTerm)
            );

            const section = document.getElementById("carreiras");
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
        setCarreirasFiltradas(listaFiltrada);
        ordenarArquivos(listaFiltrada)

    }, [search, pathname, carreiras, user]);
    function slugify(value?: string | null): string {
        if (!value) return "default";

        return value
            .normalize("NFD")                 // remove acentos
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")      // troca chars inválidos
            .replace(/(^-|-$)+/g, "");        // remove - início/fim
    }

    function getImgUrl(url: string) {
        const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/i;
        const match = url.match(regex);
        return match ? match[1] : "";
    }
    function ordenarArquivos(list: any[]) {
        if (categoria?.includes('DESENVOLVIMENTO DE GAMES')) {
            const removiveis = list.slice(3, 5)
            console.log(removiveis)

            list.splice(1, 0, ...removiveis.reverse())
            console.log(list)
            list.splice(5, 2)
            setCarreirasFiltradas(list);
        }

    }
    return (
        carreirasFiltradas.length > 0 &&
        <div className='overflow-hidden px-2'>
            {
                categoria
                && <div className='position-relative'>


                    <div className="w-100 h-100 d-flex justify-content-between gap-2 align-items-center z-1  mb-4 mt-5 px-2 ">
                        <div className={`custom-prev-${slugify(categoria) || "default"} `}> <img src="/Back Arrow.svg" className='arrows' alt="Back Arrow" /> </div>
                        <h1 className="fs-28 fw-700  text-center">{categoria}</h1>
                        <div className={`custom-next-${slugify(categoria) || "default"} `}><img src="/Back Arrow.svg" className='arrows' alt="Back Arrow" style={{ rotate: "180deg" }} /></div>
                    </div>


                    <Swiper
                        modules={[Navigation, Pagination]}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 40 },

                            1320: { slidesPerView: 3, spaceBetween: 30 }
                        }}

                        pagination={{
                            clickable: true,
                        }}
                        navigation={{
                            prevEl: `.custom-prev-${slugify(categoria) || "default"}`,
                            nextEl: `.custom-next-${slugify(categoria) || "default"}`,
                        }}
                        className="mySwiper carrossel-carreiras position-relative z-0"
                    >

                        {
                            carreirasFiltradas.map((carreira, index) => (
                                <SwiperSlide key={index} className={`card-curso carrossel-carreiras-slide rounded-3 ${progresso ? 'carrossel-carreiras-slide-progresso' : ''}`}>
                                    <Image src={getImgUrl(carreira?.icon || "")} width={0} height={160} className="w-100 object-fit-cover rounded-top-3" alt="Imagem representativa da Carreira" />
                                    <div className="px-4 d-flex flex-column justify-content-between carrossel-carreiras-infos w-100">
                                        <div>
                                            <div className="d-flex justify-content-between py-4">
                                                <span className="fs-12 d-flex align-items-center">
                                                    <FaRegClock className='text-auxiliary1-project me-2' />
                                                    {carreira.carga}H DE ESTUDO
                                                </span>
                                                <a
                                                    href={
                                                        user?.type_render === 'curso'
                                                            ? `/cursos/${carreira.id}`
                                                            : `/curso?id=${carreira.id}`
                                                    }
                                                    className="btn btn-primary d-flex align-items-center justify-content-center fs-12 fw-700 px-md-4"
                                                >
                                                    {user?.type_render === 'curso' ? 'Acessar Curso' : 'Acessar Carreira'}
                                                    <RiPlayMiniLine size={20} strokeWidth={0.5} className="ms-1" />
                                                </a>
                                            </div>
                                            <span className="fs-18 fw-700">{carreira.fullname}</span>
                                        </div>
                                        {
                                            progresso
                                            &&
                                            <div className="d-flex pb-3 gap-2 align-items-center fs-12 fw-700">
                                                <div className="w-100">
                                                    <ProgressBar now={parseInt(carreira?.progresso || "0")} />
                                                </div>
                                                {carreira.progresso || "0"}%
                                            </div>
                                        }
                                    </div>
                                </SwiperSlide>
                            ))
                        }

                    </Swiper>
                </div>

            }
        </div>
    )
}