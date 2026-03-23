import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cancer Registry",
  description: "Hospital Cancer Registry Information System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}