import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "self-driving jazz",
  description: "the world's first future trillion dollar creative brand",
  icons: {
    icon: "/shrump.jpg",
    shortcut: "/shrump.jpg",
    apple: "/shrump.jpg",
  },
  openGraph: {
    title: "self-driving jazz",
    description: "the world's first future trillion dollar creative brand",
    url: "https://selfdrivingjazz.com",
    siteName: "self-driving jazz",
    type: "website",
    images: [
      {
        url: "/shrump.jpg",
        width: 1200,
        height: 630,
        alt: "self-driving jazz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "self-driving jazz",
    description: "the world's first future trillion dollar creative brand",
    images: ["/shrump.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
