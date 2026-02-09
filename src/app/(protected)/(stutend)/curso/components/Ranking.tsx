import { AuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import { ProgressBar } from "react-bootstrap";
import trofeu from "/public/trofeu.png";
import { useContext } from "react";

export default function Ranking() {
    const { userLevel } = useContext(AuthContext);

    return (
        <div className="d-flex bg-auxiliary2-project rounded-3 mb-4 px-3" style={{ height: 112 }}>
            <div className="w-100 d-flex flex-column justify-content-center gap-2 pe-3">
                <span className="text-white fw-700">Lv. {userLevel}</span>
                <div className="w-100">
                    <ProgressBar min={1} max={20} now={Number(userLevel)} color="#000" variant="auxiliary7-project" />

                </div>
            </div>
            <div className="d-flex py-2 px-3 my-3 rounded-3 bg-auxiliary2-project">
                <Image src={trofeu.src} width={60} height={trofeu.height} alt="troféu" className="h-auto" />
            </div>
        </div>
    )
}