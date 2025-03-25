'use client';

import { callApi } from '@/app/utils/api';
import SectionTitle from '../Common/SectionTitle';
import { useEffect, useState } from 'react';
import { SingleCourse } from './SingleCourse';

const NewestCourse = () => {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await callApi('courses?limit=3&sort[created_at]=DESC');
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section
      id="blog"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <SectionTitle
          title="KHÓA HỌC MỚI NHẤT"
          paragraph="Những khóa học với phương pháp dạy học hiệu quả, luôn được cập nhật dựa trên nhu cầu của học viên cũng như chương trình mới nhất của Bộ Giáo dục và Đào tạo."
          center
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3 -mt-4">
          {courses.map((course) => (
            <SingleCourse key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewestCourse;
