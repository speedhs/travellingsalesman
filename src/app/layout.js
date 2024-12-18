import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TravellingSalesman",
  description: "Easiest way to get travel itineraries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="src/app/favicon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
