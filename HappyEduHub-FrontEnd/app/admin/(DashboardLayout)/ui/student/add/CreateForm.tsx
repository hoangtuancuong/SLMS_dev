'use client';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import Header from '@/app/admin/components/dashboard/Header';
import RequiredStar from '@/app/admin/components/dashboard/RequiredStar';
import useForm from '@/app/hooks/useForm';
import { callApi } from '@/app/utils/api';
import { uploadFile } from '@/app/utils/utils';
import { notify } from '@/components/Alert/Alert';
import { Icon } from '@iconify/react';
import { Switch } from '@mui/material';
import {
  Accordion,
  Button,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from 'flowbite-react';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CreateForm = () => {
  const reader = useMemo(() => new FileReader(), []);
  const [avatarImage, setAvatarImage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { values, handleChange, resetForm, setValues } = useForm({
    name: '',
    email: '',
    password: '',
    avatar_url: '',
    date_of_birth: '',
    role: 'STUDENT',
    is_thaiphien: '',
    gender: 'MALE',
    address: '',
    first_contact_name: '',
    cccd: '',
    class: '',
    school: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatar_url = '';

      if (avatarImage) {
        console.log('Uploading avatar:', avatarImage);
        const avatarResponse = await uploadFile(avatarImage);
        if (!avatarResponse) throw new Error('Lỗi khi upload avatar');
        notify('Upload thành công avatar', 'success');
        avatar_url = avatarResponse.web_view_link;
      }

      const body = {
        student_data: [
          {
            name: values.name.trim(),
            email: values.email.trim(),
            password: values.password.trim(),
            date_of_birth: values.date_of_birth.trim(),
            phone_number: values.first_contact_tel.trim(),
            role: values.role.trim(),
            avatar_url: avatar_url.trim(),
            is_thaiphien: values.is_thaiphien,
            gender: values.gender.trim(),
            address: values.address.trim(),
            first_contact_name: values.first_contact_name.trim(),
            cccd: values.cccd.trim(),
            class: values.class.trim(),
            school: values.school.trim(),
            first_contact_tel: values.first_contact_tel.trim(),
          },
        ],
      };

      console.log('Body gửi lên API:', body);
      const response = await callApi('user/bulk-student-create', 'POST', body);

      notify('Tạo người dùng thành công', 'success');
      resetForm();
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (values.is_thaiphien)
      setValues((prev) => ({
        ...prev,
        school: 'THPT Thái Phiên',
      }));
  }, [setValues, values.is_thaiphien]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callApi('tags');
        const tags = response;
        console.log(tags);

        setSubjects(tags.filter((p) => p.type === 'SUBJECT'));
        console.log(subjects);
      } catch (error) {
        //notify(error.message, 'error');
      }
    };

    fetchData();
  }, []);

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="rounded-sm shadow-md bg-white dark:bg-darkgray p-6 w-full"
    >
      <BlogSpinner isLoading={isLoading} />
      <Header
        icon="solar:document-bold"
        title="Thêm mới học sinh"
        showButton={false}
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Họ và tên" className="mb-2" />
                <RequiredStar />
              </div>
              <TextInput
                id="name"
                name="name"
                className="rounded-sm"
                type="text"
                placeholder="VD: Nguyễn Hữu Việt"
                value={values.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="address" value="Địa chỉ" className="mb-2" />
                <RequiredStar />
              </div>
              <TextInput
                id="address"
                name="address"
                type="text"
                placeholder="VD: 1 Đại Cồ Việt, Quận Hai Bà Trưng, Hà Nội"
                value={values.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="gender" value="Giới tính" className="mb-2" />
                <RequiredStar />
              </div>
              <Select
                id="gender"
                name="gender"
                value={values.gender}
                onChange={handleChange}
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                {/* <option value="OTHER">Khác</option> */}
              </Select>
            </div>

            <div>
              <div className="lg:col-span-6 col-span-12 mb-2 block">
                <Label
                  htmlFor="address"
                  value="Trường hiện đang theo học"
                  className="mb-2"
                />
                <RequiredStar />
              </div>
              {values.is_thaiphien && (
                <TextInput
                  id="school"
                  name="school"
                  type="text"
                  className="bg-gray-50 text-gray-200"
                  placeholder="VD: THPT Thái Phiên"
                  value={values.school}
                  onChange={handleChange}
                  required
                  readOnly
                />
              )}

              {!values.is_thaiphien && (
                <TextInput
                  id="school"
                  name="school"
                  type="text"
                  placeholder="VD: THPT Thái Phiên"
                  value={values.school}
                  onChange={handleChange}
                  required
                />
              )}
            </div>

            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="class"
                  value="Lớp học tại trường"
                  className="mb-2"
                />
                <RequiredStar />
              </div>
              <TextInput
                id="class"
                name="class"
                type="text"
                placeholder="VD: 12A8"
                value={values.class}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 col-span-12">
          <div className="lg:col-span-6 col-span-12">
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="email"
                    value="Email đăng nhập"
                    className="mb-2"
                  />
                  <RequiredStar />
                </div>
                <TextInput
                  id="email"
                  name="email"
                  type="text"
                  placeholder="VD: nguyenhuuviet@gmail.com"
                  value={values.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <Label htmlFor="date_of_birth" value="Ngày tháng năm sinh" />
                  <RequiredStar />
                </div>
                <TextInput
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={values.date_of_birth}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="avatar_url" value="Ảnh đại diện" />
                <FileInput
                  id="avatar_url"
                  name="avatar_url"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    console.log(file);
                    if (!file) {
                      setAvatarImage(null);
                    } else if (file.size > 5 * 1024 * 1024) {
                      notify('Kích cỡ ảnh không được vượt quá 5MB', 'error');
                    } else {
                      setAvatarImage(file);
                    }
                  }}
                />
              </div>
              <div className="mb-2 block">
                <div className="flex items-center justify-between ">
                  <Label
                    htmlFor="is_thaiphien"
                    value="Là học sinh trường THPT Thái Phiên"
                  />
                  <Switch
                    id="is_thaiphien"
                    name="is_thaiphien"
                    checked={values.is_thaiphien}
                    value={values.is_thaiphien}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        is_thaiphien: e.target.checked,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Accordion
        className="w-full mt-4 transition-all duration-10000 ease-in-out"
        data-accordion="open"
      >
        <Accordion.Panel data-accordion="open">
          <Accordion.Title className="border-0 focus:outline-none focus:ring-0">
            Thông tin liên lạc
          </Accordion.Title>
          <Accordion.Content>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label
                  className="mb-2 block"
                  htmlFor="first_contact_name"
                  value="Họ và tên phụ huynh"
                />
                <TextInput
                  id="first_contact_name"
                  name="first_contact_name"
                  type="text"
                  placeholder="VD: Nguyễn Văn A"
                  value={values.first_contact_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label
                  className="mb-2 block"
                  htmlFor="first_contact_tel"
                  value="SĐT phụ huynh"
                />
                <TextInput
                  id="first_contact_tel"
                  name="first_contact_tel"
                  type="text"
                  placeholder="VD: 031303000165"
                  value={values.first_contact_tel}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label
                  className="mb-2 block"
                  htmlFor="cccd"
                  value="CCCD/CMT phụ huynh"
                />
                <TextInput
                  id="cccd"
                  name="cccd"
                  type="text"
                  placeholder="VD: 0123456789"
                  value={values.cccd}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
      <div className="col-span-12 flex gap-3 mt-4">
        <Button color="primary" type="submit">
          Tạo người dùng
        </Button>
        <Button color="gray" type="button" onClick={resetForm}>
          Xoá form
        </Button>
      </div>
    </form>
  );
};

export default CreateForm;
