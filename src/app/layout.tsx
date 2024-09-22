import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TheNavbar from "@/components/TheNavbar";
import TheContainer from "@/components/TheContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gray-100`}>
        <TheNavbar />
        <TheContainer>{children}</TheContainer>
      </body>
    </html>
  );
}
