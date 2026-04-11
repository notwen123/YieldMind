import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

import { BlockchainProvider } from "@/components/BlockchainProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SmoothScroll } from "@/components/Providers/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground transition-colors duration-500 selection:bg-brand-orange/10 overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <BlockchainProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </BlockchainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



