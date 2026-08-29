import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nadha Relay — Meet someone new",
  description: "A simple, safe place for spontaneous video and text conversations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
