import Image from "next/image";
import img from "/public/rectangle_ranking.png";

export default function Ranking() {

    return (
        <div className="bg-auxiliary1-project rounded-3" style={{ overflow: 'hidden' }}>
            <div className="position-relative">
                <Image src={img.src} width={0} height={0} className="w-100 h-auto" alt="" />
                <div className="position-absolute mt-exxl-4 mt-3 d-flex flex-column justify-content-center align-items-center w-100 top-0">
                    <span className="text-white fs-21 fw-700">Ranking</span>
                    <div className="d-flex mt-2 gap-3 position-relative">
                        <div className="mt-5 rounded-circle d-flex flex-column">
                            <Image src={"https://placehold.co/90x90"} width={90} height={90} alt="" className="rounded-circle perfil-ranking-aula2" />
                            <div className="d-flex justify-content-center">
                                <span className="px-2 py-1 rounded-circle colocacao-ranking-aula2 text-white fw-700" style={{ marginTop: -18 }}>2º</span>
                            </div>
                        </div>
                        <div className="mt-2 rounded-circle d-flex flex-column">
                            <Image src={"https://placehold.co/120x120"} width={120} height={120} alt="" className="rounded-circle perfil-ranking-aula1" />
                            <div className="d-flex justify-content-center">
                                <span className="px-2 py-1 rounded-circle colocacao-ranking-aula1 text-white fw-700" style={{ marginTop: -18 }}>1º</span>
                            </div>
                        </div>
                        <div className="mt-5 rounded-circle d-flex flex-column">
                            <Image src={"https://placehold.co/90x90"} width={90} height={90} alt="" className="rounded-circle perfil-ranking-aula3" />
                            <div className="d-flex justify-content-center">
                                <span className="px-2 py-1 rounded-circle colocacao-ranking-aula3 text-white fw-700" style={{ marginTop: -18 }}>3º</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column gap-3 mx-4 my-3">
                <div className="row rounded-3 justify-content-center lista-ranking-aula-active">
                <div className="py-2 col-2 d-flex align-items-center justify-content-center">
                        <span className="p-4 rounded-3 ms-3 colocacao">1°</span>
                    </div>
                    <div className="d-flex col-7 gap-3 align-items-center perfil p-0">
                        <Image src={"https://placehold.co/90x90"} width={60} height={60} alt="" className="rounded-circle ms-4" />
                        <div className="d-flex flex-column">
                            <span className="fw-700 fs-13">Nome do Aluno</span>
                            <span className="fs-13">Cidade</span>
                        </div>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end">
                        <div className="hexagon">
                            <div>
                                <span>1750</span>
                                <br />
                                <span className="fs-13 fw-400">xp</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row rounded-3 justify-content-center lista-ranking-aula">
                    <div className="py-2 col-2 d-flex align-items-center justify-content-center">
                        <span className="p-4 rounded-3 ms-3 colocacao">2°</span>
                    </div>
                    <div className="d-flex col-7 p-0 gap-3 align-items-center perfil">
                        <Image src={"https://placehold.co/90x90"} width={60} height={60} alt="" className="rounded-circle ms-4" />
                        <div className="d-flex flex-column">
                            <span className="fw-700 fs-13">Nome do Aluno</span>
                            <span className="fs-13">Cidade</span>
                        </div>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end">
                        <div className="hexagon">
                            <div>
                                <span>1750</span>
                                <br />
                                <span className="fs-13 fw-400">xp</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row rounded-3 justify-content-center lista-ranking-aula">
                    <div className="py-2 col-2 d-flex align-items-center justify-content-center">
                        <span className="p-4 rounded-3 ms-3 colocacao">3°</span>
                    </div>
                    <div className="d-flex col-7 p-0 gap-3 align-items-center perfil">
                        <Image src={"https://placehold.co/90x90"} width={60} height={60} alt="" className="rounded-circle ms-4" />
                        <div className="d-flex flex-column">
                            <span className="fw-700 fs-13">Nome do Aluno</span>
                            <span className="fs-13">Cidade</span>
                        </div>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end">
                        <div className="hexagon">
                            <div>
                                <span>1750</span>
                                <br />
                                <span className="fs-13 fw-400">xp</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row rounded-3 justify-content-center lista-ranking-aula">
                    <div className="py-2 col-2 d-flex align-items-center justify-content-center">
                        <span className="p-4 rounded-3 ms-3 colocacao">4°</span>
                    </div>
                    <div className="d-flex col-7 p-0 gap-3 align-items-center perfil">
                        <Image src={"https://placehold.co/90x90"} width={60} height={60} alt="" className="rounded-circle ms-4" />
                        <div className="d-flex flex-column">
                            <span className="fw-700 fs-13">Nome do Aluno</span>
                            <span className="fs-13">Cidade</span>
                        </div>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end">
                        <div className="hexagon">
                            <div>
                                <span>1750</span>
                                <br />
                                <span className="fs-13 fw-400">xp</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row rounded-3 justify-content-center lista-ranking-aula">
                    <div className="py-2 col-2 d-flex align-items-center justify-content-center">
                        <span className="p-4 rounded-3 ms-3 colocacao">5°</span>
                    </div>
                    <div className="d-flex col-7 p-0 gap-3 align-items-center perfil">
                        <Image src={"https://placehold.co/90x90"} width={60} height={60} alt="" className="rounded-circle ms-4" />
                        <div className="d-flex flex-column">
                            <span className="fw-700 fs-13">Nome do Aluno</span>
                            <span className="fs-13">Cidade</span>
                        </div>
                    </div>
                    <div className="col-3 d-flex align-items-center justify-content-end">
                        <div className="hexagon">
                            <div>
                                <span>1750</span>
                                <br />
                                <span className="fs-13 fw-400">xp</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}