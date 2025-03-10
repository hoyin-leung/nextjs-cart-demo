import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_HK } from "next/font/google";
import Link from "next/link";
import CartContextProvider from "@/context/CartContext";
import { zhTW } from "@clerk/localizations";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import SignInDetector from "@/components/SignInDetector";
import { currentUser } from "@clerk/nextjs/server";

const notoSansHK = Noto_Sans_HK({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-hk',
});

export const metadata: Metadata = {
  title: "NextJS Cart Demo",
  description: "Taught by Ho Yin Leung",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const user = await currentUser()
  
  return (
    <ClerkProvider localization={zhTW}>
      <html lang="zh">
        <body
          className={`${notoSansHK.className} antialiased bg-slate-50`}
        >
          <CartContextProvider>
            <nav className="py-5 px-7 container bg-slate-100 flex justify-between">
              <Link href="/" className="text-xl font-bold">產品列表</Link>
              <Link href="/checkout" className="text-xl font-bold">💲結帳</Link>
              <SignedOut>
                <Link href={`/sign-in`} className="text-xl font-bold">登入</Link>
              </SignedOut>
              <SignedIn>
              {
                  (user?.emailAddresses[0].emailAddress === "hello@leunghoyin.hk") && 
                  (<Link href={`order-history`} className="text-xl font-bold">購買記錄</Link>)
                }
                <UserButton />
              </SignedIn>
            </nav>
            <main className="container bg-yellow-50">
              {children}
            </main>
            <SignInDetector />
          </CartContextProvider>
          <footer className="container text-center text-base bg-yellow-50">
          <Link target="_blank" href={`https://github.com/hoyinleung/nextjs-cart-demo`}>NextJS Cart Demo</Link> By <Link target="_blank" href={`https://www.leunghoyin.hk`}>梁浩賢</Link>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
