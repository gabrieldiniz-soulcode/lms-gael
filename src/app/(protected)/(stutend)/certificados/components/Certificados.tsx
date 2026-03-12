import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import Certificado from "@/components/Certificado/Certificado";
import { FaRegFilePdf } from "react-icons/fa";
import { LoaderContext } from "@/contexts/LoaderContext";
import axios from "axios";

import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

interface CertificateData {
  certificate_created: number;
  code: string;
  coursename: string;
  firstname: string;
  lastname: string;
  workload: string;
  name: string;
}

export default function Certificados() {
  const { updateResponses } = useContext(LoaderContext);
  const { user } = useContext(AuthContext);
  const [certificados, setCertificados] = useState<CertificateData[]>([]);
  const [triggerDownload, setTriggerDownload] = useState<boolean[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  const MOCK_CERTIFICATES: CertificateData[] = [
    {
      certificate_created: 1700000000,
      code: "MOCK-001",
      coursename: "Curso Mock",
      firstname: "João",
      lastname: "Silva",
      workload: "10",
      name: "Certificado Mock #1",
    },
    {
      certificate_created: 1700000000,
      code: "MOCK-002",
      coursename: "Curso Mock",
      firstname: "Maria",
      lastname: "Oliveira",
      workload: "8",
      name: "Certificado Mock #2",
    },
    {
      certificate_created: 1700000000,
      code: "MOCK-003",
      coursename: "Curso Mock",
      firstname: "Lucas",
      lastname: "Almeida",
      workload: "12",
      name: "Certificado Mock #3",
    },
    {
      certificate_created: 1700000000,
      code: "MOCK-004",
      coursename: "Curso Mock",
      firstname: "Ana",
      lastname: "Fernandes",
      workload: "6",
      name: "Certificado Mock #4",
    },
    {
      certificate_created: 1700000000,
      code: "MOCK-004",
      coursename: "Curso Mock",
      firstname: "Ana",
      lastname: "Fernandes",
      workload: "6",
      name: "Certificado Mock #5",
    },
  ];

  useEffect(() => {
    async function getCertificates() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/certificate/my`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          },
        );
        let data: CertificateData[] = Array.isArray(res.data) ? res.data : [];
        const triggerArray = new Array(data.length).fill(false);

        // data = MOCK_CERTIFICATES;
        setTriggerDownload(triggerArray);
        setCertificados(data);
      } finally {
        updateResponses();
      }
    }

    if (user?.token && triggerDownload.length < 1) {
      getCertificates();
    }
  }, [triggerDownload, user?.token, updateResponses]);

  useEffect(() => {
    function updateIsMobile() {
      setIsMobile(
        typeof window !== "undefined" ? window.innerWidth < 992 : false,
      );
    }

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  return (
    <div className="row row-gap-5 mt-4 mb-5">
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center justify-content-between w-100 gap-2 mb-2">
            {isMobile && (
              <div className="custom-prev-certificados">
                <img src="/Back Arrow.svg" className="arrows" alt="Anterior" />
              </div>
            )}

            <h2 className="mb-0 fs-28 fw-700">Meus Certificados</h2>

            {isMobile && (
              <div className="custom-next-certificados">
                <img
                  src="/Back Arrow.svg"
                  className="arrows"
                  alt="Próximo"
                  style={{ rotate: "180deg" }}
                />
              </div>
            )}
          </div>
        </div>
        <span>
          Estes são os certificados que você solicitou por email ou baixou
          manualmente.
        </span>
      </div>

      {isMobile ? (
        <div className="overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination]}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              576: { slidesPerView: 2, spaceBetween: 16 },
            }}
            pagination={{ clickable: true }}
            navigation={{
              prevEl: ".custom-prev-certificados",
              nextEl: ".custom-next-certificados",
            }}
            className="mySwiper"
          >
            {certificados.map((item, index) => (
              <SwiperSlide key={item.code || index}>
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    const newTrigger = [...triggerDownload];
                    newTrigger[index] = true;
                    setTriggerDownload(newTrigger);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      const newTrigger = [...triggerDownload];
                      newTrigger[index] = true;
                      setTriggerDownload(newTrigger);
                    }
                  }}
                >
                  <div className="d-flex flex-column bg-white me-3 rounded-3 h-100">
                    <div className="py-5 px-4 mx-xl-5 mx-md-3 mx-4">
                      <FaRegFilePdf
                        className="w-100 h-auto px-4"
                        color="#FF3B30"
                      />
                    </div>
                    <div className="bg-auxiliary5-project pb-3 pt-4 px-4 fw-700 h-100 rounded-bottom-3">
                      {item.name}
                    </div>
                  </div>
                  <Certificado
                    certificado={item}
                    triggerDownload={triggerDownload}
                    onDownloaded={() => {
                      const newTrigger = [...triggerDownload];
                      newTrigger[index] = false;
                      setTriggerDownload(newTrigger);
                    }}
                    index={index}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
          {certificados.map((item, index) => (
            <div className="col" key={item.code || index}>
              <div
                className="cursor-pointer"
                onClick={() => {
                  const newTrigger = [...triggerDownload];
                  newTrigger[index] = true;
                  setTriggerDownload(newTrigger);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    const newTrigger = [...triggerDownload];
                    newTrigger[index] = true;
                    setTriggerDownload(newTrigger);
                  }
                }}
              >
                <div className="d-flex flex-column bg-white me-3 rounded-3 h-100">
                  <div className="py-5 px-4 mx-xl-5 mx-md-3 mx-4">
                    <FaRegFilePdf
                      className="w-100 h-auto px-4"
                      color="#FF3B30"
                    />
                  </div>
                  <div className="bg-auxiliary5-project pb-3 pt-4 px-4 fw-700 h-100 rounded-bottom-3">
                    {item.name}
                  </div>
                </div>
                <Certificado
                  certificado={item}
                  triggerDownload={triggerDownload}
                  onDownloaded={() => {
                    const newTrigger = [...triggerDownload];
                    newTrigger[index] = false;
                    setTriggerDownload(newTrigger);
                  }}
                  index={index}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
