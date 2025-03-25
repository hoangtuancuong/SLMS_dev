'use client';

import { Carousel } from 'flowbite-react';
import TeacherProfileCard from './TeacherProfileCard';
export function ListStudent() {
  return (
    <section className="bg-gray-light relative z-10 py-16 md:py-20 lg:py-28">
      <h1 className="text-5xl font-bold text-[#4c6cf4]  text-center">
        ĐỘI NGŨ GIÁO VIÊN <br /> TRUNG TÂM
      </h1>
      <div className="w-full shadow-none bg-gray-light mx-auto h-[400px] sm:h-[500px] xl:h-[600px] 2xl:h-[700px] flex items-center">
        <Carousel className="w-full items-center ">
          <TeacherProfileCard />
          <TeacherProfileCard />
          <TeacherProfileCard />
        </Carousel>
      </div>
    </section>
  );
}
