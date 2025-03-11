import { RefObject, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useOnClickOutside } from "usehooks-ts";

export default function Bootcamps() {

    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref as RefObject<HTMLElement>, () => {
        setOpen(false);
    });

    return (
        <div className="row justify-content-center py-2">
            <div className="col-xxl-6" ref={ref} onClick={(e) => {
                setOpen(!open);
                e.stopPropagation();
            }}>
                {
                    !open
                        ?
                        <Button className="w-100 fw-700 fs-21 rounded-3">Próximos Bootcamp’s</Button>
                        :
                        <div className="rounded-3 w-100 bg-white" onClick={(e) => e.stopPropagation()}>
                            <div className="p-3">
                                <div className="d-flex justify-content-between">
                                    <span className="fs-21">Inteligência Artificial LLM</span>
                                    <a href="" className="btn btn-success z-2">Vagas Abertas</a>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-between">
                                    <span className="fs-21">Análise de Dados e Plataformas Low-Code </span>
                                    <a href="" className="btn btn-success z-2">Vagas Abertas</a>
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}