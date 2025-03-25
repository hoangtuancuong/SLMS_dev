/* eslint-disable @next/next/no-img-element */
'use client';

import { APIS } from '@/app/utils/api';
import { Course } from '@/app/utils/api_model';
import Breadcrumb from '@/components/Common/Breadcrumb';
import GlobalLoader from '@/components/GlobalLoader';
import { Pagination } from 'flowbite-react';
import { useEffect, useState } from 'react';
import CourseModal from './CourseModal';
import { SingleCourse } from '@/components/Course/SingleCourse';

export default function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await APIS.getCourses({
          limit: 9,
          offset: (currentIndex - 1) * 9,
        });
        setCourses(response.data);
        setTotalPages(Math.floor(response.meta.total / 8) + 1);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching courses:', error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [currentIndex]);

  return (
    <div className="flex flex-col">
      <GlobalLoader isLoading={isLoading} />

      <Breadcrumb
        pageName="Danh sách khóa học"
        description="Các khóa học được tạo bởi các giáo viên có kinh nghiệm và được đánh giá cao bởi học sinh. Đây là nơi bạn có thể tìm kiếm và đăng ký khóa học phù hợp với bạn."
      />
      <div className="mt-6 grid gap-8 grid-cols-1 mx-8 sm:mx-12 md:grid-cols-2 md:mx-24 lg:grid-cols-3 lg:mx-48">
        {courses.map((course) => (
          <SingleCourse key={course.id} course={course} onClick={() => {
            setSelectedCourse(course);
            setShowModal(true);
          }} />
        ))}
      </div>
      <div className="h-8 mx-auto my-6">
        <Pagination
          currentPage={currentIndex}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentIndex(page)}
          previousLabel="Trang trước"
          nextLabel="Trang tiếp"
        />
      </div>
      <CourseModal course={selectedCourse} show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
