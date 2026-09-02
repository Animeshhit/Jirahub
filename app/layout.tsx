import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = {
  title: "JiraHub — Work, in one place",
  description: "A connected workspace for teams to plan and ship together.",
};
export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f6f5f4",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en" className={cn("bg-background", "font-sans", geist.variable)}>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
