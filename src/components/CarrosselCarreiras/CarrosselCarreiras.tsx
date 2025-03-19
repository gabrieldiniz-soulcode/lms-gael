import { Swiper, SwiperSlide } from 'swiper/react';
import Image from "next/image";
import { FaRegClock } from "react-icons/fa";
import { RiPlayMiniLine } from "react-icons/ri";
import { ProgressBar } from 'react-bootstrap';

import 'swiper/css';
import 'swiper/css/pagination';

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
}

export default function CarrosselCarreiras({ carreiras, progresso = false }: Props) {

    return (
        <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            pagination={{
                clickable: true,
            }}
            className="mySwiper carrossel-carreiras"
        >
            {
                carreiras.map((carreira, index) => (
                    <SwiperSlide key={index} className={`carrossel-carreiras-slide rounded-3 ${progresso ? 'carrossel-carreiras-slide-progresso' : ''}`}>
                        <Image src="https://placehold.co/375x160" width={0} height={160} className="w-100 object-fit-cover rounded-top-3" alt="Imagem representativa da Carreira" />
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
    )
}