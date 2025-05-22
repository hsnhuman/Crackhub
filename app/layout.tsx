import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/general/Navbar";
import { SessionProvider } from "next-auth/react";
import { auth } from "./auth/auth";
import { prisma } from "./utils/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crackhub",
  description: "A gamers only friend",
};

export default async function RootLayout({
  children = <p className="text-center">Default content goes here.</p>,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex min-h-screen">
            <div className="w-[19%]">
              <Navbar />
            </div>
            <div className="w-[81%]">{children}</div>
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
