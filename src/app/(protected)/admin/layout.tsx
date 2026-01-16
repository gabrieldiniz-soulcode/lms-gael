import Footer from "@/components/Footer/Footer";
import HeaderAdmin from "@/components/Header/HeaderAdmin";
import Loader from "@/components/Loader/Loader";
import SidebarAdmin from "@/components/Sidebar/SidebarAdmin";

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <div className="d-flex flex-column min-h-100 position-relative justify-content-between">
      <header>
        <HeaderAdmin />
      </header >
      <SidebarAdmin />
      <Loader>
        {children}
      </Loader>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}