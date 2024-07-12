import type { Metadata } from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Header from "@/layouts/Header/header";
import { UserProvider } from "@/common/contexts/userContext";
import { CartProvider } from "@/common/contexts/cartContext";
import Footer from "@/layouts/Footer/footer";

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
          <CartProvider >
            <Header/>
            {children}
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
