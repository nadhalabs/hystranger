import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "hyStranger — Meet someone new",
  description: "A minimal, safe place for spontaneous video conversations with strangers.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('hystranger-theme');
                if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen transition-colors duration-200">{children}</body>
    </html>
  );
}
