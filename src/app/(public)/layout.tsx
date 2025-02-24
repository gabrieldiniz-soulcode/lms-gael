import Footer from "./login/components/Footer";
import Header from "./login/components/Header";

export default function PublicLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}