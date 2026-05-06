import type { Metadata } from "next";
import QueryProvider from "@/lib/providers/QueryProvider";
import ToastProvider from "@/lib/providers/ToastProvider";
import ModalProvider from "@/lib/providers/ModalProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShaadiBook — Wedding Vendor Booking Management",
  description:
    "A premium SaaS platform for Pakistan's wedding vendors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-body)' }}>
        <QueryProvider>
          {children}
          <ModalProvider />
          <ToastProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
