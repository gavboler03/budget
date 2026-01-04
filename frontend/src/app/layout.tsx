import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "Budget App",
  description: "My budget app!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}
