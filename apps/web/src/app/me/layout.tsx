import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | HackDay 2026",
  description: "View your profile information and account details",
};

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
