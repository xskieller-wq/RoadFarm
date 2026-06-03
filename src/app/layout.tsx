import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider, ReservationProvider } from "@/context/AppContext";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainContent from "@/components/layout/MainContent";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RouteFarm — Discover local growers & makers near you",
  description:
    "Meet local growers, gardeners, flower makers and producers. Explore gardens, watch video tours, read reviews, and reserve for pickup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <MarketplaceProvider>
            <ReservationProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <MainContent>{children}</MainContent>
                <Footer />
              </div>
            </ReservationProvider>
          </MarketplaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
