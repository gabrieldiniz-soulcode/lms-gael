import "./globals.css";
import "./soulhub.css";

import { Geist, Geist_Mono } from "next/font/google";

import { AuthContextProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trident Creator Games",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="h-100">
      <body className={`${geistSans.variable} h-100 ${geistMono.variable}`}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
