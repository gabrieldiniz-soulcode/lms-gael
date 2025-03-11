import Image from "next/image";
import bannerDiscord from "/public/discord.png";
import bannerDiscord2 from "/public/discord_2.png";
import bannerYT from "/public/ao_vivo_yt.png";
import { FaRegClock } from "react-icons/fa";
import { RiPlayMiniLine } from "react-icons/ri";
import { ProgressBar } from "react-bootstrap";
import { IoRadioSharp } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
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
}

interface ApiResponse {
    data: Course[];
}


export default function Hero() {

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);
    const [course, setCourse] = useState<Course>();

    useEffect(() => {
        function getCourse() {
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/course?username=${user?.name}&database=${user?.database}`)
                .then((res: ApiResponse) => {
                    const curso = res.data.find((car) => car.destaque === 1);
                    console.log(curso)
                    setCourse(curso);
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
    }, [user, updateResponses]);

    return (
        course
        &&
        <div className="row hero-carreiras row-gap-4">
            <a href="#" className="col-12 d-md-block d-none px-2">
                <Image src={bannerDiscord.src} width={0} height={0} className="w-100 h-auto" alt="Banner Discord" />
            </a>
            <a href="#" className="col-12 d-md-none d-block px-2">
                <Image src={bannerDiscord2.src} width={0} height={0} className="w-100 h-auto" alt="Banner Discord" />
            </a>
            <div className="col-xxl-6 col-12 card-hero d-md-block d-none">
                <div className="d-flex box-shadow-hero rounded-3">
                    <div className="col-5 px-0 rounded-start-3">
                        <Image src="https://placehold.co/223x288" width={0} height={288} className="w-100 object-fit-cover rounded-start-3" alt="Imagem ilustrativa da carreira" />
                    </div>
                    <div className="col-7 bg-white d-flex flex-column py-4 px-3 justify-content-between rounded-end-3">
                        <span className="fw-700 fs-21 card-title-hero">{course?.fullname}</span>
                        <span className="card-text-hero">{course?.summary}</span>
                        <div className="d-flex justify-content-between py-4">
                            <span className="fs-12 d-flex align-items-center">
                                <FaRegClock className='text-auxiliary1-project me-2' />
                                {course?.carga} DE ESTUDO
                            </span>
                            <a href="#" className="btn btn-primary d-flex align-items-center justify-content-center fs-12 fw-700 px-md-4">
                                Acessar Carreira
                                <RiPlayMiniLine size={20} strokeWidth={0.5} className="ms-1" />
                            </a>
                        </div>
                        <div className="d-flex gap-2 align-items-center fs-12 fw-700">
                            <div className="w-100">
                                <ProgressBar now={0} />
                            </div>
                            0%
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xxl-6 col-12 card-hero">
                <a href="https://www.youtube.com/@SoulCodeAcademy/streams" target="_blank" className="d-flex text-decoration-none flex-column justify-content-center h-100 rounded-3 box-shadow-hero">
                    <Image src={bannerYT.src} width={0} height={0} className="w-100 h-100 rounded-top-3 overflow-hidden" alt="Imagem ilustrativa da carreira" />
                    <span className="py-3 bg-white rounded-bottom-3 text-center fs-21 fw-700">
                        Ao vivo no YouTube
                        <IoRadioSharp size={24} className="ms-2" />
                    </span>
                </a>
            </div>
        </div>
    )
}