import Banner from "./login/components/Banner";
import Depoimentos from "./login/components/Depoimentos";
import Faq from "./login/components/Faq";
import Footer from "./login/components/Footer";
import Header from "./login/components/Header";

export default function PublicLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Header />
            {children}
            <section className="container">
                <Depoimentos />
            </section>
            <section>
                <Banner />
            </section>
            <section className="container">
                <Faq />
            </section>
            <Footer />
        </>
    );
}