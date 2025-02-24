import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from "react-bootstrap";

export function Faq() {

    return (
        <Row className="d-flex justify-content-center py-5 px-2">
            <Col md={10}>
                <span>Faq</span>
                <h2 className="fw-700 fs-28 mb-4 mt-2">Dúvidas Frequentes</h2>

                <Accordion alwaysOpen>
                    <AccordionItem eventKey="0" className="mb-2">
                        <AccordionHeader>O Passaporte Digital é gratuíto</AccordionHeader>
                        <AccordionBody>
                            Você pode testar por até 30 dias grátis. Satisfação garantida ou seu dinheiro de volta!
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="1" className="mb-2">
                        <AccordionHeader>O curso oferece certificado?</AccordionHeader>
                        <AccordionBody>
                            Todos os cursos possuem certificados
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="2" className="mb-2">
                        <AccordionHeader>Preciso ter algum conhecimento na área? </AccordionHeader>
                        <AccordionBody>
                            Você não precisa ter conhecimento prévio e pode estudar quando e onde quiser!
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem eventKey="3" className="mb-2">
                        <AccordionHeader>Sem limites no cartão de crédito?</AccordionHeader>
                        <AccordionBody>
                            Nesse caso, faremos a cobrança em modo recorrente, ou seja, o limite a ser consumido será apenas do valor da parcela!
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Col>
        </Row>
    )
}