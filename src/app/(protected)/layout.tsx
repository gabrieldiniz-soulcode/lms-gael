import Sidebar from "@/components/Sidebar/Sidebar";

export default function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <header style={{height: 80}} className="bg-auxiliary1-project position-fixed w-100"></header>
            <Sidebar />
            {children}
            <footer></footer>
        </>
    );
}