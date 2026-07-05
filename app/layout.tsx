// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { getServerSession } from "next-auth";
import { authOptions } from "./lib/AuthOptions";

export const metadata: Metadata = {
  title: "AI Anime Storyboard Generator",
  description: "Turn your ideas into cinematic anime storyboards powered by AI.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text-base">
        <AuthProvider session={session}>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
