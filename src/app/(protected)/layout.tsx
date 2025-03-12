import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Loader from "@/components/Loader/Loader";
import Sidebar from "@/components/Sidebar/Sidebar";
import { LoaderProvider } from "@/contexts/LoaderContext";

export default function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <LoaderProvider>
            <div className="d-flex flex-column min-h-100 position-relative justify-content-between">
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
            </div>
        </LoaderProvider>
    );
}