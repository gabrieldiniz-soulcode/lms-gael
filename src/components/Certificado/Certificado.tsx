import React, { useEffect, useRef, useState } from "react";

// import Carmela from '../../../public/ca_white_1.webp';
// import Fabricio from '../../../public/fa_white_1.webp';
// import Image from "next/image";
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

function formatarDataCurta(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
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
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ fontSize: '42px', fontWeight: '900', lineHeight: 1, letterSpacing: '1px', color: '#ffffff' }}>
                            CERTIFICADO
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '400', lineHeight: 1.2, color: '#ffffff' }}>
                            DE CONCLUSÃO
                        </div>
                    </div>

                    {/* Nome do curso */}
                    <div style={{ marginBottom: '36px' }}>
                        <div style={{ fontSize: '20px', marginBottom: '6px', color: '#ffffff' }}>Trilha</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', lineHeight: 1.15, textTransform: 'uppercase', color: '#ffffff' }}>
                            {courseName}
                        </div>
                    </div>

                    {/* Descrição */}
                    <div style={{ marginBottom: 'auto' }}>
                        <div style={{
                            fontSize: '16px', color: '#ffffff', lineHeight: 1.6, maxWidth: '500px'
                        }}>
                            <strong>{certificado.firstname} {certificado.lastname}</strong> concluiu em {formatarDataCurta(certificado.certificate_created)} a Trilha de {courseName} ({certificado.workload}h) parte integrante do curso livre CRIA MAIS | Educação Financeira para Empreendedores Criativos.
                        </div>
                    </div>

                    {/* Assinaturas */}
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-end', justifyContent: "flex-end", marginBottom: '70px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* <Image src={Fabricio} width={250} height={80} alt="Assinatura Fabrício" style={{ objectFit: 'contain' }} /> */}
                            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px', color: '#ffffff' }}>Fabrício Cardoso</div>
                            <div style={{ fontSize: '14px', fontWeight: '400', color: '#ffffff' }}>SOULCODE</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* <Image src={Carmela} width={250} height={80} alt="Assinatura Gaetano" style={{ objectFit: 'contain' }} /> */}
                            <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '4px', color: '#ffffff' }}>Gaetano Lops</div>
                            <div style={{ fontSize: '14px', fontWeight: '400', color: '#ffffff' }}>GAEL COMUNICAÇÃO E ENTRETENIMENTO</div>
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
