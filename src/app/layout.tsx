import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dogifier",
  description: "Add a dog to any photo using AI",
  icons: { icon: "https://i.imgur.com/Gv8rmae.png" },
  openGraph: {
    title: "Dogifier",
    description: "Add a dog to any photo using AI",
    images: ["https://i.imgur.com/Gv8rmae.png"],
  },
  themeColor: "#F54242",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
