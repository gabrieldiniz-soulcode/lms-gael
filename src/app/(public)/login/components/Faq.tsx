import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from "react-bootstrap";

export default function Faq() {
    return (
        <Row className="d-flex justify-content-center py-5 px-2">
            <Col xxl={8} md={19}>
                <span>Faq</span>
                <h2 className="fw-700 fs-28 mb-4 mt-2">Dúvidas Frequentes</h2>

                <Accordion alwaysOpen>
                    <AccordionItem eventKey="0" className="mb-2">
                        <AccordionHeader>Lorem ipsum dolor sit?</AccordionHeader>
                        <AccordionBody>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam, quas error molestias corrupti deleniti, reprehenderit consequatur amet eligendi illum rem asperiores veritatis magnam iure similique voluptate velit, dolorum culpa dolor!
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="1" className="mb-2">
                        <AccordionHeader>Lorem ipsum dolor sit?</AccordionHeader>
                        <AccordionBody>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam, quas error molestias corrupti deleniti, reprehenderit consequatur amet eligendi illum rem asperiores veritatis magnam iure similique voluptate velit, dolorum culpa dolor!
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="2" className="mb-2">
                        <AccordionHeader>Lorem ipsum dolor sit?</AccordionHeader>
                        <AccordionBody>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam, quas error molestias corrupti deleniti, reprehenderit consequatur amet eligendi illum rem asperiores veritatis magnam iure similique voluptate velit, dolorum culpa dolor!
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="3" className="mb-2">
                        <AccordionHeader>Lorem ipsum dolor sit?</AccordionHeader>
                        <AccordionBody>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam, quas error molestias corrupti deleniti, reprehenderit consequatur amet eligendi illum rem asperiores veritatis magnam iure similique voluptate velit, dolorum culpa dolor!
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Col>
        </Row >
    );
}