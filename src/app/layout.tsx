import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Libre_Baskerville,
  Michroma,
  Chakra_Petch,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});
const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Om Upadhyay — Portfolio",
  description: "Projects, experience, and writing by Om Upadhyay.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} ${michroma.variable} ${chakraPetch.variable} ${jetbrainsMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
