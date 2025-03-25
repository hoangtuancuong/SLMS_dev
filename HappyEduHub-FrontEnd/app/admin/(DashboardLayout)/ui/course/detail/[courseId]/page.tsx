'use client';
import { useParams } from 'next/navigation';
import CourseDetails from '../CourseDetail';
const CoursePage = () => {
  const { courseId } = useParams();

  return <CourseDetails courseId={courseId} />;
};

export default CoursePage;
