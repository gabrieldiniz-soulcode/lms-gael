import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { IoMailSharp } from "react-icons/io5";
import { LoaderContext } from "@/contexts/LoaderContext";
import { MdOutlineModeEditOutline } from "react-icons/md";
import axios from "axios";

interface UserFrequency {
    [date: string]: number;
}

interface User {
    firstname: string;
    lastname: string;
    email: string;
    phone1: string;
    phone2: string;
    address: string;
    city: string;
    country: string;
    timezone: string;
    firstaccess: number;
    lastlogin: number;
    description: string;
    timecreated: number;
    opentowork: number;
    linkedin: string | null;
    portfolio: string | null;
    frequency: UserFrequency;
    imagealt: string;
}

interface ApiResponse {
    data: User;
}

export default function Perfil() {

    const [perfil, setPerfil] = useState<User>();

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);

    useEffect(() => {

        function getPerfil() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
                headers: {
                    "database": user.database,
                    "Authorization": `Bearer ${user.token}`
                }
            })
                .then((res: ApiResponse) => {
                    setPerfil(res.data);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.token && !perfil) {
            getPerfil();
        }

    }, [user, updateResponses, perfil]);

    return (
        perfil
        &&
        <div className="rounded-3 bg-auxiliary1-project p-4 perfil-perfil position-relative mt-5">
            <div className="row row-gap-4 align-items-center mt-3">
                <div className="col-xxl-5">
                    <div className="row">
                        {
                            perfil?.imagealt &&
                            <div className="col-md-4 col-12 d-flex justify-content-md-start justify-content-center">
                                <Image src={perfil?.imagealt} width={160} height={160} alt="foto de perfil" style={{ borderRadius: '100%', border: "#93C01F 4px solid" }} />
                            </div>
                        }
                        <div className="d-flex ps-xxl-5 col-md-8 col-12 pt-3 gap-3 flex-column align-items-md-start align-items-center">
                            <span className="text-auxiliary10-project fs-21 fw-700">{perfil.firstname} {perfil.lastname}</span>
                            <span className="text-auxiliary10-project">
                                <IoMailSharp size={24} color="#fff" className="me-2" />
                                {perfil.email}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-4 offset-xxl-3">
                    <a className="w-100 btn btn-primary fs-12 fw-700" href="/perfil/editar">
                        <MdOutlineModeEditOutline size={22} className="me-2" />
                        Editar Perfil
                    </a>
                    <a className="w-100 btn btn-secondary fs-12 fw-700 mt-3" href="/perfil/alterar-senha">
                        <MdOutlineModeEditOutline size={22} className="me-2" />
                        Alterar Senha
                    </a>
                    <button disabled className="w-100 fs-12 fw-700 text-auxiliary10-project opacity-100 d-flex align-items-center gap-3 justify-content-center btn btn-outline-light mt-3">
                        Disponível para ofertas de emprego?
                        <Form.Switch
                            type="switch"
                            id="custom-switch"
                            className="mt-0"
                            defaultChecked={perfil.opentowork == 1}
                        />
                    </button>
                </div>
            </div>
            <div className="bg-auxiliary4-project p-3 mb-3 mt-4 rounded-3">
                <div className="row my-2 row-gap-3">
                    <div className="col-8 d-flex flex-column gap-3">
                        {
                            perfil?.description
                            &&
                            <>
                                <span className="text-auxiliary10-project fw-600">Sobre</span>
                                <span className="text-auxiliary10-project" dangerouslySetInnerHTML={{ __html: perfil.description }}></span>
                            </>
                        }
                        <div className="d-flex flex-wrap gap-3">
                            {
                                perfil?.country
                                &&
                                <div>
                                    <span className="text-auxiliary10-project fw-700">País: </span>
                                    <span className="text-auxiliary10-project">{perfil.country}</span>
                                </div>
                            }
                            {
                                perfil?.city
                                &&
                                <div>
                                    <span className="text-auxiliary10-project fw-700">Cidade: </span>
                                    <span className="text-auxiliary10-project">{perfil.city}</span>
                                </div>
                            }
                            {
                                perfil?.linkedin
                                &&
                                <div>
                                    <span className="text-auxiliary10-project fw-700">Linkedin: </span>
                                    <span className="text-auxiliary10-project">{perfil.linkedin}</span>
                                </div>
                            }
                            {
                                perfil?.portfolio
                                &&
                                <div>
                                    <span className="text-auxiliary10-project fw-700">Portfólio: </span>
                                    <span className="text-auxiliary10-project">{perfil.portfolio}</span>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-xxl-4 col-md-6 d-flex gap-2 flex-wrap">
                        <span className="w-100 fw-700 mb-1 text-auxiliary10-project">Minha frequência</span>
                        {
                            Object.keys(perfil.frequency).map((data, index) => (
                                <OverlayTrigger
                                    key={index}
                                    placement="top"
                                    overlay={
                                        <Tooltip>
                                            {data}
                                        </Tooltip>
                                    }
                                >
                                    <div className={`frequency display-inline-block ${perfil.frequency[data] == 1 ? 'bg-red' : 'bg-auxiliary6-project'}`}></div>
                                </OverlayTrigger>
                            ))
                        }
                        <div className="w-100">
                            <span className="fw-700 fs-09 text-auxiliary10-project">Último acesso ao sistema:</span>
                            <span className="fs-09 text-auxiliary10-project ms-2">{new Date(perfil.lastlogin * 1000).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}