'use client';
import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Icon } from '@iconify/react';

const StatsDiv = ({text, score, icon}) => {
  return (
    <>
      <div className="border border-blue-300 bg-white rounded-lg p-6 relative w-full break-words">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-14 h-10 rounded-full flex items-center justify-center  bg-error text-white">
              <Icon icon={icon} height={24} />
            </span>
            <h5 className="text-base opacity-70">{text}: <span className='text-blue-800 font-bold'>{score.toFixed(2)}</span></h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatsDiv;
