'use client';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '/public/images/logo/logo-color.png';
import Logowhite from '/public/images/logo/logo-white.png';
const FullLogo = () => {
  return (
    <Link href={'/'}>
      <div className="flex items-center gap-1">
        <Image
          src={Logo}
          width={50}
          height={30}
          alt="logo"
          className="block dark:hidden rtl:scale-x-[-1]"
        />
        <span className="text-md font-bold text-black dark:hidden">
          S<span className="text-[#f9c500]"> LM</span>
          <span className="text-[#4b61be]"> S</span>
        </span>
        <Image
          src={Logowhite}
          width={50}
          height={30}
          alt="logo"
          className="hidden dark:block rtl:scale-x-[-1]"
        />
      </div>
    </Link>
  );
};

export default FullLogo;
