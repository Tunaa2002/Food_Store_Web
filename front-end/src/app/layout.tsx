import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/layouts/Header/header";
import { UserProvider } from "@/common/contexts/userContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Food Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Header/>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
