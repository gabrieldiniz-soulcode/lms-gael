import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Certificado from "@/components/Certificado/Certificado";
import { FaRegFilePdf } from "react-icons/fa";
import { LoaderContext } from "@/contexts/LoaderContext";
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

    const { updateResponses } = useContext(LoaderContext);
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
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.token && triggerDownload.length < 1) {
            getCertificates();
        }

    }, [triggerDownload, user?.token]);

    return (
        <div className="row row-gap-5 mt-4 mb-5">
            <div className="mb-4">
                <h2 className="mb-4 fs-28 fw-700">Meus Certificados</h2>
                <span>Estes são os certificados que você solicitou por email ou baixou manualmente.</span>
                {/* <div className="row mt-4 row-gap-3">
                    <span className="col-xxl-2 col-xl-4">Baixar dados da tabela como</span>
                    <div className="col-xxl-3 col-xl-4">
                        <button className="w-100 btn btn-outline-2 fs-12 fw-700">
                            Valores separados por vírgula (.csv)
                        </button>
                    </div>
                    <div className="col-xxl-2 col-xl-4">
                        <button className="w-100 btn btn-primary fs-12 fw-700">
                            Download
                        </button>
                    </div>
                </div> */}
            </div>
            {
                certificados.map((item, index) => (
                    <a className="col-xxl-3 col-md-4 col-md-6 col-10 text-decoration-none cursor-pointer" key={index} onClick={() => {
                        const newTrigger = [...triggerDownload];
                        newTrigger[index] = true;
                        setTriggerDownload(newTrigger);
                    }}>
                        <div className="d-flex flex-column bg-white me-3 rounded-3">
                            <div className="py-5 px-4 mx-xl-5 mx-md-3 mx-4">
                                <FaRegFilePdf className="w-100 h-auto px-4" color="#FF3B30" />
                            </div>
                            <div className="bg-auxiliary5-project pb-3 pt-4 px-4 fw-700 rounded-bottom-3">
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

                ))
            }
        </div>
    )
}