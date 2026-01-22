import Carreira, { Course } from "./Carreira";
import { Fragment, useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { FaChevronLeft } from "react-icons/fa6";
import { LoaderContext } from "@/contexts/LoaderContext";
import Ranking from "./Ranking";
import { Spinner } from "react-bootstrap";
import SubCurso from "./SubCurso";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface ApiResponse {
    data: Module[];
}

interface Module {
    name: string;
    id: number;
    course: number;
    sequence: Sequence[];
    section: number;
}

interface Sequence {
    cmid: number,
    module: string;
    complete: boolean;
    data_module: {
        name: string;
        course: number;
        refcourse: number;
        content: string;
    }
}

interface ApiResponseCarreira {
    data: Course[];
}

export default function Curso() {

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [curso, setCurso] = useState<Module>();
    // const [forum, setForum] = useState<Module>();
    const [subCurso, setSubCurso] = useState<Module[]>([]);
    const [subCursoLoading, setSubCursoLoading] = useState<boolean>(true);
    const [carreira, setCarreira] = useState<Course>();

    const { user } = useContext(AuthContext);
    const { updateResponses, responses } = useContext(LoaderContext);

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        function getCourse() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
                headers: {
                    "database": user?.database,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponseCarreira) => {
                    setCarreira(res.data.find((item) => item.id == parseInt(id || "0")));
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user?.name && user?.database && !responses?.every((value) => value === true)) {
            getCourse();
        }
    }, [user, updateResponses, id, responses]);

    useEffect(() => {

        function getModule() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/module`, {
                headers: {
                    "course": id,
                    "Authorization": `Bearer ${user?.token}`
                }
            })
                .then((res: ApiResponse) => {
                    res.data.map((item) => {
                        if (item.sequence[0]?.module == "mdl_forum" || item.sequence[0]?.module == null || item.sequence[1]?.module == "mdl_forum") {
                            // setForum(item);
                        }
                        if (item.sequence[0]?.module == "mdl_subcourse") {
                            setCurso(item);
                            getSubCurso(item.sequence[0].data_module.refcourse, user?.token);
                        }
                    })
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    updateResponses();
                });
        }

        if (user.token && id && !curso) {
            return getModule();
        }

    }, [user, updateResponses, id, curso]);

    function getSubCurso(courseId: number, token: string) {
        if (!token) return;
        setSubCursoLoading(true);
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/module`, {
            headers: {
                "course": courseId,
                "Authorization": `Bearer ${token}`
            }
        })
            .then((res: ApiResponse) => {
                setSubCurso(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setSubCursoLoading(false);
            });
    }

    function getSubCursoComponent(mobile: boolean) {
        return (
            subCursoLoading
                ?
                <div className={`w-100 d-flex align-items-center justify-content-center p-5 bg-white rounded-3 ${mobile ? 'd-xl-none' : 'd-xl-flex d-none'}`}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
                :
                <div className={`${mobile ? 'd-xl-none' : 'd-xl-block d-none'}`}>
                    {
                        !mobile
                        &&
                        <Ranking />
                    }
                    <SubCurso curso={curso?.sequence[activeIndex]?.data_module.name || ""} subCurso={subCurso} carreiraId={id || ""} carreira={carreira?.fullname || ""} />
                </div>
        );
    }

    return (
        curso
        &&
        <div className="row mb-5">
            <a href="/carreiras" className="col-12 mt-2 mb-4 text-decoration-none d-flex align-items-center gap-2">
                <FaChevronLeft size={16} />
                Voltar para home
            </a>
            <div className="col-xl-6 col-12 d-flex flex-column gap-3">
                {
                    carreira &&
                    <Carreira {...carreira} />
                }
                {
                    curso.sequence.map((cur, index) => (
                        <Fragment key={index}>
                            <span
                                onClick={() => {
                                    getSubCurso(cur.data_module.refcourse, user?.token);
                                    setActiveIndex(index);
                                }}
                                className={`${index == activeIndex ? "text-white bg-auxiliary1-project" : "bg-white"} p-2 fs-18 fw-700 rounded-3 cursor-pointer`}
                            >
                                {cur.data_module.name}
                            </span>
                            {
                                (index == activeIndex && subCurso)
                                &&
                                getSubCursoComponent(true)
                            }
                        </Fragment>
                    ))
                }
            </div>
            <div className="col-6 flex-column gap-3">
                {
                    subCurso
                    &&
                    getSubCursoComponent(false)
                }
            </div>
            {/* <a href="" className="col-12 text-center text-decoration-none mt-4">Fórum do Curso</a> */}
        </div>
    );
}