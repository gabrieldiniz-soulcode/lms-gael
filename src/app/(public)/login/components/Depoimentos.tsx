import { Col, Image, Row } from "react-bootstrap";

//import aluno1 from "/public/aluno_1.png";
//import aluno2 from "/public/aluno_2.png";
//import aluno3 from "/public/aluno_3.png";
import grafismo1 from "/public/grafismo_1.png";

export default function Depoimentos() {

    return (
        <Row className="depoimentos py-5 px-md-5 mx-md-5 row-gap-4">
            <h2 className="text-center fw-700 fs-28 mb-5">Depoimentos</h2>

            <Col xxl={4} lg={6} md={12}>
                <div className="d-flex flex-column position-relative align-items-center bg-auxiliary1-project py-4 rounded-3 depoimentos-card gap-2">
                    {/*<Image src={aluno2.src} width={90} height={90} alt="foto de aluno" className="depoimentos-foto" />*/}
                    <span className="text-auxiliary7-project fs-21 fw-700">Thais B.</span>
                    <span className="text-auxiliary7-project">Analista de Dados</span>
                    <span className="text-center text-white px-4 mt-2" >Com aulas diretas, didáticas e de curta duração, consigo me manter atualizada com as novas tecnologias e desenvolver — na teoria e na prática — as habilidades essenciais para atuar como analista. Além disso, a qualidade do material, dos professores e da plataforma torna o aprendizado ainda mais acessível e eficiente.</span>
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-1" />
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-2" />
                </div>
            </Col>

            <Col xxl={4} lg={6} md={12} className="">
                <div className="d-flex flex-column position-relative align-items-center bg-auxiliary1-project py-4 rounded-3 depoimentos-card gap-2">
                    {/*<Image src={aluno3.src} width={90} height={90} alt="foto de aluno" className="depoimentos-foto" />*/}
                    <span className="text-auxiliary7-project fs-21 fw-700">Junior Cesar S.</span>
                    <span className="text-auxiliary7-project">Analista de TI</span>
                    <span className="text-center text-white px-4 mt-2" >A plataforma ajuda muito no estudo e na aprendizagem. Percebi que, apesar de ter mais de 50 anos, ainda há muito que posso aprender e ensinar. Descobri também que é divertido conhecer novas tecnologias, estabelecer novos limites e, principalmente, expandir horizontes que, até poucos meses atrás, eu já considerava encerrados.</span>
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-1" />
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-2" />
                </div>
            </Col>

            <Col xxl={4} lg={6} md={12} className="">
                <div className="d-flex flex-column position-relative align-items-center bg-auxiliary1-project py-4 rounded-3 depoimentos-card gap-2">
                    {/*<Image src={aluno1.src} width={90} height={90} alt="foto de aluno" className="depoimentos-foto" />*/}
                    <span className="text-auxiliary7-project fs-21 fw-700">Maiza Maria L.</span>
                    <span className="text-auxiliary7-project">Desenvolvedora front-end e back-end</span>
                    <span className="text-center text-white px-4 mt-2" >O passaporte digital da SoulCode foi uma ferramenta fantástica. Com ele, tive acesso a cursos online com aulas gravadas que ensinam o conteúdo passo a passo. Aprendi muito, de fato, pois a metodologia dos professores é excelente e bastante didática. A forma como ensinam torna o aprendizado de qualquer nova linguagem de programação muito mais fácil.</span>
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-1" />
                    <Image src={grafismo1.src} width={grafismo1.width} height={grafismo1.height} alt="grafismo" className="depoimento-grafismo-2" />
                </div>
            </Col>

        </Row>
    );
}