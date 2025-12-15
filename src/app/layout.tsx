import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#14b8a6",
};

export const metadata: Metadata = {
  title: "Limpiezas Marbella | Calendario Airbnb",
  description:
    "Calendario de limpiezas para Ana. Gestiona las limpiezas de la propiedad Airbnb en Marbella con alertas de reservas de última hora.",
  keywords: [
    "limpieza",
    "Airbnb",
    "Marbella",
    "calendario",
    "housekeeping",
    "gestión",
  ],
  authors: [{ name: "Marbella Property" }],
  creator: "Marbella Property",
  publisher: "Marbella Property",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://airbnbmarbella.vercel.app",
    siteName: "Limpiezas Marbella",
    title: "Limpiezas Marbella | Calendario Airbnb",
    description:
      "Calendario de limpiezas para la propiedad Airbnb en Marbella. Próximas limpiezas, alertas de huecos y historial.",
    images: [
      {
        url: "https://airbnbmarbella.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Limpiezas Marbella - Calendario de limpiezas Airbnb",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Limpiezas Marbella | Calendario Airbnb",
    description:
      "Calendario de limpiezas para la propiedad Airbnb en Marbella.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Limpiezas",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
