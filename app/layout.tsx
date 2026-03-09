import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "../styles/theme.css";
import "./globals.css";
import { getSiteConfig } from "@/lib/site-config";
import { SiteConfigProvider } from "@/components/SiteConfigProvider";
import SplashScreen from "@/components/SplashScreen";
import CursorGlow from "@/components/CursorGlow";
import { getTemplateSiteIdentity } from "@/config/template-config";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const site = getTemplateSiteIdentity(config);
  return {
    title: site.siteName,
    description: `${site.siteName} — ${site.tagline}`,
    icons: {
      icon: site.logo,
      apple: site.logo,
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const dynamic = "force-dynamic";

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const full = normalized.length === 3 ? normalized.split("").map((x) => x + x).join("") : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return "59 130 246";
  const num = Number.parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configPromise = getSiteConfig();

  return (
    <RootWithConfig configPromise={configPromise}>{children}</RootWithConfig>
  );
}

async function RootWithConfig({
  children,
  configPromise,
}: {
  children: React.ReactNode;
  configPromise: ReturnType<typeof getSiteConfig>;
}) {
  const config = await configPromise;
  const themeVars: Record<string, string> = {
    "--paper": config.theme.paper,
    "--brand-400": config.theme.brand400,
    "--brand-600": config.theme.brand600,
    "--brand-700": config.theme.brand700,
    "--surface": config.theme.surface,
    "--surface-soft": config.theme.surfaceSoft,
    "--highlight": config.theme.highlight,
    "--glare-blue": config.theme.glareBlue,
    "--glare-gold": config.theme.glareGold,
    "--glare-blur": `${config.theme.glareBlur}px`,
    "--glare-speed": `${config.theme.glareSpeed}s`,
    "--glare-size": `${config.theme.glareSize}px`,
    "--hero-highlight": config.theme.heroHighlight,
    "--footer-button": config.theme.footerButton,
    "--brand-400-rgb": hexToRgb(config.theme.brand400),
    "--brand-600-rgb": hexToRgb(config.theme.brand600),
    "--brand-700-rgb": hexToRgb(config.theme.brand700),
    "--highlight-rgb": hexToRgb(config.theme.highlight),
    "--surface-rgb": hexToRgb(config.theme.surface),
  };

  return (
    <html lang="en">
      <body style={themeVars as CSSProperties}>
        <SiteConfigProvider value={config}>
          <CursorGlow />
          <SplashScreen logoPath={config.logoPath || "/logo.png"} />
          <div className="site-shell">
            <div className="ambient-layer ambient-layer-static" aria-hidden="true" />
            <div className="ambient-layer ambient-layer-reactive" aria-hidden="true" />
            <div className="ambient-layer ambient-layer-grain" aria-hidden="true" />
            {children}
          </div>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
