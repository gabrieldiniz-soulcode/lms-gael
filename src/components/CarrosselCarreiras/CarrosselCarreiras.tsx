"use client";

import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from "next/navigation";

import { FaRegClock } from "react-icons/fa";
import Image from "next/image";
import { ProgressBar } from 'react-bootstrap';
import { RiPlayMiniLine } from "react-icons/ri";

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

    const searchParams = useSearchParams();
    const pathname = usePathname();

    const search = searchParams.get('search');

    useEffect(() => {
        setCarreirasFiltradas(carreiras);
        if (pathname.includes('carreiras') && search) {
            setCarreirasFiltradas(carreiras.filter((carreira) => carreira.fullname.toLocaleLowerCase().includes(search.toLocaleLowerCase())));
            const section = document.getElementById('carreiras');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [search, pathname, carreiras]);

    function getImgUrl(url: string) {
        const regex = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/i;
        const match = url.match(regex);
        return match ? match[1] : "";
    }

    return (
        carreirasFiltradas.length > 0 &&
        <>
            {
                categoria
                &&
                <h1 className="fs-28 fw-700 mb-4 mt-5">{categoria}</h1>
            }
            <Swiper
                slidesPerView={"auto"}
                spaceBetween={30}
                pagination={{
                    clickable: true,
                }}
                className="mySwiper carrossel-carreiras"
            >
                {
                    carreirasFiltradas.map((carreira, index) => (
                        <SwiperSlide key={index} className={`carrossel-carreiras-slide rounded-3 ${progresso ? 'carrossel-carreiras-slide-progresso' : ''}`}>
                            <Image src={getImgUrl(carreira?.icon || "")} width={0} height={160} className="w-100 object-fit-contain rounded-top-3" alt="Imagem representativa da Carreira" />
                            <div className="px-4 d-flex flex-column justify-content-between carrossel-carreiras-infos">
                                <div>
                                    <div className="d-flex justify-content-between py-4">
                                        <span className="fs-12 d-flex align-items-center">
                                            <FaRegClock className='text-auxiliary1-project me-2' />
                                            {carreira.carga}H DE ESTUDO
                                        </span>
                                        <a href={`/curso?id=${carreira.id}`} className="btn btn-primary d-flex align-items-center justify-content-center fs-12 fw-700 px-md-4">
                                            Acessar Carreira
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
        </>
    )
}