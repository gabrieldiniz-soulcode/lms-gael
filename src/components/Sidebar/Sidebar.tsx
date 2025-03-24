"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useContext, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import { GoHome } from "react-icons/go";
import Image from "next/image";
import { LiaCertificateSolid } from "react-icons/lia";
import { MdLogout } from "react-icons/md";
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineForum } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import logo from "/public/logos/logo_soulcode_passaporte_digital_vertical.png";

export default function Sidebar() {

    const { signOut } = useContext(AuthContext);

    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className={`d-lg-flex d-none gap-1 sidebar position-fixed bg-auxiliary1-project position-relative flex-column align-items-center px-3 py-4 ${open ? 'sidebar-open' : ''}`}>

            <Image src={logo.src} width={logo.width} height={logo.width} alt="Logo Soulcode Passaporte Digital" className="mb-5" />

            <a href="/carreiras" className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar mt-5 text-white`}>
                <GoHome color="#fff" size={20} strokeWidth={0.5} />
                {open && 'Home'}
            </a>
            <div className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <MdOutlineDashboard color="#fff" size={20} />
                {open && 'Dashboard'}
            </div>

            <div className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <PiStudentBold color="#fff" size={20} />
                {open && 'Minhas Carreiras'}
            </div>

            <div className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <MdOutlineForum color="#fff" size={20} />
                {open && 'Fórum'}
            </div>

            <div className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <LiaCertificateSolid color="#fff" size={20} strokeWidth={0.5} />
                {open && 'Certificados'}
            </div>

            <div className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <FaRegCalendarAlt color="#fff" size={20} />
                {open && 'Eventos'}
            </div>

            <div className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <GoGear color="#fff" size={20} strokeWidth={0.5} />
                {open && 'Configurações'}
            </div>


            <div className={`${open ? 'w-100 icon-18-sidebar py-2' : ''} logout-sidebar align-item-center justify-content-center fs-12 text-auxiliary1-project div-icon-sidebar mt-auto bg-white`} onClick={signOut}>
                <MdLogout className="text-auxiliary1-project" size={20} />
                {open && 'Sair'}
            </div>

            <div className="icon-aba-sidebar bg-auxiliary1-project cursor-pointer" onClick={() => setOpen(!open)}>
                {
                    open
                        ?
                        <FaChevronLeft color="#fff" size={18} />
                        :
                        <FaChevronRight color="#fff" size={18} />
                }
            </div>
        </div>
    );
}