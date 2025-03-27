import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useSearchParams } from "next/navigation";

interface Nota {
    content: string;
}

interface ApiResponse {
    data: Nota;
}

export default function Notas() {

    const [data, setData] = useState<string>("");
    const [prevData, setPrevData] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const { user } = useContext(AuthContext);

    const searchParams = useSearchParams()
    const id = searchParams.get('id');

    useEffect(() => {

        function getNotes() {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/notes`, {
                headers: {
                    "Authorization": `Bearer ${user?.token}`,
                    "cmid": id
                }
            }).
                then((res: ApiResponse) => {
                    setPrevData(res.data.content);
                    setData(res.data.content);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (user.database && user.id) {
            setLoading(true);
            setData("");
            getNotes();
        }

    }, [user, id]);

    function postNotes() {
        if (!user.database || !user.id) {
            return;
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notes`, {
            userid: user.id,
            cmid: id,
            content: data
        }, {
            headers: {
                "database": user.database
            }
        })
            .then(() => {
                setPrevData(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }

    return (
        <div className="row notas">
            <div className="col-xl-8 col-12 position-relative">
                <span className="fw-700">Anotações</span>
                <div className="position-relative mt-2">
                    <textarea rows={10} className="w-100 rounded-3 bg-auxiliary6-project p-3 border-0" value={data} onChange={(e) => setData(e.target.value)} />
                    {
                        loading
                        &&
                        <div className="loading-ellipsis position-absolute fs-14 fw-700" style={{ top: 16, left: 16 }}>Carregando</div>
                    }
                </div>
                <div className="d-flex justify-content-end mt-2">
                    <Button disabled={prevData == data} onClick={postNotes} className="px-4 rounded-4">Salvar</Button>
                </div>
            </div>
        </div>
    );
}