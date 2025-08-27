
import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "C:\\Users\\Chiranjeevi PK\\Desktop\\SuperMall\\src\\components\\page-components\\Navbar";
import Footer from "C:\\Users\\Chiranjeevi PK\\Desktop\\SuperMall\\src\\components\\page-components\\Footer";
import { AuthProvider } from "C:\\Users\\Chiranjeevi PK\\Desktop\\SuperMall\\src\\contexts\\AuthContext";
import { CartProvider } from "C:\\Users\\Chiranjeevi PK\\Desktop\\SuperMall\\src\\contexts\\CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Super Mall | Largest Local to Global Marketplace",
  description: "Connecting Rural to Global",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
