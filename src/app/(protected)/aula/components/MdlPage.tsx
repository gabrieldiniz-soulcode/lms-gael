import { useRef } from "react";
import playImg from "/public/play.png";
import Image from "next/image";

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

interface Props {
    sequence: Sequence;
    paused: boolean;
    setPaused: (newPaused: boolean) => void;
}

export default function MdlPage({ sequence, paused, setPaused }: Props) {

    const videoRef = useRef<HTMLVideoElement>(null);


    function getVideoLink(): string {
        const regex = /<source\s+src="([^"]+)"/g;
        const match = regex.exec(sequence.data_module.content);
        return match ? match[1] : "";
    }

    function isLinkOrText(): string {
        if (sequence.data_module.content.includes("<video") || sequence.data_module.content.includes("<source")) {
            return "link";
        }
        return "texto";
    }

    function play(): void {
        if (videoRef.current) {
            if (paused) {
                videoRef.current.play();
                setPaused(!paused);
                return;
            }
        }
    }

    return (
        isLinkOrText() == "link"
            ?
            <>
                <video
                    src={getVideoLink()}
                    controls={!paused}
                    ref={videoRef}
                    className="w-100 rounded-3 position-relative bg-auxiliary6-project"
                    onClick={play}
                >
                </video>
                {
                    paused
                    &&
                    <div className="position-absolute cursor-pointer" onClick={play}>
                        <Image src={playImg.src} width={150} height={150} alt="play" />
                    </div>
                }
            </>
            :
            <div className="w-100">
                <span className="dangerouslySetInnerHTML" dangerouslySetInnerHTML={{ __html: sequence.data_module.content }}></span>
            </div>
    );
}