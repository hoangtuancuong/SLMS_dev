'use client';
import { useState } from 'react';
import Image from 'next/image';
import TeacherModal from './TeacherModal';
import { processGoogleDriveLink } from '@/app/utils/utils';

const SingleTeacher = ({ teacher }: { teacher: any }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const getBadgeInfo = (type: string) => {
    switch (type) {
      case 'MALE':
        return 'Thầy ';
      case 'FEMALE':
        return 'Cô ';
      default:
        return 'Giáo viên';
    }
  };

  return (
    <>
      <div className="w-full px-4 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
        <div
          className="bg-white rounded-md shadow-md ring-1 ring-blue-400/30 overflow-hidden 
                      transition-all duration-300 ease-in-out 
                      hover:shadow-lg hover:shadow-blue-500/50 hover:ring-blue-500/50 hover:-translate-y-2 cursor-pointer"
          onClick={() =>
            window
              .open(
                `https://profile.edSLMS.vn/index.html?id=${teacher.id}`,
                '_blank'
              )
              .focus()
          }
        >
          <div className="relative w-full h-64">
            <Image
              src={processGoogleDriveLink(teacher.avatar_url)}
              alt={teacher.name}
              layout="fill"
              objectFit="cover"
              className="rounded-t-md"
            />
          </div>

          <div className="p-4 text-center">
            <h4 className="text-md font-semibold text-gray-800 truncate">
              {getBadgeInfo(teacher.gender)} {teacher.name}
            </h4>
            <p className="text-sm text-gray-600">
              Hiện đang giảng dạy môn{' '}
              <strong>{teacher.additional_teacher_data?.subject.name}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Modal hiển thị thông tin giáo viên */}
      <TeacherModal
        show={isModalOpen}
        onClose={() => setModalOpen(false)}
        teacher={teacher}
      />
    </>
  );
};

export default SingleTeacher;
