import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Loader from "@/components/Loader/Loader";
import Sidebar from "@/components/Sidebar/Sidebar";
import { LoaderProvider } from "@/contexts/LoaderContext";

export default function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <LoaderProvider>
                <header>
                    <Header />
                </header>
                <Sidebar />
                <Loader>
                    {children}
                </Loader>
                <footer>
                    <Footer />
                </footer>
            </LoaderProvider>
        </>
    );
}