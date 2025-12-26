import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agentic Social Manager",
  description: "Autonomous AI agent orchestrating your social media presence end-to-end.",
  metadataBase: new URL("https://agentic-08231843.vercel.app")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-slate-950 text-slate-100 antialiased")}>{children}</body>
    </html>
  );
}
