import { MdDone, MdPlayArrow, MdPlayLesson } from "react-icons/md";

import { Accordion } from "react-bootstrap";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaRegFilePdf } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import { MdOutlineQuiz } from "react-icons/md";
import { PiCertificate } from "react-icons/pi";

interface Module {
    name: string;
    id: number;
    course: number;
    section: number;
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
    curso: string;
    carreira: string;
}

export default function SubCurso({ subCurso, carreiraId, carreira, curso }: Props) {
    function isCerticate(index: number, array: Sequence[], indexModule: number, arrayExterno: Module[]) {
        const nextModule = array.length - 2 == index
        if (!nextModule) return 0
        const nextAccordeon = arrayExterno

        const url = `/aula?id=${nextAccordeon[indexModule + 1].sequence[0].cmid}&cursoId=${nextAccordeon[indexModule + 1].course}&carreiraId=${carreiraId}&carreira=${carreira}&curso=${curso}`

        return toBase64(url)
    }
    function toBase64(str: string) {
        return btoa(
            new TextEncoder()
                .encode(str)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
    }
    function getsubCoursesFiltred() {

        return subCurso?.filter((sub) => sub.name)
    }
    function getIcon(module: string) {
        switch (module) {
            case "mdl_page":
                return <FaRegCirclePlay width={20} />;
            case "mdl_url":
                return <FaRegFilePdf width={20} />;
            case "mdl_quiz":
                return <MdOutlineQuiz width={20} />;
            case "mdl_customcert":
                return <PiCertificate width={20} />;
            default:
                break;
        }
    }
    function boldifcerticate(module: string) {
        switch (module) {
            case "mdl_customcert":
                return 'fw-bold'
            default:
                break;
        }
    }

    return (
        <Accordion defaultActiveKey="0" className="bg-white accordion-curso rounded-3">
            {
                getsubCoursesFiltred().map((sub2, index) => (
                    <Accordion.Item eventKey={index.toString()} key={sub2.id}>
                        <Accordion.Header>{sub2.name}</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex flex-column gap-3">
                                {sub2.sequence.map((aula, index_inside) => {
                                    const canNext = sub2.sequence[index_inside - 1]?.complete || index_inside === 0;
                                    return (
                                        <a
                                            href={canNext ? `/aula?id=${aula.cmid}&cursoId=${aula.data_module.course}&carreiraId=${carreiraId}&carreira=${carreira}&curso=${curso}` : "#"}
                                            key={aula.cmid}
                                            className="d-flex align-items-center justify-content-between gap-3 text-decoration-none"
                                        >
                                            <div className="d-flex gap-3 align-items-center">
                                                <span className="">
                                                    {getIcon(aula.module)}
                                                </span>

                                                <span className={boldifcerticate(aula.module)} >
                                                    {aula?.data_module.name}
                                                </span>
                                            </div>
                                            {
                                                aula.complete ? (
                                                    <div className="ms-auto bg-auxiliary9-project rounded-5 d-flex align-items-center justify-content-center">
                                                        <MdDone size={20} color="#fff" className="m-1" />
                                                    </div>
                                                ) :
                                                    canNext ? (
                                                        <div className="ms-auto bg-black rounded-5 d-flex align-items-center justify-content-center">
                                                            <MdPlayArrow size={20} color="#fff" className="m-1" />
                                                        </div>
                                                    ) : (
                                                        <span >

                                                            <IoIosLock size={24} className="ms-auto" />
                                                        </span>
                                                    )
                                            }
                                        </a>
                                    )
                                })}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                ))
            }
        </Accordion>
    )
}