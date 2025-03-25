import React from 'react';
import { Rating } from 'flowbite-react';
import { Card } from 'flowbite-react';
const starIcon = (
  <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current">
    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
  </svg>
);

const TeacherProfileCard = () => {
  const teacherInfo = {
    name: 'Cô Lương Thảo Nhi',
    role: 'Giáo viên ',
    department: 'trung tâm SLMS',
    qualifications: [
      '- Tốt nghiệp loại Giỏi hệ chính quy tại trường Đại học Anh Quốc Việt Nam (British University Vietnam)',
      '- Kinh nghiệm giảng dạy: 3 năm luyện thi IELTS và các lớp tiếng Anh khác.',
      '- Thành tích nổi bật: Quán quân học bổng 100% trường ĐH Anh Quốc Việt Nam.',
      '- Khối lớp phụ trách tại ECE: Foundation & IELTS',
      '- Thế mạnh trong giảng dạy: Truyền đạt kiến thức và tạo động lực/hứng thú học ngoại ngữ cho học sinh.',
      '- Phong cách giảng dạy: Năng động và cởi mở',
    ],
  };

  return (
    <Card className="w-screen h-auto bg-gray-light flex items-center rounded-none shadow-none border-none justify-center p-4 ">
      <div className="flex flex-row w-full h-full  max-w-6xl">
        {/* Image Section */}
        <div className="w-1/3 h-full relative p-1 flex items-center justify-center">
          <div className="h-3/4 w-full relative rounded-sm">
            <img
              src="/images/giangvien.jpg"
              alt="Teacher profile"
              className="h-full w-full object-cover rounded-sm "
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="mb-4 border-b-2 border-blue-900">
            <h5 className="text-3xl text-blue-900 font-bold tracking-tight mb-2 dark:text-white">
              {teacherInfo.name}
            </h5>
            <p className="text-blue-900 dark:text-blue-500 mb-2 text-lg">
              {teacherInfo.role}{' '}
              <span className="text-blue-900 dark:text-gray-400">
                {teacherInfo.department}
              </span>
            </p>
          </div>

          <div className="space-y-3 text-lg">
            {teacherInfo.qualifications.map((qualification, index) => (
              <div key={index} className="flex items-start gap-2">
                <p className="text-gray-700 dark:text-gray-400">
                  {qualification}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeacherProfileCard;
