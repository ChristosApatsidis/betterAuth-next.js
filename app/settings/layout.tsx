// app/settings/layout.tsx
import type { Metadata } from "next";
import SettingsMenu from "@/components/SettingsMenu";

export const metadata: Metadata = {
  title: "Auth App - Settings",
  description: "Settings section of the Auth App",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="flex flex-col md:flex-row gap-2 md:items-start">
        {/* Menu (left) */}
        <SettingsMenu />
        {/* Main content (right) */}
        {children}
      </div>
    </div>
  );
}
