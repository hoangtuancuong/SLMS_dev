'use client';
import { callApi } from '@/app/utils/api';
import { SubjectData } from '@/app/utils/constant';
import { Typography } from '@mui/material';
import { Badge, Spinner } from 'flowbite-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await callApi('assignment/my-assignment', 'GET');
      // Cần assignment_type(EXCERCISE, TEST), course.code, course.name, name
      console.log(res);
      setAssignments(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Typography variant="body1" className="text-center p-4">
        Không có bài tập
      </Typography>
    );
  }

  return (
    <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      {assignments.map((assignment: any) => (
        <div key={assignment.id} className="mb-4">
          {SubjectData.map((subject) => {
            if (
              assignment.course.code.substring(0, 2) === subject.code_fragment
            ) {
              return (
                <div key={subject.id} className="flex items-center gap-2">
                  <Image
                    src={subject.image}
                    alt={subject.name}
                    className="w-8 h-8"
                    width={32}
                    height={32}
                  />
                  <div>
                    <Badge
                      color={
                        assignment.assignment_type === 'EXCERCISE'
                          ? 'lighterror'
                          : 'lightwarning'
                      }
                    >
                      {assignment.assignment_type === 'EXCERCISE'
                        ? 'Bài tập'
                        : 'Bài kiểm tra'}
                    </Badge>
                    <div className="font-semibold flex items-center gap-2">
                      {assignment.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Mã khóa học: {assignment.course.code}
                    </div>
                    <div className="text-sm text-gray-600">
                      Tên khóa học: {assignment.course.name}
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
  );
};

export default AssignmentList;
