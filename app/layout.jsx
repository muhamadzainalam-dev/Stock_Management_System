import { Toaster } from "@/components/ui/toaster";
import Header from "../components/custom/header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <hr className="my-8" />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
