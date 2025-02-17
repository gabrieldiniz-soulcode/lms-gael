import Image from "next/image";
import logo from "/public/logos/logo_soulcode_passaporte_digital_horizontal.png";

export default function Header() {

    return (
        <div className="header-login d-flex justify-content-center align-items-center w-100 bg-auxiliary1-project px-2">
            <Image src={logo.src} width={logo.width} height={logo.height} alt="logo soulcode + passaporte digital"  className="header-login-logo object-fit-contain"/>
        </div>
    )
}