import React, { useEffect, useRef, useState } from "react";

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateData {
    certificate_created: number;
    code: string;
    coursename: string;
    firstname: string;
    lastname: string;
    workload: string;
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
            <div className="certificado row position-relative mb-5">
                <div className="col-9 d-flex flex-column">
                    <div className="mt-5 pt-5 ps-5 ms-5 fs-51 d-flex flex-column">
                        <span style={{ lineHeight: '50px' }} className="fw-700">CERTIFICADO</span>
                        <span>DE CONCLUSÃO</span>
                    </div>
                    <div className="d-flex justify-content-end mt-5 pt-5 me-5">
                        <div className="d-flex flex-column gap-2">
                            <span className="fs-21 fw-700">Concluiu o curso online com carga horária estimada em {certificado.workload} horas.</span>
                            <span className="mt-2">Finalizado em {formatarData(certificado.certificate_created)}</span>
                            <span className="fs-38 fw-700">{certificado.firstname} {certificado.lastname}</span>
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-3 ps-5 ms-5">
                        <span className="fs-28 fw-700">Curso</span>
                        <span className="fs-51 fw-700">{certificado.coursename}</span>
                    </div>
                    <div className="d-flex justify-content-between ms-5 ps-5 mt-auto mb-5 pb-5">
                        <span className="fs-21 fw-700">CÓDIGO DE VALIDAÇÃO: {certificado.code}</span>
                        <div className="d-flex gap-5 me-5">
                            <span className="fs-21">Assinatura 1</span>
                            <span className="fs-21">Assinatura 2</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
