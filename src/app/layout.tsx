import { Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
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
      className={`${figtree.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground transition-colors duration-500 selection:bg-brand-orange/10 overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
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



