"use client";

import { FaChalkboardTeacher, FaLink } from 'react-icons/fa';
import { Nav, Navbar, NavbarCollapse, NavbarToggle } from 'react-bootstrap';

import { AuthContext } from '@/contexts/AuthContext';
import { FaUpload } from "react-icons/fa6";
import Image from 'next/image';
import { RiAiGenerate2 } from 'react-icons/ri';
import aluno from "/public/aluno_2.png";
import logo from "/public/logos/logo_soulcode_passaporte_digital_horizontal.png";
import { useContext } from 'react';

export default function HeaderAdmin() {

  const { perfil } = useContext(AuthContext);

  return (
    <Navbar expand="lg" className="header bg-auxiliary1-project py-lg-2 py-4 position-absolute w-100" style={{ zIndex: 500 }}>
      <div className='d-lg-flex d-none justify-content-end w-100 align-items-center gap-5'>
        <a className="d-flex gap-2 align-items-center">
          <Image src={perfil?.imagealt || aluno.src} width={55} height={55} alt="foto de aluno" className="foto-aluno-header" />
          <span className="fw-300 fs-12 text-white">Olá, {perfil?.firstname || "Estudante"}</span>
        </a>
      </div>

      <div className="d-lg-none d-flex flex-nowrap justify-content-center w-100">
        <Image src={logo.src} width={logo.width} height={logo.height - 20} alt="logo soulcode + passaporte digital" className="w-75 object-fit-contain" />
        <NavbarToggle aria-controls="basic-navbar-nav" />
      </div>

      <NavbarCollapse id="basic-navbar-nav">
        <Nav className="me-auto d-lg-none">
          <div className="d-flex flex-column align-items-center gap-1">
            <a href="/admin" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar mt-5 text-white">
              <FaChalkboardTeacher color="#fff" size={20} strokeWidth={0.5} className="me-2" />
              Tutors
            </a>

            <a href="/admin/mappgins" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <FaLink color="#fff" size={18} className="me-2" />
              Mappgins
            </a>

            <a href="/admin/ingest" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <FaUpload color="#fff" size={18} className="me-2" strokeWidth={0.5} />
              Ingest
            </a>

            <a href="/admin/generate" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <RiAiGenerate2 color="#fff" size={18} className="me-2" strokeWidth={0.5} />
              Generate
            </a>
          </div>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  )
}