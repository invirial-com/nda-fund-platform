import "../globals.css";
import SessionProvider from "../provider/SessionProvider";

export const metadata = {
  title: "Auth - NdaFundPlatform",
  description: "Sign in to your NdaFundPlatform account",
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SessionProvider>{children}</SessionProvider>;
}
