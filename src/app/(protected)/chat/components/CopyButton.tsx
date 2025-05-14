import { useState } from "react";
import { Button } from "react-bootstrap";
import { GoCopy, GoCheck } from "react-icons/go";

type CopyButtonProps = {
  code: string;
};

export default function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button title="Copiar código" size="sm" variant="primary" className="copy-btn" onClick={handleCopy}>
      {copied ? (
        <GoCheck color={"#fff"} size={20} strokeWidth={0.5} />
      ) : (
        <GoCopy color={"#fff"} size={20} strokeWidth={0.5} />
      )}
    </Button>
  );
}
