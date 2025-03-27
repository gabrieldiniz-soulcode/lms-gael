import { Button } from "react-bootstrap";

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
}

export default function MdlCustomcert({ }: Props) {

    return (
        <div className="w-100">
            <Button className="px-3">Baixar Certificado</Button>
        </div>
    );
}