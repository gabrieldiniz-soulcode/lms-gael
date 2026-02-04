import Image from "next/image";
import logo1 from "/public/logos_trident/logo_kings.png";
import logo2 from "/public/logos_trident/logo_sc_branco.svg";
import logo3 from "/public/logos_trident/logo_trident.png";

export default function Header() {

    return (
        <header className="header-login d-flex justify-content-center align-items-center w-100 bg-auxiliary1-project gap-3 flex-wrap">
            <Image src={logo3.src} width={logo3.width} height={60} alt="logo Trident" className="header-login-logo object-fit-contain" />
            <Image src={logo1.src} width={logo1.width} height={60} alt="logo Trident" className="header-login-logo object-fit-contain" />
            <Image src={logo2.src} width={logo2.width} height={60} alt="logo Trident" className="header-login-logo object-fit-contain" />
        </header>
    )
}