import React, { useEffect, useRef, useState } from "react";

import Carmela from '../../../public/ca_white_1.webp';
import Fabricio from '../../../public/fa_white_1.webp';
import Image from "next/image";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
            const canvas = await html2canvas(certificateRef.current, { useCORS: true });
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

    const courseName = certificado.name === "Certificado de Conclusão"
        ? certificado.coursename
        : certificado.name;

    return (
        <div
            ref={certificateRef}
            style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                width: '1120px',
                height: '706px',
                display: 'flex',
                fontFamily: 'Arial, sans-serif',
                overflow: 'hidden',
            }}
        >
            {/* Lado esquerdo - fundo escuro com conteúdo */}
            <div style={{
                position: 'relative',
                flex: '0 0 75%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }} className="text-white">
                {/* Camada 1 do background */}
                <img
                    src="/gael/bg_certificado_camada1.png"
                    alt=""
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', zIndex: 0,
                    }}
                />
                {/* Camada 2 do background */}
                <img
                    src="/gael/bg_certificado_camada2.png"
                    alt=""
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', zIndex: 1,
                    }}
                />

                {/* Conteúdo */}
                <div style={{
                    position: 'relative', zIndex: 2,
                    display: 'flex', flexDirection: 'column',
                    height: '100%', padding: '48px 56px',
                    color: '#ffffff',
                }}>
                    {/* Título */}
                    <div style={{ marginBottom: '32px' }}>
                        <div style={{ fontSize: '42px', fontWeight: '900', lineHeight: 1, letterSpacing: '1px', color: '#ffffff' }}>
                            CERTIFICADO
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '400', lineHeight: 1.2, color: '#ffffff' }}>
                            DE CONCLUSÃO
                        </div>
                    </div>

                    {/* Dados do aluno */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ fontSize: '13px', marginBottom: '4px', color: '#ffffff' }}>
                            Concluiu o curso online com carga horária estimada em {certificado.workload} horas.
                        </div>
                        <div style={{ fontSize: '13px', marginBottom: '12px', color: '#ffffff' }}>
                            Finalizado em {formatarData(certificado.certificate_created)}
                        </div>
                        <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff' }}>
                            {certificado.firstname} {certificado.lastname}
                        </div>
                    </div>

                    {/* Nome do curso */}
                    <div style={{ marginBottom: 'auto' }}>
                        <div style={{ fontSize: '13px', marginBottom: '6px', color: '#ffffff' }}>Curso</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', lineHeight: 1.15, textTransform: 'uppercase', color: '#ffffff' }}>
                            {courseName}
                        </div>
                    </div>

                    {/* Assinaturas */}
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end', justifyContent: "flex-end" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Image src={Fabricio} width={250} height={80} alt="Assinatura Fabrício" style={{ objectFit: 'contain' }} />
                            <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px', color: '#ffffff' }}>Fabrício Silva Cardoso</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Image src={Carmela} width={250} height={80} alt="Assinatura Carmela" style={{ objectFit: 'contain' }} />
                            <div style={{ fontSize: '12px', fontWeight: '600', marginTop: '4px', color: '#ffffff' }}>Carmela Borst</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lado direito - fundo laranja com logos */}
            <div style={{
                flex: '0 0 25%',
                backgroundColor: '#F26522',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px 20px',
                gap: '24px',
            }}>
                {/* Logo principal (CRIA MAIS) */}
                <img
                    src="/gael/logo_certificado.png"
                    alt="Logo"
                    style={{ width: '200px', height: '100px', objectFit: 'contain' }}
                />

                {/* Patrocinadores verticais */}
                <img
                    src="/gael/patriocinadores_vertical.png"
                    alt="Patrocinadores"
                    className="mt-3"
                    style={{ width: '150px', height: '350px', objectFit: 'contain', flex: 1 }}
                />
            </div>
        </div>
    );
}
