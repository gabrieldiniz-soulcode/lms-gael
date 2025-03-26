import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import MdlCustomcert from "./MdlCustomcert";
import MdlPage from "./MdlPage";
import MdlQuiz from "./MdlQuiz";
import MdlUrl from "./MdlUrl";
import axios from "axios";

interface Module {
    name: string;
    id: number;
    course: number;
    availability: string;
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
        externalurl: string;
        id: number;
    }
}

interface ApiResponse {
    data: Module[];
}

export default function Aula() {

    const [aulas, setAulas] = useState<Sequence[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [paused, setPaused] = useState<boolean>(true);

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const id = searchParams.get('id');
    const cursoId = searchParams.get('cursoId');
    const carreiraId = searchParams.get('carreiraId');

    useEffect(() => {
        function getModule() {
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/module`, {
                headers: {
                    "course": cursoId,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    const sequence: Sequence[] = [];
                    res.data.map((item) => {
                        if (item.name) {
                            sequence.push(...item.sequence);
                        }
                    });
                    setActiveIndex(sequence.findIndex((item) => item.cmid == parseInt(id || "0")));
                    setAulas(sequence);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.database && user?.id && id && cursoId && !aulas.length) {
            return getModule();
        }

    }, [id, updateResponses, user, cursoId, aulas]);

    useEffect(() => {
        function completeModule() {
            axios.post(`http://${process.env.NEXT_PUBLIC_API_URL}/module/completion`, {
                cmid: aulas[activeIndex].cmid,
                course: aulas[activeIndex].data_module.course,
            }, {
                headers: {
                    "database": user.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res) => {
                    console.log(res);
                })
                .catch(() => { });
        }

        if (aulas[activeIndex] && user && cursoId && !aulas[activeIndex].complete) {
            completeModule();
        }

    }, [aulas, activeIndex, user, cursoId]);

    useEffect(() => {
        function updateIdSearchParam() {
            const params = new URLSearchParams(searchParams.toString());
            params.set("id", aulas[activeIndex].cmid.toString());
            replace(`${pathname}?${params.toString()}`);
        }

        if (aulas[activeIndex]) {
            updateIdSearchParam();
        }

    }, [activeIndex, aulas, pathname, replace, searchParams]);

    function prevOrNext(next: boolean) {
        setPaused(true);
        if (next) {
            setActiveIndex(activeIndex + 1)
        }
        else {
            setActiveIndex(activeIndex - 1)
        }
    }

    function getDisplay(): React.ReactNode {
        switch (aulas[activeIndex]?.module) {
            case "mdl_page":
                return <MdlPage sequence={aulas[activeIndex]} paused={paused} setPaused={setPaused} />;
            case "mdl_url":
                return <MdlUrl sequence={aulas[activeIndex]} />;
            case "mdl_quiz":
                return <MdlQuiz cmid={aulas[activeIndex].cmid} database={user.database} instance={aulas[activeIndex].data_module.id} userid={user.id} />;
            case "mdl_customcert":
                return <MdlCustomcert sequence={aulas[activeIndex]} />;
            default:
                return <></>;
        }
    }

    return (
        aulas
        &&
        <div className="row">
            <a href={`/curso?id=${carreiraId}`} className="col-12 mt-2 mb-4 text-decoration-none d-flex align-items-center gap-2">
                <FaChevronLeft size={16} />
                Voltar para carreira
            </a>
            <div className="col-xl-8 col-12">
                <h2 className="fs-18 fw-700">
                    {aulas[activeIndex]?.data_module.name}
                </h2>
                <div className="d-flex justify-content-end gap-3">
                    <button disabled={activeIndex < 1} className="d-flex gap-3 align-items-center pe-3 border-0 cursor-pointer rounded-5 bg-white" onClick={() => prevOrNext(false)}>
                        <div className="p-2 bg-auxiliary6-project rounded-5">
                            <FaChevronLeft className="mx-1" />
                        </div>
                        Anterior
                    </button>
                    <button disabled={activeIndex > aulas.length - 2} className="d-flex gap-3 align-items-center ps-3 border-0 cursor-pointer rounded-5 bg-white" onClick={() => prevOrNext(true)}>
                        Próximo
                        <div className="p-2 bg-auxiliary6-project rounded-5">
                            <FaChevronRight className="mx-1" />
                        </div>
                    </button>
                </div>
                <div className="mt-4 position-relative d-flex justify-content-center align-items-center">
                    {getDisplay()}
                </div>
            </div>
        </div>
    )
}