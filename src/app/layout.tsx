import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hyStranger — Meet someone new",
  description: "A minimal, safe place for spontaneous video conversations with strangers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
