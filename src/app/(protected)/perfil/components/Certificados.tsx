import { FaChevronRight, FaRegFilePdf } from "react-icons/fa";

export default function Certificados() {

    const certificados = [
        {
            titulo: "DESENVOLVEDOR DE JOGOS COM UNITY",
            link: ""
        },
        {
            titulo: "DESENVOLVEDOR DE JOGOS COM UNITY",
            link: ""
        },
        {
            titulo: "DESENVOLVEDOR DE JOGOS COM UNITY",
            link: ""
        },
        {
            titulo: "DESENVOLVEDOR DE JOGOS COM UNITY",
            link: ""
        },
        {
            titulo: "DESENVOLVEDOR DE JOGOS COM UNITY",
            link: ""
        },
    ];

    return (
        <div className="row row-gap-4 pb-5">
            <div className="d-flex justify-content-between row-gap-4">
                <span className="fs-28 fw-700 text-auxiliary1-project">Certificados</span>
                <a href="" className="pt-5 me-3 text-decoration-none d-flex align-items-center gap-2">
                    Ver todos
                    <FaChevronRight size={16} />
                </a>
            </div>
            {
                certificados.map((item, index) => {
                    if (index > 3) return;
                    return (
                        <a href={item.link} target="_blank" className="col-xxl-3 col-md-4 col-md-6 col-10 text-decoration-none" key={index}>
                            <div className="d-flex flex-column bg-white me-3 rounded-3">
                                <div className="py-5 px-4 mx-xl-5 mx-md-3 mx-4">
                                    <FaRegFilePdf className="w-100 h-auto px-4" color="#FF3B30" />
                                </div>
                                <div className="bg-auxiliary5-project pb-3 pt-4 px-4 fw-700 rounded-bottom-3">
                                    {item.titulo}
                                </div>
                            </div>
                        </a>
                    );
                })
            }
        </div>
    )
}