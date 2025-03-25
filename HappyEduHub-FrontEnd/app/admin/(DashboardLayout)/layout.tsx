'use client';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './layout/vertical/sidebar/Sidebar';
import Header from './layout/vertical/header/Header';
import store from '@/app/libs/store';
import { loginSuccess } from '@/app/libs/features/authSlice';
import Image from 'next/image';
import { RoleType } from '@/app/utils/constant';
import { getCurrentUserRole, getRole } from '@/app/utils/utils';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isRedirecting) return;

    setIsAuthenticating(true);
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      setIsRedirecting(true);
      router.replace('/pages/signin');
      return;
    }

    const parsedUser = JSON.parse(user);
    const role = getCurrentUserRole();

    if (role === RoleType.NULL) {
      setIsRedirecting(true);
      router.replace('/pages/signin');
      return;
    }

    store.dispatch(loginSuccess({ token, user: parsedUser }));

    if (pathname === '/admin') {
      setIsRedirecting(true);
      switch (role) {
        case RoleType.STUDENT:
          router.replace('/admin/ui/student/dashboard');
          break;
        case RoleType.TEACHER:
        case RoleType.ACADEMIC_AFFAIR:
          router.replace('/admin/ui/teacher/dashboard');
          break;
        case RoleType.ADMIN:
          router.replace('/admin/ui/course');
          break
        case RoleType.KETOAN:
          router.replace('/admin/ui/course');
          break;
        case RoleType.TROGIANG:
          router.replace('/admin/ui/course');
          break; 
        default:
          router.replace('/pages/signin');
      }
    }

    setIsAuthenticating(false);
  }, [router, isRedirecting]);

  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      <div className="page-wrapper flex w-full">
        <Sidebar />
        <div className="body-wrapper w-full bg-lightgray dark:bg-dark">
          <Header />
          <div className={`container mx-auto py-30`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
