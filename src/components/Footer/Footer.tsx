import Image from "next/image";
import scaleUp from "/public/scale_up.png";

export default function Footer() {

    return (
        <footer className="d-flex justify-content-center gap-5 flex-wrap w-100 bg-auxiliary1-project px-2 py-4 align-items-center px-md-5">
            <span className="text-white text-center  px-md-0 px-5">©2015-2024 SoulCode. Todos os direitos reservados.</span>
            <a href="https://bootcamp.soulcode.com/politica-de-privacidade" target="_blank" className="text-white text-center text-decoration-none px-md-0 px-5">Política de Privacidade</a>
            <span className="text-white text-center  px-md-0 px-5">Aviso de Cookies</span>
            <a href="https://bootcamp.soulcode.com/politica-de-privacidade" target="_blank" className="text-white text-center text-decoration-none px-md-0 px-5">Termos de Uso</a>
            <Image src={scaleUp.src} width={scaleUp.width} height={scaleUp.height} alt="logo endeavor scale up" />
        </footer>
    )
}