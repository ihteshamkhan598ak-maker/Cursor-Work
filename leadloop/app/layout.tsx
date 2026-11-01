import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadLoop",
  description: "A simple lead tracker that keeps every follow-up on schedule.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
