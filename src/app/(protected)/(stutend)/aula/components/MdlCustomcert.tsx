import { useContext, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "react-bootstrap";
import Certificado from "@/components/Certificado/Certificado";
import axios from "axios";

export interface Sequence {
    cmid: number,
    module: string;
    complete: boolean;
    data_module: {
        name: string;
        course: number;
        content: string;
        externalurl: string;
        id: number;
        templateid: number;
    }
}

interface Props {
    sequence: Sequence;
    setbuttons: () => React.ReactElement;
}

export interface CertificateData {
    certificate_created: number;
    code: string;
    coursename: string;
    firstname: string;
    lastname: string;
    workload: string;
    name: string;
}

export default function MdlCustomcert({ sequence, setbuttons }: Props) {

    console.log(sequence)

    const { user } = useContext(AuthContext);

    const [certificado, setCertificado] = useState<CertificateData | null>(null);
    const [triggerDownload, setTriggerDownload] = useState<boolean[]>([false]);

    const buscarCertificado = async () => {

        if (!user?.token) return;

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/certificate`, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
                course: sequence.data_module.course,
                template_id: sequence.data_module.templateid
            }
        });
        setCertificado(res.data);
        setTriggerDownload([true]);
    };

    return (
        <div className="w-100">
            <div className="w-100 my-3 mb-5 d-flex">

                <Button className="px-3 w-100" onClick={buscarCertificado}>Baixar Certificado</Button>
                <Certificado
                    certificado={certificado}
                    triggerDownload={triggerDownload}
                    index={0}
                    onDownloaded={() => setTriggerDownload([false])}
                />
            </div>
            {setbuttons()}

        </div>
    );
}