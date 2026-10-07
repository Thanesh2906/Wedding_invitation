import type { Metadata } from "next";
import "./globals.css";

// Serve the current invitation on every page load, rather than a cached page.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Thaneshvaran & Banu | Wedding Invitation",
  description: "Join Thaneshvaran and Banu as they celebrate their wedding on 15 November 2026 in Johor Bahru.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
