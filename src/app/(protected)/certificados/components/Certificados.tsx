import { FaRegFilePdf } from "react-icons/fa";

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
        {
            titulo: "DESENVOLVEDOR DE JOGOS COM UNITY",
            link: ""
        },
    ];

    return (
        <div className="row row-gap-5 mt-4 mb-5">
            <div className="mb-4">
                <h2 className="mb-4 fs-28 fw-700">Meus Certificados</h2>
                <span>Estes são os certificados que você solicitou por email ou baixou manualmente.</span>
                <div className="row mt-4 row-gap-3">
                    <span className="col-xxl-2 col-xl-4">Baixar dados da tabela como</span>
                    <div className="col-xxl-3 col-xl-4">
                        <button className="w-100 btn btn-outline-2 fs-12 fw-700">
                            Valores separados por vírgula (.csv)
                        </button>
                    </div>
                    <div className="col-xxl-2 col-xl-4">
                        <button className="w-100 btn btn-primary fs-12 fw-700">
                            Download
                        </button>
                    </div>
                </div>
            </div>
            {
                certificados.map((item, index) => (
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
                ))
            }
        </div>
    )
}