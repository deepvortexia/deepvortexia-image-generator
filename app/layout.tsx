import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Image Generator - Deep Vortex AI",
  description: "Create stunning images from text with AI using Replicate Imagen-4-Fast",
  keywords: "AI image generator, text to image, Replicate, Imagen, Deep Vortex AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
