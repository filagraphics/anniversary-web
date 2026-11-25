import type { Metadata, Viewport } from "next";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/playfair-display/latin-400-italic.css";
import "@fontsource/playfair-display/latin-500.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/caveat/latin-500.css";
import "@fontsource/noto-serif-ethiopic/ethiopic-400.css";
import "@fontsource/noto-serif-ethiopic/ethiopic-500.css";
import "@fontsource/noto-sans-ethiopic/ethiopic-400.css";
import "./globals.css";
import VisitPing from "@/components/VisitPing";
import { site } from "@/data/messages";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  // This is a private memory book: keep it out of search engines.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#1F1B1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="bg-night text-ink antialiased">
        <VisitPing />
        {children}
      </body>
    </html>
  );
}
