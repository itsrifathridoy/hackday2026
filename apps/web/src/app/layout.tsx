import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { WhisperProvider } from "@/context/WhisperContext";
import { ToastProvider } from "@/context/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <WhisperProvider>{children}</WhisperProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
