import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from "react-bootstrap";

export default function Faq() {

    return (
        <Row className="d-flex justify-content-center py-5 px-2">
            <Col xxl={8} md={19}>
                <span>Faq</span>
                <h2 className="fw-700 fs-28 mb-4 mt-2">Dúvidas Frequentes</h2>

                <Accordion alwaysOpen>
                    <AccordionItem eventKey="0" className="mb-2">
                        <AccordionHeader>Como funciona?</AccordionHeader>
                        <AccordionBody>
                            O Passaporte Digital é uma plataforma com aulas gravadas para estudar quando e onde quiser.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="1" className="mb-2">
                        <AccordionHeader>Tenho contato direto com o professor?</AccordionHeader>
                        <AccordionBody>
                            Você pode tirar todas as suas dúvidas dentro do discord, ou no email suporte@soulcode.com.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="2" className="mb-2">
                        <AccordionHeader>Vou receber certificado de cada carreira finalizada? </AccordionHeader>
                        <AccordionBody>
                            Recebe sim! Tanto os certificados de cada curso, quanto os certificados de cada carreira.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="3" className="mb-2">
                        <AccordionHeader>Os cursos do Passaporte Digital são válidos como ensino superior?</AccordionHeader>
                        <AccordionBody>
                            Não, cursos livres não fornecem formação superior.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="4" className="mb-2">
                        <AccordionHeader>A plataforma do Passaporte Digital tem conteúdos básicos ou avançados?</AccordionHeader>
                        <AccordionBody>
                            A plataforma oferece cursos desde o nível básico ao avançado.
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="5" className="mb-2">
                        <AccordionHeader>Qual a diferença entre bootcamp e Passaporte Digital?</AccordionHeader>
                        <AccordionBody>
                            Passaporte Digital:
                            É uma plataforma de aprendizado contínuo com diversos cursos online. Seu objetivo é permitir que os usuários desenvolvam habilidades digitais no próprio ritmo, sem um cronograma fixo. Os cursos são com aulas gravadas com fóruns disponíveis para esclarecer dúvidas.
                            Bootcamp:
                            É um programa intensivo e imersivo, com duração fixa e um cronograma estruturado. Os bootcamps incluem aulas ao vivo, interação com professores e colegas, projetos práticos e, em alguns casos, a possibilidade de conexão com empresas parceiras para vagas de emprego. Eles são voltados para quem busca uma experiência mais aprofundada e acelerada em uma área específica.    
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="6" className="mb-2">
                        <AccordionHeader>Estou com dificuldades para acessar a plataforma. O que fazer?</AccordionHeader>
                        <AccordionBody>Entre em contato no chat, Whatsapp ou e-mail atendimento@soulcode.com e informe qual plataforma você está tentando acessar: Starter, Passaporte Digital ou Processo Seletivo, descrevendo o erro que aparece. Se possível, envie uma captura de tela para facilitar o entendimento do problema. Também é importante compartilhar o e-mail usado no cadastro para verificarmos possíveis problemas no login. Com essas informações poderemos orientar sobre os próximos passos.</AccordionBody>
                        </AccordionItem>    
                </Accordion>
            </Col>
        </Row>
    )
}