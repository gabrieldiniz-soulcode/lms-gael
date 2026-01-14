import { DataProvider } from "@/contexts/DataContext";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Loader from "@/components/Loader/Loader";
import { LoaderProvider } from "@/contexts/LoaderContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Suspense } from "react";

export default function Layout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <LoaderProvider>
      <DataProvider>
        <div className="d-flex flex-column min-h-100 position-relative justify-content-between">
          <header>
            <Suspense>
              <Header />
            </Suspense>
          </header>
          <Sidebar />
          <Loader>
            {children}
          </Loader>
          <footer>
            <Footer />
          </footer>
        </div>
      </DataProvider>
    </LoaderProvider>
  );
}