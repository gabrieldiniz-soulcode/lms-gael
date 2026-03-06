"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Spinner, Modal } from "react-bootstrap";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import logo1 from "/public/ifood/logos/chega_junto.png";
import logo2 from "/public/ifood/logos/Logo SoulCode.svg";
import logo3 from "/public/ifood/logos/soulcode.png";

export default function LoginWithEmail() {
  const [logado, setLogado] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const { signIn } = useContext(AuthContext);

  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  async function attemptLogin() {
    if (!email) return;

    setLogado(true);

    const res = await signIn(email, "Mudar@123", true);

    if (res) {
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        router.replace("/login");
      }, 5000);
    }
  }

  useEffect(() => {
    if (logado) return;

    attemptLogin();
  }, [email, logado, signIn]);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>

      <Modal show={showModal} centered >
        <Modal.Body
          style={{
            margin: "10px 10px",
            padding: "24px 14px",
            border: "solid 1px black",
          }}
          className="rounded shadow-xl py-24 px-24 bg-auxiliary1-project text-white d-flex flex-column align-items-center gap-4"
        >
          <div className="d-flex gap-4">
            <Image
              src={logo3.src}
              width={55}
              height={55}
              alt="logo Ifood"
              className="object-fit-contain"
            />
            <Image
              src={logo1.src}
              width={55}
              height={55}
              alt="logo chega junto"
              className="object-fit-contain"
            />
            <Image
              src={logo2.src}
              width={55}
              height={55}
              alt="logo corre play"
              className="object-fit-contain"
            />
          </div>
          Verifique as instruções de login enviadas para seu e-mail.
        </Modal.Body>
      </Modal>
    </>
  );
}
