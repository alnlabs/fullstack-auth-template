import type { Metadata } from "next";
import { Aleo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "react-hot-toast";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import Providers from "@/components/providers/Providers";

const aleo = Aleo({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyMentor - Interview Platform",
  description:
    "A comprehensive interview platform with role-based access control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={aleo.className}>
        <Providers>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 3000,
                  style: {
                    background: "#10b981",
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: "#ef4444",
                  },
                },
              }}
            />
            <PerformanceMonitor />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
