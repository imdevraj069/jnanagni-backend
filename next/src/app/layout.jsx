import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/components/AuthInitializer"; // Import this

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata = { title: "Jnanagni 2025", description: "The Annual Tech Fest" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${orbitron.variable} bg-jnanagni-dark text-white overflow-x-hidden`}>
        <AuthInitializer /> {/* Hydrate Zustand from Server Cookies */}
        {children}
      </body>
    </html>
  );
}