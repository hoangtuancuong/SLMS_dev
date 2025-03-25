'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from 'flowbite-react';
import SidebarContent from './Sidebaritems';
import NavItems from './NavItems';
import NavCollapse from './NavCollapse';
import SimpleBar from 'simplebar-react';
import FullLogo from '../../shared/logo/FullLogo';
import { Icon } from '@iconify/react';
import Upgrade from './Upgrade';
import Image from 'next/image';
import {
  isAuthenticated,
  getUserData,
  getRole,
  processGoogleDriveLink,
  getCurrentUserRole,
} from '@/app/utils/utils';
import Link from 'next/link';
import LogoutButton from '@/components/Header/LogoutBtn';

const SidebarLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    role: '',
    avatar_url: '',
  });

  const filteredSidebarItems = SidebarContent.map((section) => ({
    ...section,
    children: section.children.filter(
      (child) => !child.role || child.role.includes(getRole(user))
    ),
  })).filter((section) => section.children.length > 0);

  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const userData = getUserData();
      setUser(userData);

      if (userData.avatar_url) {
        setAvatarSrc(
          processGoogleDriveLink(userData.avatar_url) || '/images/default.png'
        );
      }
    }
  }, []);

  return (
    <>
      <div className="xl:block hidden">
        <div className="flex">
          <Sidebar
            className="fixed menu-sidebar pt-6 bg-white dark:bg-darkgray z-[10] h-screen flex flex-col justify-between"
            aria-label="Sidebar with multi-level dropdown example"
          >
            <div className="mb-7 px-4 brand-logo">
              <FullLogo />
            </div>

            <SimpleBar className="flex-1 h-[calc(100vh_-_180px)]">
              <Sidebar.Items className="px-4">
                <Sidebar.ItemGroup className="sidebar-nav">
                  {filteredSidebarItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <h5 className="text-link font-semibold text-sm caption">
                        <span className="hide-menu">{item.heading}</span>
                      </h5>
                      <Icon
                        icon="solar:menu-dots-bold"
                        className="text-ld block mx-auto mt-6 leading-6 dark:text-opacity-60 hide-icon"
                        height={18}
                      />

                      {item.children?.map((child, index) => (
                        <React.Fragment key={child.id && index}>
                          {child.children ? (
                            <div className="collpase-items">
                              <NavCollapse item={child} />
                            </div>
                          ) : (
                            <NavItems item={child} />
                          )}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </Sidebar.ItemGroup>
              </Sidebar.Items>
            </SimpleBar>

            <div className="mt-auto px-4">
              <Upgrade />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center space-x-3">
                  <Image
                    src={avatarSrc ? processGoogleDriveLink(avatarSrc) : "/images/default.png"}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm font-medium text-dark dark:text-white">
                    {user?.name || 'User'} - {getCurrentUserRole()}
                  </span>
                </Link>
                <LogoutButton />
              </div>
            </div>
          </Sidebar>
        </div>
      </div>
    </>
  );
};

export default SidebarLayout;
