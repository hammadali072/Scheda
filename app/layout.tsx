import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { MuiProvider } from "@/components/ui/mui-provider";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scheda",
  description: "Book appointments with the right person, at the right time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <ThemeProvider>
          <MuiProvider>{children}</MuiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}