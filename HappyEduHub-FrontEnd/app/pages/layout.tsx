'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollToTop from '@/components/ScrollToTop';
import { Inter } from 'next/font/google';
import 'node_modules/react-modal-video/css/modal-video.css';
import '../../styles/index.css';
import '../css/globals.css';
import { Providers } from './providers';
import store from '../libs/store';
import { loginSuccess } from '../libs/features/authSlice';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [showLoader, setShowLoader] = useState(true); // For controlling fade-out effect

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      store.dispatch(
        loginSuccess({
          token,
          user: JSON.parse(user),
        })
      );
    }

    const timer = setTimeout(() => {
      setIsAuthenticating(false);
      setTimeout(() => setShowLoader(false), 200);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html suppressHydrationWarning lang="en">
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        {showLoader && (
          <div
            id="globalLoader"
            className={`fixed inset-0 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-500 ${
              isAuthenticating ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src="/images/loading.gif"
              width={150}
              height={150}
              alt="Loading..."
            />
          </div>
        )}
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
