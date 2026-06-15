export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="d-flex justify-content-center gap-lg-5 gap-2 flex-wrap w-100 bg-auxiliary2-project px-2 py-4 align-items-center px-md-5">
            <span className="text-white text-center  px-md-0 px-5">©2015-{currentYear} SoulCode. Todos os direitos reservados.</span>
            <a href="https://bootcamp.soulcode.com/politica-de-privacidade" target="_blank" className="text-white text-center text-decoration-none px-md-0 px-5">Política de Privacidade</a>
            <span className="text-white text-center  px-md-0 px-5">Aviso de Cookies</span>
            <a href="https://bootcamp.soulcode.com/politica-de-privacidade" target="_blank" className="text-white text-center text-decoration-none px-md-0 px-5">Termos de Uso</a>
        </footer>
    )
}