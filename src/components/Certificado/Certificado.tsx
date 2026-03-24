import React, { useEffect, useRef, useState } from "react";

import Carmela from '../../../public/ca.png';
import Fabricio from '../../../public/fa.png';
import Image from "next/image";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo1 from "/public/ifood/logos/chega_junto.png";
import logo2 from "/public/ifood/logos/Logo SoulCode.svg";
import logo3 from "/public/ifood/logos/soulcode.png";

interface CertificateData {
    certificate_created: number;
    code: string;
    coursename: string;
    firstname: string;
    lastname: string;
    workload: string;
    name: string;
}

type Props = {
    certificado: CertificateData | null;
    onDownloaded?: () => void;
    triggerDownload: boolean[];
    index: number;
};

const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function formatarData(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const ano = date.getFullYear();
    return `${dia} de ${mes} de ${ano}`;
}

export default function Certificado({ certificado, onDownloaded, triggerDownload, index }: Props) {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [downloaded, setDownloaded] = useState(false);

    useEffect(() => {
        async function handleDownload() {
            if (!certificateRef.current || !certificado) return;
            const canvas = await html2canvas(certificateRef.current);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape', 'pt', [canvas.width, canvas.height]);
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('certificado.pdf');
            setDownloaded(true);
            if (onDownloaded) onDownloaded();
        }

        if (certificado && triggerDownload[index] && !downloaded) {
            handleDownload();
        }
    }, [certificado, triggerDownload, downloaded, onDownloaded, index]);

    if (!certificado || !triggerDownload || downloaded) return null;

    return (
        <div
            ref={certificateRef}
            style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                width: '1420px',
                height: '900px',
                overflow: 'hidden'
            }}
        >
            <div className="certificado row position-relative mb-5 text-auxiliary2-project">
                <div className="col-9 d-flex flex-column">
                    <div className="mt-5 pt-5 ps-3 ms-5 fs-51 d-flex flex-column">
                        <span style={{ lineHeight: '50px' }} className="fw-700 text-auxiliary2-project">CERTIFICADO</span>
                        <span className="text-auxiliary2-project">DE CONCLUSÃO</span>
                    </div>
                    <div className="d-flex justify-content-start mt-3 ms-5 ps-3">
                        <div className="d-flex flex-column gap-2">
                            <span className="mt-2 text-auxiliary2-project">Finalizado em {formatarData(certificado.certificate_created)}</span>
                            <span className="fs-38 fw-700 text-auxiliary2-project">{certificado.firstname} {certificado.lastname}</span>
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-3 ps-3 ms-5 mt-5">
                        <span className="fs-51 fw-700">{certificado.name == "Certificado de Conclusão" ? certificado.coursename : certificado.name}</span>
                    </div>
                    <div className="d-flex mb-3 py-5 justify-content-end">
                        <span className="d-flex flex-column justify-content-center align-items-center">
                            <Image src={Fabricio} width={300} alt="Assinatura" />
                            <div className="text-auxiliary2-project">FABRICIO CARDOSO</div>
                            <div className="text-auxiliary2-project">Cofundador</div>
                        </span>
                        <span className="d-flex flex-column justify-content-center align-items-center">
                            <Image src={Carmela} width={350} alt="Assinatura" />
                            <div className="text-auxiliary2-project">CARMELA BORST</div>
                            <div className="text-auxiliary2-project">Fundadora</div>
                        </span>
                    </div>
                </div>
                <div className="col-3 d-flex flex-column align-items-center gap-5 pt-5">
                    <Image src={logo1.src} width={190} height={115} alt="logo Trident" className="header-login-logo h-auto object-fit-contain mt-4" />
                    <Image src={logo3.src} width={170} height={105} alt="logo Trident" className="header-login-logo mt-3 h-auto object-fit-contain" />
                    <Image src={logo2.src} width={190} height={140} alt="logo Trident" className="header-login-logo h-auto object-fit-contain" />
                </div>
            </div>
        </div>
    );
}
