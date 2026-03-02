import FormLogin from "../components/FormLogin";

export default function Login() {

    return (
        <section className="bg-black my-3">
            <div className="container">
                <FormLogin forgotPassword={true} />
            </div>
        </section>
    )
}