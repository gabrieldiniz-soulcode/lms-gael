import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <header>
                <Header />
            </header>
            <Sidebar />
            {children}
            <footer></footer>
        </>
    );
}