import { Fragment } from "react";
import { Accordion } from "react-bootstrap";
import { FaRegFilePdf } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdOutlineQuiz } from "react-icons/md";
import { PiCertificate } from "react-icons/pi";
import { MdDone } from "react-icons/md";
import { IoIosLock } from "react-icons/io";

interface Module {
    name: string;
    id: number;
    course: number;
    sequence: Sequence[];
}

interface Sequence {
    cmid: number,
    module: string;
    complete: boolean;
    data_module: {
        name: string;
        course: number;
        content: string;
    }
}

interface Props {
    subCurso: Module[];
    carreiraId: string;
}

export default function SubCurso({ subCurso, carreiraId }: Props) {

    function getIcon(module: string) {
        switch (module) {
            case "mdl_page":
                return <FaRegCirclePlay />;
            case "mdl_url":
                return <FaRegFilePdf />;
            case "mdl_quiz":
                return <MdOutlineQuiz />;
            case "mdl_customcert":
                return <PiCertificate />;
            default:
                break;
        }
    }

    return (
        <Accordion defaultActiveKey="0" className="bg-white accordion-curso rounded-3">
            {
                subCurso
                &&
                subCurso.map((sub, index) => (
                    <Fragment key={index}>
                        {
                            sub.name
                            &&
                            <Accordion.Item eventKey={index.toString()}>
                                <Accordion.Header>{sub.name}</Accordion.Header>
                                <Accordion.Body>
                                    <div className="d-flex flex-column gap-3">
                                        {
                                            sub.sequence.map((aula) => (
                                                <a href={`/aula?id=${aula.cmid}&cursoId=${sub.course}&carreiraId=${carreiraId}`} key={aula.cmid} className="d-flex align-items-center gap-3 text-decoration-none">
                                                    {getIcon(aula.module)}
                                                    {aula?.data_module.name}
                                                    {
                                                        aula.complete
                                                            ?
                                                            <div className="ms-auto bg-auxiliary9-project rounded-5 d-flex align-items-center justify-content-center">
                                                                <MdDone size={20} color="#fff" className="m-1" />
                                                            </div>
                                                            :
                                                            <IoIosLock size={24} className="ms-auto" />
                                                    }
                                                </a>
                                            ))
                                        }
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        }
                    </Fragment>
                ))
            }
        </Accordion>
    )
}