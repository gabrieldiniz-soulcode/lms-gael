import Image from "next/image";
import logo1 from "/public/ifood/logos/chega_junto.png";
import logo2 from "/public/ifood/logos/Logo SoulCode.svg";
import logo3 from "/public/ifood/logos/soulcode.png";

export default function Header() {

    return (
        <header className="header-login d-flex gap-3 justify-content-center align-items-center w-100 bg-auxiliary1-project gap-0 flex-wrap">
            <Image src={logo3.src} width={75} height={65} alt="logo Trident" className="header-login-logo object-fit-contain" />
            <Image src={logo1.src} width={75} height={65} alt="logo Trident" className="header-login-logo object-fit-contain" />
            <Image src={logo2.src} width={75} height={65} alt="logo Trident" className="header-login-logo object-fit-contain" />
        </header>
    )
}