import type { Metadata } from "next";
import "../styles/theme.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Silver Brook Public School",
  description:
    "The Silver Brook Public School — learning with purpose, rooted in community and excellence.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="splash-screen" aria-hidden="true">
          <img src="/logo.png" alt="" />
        </div>
        <div className="site-shell">{children}</div>
      </body>
    </html>
  );
}
