"use client";
import { api } from "@/shared/api/api";

import { FaChevronRight, FaRegFilePdf } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Certificado from "@/components/Certificado/Certificado";
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

interface CertificateData {
    certificate_created: number;
    code: string;
    coursename: string;
    firstname: string;
    lastname: string;
    workload: string;
    name: string;
}



export default function Certificados() {

    const { user } = useContext(AuthContext);

    const [certificados, setCertificados] = useState<CertificateData[]>([]);
    const [triggerDownload, setTriggerDownload] = useState<boolean[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        async function getCertificates() {
            const res = await api.get("/certificate/my", {
                
            });

            const data: CertificateData[] = res.data || [];

            setCertificados(data);
            setTriggerDownload(Array(data.length).fill(false));
        }

        if (user?.token && certificados.length === 0) {
            getCertificates();
        }
    }, [user?.token, certificados.length]);

    useEffect(() => {
        function updateIsMobile() {
            setIsMobile(typeof window !== 'undefined' ? window.innerWidth < 992 : false);
        }

        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    if (certificados.length === 0) return null;

    const displayedCertificates = certificados.slice(0, 4);

    return (
        <div className="row row-gap-4 pb-5">
            <div className="d-flex justify-content-between row-gap-4 align-items-center">
                <div className="d-flex align-items-center justify-content-between w-100 gap-2">
                    {isMobile && (
                        <div className="custom-prev-certificados">
                            <img src="/Back Arrow.svg" className="arrows" alt="Anterior" />
                        </div>
                    )}

                    <span className="fs-28 fw-700 text-auxiliary2-project">Certificados</span>

                    {isMobile && (
                        <div className="custom-next-certificados">
                            <img src="/Back Arrow.svg" className="arrows" alt="Próximo" style={{ rotate: "180deg" }} />
                        </div>
                    )}
                </div>
            </div>

            {isMobile ? (
                <div className="overflow-hidden">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        breakpoints={{
                            0: { slidesPerView: 1, spaceBetween: 16 },
                            576: { slidesPerView: 2, spaceBetween: 16 }
                        }}
                        navigation={{
                            prevEl: '.custom-prev-certificados',
                            nextEl: '.custom-next-certificados'
                        }}
                        className="mySwiper"
                    >
                        {displayedCertificates.map((item, index) => (
                            <SwiperSlide key={item.code || index}>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => {
                                        const newTrigger = [...triggerDownload];
                                        newTrigger[index] = true;
                                        setTriggerDownload(newTrigger);
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            const newTrigger = [...triggerDownload];
                                            newTrigger[index] = true;
                                            setTriggerDownload(newTrigger);
                                        }
                                    }}
                                >
                                    <div className="d-flex flex-column bg-white rounded-3 h-100">
                                        <div className="py-5 px-4 mx-xl-5 mx-md-3 mx-4">
                                            <FaRegFilePdf className="w-100 h-auto px-4" color="#FF3B30" />
                                        </div>
                                        <div className="bg-auxiliary5-project pb-3 pt-4 px-4 h-100 fw-700 rounded-bottom-3">
                                            {item.name}
                                        </div>
                                    </div>
                                    <Certificado
                                        certificado={item}
                                        triggerDownload={triggerDownload}
                                        onDownloaded={() => {
                                            const newTrigger = [...triggerDownload];
                                            newTrigger[index] = false;
                                            setTriggerDownload(newTrigger);
                                        }}
                                        index={index}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
                    {certificados.slice(0, 4).map((item, index) => (
                        <div className="col" key={item.code || index}>
                            <div
                                className="cursor-pointer"
                                onClick={() => {
                                    const newTrigger = [...triggerDownload];
                                    newTrigger[index] = true;
                                    setTriggerDownload(newTrigger);
                                }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        const newTrigger = [...triggerDownload];
                                        newTrigger[index] = true;
                                        setTriggerDownload(newTrigger);
                                    }
                                }}
                            >
                                <div className="d-flex flex-column bg-white rounded-3 h-100">
                                    <div className="py-5 px-4 mx-xl-5 mx-md-3 mx-4">
                                        <FaRegFilePdf className="w-100 h-auto px-4" color="#FF3B30" />
                                    </div>
                                    <div className="bg-auxiliary5-project pb-3 pt-4 px-4 h-100 fw-700 rounded-bottom-3">
                                        {item.name}
                                    </div>
                                </div>
                                <Certificado
                                    certificado={item}
                                    triggerDownload={triggerDownload}
                                    onDownloaded={() => {
                                        const newTrigger = [...triggerDownload];
                                        newTrigger[index] = false;
                                        setTriggerDownload(newTrigger);
                                    }}
                                    index={index}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <a href="/certificados" className="me-3 text-decoration-none d-flex align-items-center gap-2">
                    Ver todos
                    <FaChevronRight size={16} />
                </a>
            </div>
        </div>
    )
}
