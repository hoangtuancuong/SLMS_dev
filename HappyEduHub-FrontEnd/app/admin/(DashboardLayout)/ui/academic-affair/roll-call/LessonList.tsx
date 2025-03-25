'use client';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import Header from '@/app/admin/components/dashboard/Header';
import { callApi } from '@/app/utils/api';
import {
  formattedDate,
  getShift,
  processGoogleDriveLink,
} from '@/app/utils/utils';
import { notify } from '@/components/Alert/Alert';
import { useCallback, useEffect, useState } from 'react';
import Lessons from './Lessons';
const LessonList = () => {
  const [isLoading, setLoading] = useState(false);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    console.log(getShift());

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await callApi('lessons/today', 'GET');
        setLessons(response);
        console.log(response);
      } catch (error) {
        notify('Có lỗi xảy ra', 'error');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, []);

  return (
    <>
      <BlogSpinner isLoading={isLoading}></BlogSpinner>

      <div className="rounded-lg dark:shadow-dark-md shadow-md bg-white dark:bg-darkgray p-6 relative w-full break-words">
        <Header
          icon="solar:user-bold"
          title="Danh sách tiết học"
          showButton={false}
        />

        <Lessons lessons={lessons} />
      </div>
    </>
  );
};

export default LessonList;
