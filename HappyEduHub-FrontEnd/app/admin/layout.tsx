import customTheme from '@/utils/theme/custom-theme';
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import 'simplebar-react/dist/simplebar.min.css';
import '../css/globals.css';
import { loginSuccess } from '../libs/features/authSlice';
import store from '../libs/store';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SLMS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== 'undefined') {
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
  }

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/svg+xml" />
        <ThemeModeScript />
      </head>
      <body className={`${inter.className}`}>
        <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>
      </body>
    </html>
  );
}
