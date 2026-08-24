import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "Afinaciones de Autor | Servicio Especializado a Domicilio",
  description: "Servicio de afinación automotriz de precisión en tu domicilio. Cotización por VIN y reporte técnico certificado.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Afinaciones",
  },
};

export const viewport: Viewport = {
  themeColor: "#001E50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light" suppressHydrationWarning>
      <body className="antialiased bg-[#F8FAFC] text-slate-900 min-h-screen" suppressHydrationWarning>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
