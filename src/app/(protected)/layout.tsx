export default function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <>
            <header></header>
            {children}
            <footer></footer>
        </>
    );
}