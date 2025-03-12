import { AuthContext } from "@/contexts/AuthContext";
import { LoaderContext } from "@/contexts/LoaderContext";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Fragment, useContext, useEffect, useState } from "react";
import SubCurso from "./SubCurso";
import { Spinner } from "react-bootstrap";
import Carreira from "./Carreira";
import { FaChevronLeft } from "react-icons/fa6";

interface ApiResponse {
    data: Module[];
}

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
        refcourse: number;
        content: string;
    }
}

export default function Curso() {

    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [curso, setCurso] = useState<Module>();
    const [forum, setForum] = useState<Module>();
    const [subCurso, setSubCurso] = useState<Module[]>([]);
    const [subCursoLoading, setSubCursoLoading] = useState<boolean>(true);

    const { user } = useContext(AuthContext);
    const { updateResponses } = useContext(LoaderContext);

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {

        function getModule() {
            axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/module?course=${search}&database=${user?.database}&userid=${user?.id}`)
                .then((res: ApiResponse) => {
                    res.data.map((item) => {
                        if (item.sequence[0]?.module == "mdl_forum" || item.sequence[1]?.module == "mdl_forum") {
                            setForum(item);
                        }
                        if (item.sequence[1]?.module == "mdl_subcourse") {
                            setCurso(item);
                            getSubCurso(item.sequence[0].data_module.refcourse, user?.database, user?.id);
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

        if (user.database) {
            return getModule();
        }

    }, [user, updateResponses, search]);

    function getSubCurso(id: number, database: string, userId: string) {
        setSubCursoLoading(true);
        axios.get(`http://${process.env.NEXT_PUBLIC_API_URL}/module?course=${id}&database=${database}&userid=${userId}`)
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
        console.log(forum)

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
                    <SubCurso subCurso={subCurso} />
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
                <Carreira />
                {
                    curso.sequence.map((cur, index) => (
                        <Fragment key={index}>
                            <span
                                onClick={() => {
                                    getSubCurso(cur.data_module.refcourse, user?.database, user?.id);
                                    setActiveIndex(index);
                                }}
                                className={`${index == activeIndex ? "text-white bg-auxiliary1-project" : "bg-white"} p-2 fs-18 fw-700 rounded-3 cursor-pointer`}
                            >
                                {cur.data_module.name}
                            </span>
                            {
                                index == activeIndex
                                &&
                                getSubCursoComponent(true)
                            }
                        </Fragment>
                    ))
                }
            </div>
            <div className="col-6 flex-column gap-3">
                {
                    getSubCursoComponent(false)
                }
            </div>
            <a href="" className="col-12 text-center text-decoration-none mt-4">Fórum do Curso</a>
        </div>
    );
}