import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/general/Navbar";
import { AuthProvider } from "@/components/general/AuthProvider";

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

export default function RootLayout({
  children = <p className="text-center">Default content goes here.</p>,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
