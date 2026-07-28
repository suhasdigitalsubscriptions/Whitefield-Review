import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL("https://reviews.epitomekia.example"),
  title: {
    default: siteConfig.defaultTitle,
    template: "%s",
  },
  description: siteConfig.defaultDescription,
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    type: "website",
    siteName: siteConfig.brandName,
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    // This is a private, per-customer QR-code flow, not a page meant to rank.
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--color-mist)]">
        {children}
      </body>
    </html>
  );
}
