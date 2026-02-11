import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "AI Image Generator - Deep Vortex AI | Create Stunning Images from Text",
  description: "Create stunning AI-generated images from text descriptions. Professional quality, multiple aspect ratios, instant results. Part of the Deep Vortex AI creative ecosystem.",
  keywords: "AI image generator, text to image, AI art, image creation, Deep Vortex AI, Imagen, AI tools, generate images from text, AI art generator",
  authors: [{ name: "Deep Vortex AI" }],
  creator: "Deep Vortex AI",
  publisher: "Deep Vortex AI",
  robots: "index, follow",
  metadataBase: new URL("https://images.deepvortexai.art"),
  alternates: {
    canonical: "https://images.deepvortexai.art",
  },
  openGraph: {
    type: "website",
    url: "https://images.deepvortexai.art",
    title: "AI Image Generator - Deep Vortex AI",
    description: "Create stunning AI-generated images from text. Professional quality, multiple aspect ratios, instant results.",
    siteName: "Deep Vortex AI",
    images: [{ url: "/deepgoldremoveetiny.png", width: 512, height: 512, alt: "Deep Vortex AI Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Generator - Deep Vortex AI",
    description: "Create stunning AI-generated images from text. Professional quality, instant results.",
    images: ["/deepgoldremoveetiny.png"],
  },
  icons: {
    icon: "/deepgoldremoveetiny.png",
    apple: "/deepgoldremoveetiny.png",
  },
  other: {
    "theme-color": "#D4AF37",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Deep Vortex AI",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "application-name": "Deep Vortex AI Image Generator",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://replicate.delivery" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Deep Vortex AI Image Generator",
              "description": "Create stunning AI-generated images from text descriptions with professional quality.",
              "url": "https://images.deepvortexai.art",
              "applicationCategory": "DesignApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "AggregateOffer",
                "priceCurrency": "USD",
                "lowPrice": "0",
                "highPrice": "84.99",
                "offerCount": "5"
              },
              "creator": {
                "@type": "Organization",
                "name": "Deep Vortex AI",
                "url": "https://deepvortexai.art"
              },
              "featureList": [
                "Text to Image Generation",
                "Multiple Aspect Ratios",
                "AI-Powered with Imagen",
                "Instant Download",
                "Favorites Gallery"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
