import { Button, Modal, Spinner } from "react-bootstrap";
import { CertificateData, Sequence } from "./MdlCustomcert";
import { Suspense, useContext, useEffect, useState } from "react"

import { AuthContext } from "@/contexts/AuthContext";
import Certificado from "@/components/Certificado/Certificado";
import Quiz from "./Quiz";
import { api } from "@/shared/api/api";

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
export default function MdlQuiz({ userid, database, cmid, instance, setbuttons }: Props) {

    const [quiz, setQuiz] = useState<Resposta>();
    const [loading, setLoading] = useState<boolean>(true);
    const [quizAttempt, setQuizAttempt] = useState<boolean>(false);
    const [wasAttempLoading, setWasAttempLoading] = useState<boolean>(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {

        function getQuiz() {
            api.get("/quiz", {
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
                    </div >
            )
    );
}