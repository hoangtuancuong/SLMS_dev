import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'simplebar-react/dist/simplebar.min.css';
import './css/globals.css';
import ClientProvider from './ClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SMLS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClientProvider>{children}</ClientProvider>
    </>
  );
}
