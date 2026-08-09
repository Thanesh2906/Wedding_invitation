import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thaneshvaran & Banu | Wedding Invitation",
  description: "Join Thaneshvaran and Banu as they celebrate their wedding on 15 November 2026 in Johor Bahru.",
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
