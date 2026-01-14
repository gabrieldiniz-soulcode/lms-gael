import { FaChevronRight, FaRegFilePdf } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Certificado from "@/components/Certificado/Certificado";
import axios from "axios";

interface CertificateData {
    certificate_created: number;
    code: string;
    coursename: string;
    firstname: string;
    lastname: string;
    workload: string;
}

export default function Certificados() {

    const { user } = useContext(AuthContext);

    const [certificados, setCertificados] = useState<CertificateData[]>([]);
    const [triggerDownload, setTriggerDownload] = useState<boolean[]>([]);

    useEffect(() => {

        function getCertificates() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/certificate/my`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            })
                .then((res) => {
                    res.data.map(() => {
                        setTriggerDownload([...triggerDownload, false])
                    })
                    setCertificados(res.data);
                });
        }

        if (user?.token && triggerDownload.length < 1) {
            getCertificates();
        }

    }, [triggerDownload, user?.token]);

    return (
        certificados.length > 0
        &&
        <div className="row row-gap-4 pb-5">
            <div className="d-flex justify-content-between row-gap-4">
                <span className="fs-28 fw-700 text-auxiliary1-project">Certificados</span>
                <a href="/certificados" className="pt-5 me-3 text-decoration-none d-flex align-items-center gap-2">
                    Ver todos
                    <FaChevronRight size={16} />
                </a>
            </div>
            {
                certificados.map((item, index) => {
                    if (index > 3) {
                        return;
                    }
                    return (
                        <a className="col-xxl-3 col-md-4 col-md-6 col-10 text-decoration-none cursor-pointer" key={index} onClick={() => {
                            const newTrigger = [...triggerDownload];
                            newTrigger[index] = true;
                            setTriggerDownload(newTrigger);
                        }}>
                            <div className="d-flex flex-column bg-white me-3 rounded-3 h-100">
                                <div className="py-5 px-4 mx-xl-5 mx-md-3 mx-4">
                                    <FaRegFilePdf className="w-100 h-auto px-4" color="#FF3B30" />
                                </div>
                                <div className="bg-auxiliary5-project pb-3 pt-4 px-4 h-100 fw-700 rounded-bottom-3">
                                    {item.coursename}
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
                        </a>
                    )
                })
            }
        </div>
    )
}