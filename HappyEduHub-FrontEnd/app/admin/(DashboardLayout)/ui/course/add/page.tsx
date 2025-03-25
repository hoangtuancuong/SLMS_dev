'use client';
import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput, Select, Card } from 'flowbite-react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import useForm from '@/app/hooks/useForm';
import { notify } from '@/components/Alert/Alert';
import { callApi } from '@/app/utils/api';
import RequiredStar from '@/app/admin/components/dashboard/RequiredStar';
import Header from '@/app/admin/components/dashboard/Header';
import { StudySession, TagType } from '@/app/utils/constant';
import { useRouter } from 'next/navigation';
export type SelectOption = {
  value: string;
  label: string;
};

const DAYS_OF_WEEK = [
  { value: 1, label: 'Chủ Nhật' },
  { value: 2, label: 'Thứ 2' },
  { value: 3, label: 'Thứ 3' },
  { value: 4, label: 'Thứ 4' },
  { value: 5, label: 'Thứ 5' },
  { value: 6, label: 'Thứ 6' },
  { value: 7, label: 'Thứ 7' },
];

const SHIFTS = [
  { value: 1, label: 'Sáng- ca 1' },
  { value: 2, label: 'Sáng- ca 2' },
  { value: 3, label: 'Chiều- ca 1' },
  { value: 4, label: 'Chiều- ca 2' },
  { value: 5, label: 'Chiều- ca 3' },
  { value: 6, label: 'Chiều- ca 4' },
];


const CreateClassForm = () => {
  const [isLoading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([])
  const [updatedTags, setUpdatedTags] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const { values, handleChange, resetForm, setValues } = useForm({
    name: '',
    start_date: '',
    end_date: '',
    fee: '',
    tag_ids: [1,12],
    course_shifts: [],
    description: '',
  });
  const router = useRouter();
  const handleTagChange = (e, type) => {
  
    if (type === 'SUBJECT') {
      updatedTags[1] = e.target.value; // Subject ở vị trí 1
    } else if (type === 'GRADE') {
      updatedTags[0] = e.target.value; // Grade ở vị trí 0
    }
    setValues((prev) => ({
      ...prev,
      tag_ids: updatedTags, 
    }));
  };

  const handleAddCourseTime = () => {
    setValues((prev) => ({
      ...prev,
      course_shifts: [
        ...prev.course_shifts,
        { day: null, shift: null },
      ],
    }));
  };

  const handleRemoveCourseTime = (index) => {
    const updatedCourseTimes = [...values.course_shifts];
    updatedCourseTimes.splice(index, 1);
    setValues((prev) => ({
      ...prev,
      course_shifts: updatedCourseTimes,
    }));
  };

  const handleCourseTimeChange = (index, field, value) => {
    const updatedCourseTimes = [...values.course_shifts];
    updatedCourseTimes[index][field] = value;
    setValues((prev) => ({
      ...prev,
      course_shifts: updatedCourseTimes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.name.trim() || !values.start_date || !values.end_date) {
      notify('Vui lòng điền đầy đủ thông tin!', 'warning');
      return;
    }

    const body = {
      name: values.name.trim(),
      start_date: values.start_date,
      end_date: values.end_date,
      fee: parseFloat(values.fee),
      course_shifts: values.course_shifts,
      tag_ids: values.tag_ids,
      description: values.description,
    };

    try {
      setLoading(true);
      const res = await callApi('courses', 'POST', body);
      if (selectedTeacher) {
        const body = {
          "course_id": res.id,
          "user_id": selectedTeacher,
          "status": "ACCEPTED"
        }
        const res_assign_teacher = await callApi("members", "POST", body);
      }
      notify('Tạo lớp học thành công!', 'success');
      resetForm();
      router.push('/admin/ui/course');
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const teachers = await callApi(
          'user?limit=100&filter%5Brole%5D=TEACHER&sort%5Bdate_of_birth%5D=ASC'
        );
        const tags = await callApi('tags');
        setSubjects(tags.filter((p) => p.type === 'SUBJECT'));
        setGrades(tags.filter((p) => p.type === 'GRADE'));
        setTeachers(teachers.data);
      } catch (error) {
        notify(error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg shadow-md bg-white dark:bg-gray-900 p-6 w-full space-y-6"
    >
      <Header
        icon="solar:document-bold"
        title="Tạo mới lớp học"
        showButton={false}
        buttonIcon={undefined}
        buttonText={undefined}
        buttonLink={undefined}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 space-y-4">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="name" value="Tên lớp học"></Label>
              <RequiredStar />
            </div>
            <TextInput
              id="name"
              name="name"
              type="text"
              placeholder="Nhập tên lớp học"
              value={values.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="start_date" value="Ngày bắt đầu"></Label>
              <RequiredStar />
            </div>
            <TextInput
              id="start_date"
              name="start_date"
              type="date"
              value={values.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="end_date" value="Ngày kết thúc"></Label>
              <RequiredStar />
            </div>
            <TextInput
              id="end_date"
              name="end_date"
              type="date"
              value={values.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="fee" value="Học phí (VND)"></Label>
              <RequiredStar />
            </div>
            <TextInput
              id="fee"
              name="fee"
              type="number"
              placeholder="Nhập học phí"
              value={values.fee}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 space-y-4">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="tags" value="Môn học" />
              <RequiredStar />
            </div>
            <Select
              id="tags"
              onChange={(e) => handleTagChange(e, 'SUBJECT')}
              className="rounded-md"
            >
              {subjects.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="tags" value="Khối học" />
              <RequiredStar />
            </div>
            <Select
              id="tags"
              onChange={(e) => handleTagChange(e, 'GRADE')}
              className="rounded-md"
            >
              {grades.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <div className="mb-1 block">
              <Label
                htmlFor="descriptio <RequiredStar />n"
                value="Mô tả"
              ></Label>
              <RequiredStar />
            </div>
            <TextInput
              id="description"
              name="description"
              type="text"
              placeholder="Nhập mô tả"
              value={values.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <div className="mb-1 block">
              <Label htmlFor="tags" value="Giáo viên giảng dạy" />
              <RequiredStar />
            </div>
            <Select
              id="teachers"
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="rounded-md"
            >
              <option>
                Chọn giáo viên giảng dạy
              </option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.code}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="col-span-12 space-y-4 relative">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">
              Thời gian học
              <RequiredStar />
            </h4>
            <button
              type="button"
              onClick={handleAddCourseTime}
              className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              <HiOutlinePlus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {values.course_shifts.map((courseTime, index) => (
              <div
                key={index}
                className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-sm shadow-sm hover:shadow-md transition duration-200"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveCourseTime(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>

                <div>
                  <Label className="mb-1 block">Ngày học trong tuần</Label>
                  <Select
                    value={courseTime.day === null ? '' : courseTime.day}
                    onChange={(e) =>
                      handleCourseTimeChange(index, 'day', e.target.value)
                    }
                    className="w-full"
                  >
                    <option value="">Chọn thứ</option>
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label className="mb-1 block">Chọn ca học trong ngày</Label>
                  <Select
                    value={courseTime.shift === null ? '' : courseTime.shift}
                    onChange={(e) =>
                      handleCourseTimeChange(index, 'shift', e.target.value)
                    }
                    className="w-full"
                  >
                    <option value="">Chọn ca</option>
                    {SHIFTS.map((shift) => (
                      <option key={shift.value} value={shift.value}>
                        {shift.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 flex gap-3 mt-4">
          <Button color="primary" type="submit" isProcessing={isLoading}>
            Tạo lớp học
          </Button>
          <Button color="gray" type="button" onClick={resetForm}>
            Xoá form
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateClassForm;
