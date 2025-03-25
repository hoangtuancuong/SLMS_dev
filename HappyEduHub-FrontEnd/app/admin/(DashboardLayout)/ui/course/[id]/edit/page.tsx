'use client';
import React, { useEffect, useState } from 'react';
import { Button, Label, TextInput, Select, Textarea } from 'flowbite-react';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import useForm from '@/app/hooks/useForm';
import { notify } from '@/components/Alert/Alert';
import { callApi } from '@/app/utils/api';
import RequiredStar from '@/app/admin/components/dashboard/RequiredStar';
import Header from '@/app/admin/components/dashboard/Header';
import { useParams, useRouter } from 'next/navigation';
import { formattedDate } from '@/app/utils/utils';
// Hàm định dạng ngày tháng thành YYYY-MM-DD
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ''; // Nếu không parse được, trả về rỗng
  return date.toISOString().split('T')[0]; // Trả về định dạng YYYY-MM-DD
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

const UpdateClassForm = () => {
  const [isLoading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [updatedTags, setUpdatedTags] = useState([]);
  const [subjectTag, setSubjectTag] = useState(null);
  const [gradeTag, setGradeTag] = useState(null);
  const { values, handleChange, resetForm, setValues } = useForm({
    name: '',
    start_date: '',
    end_date: '',
    fee: '',
    tag_ids: [],
    course_shifts: [],
    description: '',
  });
  const params = useParams();
  const classId = params.id;
  const router = useRouter();
  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        setLoading(true);
        const classData = await callApi(`courses/${classId}`, 'GET');

        const subjectTag = classData.tags.find((tag) => tag.type === 'SUBJECT');
        const gradeTag = classData.tags.find((tag) => tag.type === 'GRADE');
        const tagIdsString = [gradeTag?.id, subjectTag?.id]

      
        const formattedStartDate = formatDateForInput(classData.start_date);
        const formattedEndDate = formatDateForInput(classData.end_date);

        setValues({
          name: classData.name || '',
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          fee: classData.fee || '',
          tag_ids: tagIdsString,
          course_shifts: classData.shifts.map((shift) => ({
            day: shift.day ?? null,
            shift: shift.shift ?? null,
          })),
          description: classData.description || '',
        });
      } catch (error) {
        notify('Không thể tải thông tin lớp học!', 'error');
        console.error('Fetch class detail error:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const tags = await callApi('tags', 'GET');
        setSubjects(tags.filter((p) => p.type === 'SUBJECT'));
        setGrades(tags.filter((p) => p.type === 'GRADE'));
      } catch (error) {
        notify(error.message, 'error');
      }
    };

    if (classId) {
      fetchClassDetail();
      fetchTags();
    }
  }, [classId, setValues]);

  const handleTagChange = (e, type) => {
    const newValue = parseInt(e.target.value) || null;
  
    const newTags = [...updatedTags];
    if (type === 'SUBJECT') {
      newTags[1] = newValue;
    } else if (type === 'GRADE') {
      newTags[0] = newValue;
    }
    setUpdatedTags(newTags);
    setValues((prev) => ({
      ...prev,
      tag_ids: newTags,
    }));
    console.log(newTags);
  };

  const handleAddCourseTime = () => {
    setValues((prev) => ({
      ...prev,
      course_shifts: [...prev.course_shifts, { day: null, shift: null }],
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
    updatedCourseTimes[index][field] = value ? parseInt(value) : null;
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
      fee: parseFloat(values.fee) || 0,
      course_shifts: values.course_shifts.filter(
        (shift) => shift.day !== null && shift.shift !== null
      ),
      tag_ids: values.tag_ids,
      description: values.description,
    };

    try {
      setLoading(true);
      await callApi(`courses/${classId}`, 'PUT', body);
      notify('Cập nhật lớp học thành công!', 'success');
      router.push(`/admin/ui/course`);
    } catch (error) {
      console.error('Submit error:', error);
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg shadow-md bg-white dark:bg-gray-900 p-6 w-full space-y-6"
    >
      <Header
        icon="solar:document-bold"
        title="Cập nhật lớp học"
        showButton={false}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6 space-y-4">
          <div>
            <Label htmlFor="name" value="Tên lớp học" />
            <RequiredStar />
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
            <Label htmlFor="start_date" value="Ngày bắt đầu" />
            <RequiredStar />
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
            <Label htmlFor="end_date" value="Ngày kết thúc" />
            <RequiredStar />
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
            <Label htmlFor="fee" value="Học phí (VND)" />
            <RequiredStar />
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
            <Label htmlFor="subject" value="Môn học" />
            <RequiredStar />
            <Select
              id="subject"
              value={values.tag_ids[1] ?? ''}
              
              onChange={(e) => handleTagChange(e, 'SUBJECT')}
            >
              <option value="">Chọn môn học</option>
              {subjects.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="grade" value="Khối học" />
            <RequiredStar />
            <Select
              id="grade"
              value={values.tag_ids[0]??''}
              onChange={(e) => handleTagChange(e, 'GRADE')}
            >
              <option value="">Chọn khối học</option>
              {grades.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="description" value="Mô tả" />
            <RequiredStar />
            <Textarea
              id="description"
              name="description"
              placeholder="Nhập mô tả"
              value={values.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-span-12 space-y-4">
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
                className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-sm shadow-sm hover:shadow-md transition"
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
                    value={courseTime.day ?? ''}
                    onChange={(e) =>
                      handleCourseTimeChange(index, 'day', e.target.value)
                    }
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
                    value={courseTime.shift ?? ''}
                    onChange={(e) =>
                      handleCourseTimeChange(index, 'shift', e.target.value)
                    }
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
            Cập nhật lớp học
          </Button>
          <Button color="gray" type="button" onClick={resetForm}>
            Reset form
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateClassForm;
