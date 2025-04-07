import { Col, Image, Row } from "react-bootstrap";

import aluno1 from "/public/aluno_1.png";
import aluno2 from "/public/aluno_2.png";
import aluno3 from "/public/aluno_3.png";
import grafismo1 from "/public/grafismo_1.png";

export default function Depoimentos() {

    return (
        <Row className="depoimentos py-5 px-md-5 mx-md-5 row-gap-4">
            <h2 className="text-center fw-700 fs-28 mb-5">Depoimentos</h2>

            <Col xxl={4} lg={6} md={12}>
                <div className="d-flex flex-column position-relative align-items-center bg-auxiliary1-project py-4 rounded-3 depoimentos-card gap-2">
                    <Image src={aluno2.src} width={90} height={90} alt="foto de aluno" className="depoimentos-foto" />
                    <span className="text-auxiliary7-project fs-21 fw-700">Nome do aluno</span>
                    <span className="text-auxiliary7-project">Carreira do Aluno</span>
                    <span className="text-center text-white px-4 mt-2" >Você quer se destacar no mundo das vendas? Este curso oferece uma introdução abrangente ao universo das vendas, fornecendo as habilidades e estratégias necessárias para impulsionar suas vendas e alcançar o sucesso profissional.</span>
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-1" />
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-2" />
                </div>
            </Col>

            <Col xxl={4} lg={6} md={12} className="">
                <div className="d-flex flex-column position-relative align-items-center bg-auxiliary1-project py-4 rounded-3 depoimentos-card gap-2">
                    <Image src={aluno3.src} width={90} height={90} alt="foto de aluno" className="depoimentos-foto" />
                    <span className="text-auxiliary7-project fs-21 fw-700">Nome do aluno</span>
                    <span className="text-auxiliary7-project">Carreira do Aluno</span>
                    <span className="text-center text-white px-4 mt-2" >Você quer se destacar no mundo das vendas? Este curso oferece uma introdução abrangente ao universo das vendas, fornecendo as habilidades e estratégias necessárias para impulsionar suas vendas e alcançar o sucesso profissional.</span>
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-1" />
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-2" />
                </div>
            </Col>

            <Col xxl={4} lg={6} md={12} className="">
                <div className="d-flex flex-column position-relative align-items-center bg-auxiliary1-project py-4 rounded-3 depoimentos-card gap-2">
                    <Image src={aluno1.src} width={90} height={90} alt="foto de aluno" className="depoimentos-foto" />
                    <span className="text-auxiliary7-project fs-21 fw-700">Nome do aluno</span>
                    <span className="text-auxiliary7-project">Carreira do Aluno</span>
                    <span className="text-center text-white px-4 mt-2" >Você quer se destacar no mundo das vendas? Este curso oferece uma introdução abrangente ao universo das vendas, fornecendo as habilidades e estratégias necessárias para impulsionar suas vendas e alcançar o sucesso profissional.</span>
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-1" />
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-2" />
                </div>
            </Col>

        </Row>
    );
}