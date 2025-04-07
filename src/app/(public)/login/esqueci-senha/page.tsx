import Banner from "../components/Banner";
import Depoimentos from "../components/Depoimentos";
import Faq from "../components/Faq";
import FormLogin from "../components/FormLogin";

export default function Login() {

    return (
        <main>
            <section className="bg-black">
                <div className="container">
                    <FormLogin forgotPassword={true}/>
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