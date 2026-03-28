import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentOps Live — Autonomous Company OS",
  description: "A live operating system for companies run entirely by AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
