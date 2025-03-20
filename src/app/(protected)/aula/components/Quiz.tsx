import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";

interface Props {
    userid: string;
    database: string;
    cmid: number;
    instance: number;
    newAttempt: boolean;
    setQuizAttempt: (newQuizAttempt: boolean) => void;
}

interface QuestionAnswer {
    id: number;
    question: number;
    answer: string;
    answerformat: number;
    fraction: string;
    feedback: string;
    feedbackformat: number;
}

interface Question {
    slot: number;
    slotid: number;
    page: number;
    maxmark: string;
    requireprevious: number;
    filtercondition: null;
    status: string;
    versionid: number;
    version: number;
    requestedversion: null;
    questionbankentryid: number;
    questionid: number;
    id: number;
    parent: number;
    name: string;
    questiontext: string;
    questiontextformat: number;
    generalfeedback: string;
    generalfeedbackformat: number;
    defaultmark: string;
    penalty: string;
    qtype: string;
    length: number;
    stamp: string;
    timecreated: number;
    timemodified: number;
    createdby: number;
    modifiedby: number;
    category: number;
    contextid: number;
    q_answers: QuestionAnswer[];
}
interface ApiResponse {
    data: Question[];
}

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

export default function Quiz({ userid, database, cmid, instance, newAttempt, setQuizAttempt }: Props) {

    const [quiz, setQuiz] = useState<Question[]>();
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const searchParams = useSearchParams();
    const cursoId = searchParams.get('cursoId');

    useEffect(() => {
        function getQuiz() {
            axios.post(`http://${process.env.NEXT_PUBLIC_API_URL}/quiz/new_attempt`, {
                userid,
                cmid,
                instance
            }, {
                headers: {
                    "database": database
                }
            })
                .then((res: ApiResponse) => {
                    setQuiz(res.data);
                    setSelectedAnswer(res.data.map(() => 0));
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        function getQuizInProgress() {
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/quiz/continue_attempt`, {
                headers: {
                    "database": database,
                    "attempt_id": instance
                }
            })
                .then((res: ApiResponse) => {
                    setQuiz(res.data);
                    setSelectedAnswer(res.data.map(() => 0));
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (cmid && userid && instance && database) {
            if (newAttempt) {
                getQuiz();
                return;
            }
            getQuizInProgress();
        }

    }, [cmid, userid, instance, database, newAttempt, setLoading]);

    function saveQuestionAttempt(answerId: number) {
        if (!quiz) return;
        axios.put(`http://${process.env.NEXT_PUBLIC_API_URL}/quiz/save_question_attempt`, {
            userid,
            slot: quiz[activeIndex].slot,
            question_usages_id: 34065,
            question_answer_id: answerId
        }, {
            headers: {
                "database": database
            }
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function completeQuizAttempt() {
        if (!isComplete()) {
            setQuizAttempt(false);
            return;
        }
        axios.put(`http://${process.env.NEXT_PUBLIC_API_URL}/quiz/complete_attempt`, {
            userid,
            cmid,
            question_usages_id: 34065,
            course: cursoId
        }, {
            headers: {
                "database": database
            }
        })
            .then(() => {
                setQuizAttempt(false);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function saveAnswer(answerId: number) {
        saveQuestionAttempt(answerId);
        const newAnswers = [...selectedAnswer];
        newAnswers[activeIndex] = answerId;
        setSelectedAnswer(newAnswers);
    }

    function tryAgain() {
        if (!quiz) return;
        setSelectedAnswer(quiz.map(() => 0));
        setActiveIndex(0);
    }

    function isComplete(): boolean {
        return selectedAnswer.every((value) => value !== 0);
    }

    function removeHtmlTags(text: string) {
        return text.replace(/<[^>]*>/g, '');
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
            (quiz && selectedAnswer.length > 0)
            &&
            <div className="row w-100">
                <div className="col-2 p-3 gap-3 rounded-3 bg-auxiliary6-project d-md-flex d-none flex-column">
                    <span className="text-center py-2 rounded-3 bg-primary text-white fw-700">Questões</span>
                    {
                        quiz.map((_, index) => (
                            <span key={index} className={`text-center py-2 rounded-3 ${activeIndex == index ? 'bg-auxiliary8-project text-white' : 'bg-white'}`}>Questão {index + 1}</span>
                        ))
                    }
                    <span className="text-center py-2 rounded-3 bg-white my-1 cursor-pointer" onClick={completeQuizAttempt}>{isComplete() ? "Finalizar" : "Salvar"}</span>
                    <span className="text-center py-2 fs-12 rounded-3 bg-auxiliary7-project cursor-pointer" onClick={tryAgain}>Tentar <br /> novamente</span>
                </div>
                <div className="col-md-10 col-12 pt-md-5">
                    <div className="bg-auxiliary6-project d-flex flex-column mt-4 gap-3 p-3 rounded-3">

                        <span className="fw-700 fs-18">{removeHtmlTags(quiz[activeIndex].questiontext)}</span>
                        {
                            quiz[activeIndex].q_answers.map((item, index) => (
                                <div key={index} className="d-flex gap-2" onClick={() => saveAnswer(item.id)}>
                                    <Form.Check
                                        type="radio"
                                        className="bg-transparent"
                                        checked={selectedAnswer[activeIndex] === item.id}
                                        onChange={() => saveAnswer(item.id)}
                                    />
                                    <span className="fw-700">{alphabet[index]}. </span>
                                    <span key={index}>{removeHtmlTags(item.answer)}</span>
                                </div>
                            ))
                        }
                    </div>
                    <div className="d-flex justify-content-between mt-3 gap-3">
                        <Button className="px-4" disabled={activeIndex < 1} onClick={() => setActiveIndex(activeIndex - 1)}>Pergunta Anterior</Button>
                        {
                            activeIndex >= (quiz.length - 1)
                                ?
                                <Button className="px-4" onClick={completeQuizAttempt} disabled={selectedAnswer[activeIndex] == 0}>Finalizar</Button>
                                :
                                <Button className="px-4" onClick={() => setActiveIndex(activeIndex + 1)} disabled={selectedAnswer[activeIndex] == 0}>Próxima Pergunta</Button>
                        }
                    </div>
                    <div className="d-flex flex-wrap gap-md-5 mt-4 gap-3">
                        <span className="fw-700">Questão {activeIndex + 1}</span>
                        <span>{selectedAnswer[activeIndex] == 0 ? "Ainda não respondida" : "Respondida"}</span>
                        <span>Vale {parseFloat(quiz[activeIndex].maxmark)} ponto(s)</span>
                    </div>
                </div>
            </div>
    );
}