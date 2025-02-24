import Image from "next/image";
import banner from "/public/banner_login.png";
import { Row } from "react-bootstrap";

export default function Banner() {

    return (
        <Row className="d-flex justify-content-center">
            <Image src={banner.src} width={banner.width} height={banner.height} className="h-auto" alt="Mulher olhando tela de cursos do Soulhub" />
        </Row>
    )
}