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
            {/* Cinematic Backdrop - Theme Aware */}
            <div className="fixed inset-0 -z-10 bg-background transition-colors duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--color-brand-orange-alpha),transparent_50%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-grid-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-grid-line)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>
            {children}
          </BlockchainProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



