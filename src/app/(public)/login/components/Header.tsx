import Image from "next/image";
import logoTrident from "/public/logos/logo_trident.png";

export default function Header() {

    return (
        <header className="header-login d-flex justify-content-center align-items-center w-100 bg-auxiliary1-project px-2">
            <Image src={logoTrident.src} width={logoTrident.width} height={60} alt="logo Trident"  className="header-login-logo object-fit-contain"/>
        </header>
    )
}