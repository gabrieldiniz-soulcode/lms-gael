import Banner from "./components/Banner";
import Depoimentos from "./components/Depoimentos";
import { Faq } from "./components/Faq";
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
            <section className="container">
                <Depoimentos />
            </section>
            <section>
                <Banner />
            </section>
            <section className="container">
                <Faq />
            </section>
        </main>
    )
}