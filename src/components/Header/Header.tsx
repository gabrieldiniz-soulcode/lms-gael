"use client";

import { Form, Nav, Navbar, NavbarCollapse, NavbarToggle } from 'react-bootstrap';
import { FaChevronRight, FaSearch } from "react-icons/fa";
import { GoHome } from "react-icons/go";
import { MdOutlineDashboard } from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { MdOutlineForum } from "react-icons/md";
import { LiaCertificateSolid } from "react-icons/lia";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoGear } from "react-icons/go";
import Image from 'next/image';
import logo from "/public/logos/logo_soulcode_passaporte_digital_horizontal.png";
import aluno from "/public/aluno_2.png";

export default function Header() {

  return (
    <Navbar expand="lg" className="header bg-auxiliary1-project py-lg-2 py-4 position-absolute w-100" >

      <div className='d-lg-flex d-none justify-content-end w-100 align-items-center gap-5'>
        <div className="position-relative">
          <Form.Control className="form-input-header" type="texto" placeholder="Buscar Cursos" />
          <FaSearch className="form-input-icon-header cursor-pointer" color="#fff" />
        </div>
        <a href="/perfil" className="d-flex gap-2 align-items-center">
          <Image src={aluno.src} width={55} height={55} alt="foto de aluno" className="foto-aluno-header" />
          <span className="fw-300 fs-12 text-white">Olá, Estudante</span>
          <FaChevronRight color="#fff" size={18} />
        </a>
      </div>

      <div className="d-lg-none d-flex flex-nowrap justify-content-center w-100">
        <Image src={logo.src} width={logo.width} height={logo.height - 20} alt="logo soulcode + passaporte digital" className="w-75 object-fit-contain" />
        <NavbarToggle aria-controls="basic-navbar-nav" />
      </div>

      <NavbarCollapse id="basic-navbar-nav">
        <Nav className="me-auto d-lg-none">
          <div className="d-flex flex-column align-items-center gap-1">
            <a href="/carreiras" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar mt-5 text-white">
              <GoHome color="#fff" size={20} strokeWidth={0.5} className="me-2" />
              Home
            </a>
            <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <MdOutlineDashboard color="#fff" size={18} className="me-2" />
              Dashboard
            </div>

            <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <PiStudentBold color="#fff" size={18} className="me-2" />
              Minhas Carreiras
            </div>

            <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <MdOutlineForum color="#fff" size={18} className="me-2" />
              Fórum
            </div>

            <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <LiaCertificateSolid color="#fff" size={18} className="me-2" strokeWidth={0.5} />
              Certificados
            </div>

            <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <FaRegCalendarAlt color="#fff" size={18} className="me-2" />
              Eventos
            </div>

            <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white mb-5">
              <GoGear color="#fff" size={18} className="me-2" strokeWidth={0.5} />
              Configurações
            </div>
          </div>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  )
}