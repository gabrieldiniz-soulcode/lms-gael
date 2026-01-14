import Image, { StaticImageData } from "next/image";
import { useCallback, useContext, useEffect, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import img from "/public/rectangle_ranking.png";
import placeholder from "/public/placeholder.png";

interface UserDetails {
    firstname?: string;
    lastname?: string;
    city?: string;
    imagealt?: string | StaticImageData;
}

interface UserData {
    userid?: number;
    xp_total?: number;
    level?: number;
    user?: UserDetails;
}

export default function Ranking() {
    const [ranking, setRanking] = useState<UserData[]>();
    const { user, setUserLevel } = useContext(AuthContext);

    const fetchRanking = useCallback(async () => {
        if (!user?.token || !user?.database || !user?.id) return;
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/ranking`, {
                headers: {
                    "database": user.database,
                    "Authorization": `Bearer ${user.token}`
                }
            });

            const data = res.data as UserData[];
            setRanking(data);

            // Atualiza o nível do usuário logado
            const currentUser = data.find(item => item.userid === Number(user.id));
            if (currentUser && currentUser.level !== undefined) {
                setUserLevel(currentUser.level);
            }
        } catch (err) {
            console.error("Erro ao buscar o ranking:", err);
        }
    }, [user.database, user.token, user.id, setUserLevel]);

    useEffect(() => {
        if (!user?.token || !user?.database || !user?.id) return;
        fetchRanking();
    }, [fetchRanking, user?.token, user?.database, user?.id]);

    function verificarImg(userData: UserData): string | StaticImageData {
        if (!userData) {
            return placeholder;
        }
        if (userData?.user?.imagealt !== "") {
            return userData?.user?.imagealt || placeholder;
        }
        return placeholder;
    }

    return (
        ranking &&
        <div className="bg-auxiliary1-project rounded-3" style={{ overflow: 'hidden' }}>
            <div className="position-relative">
                <Image src={img.src} width={0} height={0} className="w-100 h-auto" alt="" />
                <div className="position-absolute mt-exxl-4 mt-3 d-flex flex-column justify-content-center align-items-center w-100 top-0">
                    <span className="text-white fs-21 fw-700">Ranking</span>
                    <div className="d-flex mt-2 gap-3 position-relative">
                        <div className="mt-5 rounded-circle d-flex flex-column">
                            <Image src={verificarImg(ranking[1])} width={90} height={90} alt="" className="rounded-circle perfil-ranking-aula2" />
                            <div className="d-flex justify-content-center">
                                <span className="px-2 py-1 rounded-circle colocacao-ranking-aula2 text-white fw-700" style={{ marginTop: -18 }}>2º</span>
                            </div>
                        </div>
                        <div className="mt-2 rounded-circle d-flex flex-column">
                            <Image src={verificarImg(ranking[0])} width={120} height={120} alt="" className="rounded-circle perfil-ranking-aula1" />
                            <div className="d-flex justify-content-center">
                                <span className="px-2 py-1 rounded-circle colocacao-ranking-aula1 text-white fw-700" style={{ marginTop: -18 }}>1º</span>
                            </div>
                        </div>
                        <div className="mt-5 rounded-circle d-flex flex-column">
                            <Image src={verificarImg(ranking[2])} width={90} height={90} alt="" className="rounded-circle perfil-ranking-aula3" />
                            <div className="d-flex justify-content-center">
                                <span className="px-2 py-1 rounded-circle colocacao-ranking-aula3 text-white fw-700" style={{ marginTop: -18 }}>3º</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex flex-column gap-3 mx-4 my-3">
                {ranking.map((item, index) => (
                    <div key={index} className="row rounded-3 justify-content-center lista-ranking-aula-active">
                        <div className="py-2 col-2 d-flex align-items-center justify-content-center">
                            <span className="p-4 rounded-3 ms-3 colocacao">{index + 1}°</span>
                        </div>
                        <div className="d-flex col-7 gap-3 align-items-center perfil p-0">
                            <Image src={verificarImg(item)} width={60} height={60} alt="" className="rounded-circle ms-4" />
                            <div className="d-flex flex-column">
                                <span className="fw-700 fs-13">{item.user?.firstname} {item.user?.lastname}</span>
                                <span className="fs-13">{item.user?.city}</span>
                            </div>
                        </div>
                        <div className="col-3 d-flex align-items-center justify-content-end">
                            <div className="hexagon">
                                <div>
                                    <span>{item.xp_total}</span>
                                    <br />
                                    <span className="fs-13 fw-400">xp</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}