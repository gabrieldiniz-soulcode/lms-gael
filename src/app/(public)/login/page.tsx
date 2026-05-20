import FormLogin from "./components/FormLogin";
import bgLogin from "/public/gael/bg_certificado_camada1.png";

export default function Login() {
    return (
        <section
            style={{
                backgroundImage: `url(${bgLogin.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="container">
                <FormLogin />
            </div>
        </section>
    )
}
