import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Row } from "react-bootstrap";

export default function Faq() {
    return (
        <Row className="d-flex justify-content-center py-5 px-2">
            <Col xxl={8} md={19}>
                <span>Faq</span>
                <h2 className="fw-700 fs-28 mb-4 mt-2">Dúvidas Frequentes</h2>

                <Accordion alwaysOpen>
                    <AccordionItem eventKey="0" className="mb-2">
                        <AccordionHeader>Para quem é o Cria Mais?</AccordionHeader>
                        <AccordionBody>
                            O programa foi feito para pessoas criativas, empreendedores, que trabalham por conta própria e querem aprender a organizar suas finanças.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="1" className="mb-2">
                        <AccordionHeader>O curso é gratuito e com certificado?</AccordionHeader>
                        <AccordionBody>
                            Sim! O programa é 100% gratuito do início ao fim. Ao final de cada trilha, você recebe um certificado referente e ao completar toda a jornada, você emite o certificado oficial consolidado do Cria Mais.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="2" className="mb-2">
                        <AccordionHeader>Posso me inscrever a qualquer momento?</AccordionHeader>
                        <AccordionBody>
                            Sim! As aulas começam oficialmente no dia 22/06, mas as vagas são limitadas! Garanta o seu cadastro o quanto antes no formulário acima.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="3" className="mb-2">
                        <AccordionHeader>Como funciona a seleção para ganhar as mentorias e o dinheiro (Capital Semente)?</AccordionHeader>
                        <AccordionBody>
                            O prazo para as inscrições na pré-seleção acontecerão do dia 20 de Agosto ao dia 20 de setembro, após a conclusão das aulas e emissão do seu certificado da Fase I. Você poderá se inscrever para a pré-seleção, enviando o material solicitado (vídeo-pitch e uma apresentação do empreendimento). Uma banca avaliadora apresentará os 60 projetos que mais se destacaram, eles receberão 3 meses de mentoria e um capital semente no valor de R$ 8.000,00 para investir no negócio.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="4" className="mb-2">
                        <AccordionHeader>Qual é a duração do Programa?</AccordionHeader>
                        <AccordionBody>
                            A plataforma online oferece 20 horas de conteúdo dinâmico focado na prática. O programa tem duração até dezembro, mas as vagas são limitadas!                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="5" className="mb-2">
                        <AccordionHeader>Preciso ter MEI ou empresa (CNPJ) para participar?</AccordionHeader>
                        <AccordionBody>
                            Não. Qualquer pessoa pode participar. Caso você queira disputar as vagas de mentoria e capital semente na Fase 2, basta enviar o material solicitado.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="6" className="mb-2">
                        <AccordionHeader>Como posso me inscrever?</AccordionHeader>
                        <AccordionBody>
                            É super rápido! Vá até o nosso formulário de cadastro, preencha seus dados básicos e clique em avançar. Você receberá o acesso para entrar na plataforma e garantir sua vaga.
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem eventKey="7" className="mb-2">
                        <AccordionHeader>Fiquei com dúvidas sobre o conteúdo das aulas. O que eu faço?</AccordionHeader>
                        <AccordionBody>
                            Não se preocupe! Se você tiver qualquer dúvida relacionada aos assuntos ou materiais das nossas trilhas, pode enviar um e-mail direto para o duvidas.conteudo@criamaisfinancas.com.br. Nossa equipe está pronta para te ajudar!
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Col>
        </Row>
    );
}
