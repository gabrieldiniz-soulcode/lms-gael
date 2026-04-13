import "./globals.css";
import "./soulhub.css";

import { Geist, Geist_Mono } from "next/font/google";

import { AuthContextProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import Script from "next/script";
import { TrackingProvider } from "@/contexts/TrackingContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Corre Play",
  description: ""
};

export default function RootLayout({
  children }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="pt-br" className="h-100">
      <Script id="zendesk-settings" strategy="afterInteractive">
        {`
            window.zESettings = {
              webWidget: {
                launcher: {
                  chatLabel: { '*': 'Fale conosco' }
                }
              }
            };
          `}
      </Script>
      <Script defer id="ze-snippet" strategy="afterInteractive"
        src="https://static.zdassets.com/ekr/snippet.js?key=4024e11b-a64c-4483-bde7-28e3ac0a7de0"> </Script>
      <body className={`${geistSans.variable} h-100 ${geistMono.variable}`}>
        <AuthContextProvider>
          <TrackingProvider>
            {children}
          </TrackingProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
