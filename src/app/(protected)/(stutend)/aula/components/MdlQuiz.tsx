import { Button, Modal, Spinner } from "react-bootstrap";
import { Suspense, useContext, useEffect, useState } from "react"

import { AuthContext } from "@/contexts/AuthContext";
import Quiz from "./Quiz";
import axios from "axios";
import { CertificateData, Sequence } from "./MdlCustomcert";
import Certificado from "@/components/Certificado/Certificado";

interface Props {
    userid: string,
    database: string,
    cmid: number,
    instance: number
    setbuttons: () => React.ReactElement;
    sequence: Sequence;
    nexturl?: string
}

interface Tentativa {
    id: number;
    quiz: number;
    userid: number;
    attempt: number;
    uniqueid: number;
    layout: string;
    currentpage: number;
    preview: number;
    state: string;
    timestart: number;
    timefinish: number;
    timemodified: number;
    timemodifiedoffline: number;
    timecheckstate: null | number;
    sumgrades: string;
    gradednotificationsenttime: number;
}

interface Resposta {
    message: string;
    action: string;
    attempt_id: number;
    userid: string;
    cmid: string;
    attempts: Tentativa[];
}

interface ApiResponse {
    data: Resposta;
}
export default function MdlQuiz({ userid, database, cmid, instance, setbuttons, sequence, nexturl }: Props) {

    const [quiz, setQuiz] = useState<Resposta>();
    const [loading, setLoading] = useState<boolean>(true);
    const [quizAttempt, setQuizAttempt] = useState<boolean>(false);
    const [wasAttempLoading, setWasAttempLoading] = useState<boolean>(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {

        function getQuiz() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quiz`, {
                headers: {
                    "Authorization": `Bearer ${user?.token}`,
                    "cmid": cmid,
                    "instance": instance
                }
            })
                .then((res: ApiResponse) => {
                    setQuiz(res.data);

                    if (wasAttempLoading) {
                        setWasAttempLoading(false)
                        handleShow()
                    }


                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (cmid && database && userid && instance && !quizAttempt && user) {
            getQuiz();
        }

    }, [cmid, database, userid, instance, quizAttempt, user]);

    function formatData(timestamp: number): string {
        if (!timestamp) {
            return "Data não disponível";
        }
        const date = new Date(timestamp * 1000);
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const ano = date.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [certificado, setCertificado] = useState<CertificateData | null>(null);
    const [triggerDownload, setTriggerDownload] = useState<boolean[]>([false]);

    const buscarCertificado = async () => {

        if (!user?.token) return;

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/certificate`, {
            headers: {
                Authorization: `Bearer ${user?.token}`,
                course: sequence.data_module.course,
                template_id: sequence.data_module.templateid
            }
        }).catch(e => console.log(e))
        if (!res) return
        setCertificado(res.data);
        setTriggerDownload([true]);
    };


    return (
        loading
            ?
            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
            :
            quiz && (
                quizAttempt
                    ?
                    <Suspense>
                        <div>

                            <Quiz
                                cmid={cmid}
                                database={database}
                                instance={(quiz?.action == "continue_attempt" ? quiz.attempt_id : instance)}
                                userid={userid}
                                newAttempt={(quiz?.action == "continue_attempt" ? false : true)}
                                setQuizAttempt={setQuizAttempt}
                                setWasAttempLoading={setWasAttempLoading}

                            />
                        </div>
                    </Suspense>
                    :
                    <div className="w-100">
                        {setbuttons()}
                        <Button className="px-3 my-3" onClick={() => setQuizAttempt(true)}>{quiz.message}</Button>
                        <table className="table my-4">
                            <thead>
                                <tr>
                                    <th scope="col d-flex justify-content-center">Tentativa</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Nota / 10.00</th>
                                    <th scope="col">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    quiz.attempts?.map((attempt, index) => (
                                        <tr key={index}>
                                            <th className="text-center">
                                                {attempt.attempt}
                                                {/* {attempt.uniqueid} */}
                                            </th>
                                            <td>{attempt.state}</td>
                                            <td>{parseInt(attempt.sumgrades || "0").toFixed(2)}</td>
                                            <td>{attempt.state == "finished" ? `Conclusão: ${formatData(attempt.timefinish)}` : `Início: ${formatData(attempt.timestart)}`}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>




                        <Button variant="primary" onClick={handleShow}>
                            Launch demo modal
                        </Button>

                        <Modal show={show} onHide={handleClose} className="position-relative" backdrop="static">
                            <img src="/modulo400.png" className="w-100 position-relative z-1 rounded" alt="" />
                            <div className="position-absolute h-100 z-2 d-flex justify-content-around w-100 ">
                                <div className=" d-flex justify-content-center align-items-end pb-5 w-100 mb-5 gap-3">

                                    <Button variant="secondary" onClick={buscarCertificado}>
                                        Baixe seu certificado
                                        <span className=""><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg></span>
                                    </Button>
                                    <Certificado
                                        certificado={certificado}
                                        triggerDownload={triggerDownload}
                                        index={0}
                                        onDownloaded={() => setTriggerDownload([false])}
                                    />

                                    <a className="btn btn-primary" href={nexturl}>
                                        ir para o próximo módulo
                                        <span className="">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="black"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" /></svg>
                                        </span>

                                    </a>
                                </div>
                            </div>

                        </Modal>

                    </div >
            )
    );
}