import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";
import { SessionProvider } from "next-auth/react";


export const metadata = {
  title: "PromptFlow",
  description: "Learn, Share & Level Up Your Prompts",
  icons: {
    icon: "/myicon.png",
    shortcut: "/myicon.png",
    apple: "/myicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/myicon.png" sizes="any" />
      </head>
      <body className="flex flex-col min-h-screen">
        <SessionWrapper>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}
