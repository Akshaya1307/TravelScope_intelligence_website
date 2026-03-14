import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HelpChatBot from "@/components/HelpChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TravelScope Intelligence",
  description: "Premium Tourism Analytics Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-background-dark
          text-white
          min-h-screen
          antialiased
        `}
      >
        {children}

        {/* Global Floating Help Assistant */}
        <HelpChatBot />
      </body>
    </html>
  );
}