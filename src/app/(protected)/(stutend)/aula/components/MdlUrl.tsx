import { FaRegFilePdf } from "react-icons/fa";

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
    setbuttons: () => React.ReactElement;

}

export default function MdlUrl({ sequence, setbuttons }: Props) {

    return (
        <div>
            {setbuttons()}
            < div className="d-flex gap-2 align-items-center w-100" >
                <a href={sequence.data_module.externalurl} target="_blank">Link Externo</a>
                <FaRegFilePdf />
            </ div>
        </div>
    );
}