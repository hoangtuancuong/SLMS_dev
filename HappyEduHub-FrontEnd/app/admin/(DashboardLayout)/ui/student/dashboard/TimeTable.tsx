'use client';

import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Badge, Typography, Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { callApi } from '@/app/utils/api';
import { Card } from 'flowbite-react';
import { SubjectData } from '@/app/utils/constant';
import Image from 'next/image';

const TimeTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [lessons, setLessons] = useState([]);
  const [thisDayLesson, setThisDayLesson] = useState(null);

  const handleDayClick = (day: any) => {
    const dayLessons = lessons.filter((lesson) =>
      lesson.day.isSame(day, 'day')
    );
    setThisDayLesson(dayLessons.length > 0 ? dayLessons : null);
  };

  const handleChangeMonth = (newMonth: any) => {
    setThisDayLesson(null);
    setCurrentMonth(newMonth);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const startDate = currentMonth.startOf('month');
      const endDate = currentMonth.endOf('month');

      const res = await callApi(`lessons/my-schedule`, 'POST', {
        start_date: dayjs(),
        end_date: endDate,
      });
      const lessonsData = res.map((lesson: any) => {
        return {
          day: dayjs(lesson.take_place_at),
          code: lesson.course.code,
          name: lesson.course.name,
          shift: lesson.shift,
          room: lesson.room,
        };
      });
      setLessons(lessonsData);

      // Set lessons for current day
      const today = dayjs(currentMonth);
      const todayLessons = lessonsData.filter((lesson: any) =>
        lesson.day.isSame(today, 'day')
      );
      setThisDayLesson(todayLessons.length > 0 ? todayLessons : null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex justify-center items-center">
          <Skeleton variant="rectangular" width={320} height={420}>
            <DateCalendar />
          </Skeleton>
        </div>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={currentMonth}
        onChange={(newValue) => handleDayClick(newValue)}
        onMonthChange={(newMonth) => handleChangeMonth(newMonth)}
        slotProps={{
          day: (ownerState) => {
            const isHighlighted = lessons.some((lesson) =>
              lesson.day.isSame(ownerState.day, 'day')
            );

            return {
              onClick: () => handleDayClick(ownerState.day),
              children: (
                <Badge
                  key={ownerState.day.toString()}
                  color="error"
                  variant="dot"
                  invisible={!isHighlighted}
                >
                  {ownerState.day.date()}
                </Badge>
              ),
            };
          },
        }}
      />
      <Card>
        {thisDayLesson === null ? (
          <Typography variant="body1" className="text-center p-4">
            Không có tiết học
          </Typography>
        ) : (
          <div>
            <Typography variant="body2" className="mb-3 p-3">
              Bạn có {thisDayLesson.length} ca học trong ngày{' '}
              {currentMonth.format('DD/MM/YYYY')}
            </Typography>
            <div className="max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {thisDayLesson.map((lesson: any, index: number) => (
                <div key={index} className="mb-4">
                  {SubjectData.map((subject) => {
                    if (lesson.code.substring(0, 2) === subject.code_fragment) {
                      return (
                        <div
                          key={subject.id}
                          className="flex items-center gap-2"
                        >
                          <Image
                            src={subject.image}
                            alt={subject.name}
                            className="w-8 h-8"
                            width={32}
                            height={32}
                          />
                          <div>
                            <div className="font-semibold">{lesson.name}</div>
                            <div className="text-sm text-gray-600">
                              Mã khóa học: {lesson.code}
                            </div>
                            <div className="text-sm text-gray-600">
                              Ca học: {lesson.shift}
                            </div>
                            <div className="text-sm text-gray-600">
                              Phòng học: {lesson.room}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </LocalizationProvider>
  );
};

export default TimeTable;
