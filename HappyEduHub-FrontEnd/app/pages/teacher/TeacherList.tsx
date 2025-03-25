'use client';
import Breadcrumb from '@/components/Common/Breadcrumb';
import SingleTeacher from './SingleTeacher';
import { useEffect, useState } from 'react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import { Teacher } from '@/types/teacher';
import Link from 'next/link';
import GlobalLoader from '@/components/GlobalLoader';

const TeacherList = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [teacherData, setTeacherData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const tagData = await callApi('tags');
        const teacherData = await callApi(
          'user?limit=100&filter%5Brole%5D=TEACHER&sort%5Bdate_of_birth%5D=ASC'
        );

        const tags = tagData;
        setTeacherData(teacherData.data);
        setSubjects(tags.filter((p) => p.type === 'SUBJECT'));
        setLoading(false);
      } catch (error) {
        notify(error.message, 'error');
      }
    };

    fetchData();
  }, []);

  const filteredTeachers = selectedSubject
    ? teacherData.filter((teacher) => teacher.subject === selectedSubject)
    : teacherData;

  return (
    <>
      <Breadcrumb
        pageName="Danh sách giáo viên"
        description="Dưới đây là danh sách giáo viên đang giảng dạy tại trung tâm.
        Tất cả đều là những chuyên gia với nhiều năm kinh nghiệm và chuyên môn cao."
      />
      <section className="pb-[60px] pt-[60px]">
        <div className="container">
          {/* Render filter buttons */}
          <div className="mb-6 flex flex-wrap gap-4">
            <button
              onClick={() => setSelectedSubject(null)}
              className="px-6 py-2 rounded-md border-2 bg-white text-blue-600 border-blue-500 hover:bg-blue-100"
            >
              Tất cả
            </button>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.name)}
                className={`px-6 py-2 rounded-md border-2 transition duration-300 ease-in-out 
                  ${
                    selectedSubject === subject.name
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-blue-600 border-blue-500 hover:bg-blue-100'
                  }`}
              >
                {subject.name}
              </button>
            ))}
          </div>

          {/* Teachers list */}
          <div className="-mx-4 flex flex-wrap gap-y-10">
            {filteredTeachers.map((teacher, index) => (
              <SingleTeacher key={index} teacher={teacher} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TeacherList;
