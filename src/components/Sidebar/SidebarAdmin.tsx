"use client";

import { FaChalkboardTeacher, FaChevronLeft, FaChevronRight, FaLink, FaUpload } from "react-icons/fa";
import { useContext, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { RiAiGenerate2 } from "react-icons/ri";
import logo from "/public/logos/logo_soulcode_passaporte_digital_vertical.png";

export default function SidebarAdmin() {

    const { signOut } = useContext(AuthContext);

    const [open, setOpen] = useState<boolean>(false);

    const { user } = useContext(AuthContext);

    return (
        <div className={`d-lg-flex d-none gap-1 sidebar position-fixed bg-auxiliary1-project position-relative flex-column align-items-center px-3 py-4 ${open ? 'sidebar-open' : ''}`}>


            <a href="/admin">
                <Image src={logo.src} width={logo.width} height={logo.width} alt="Logo Soulcode Passaporte Digital" className="mb-5" />
            </a>

            <a href="/admin" className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar mt-5 text-white`}>
                <FaChalkboardTeacher color="#fff" size={20} strokeWidth={0.5} />
                {open && 'Tutors'}
            </a>

            <a href="/admin/mappgins" className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <FaLink color="#fff" size={20} />
                {open && 'Mappgins'}
            </a>

            <a href="/admin/ingest" className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <FaUpload color="#fff" size={20} strokeWidth={0.5} />
                {open && 'Ingest'}
            </a>


            <a href="/admin/generate" className={`${open ? 'w-100 ps-2 icon-18-sidebar fs-12 fw-700 py-2' : ''} div-icon-sidebar text-white`}>
                <RiAiGenerate2 color="#fff" size={20} strokeWidth={0.5} />
                {open && 'Generate'}
            </a>

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