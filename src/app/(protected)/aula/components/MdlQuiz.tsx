import axios from "axios";
import { useEffect, useState } from "react"
import { Button, Spinner } from "react-bootstrap";

interface Props {
    userid: string,
    database: string,
    cmid: number,
    instance: number
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
    attempt_id: null | string;
    userid: string;
    cmid: string;
    attempts: Tentativa[];
}

interface ApiResponse {
    data: Resposta;
}
export default function MdlQuiz({ userid, database, cmid, instance }: Props) {

    const [quiz, setQuiz] = useState<Resposta>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        function getQuiz() {
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/quiz`, {
                headers: {
                    "userid": userid,
                    "database": database,
                    "cmid": cmid,
                    "instance": instance
                }
            })
                .then((res: ApiResponse) => {
                    setQuiz(res.data);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (cmid && database && userid && instance) {
            getQuiz();
        }

    }, [cmid, database, userid, instance]);

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
            quiz
            &&
            <div className="w-100">
                <Button className="px-3">{quiz.message}</Button>
                <table className="table mt-4">
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
                            quiz.attempts.map((attempt, index) => (
                                <tr key={index}>
                                    <th className="text-center">{attempt.attempt}</th>
                                    <td>{attempt.state}</td>
                                    <td>{parseInt(attempt.sumgrades).toFixed(2)}</td>
                                    <td>{attempt.state == "finished" ? `Conclusão: ${formatData(attempt.timefinish)}` : `Início: ${new Date(formatData(attempt.timestart))}`}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
    )
}