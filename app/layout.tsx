import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "IGNOU Pilot | Unofficial Utility Tool",
  description: "A quick utility tools to get the official urls to IGNOU assignments, question papers and have a personalised date sheet sorter as well"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
