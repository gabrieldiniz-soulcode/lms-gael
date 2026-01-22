"use client";

import { FaChalkboardTeacher } from 'react-icons/fa';
import { Nav, Navbar, NavbarCollapse, NavbarToggle } from 'react-bootstrap';

import { AuthContext } from '@/contexts/AuthContext';
import Image from 'next/image';
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

      <div className="d-lg-none d-flex flex-nowrap justify-content-between w-100">
        <Image src={logo.src} width={logo.width} height={logo.height - 20} alt="logo soulcode + passaporte digital" className="w-25 h-auto object-fit-contain" />
        <NavbarToggle aria-controls="basic-navbar-nav" />
      </div>

      <NavbarCollapse id="basic-navbar-nav">
        <Nav className="me-auto d-lg-none">
          <div className="d-flex flex-column align-items-center gap-1">
            <a href="/admin" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar mt-5 text-white">
              <FaChalkboardTeacher color="#fff" size={20} strokeWidth={0.5} className="me-2" />
              Tutores educacionais
            </a>
          </div>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  )
}