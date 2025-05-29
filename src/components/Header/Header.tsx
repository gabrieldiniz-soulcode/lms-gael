"use client";

import { FaChevronRight, FaSearch } from "react-icons/fa";
import { Form, Nav, Navbar, NavbarCollapse, NavbarToggle } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AuthContext } from '@/contexts/AuthContext';
import { GoGear } from "react-icons/go";
import { GoHome } from "react-icons/go";
import Image from 'next/image';
import { LiaCertificateSolid } from "react-icons/lia";
import { PiStudentBold } from "react-icons/pi";
import aluno from "/public/aluno_2.png";
import axios from 'axios';
import logo from "/public/logos/logo_soulcode_passaporte_digital_horizontal.png";

// import { FaRegCalendarAlt } from "react-icons/fa";
// import { MdOutlineDashboard } from "react-icons/md";

interface User {
  firstname: string;
  imagealt: string;
}

interface ApiResponse {
  data: User;
}

export default function Header() {

  const [perfil, setPerfil] = useState<User>();
  const [value, setValue] = useState<string>();

  const { user } = useContext(AuthContext);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    function getPerfil() {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
        headers: {
          "database": user.database,
          "Authorization": `Bearer ${user.token}`
        }
      })
        .then((res: ApiResponse) => {
          setPerfil(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
    }

    if (user.token && !perfil) {
      getPerfil();
    }

  }, [user, perfil]);

  function handleSearch() {
    const destino = user?.type_render === 'curso' ? '/cursos' : '/carreiras';
  
    if (!pathname.includes(destino.replace("/", ""))) {
      push(`${destino}?search=${value}`);
      return;
    }
  
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value || "");
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }  

  return (
    <Navbar expand="lg" className="header bg-auxiliary1-project py-lg-2 py-4 position-absolute w-100" style={{ zIndex: 500 }}>

      <div className='d-lg-flex d-none justify-content-end w-100 align-items-center gap-5'>
        <div className="position-relative">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            <Form.Control className="form-input-header" type="texto" placeholder="Buscar Cursos" onChange={(e) => setValue(e.target.value)} />
            <FaSearch className="form-input-icon-header cursor-pointer" color="#fff" onClick={handleSearch} />
          </form>
        </div>
        <a href="/perfil" className="d-flex gap-2 align-items-center">
          <Image src={perfil?.imagealt || aluno.src} width={55} height={55} alt="foto de aluno" className="foto-aluno-header" />
          <span className="fw-300 fs-12 text-white">Olá, {perfil?.firstname || "Estudante"}</span>
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
            {/* <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <MdOutlineDashboard color="#fff" size={18} className="me-2" />
              Dashboard
            </div> */}

            <a href="/perfil" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <PiStudentBold color="#fff" size={18} className="me-2" />
              Minhas Carreiras
            </a>

            {/* <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <MdOutlineForum color="#fff" size={18} className="me-2" />
              Fórum
            </div> */}

            <a href="/certificados" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <LiaCertificateSolid color="#fff" size={18} className="me-2" strokeWidth={0.5} />
              Certificados
            </a>

            {/* <div className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white">
              <FaRegCalendarAlt color="#fff" size={18} className="me-2" />
              Eventos
            </div> */}

            <a href="/perfil/editar" className="ps-2 icon-18-sidebar header-item fs-12 fw-700 py-2 div-icon-sidebar text-white mb-5">
              <GoGear color="#fff" size={18} className="me-2" strokeWidth={0.5} />
              Configurações
            </a>
          </div>
        </Nav>
      </NavbarCollapse>
    </Navbar>
  )
}