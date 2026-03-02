import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import playImg from "/public/play.png";

interface Sequence {
    cmid: number;
    module: string;
    complete: boolean;
    data_module: {
        name: string;
        course: number;
        content: string;
        externalurl: string;
        id: number;
    };
}

interface Props {
    sequence: Sequence;
    paused: boolean;
    setPaused: (newPaused: boolean) => void;
    setbuttons: () => React.ReactElement;
}

export default function MdlPage({ sequence, paused, setPaused }: Props) {

    const videoRef = useRef<HTMLVideoElement>(null);

    const [progress, setProgress] = useState<number>(0);
    const [completed, setCompleted] = useState<boolean>(false);
    const [isSeeking, setIsSeeking] = useState<boolean>(false);

    const watchedSeconds = useRef<number>(0);
    const lastTime = useRef<number>(0);

    const { user } = useContext(AuthContext);

    function getVideoLink(): string {
        const regex = /<source\s+src="([^"]+)"/;
        const match = regex.exec(sequence.data_module.content);
        return match ? match[1] : "";
    }

    function getContentWithoutVideo(): string {
        return sequence.data_module.content
            .replace(/<video[\s\S]*?<\/video>/gi, "")
            .trim();
    }

    function hasVideo(): boolean {
        return (
            sequence.data_module.content.includes("<video") ||
            sequence.data_module.content.includes("<source")
        );
    }

    function isLinkOrText(): string {
        if (
            sequence.data_module.content.includes("<video") ||
            sequence.data_module.content.includes("<source")
        ) {
            return "link";
        }
        return "texto";
    }

    function play(): void {
        const video = videoRef.current;
        if (!video) return;

        if (paused) {
            video.play();
            setPaused(false);
        }
    }

    function handleTimeUpdate() {
        const video = videoRef.current;
        if (!video || isSeeking || !isFinite(video.duration) || video.duration <= 0)
            return;

        const current = video.currentTime;
        const delta = Math.max(0, current - lastTime.current);
        lastTime.current = current;

        watchedSeconds.current += delta;

        const percentWatched = (watchedSeconds.current / video.duration) * 100;
        setProgress(percentWatched);

        if (percentWatched >= 80 && !completed) {
            completeModule();
            setCompleted(true);
        }
    }

    function handleSeeking() {
        setIsSeeking(true);
    }

    function handleSeeked() {
        setIsSeeking(false);
        const video = videoRef.current;
        if (video) lastTime.current = video.currentTime;
    }

    function completeModule() {
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/module/completion`,
                {
                    cmid: sequence.cmid,
                    course: sequence.data_module.course,
                },
                {
                    headers: {
                        database: user.database,
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((res) => {
                console.log("Módulo concluído via vídeo!", res);
            })
            .catch((err) => {
                console.error("Erro ao concluir módulo:", err);
            });
    }

    const cappedProgress = progress >= 80 ? 80 : progress;
    const displayedProgress = (cappedProgress / 80) * 100;

    useEffect(() => {
        setProgress(0);
        setCompleted(false);
        setIsSeeking(false);

        watchedSeconds.current = 0;
        lastTime.current = 0;

        const video = videoRef.current;
        if (video) {
            video.pause();
            video.currentTime = 0;
            video.load();
        }
    }, [sequence]);

    return isLinkOrText() === "link" ? (
        <div className="position-relative w-100">
            {hasVideo() && (
                <>
                    <div className="position-relative">
                        <video
                            src={getVideoLink()}
                            controls={!paused}
                            ref={videoRef}
                            className="w-100 rounded-3 position-relative bg-auxiliary6-project"
                            onClick={play}
                            onTimeUpdate={handleTimeUpdate}
                            onSeeking={handleSeeking}
                            onSeeked={handleSeeked}
                        ></video>

                        {paused && (
                            <div
                                className="position-absolute top-50 start-50 translate-middle cursor-pointer"
                                onClick={play}
                            >
                                <Image src={playImg.src} width={150} height={150} alt="play" />
                            </div>
                        )}
                    </div>

                    <div className="d-flex align-items-center mt-3 gap-3">
                        <div className="progress flex-grow-1" style={{ height: '10px' }}>
                            <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${displayedProgress}%` }}
                                aria-valuenow={displayedProgress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                        {completed && <FaCheckCircle size={24} color="green" />}
                    </div>
                </>
            )}

            <span
                className="dangerouslySetInnerHTML"
                dangerouslySetInnerHTML={{ __html: getContentWithoutVideo() }}
            ></span>
        </div>) :
        <div className="w-100" >
            <span
                className="dangerouslySetInnerHTML"
                dangerouslySetInnerHTML={{ __html: sequence.data_module.content }}
            ></span>
        </div >

}