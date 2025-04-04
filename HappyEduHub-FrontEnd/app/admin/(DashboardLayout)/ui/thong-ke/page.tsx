import React from 'react';
import Link from 'next/link';
import BlogCards from '@/app/admin/dashboard/BlogCards';
import EarningReports from '@/app/admin/dashboard/EarningReports';
import SalesProfit from '@/app/admin/dashboard/SalesProfit';
import TotalFollowers from '@/app/admin/dashboard/TotalFollowers';
import TotalIncome from '@/app/admin/dashboard/TotalIncome';
import PopularProducts from '../table/page';
import CourseList from '../course/CourseList';

const page = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-30">
        <div className="lg:col-span-8 col-span-12">
          <SalesProfit />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <div className="grid grid-cols-12 ">
            <div className="col-span-12 mb-30">
              <TotalFollowers />
            </div>
            <div className="col-span-12">
              <TotalIncome />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <CourseList />
        </div>
        <div className="col-span-12 text-center">
          <p className="text-base">
            Design and Developed by{' '}
            <Link
              href="https://wrappixel.com"
              target="_blank"
              className="pl-1 text-primary underline decoration-primary"
            >
              wrappixel.com
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
