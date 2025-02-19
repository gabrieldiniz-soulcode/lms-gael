import FormLogin from "./components/FormLogin";
import Header from "./components/Header";

export default function Login() {


    return (
        <main>
            <Header />
            <section className="bg-black">
                <div className="container">
                    <FormLogin />
                </div>
            </section>
        </main>
    )
}