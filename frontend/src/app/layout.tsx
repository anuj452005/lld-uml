import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { BottomStatusBar } from "@/components/BottomStatusBar";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "UML Architect",
  description: "Developer-focused LLD UML Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="h-screen w-screen overflow-hidden flex flex-col bg-bg-canvas text-text-primary">
        <AuthProvider>
          <ToastProvider>
            <TopNav />
            <div className="flex-1 flex overflow-hidden">
              {children}
            </div>
            <BottomStatusBar />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
