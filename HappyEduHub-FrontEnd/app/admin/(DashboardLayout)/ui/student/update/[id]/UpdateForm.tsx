'use client';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import Header from '@/app/admin/components/dashboard/Header';
import RequiredStar from '@/app/admin/components/dashboard/RequiredStar';
import useForm from '@/app/hooks/useForm';
import { callApi } from '@/app/utils/api';
import {
  formattedDate,
  getCurrentUserRole,
  getRole,
  getUserData,
  processGoogleDriveLink,
  uploadFile,
} from '@/app/utils/utils';
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
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { RoleType } from '@/app/utils/constant';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const UpdateForm = ({ id }) => {
  const reader = useMemo(() => new FileReader(), []);
  const [avatarImage, setAvatarImage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [role, setRole] = useState(RoleType.NULL)
  const { values, handleChange, resetForm, setValues } = useForm({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    date_of_birth: '',
    role: 'STUDENT',
    is_thaiphien: '',
    gender: 'MALE',
    address: '',
    first_contact_name: '',
    first_contact_tel:'',
    cccd: '',
    class: '',
    school: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let avatar_url = values.avatar_url;

    setLoading(true);

    if (avatarImage) {
      const avatarResponse = await uploadFile(avatarImage);
      if (!avatarResponse) {
        setLoading(false);
        return;
      }
      notify('Chỉnh sửa thành công avatar', 'success');
      avatar_url = avatarResponse.web_view_link;
    }

    const body = avatar_url?{
      name: values.name.trim(),
      email: values.email.trim(),
      phone_number: values.phone_number.trim(),
      date_of_birth: values.date_of_birth.trim(),
      role: values.role.trim(),
      avatar_url: avatar_url,
      is_thaiphien: values.is_thaiphien,
      gender: values.gender.trim(),
      address: values.address.trim(),
    }:{
      name: values.name.trim(),
      email: values.email.trim(),
      phone_number: values.phone_number.trim(),
      date_of_birth: values.date_of_birth.trim(),
      role: values.role.trim(),
      is_thaiphien: values.is_thaiphien,
      gender: values.gender.trim(),
      address: values.address.trim(),
    };
    

    try {
      const user_id = (getCurrentUserRole() == RoleType.STUDENT)?getUserData().id:id;
      const response = await callApi(`user/${user_id}/update-by-admin`, 'PUT', body);

      notify('Update người dùng thành công', 'success');
      setLoading(false);
      window.location.href = `/admin/ui/student/detail/${id}`;
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      notify(error.message, 'error');
    } finally {
      resetForm();
    }
  };

  const isStudent = () => {
    if (getCurrentUserRole() === RoleType.STUDENT)
      return true;
    return false;
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userId = id;
        const userEndpoint = `user/${userId}`;
        const tags = await callApi(`tags`, 'GET');
        const response = await callApi(userEndpoint, 'GET');

        if (!tags) return;
        if (!response) return;

        const { additional_student_data, ...userData } = response;

        userData.date_of_birth = formattedDate(
          userData.date_of_birth,
          'yyyy-mm-dd'
        );
        setSubjects(tags.filter((t) => t.type != 'GRADE'));

        setValues((prev) => ({
          ...prev,
          ...userData,
          first_contact_name: additional_student_data.first_contact_name,
          first_contact_tel: additional_student_data.first_contact_tel,
        }));

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu người dùng:', error);
        notify('Lỗi khi tải dữ liệu người dùng', 'error');
        setLoading(false);
      }
    };
    fetchUserData();
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
        title="Chỉnh sửa học sinh"
        showButton={false}
      />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <div className="flex flex-col gap-4">
            {!isStudent && (<div>
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
            </div>)}

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
              {!isStudent() && (<><div className="mb-2 block">
                <Label
                  htmlFor="phone_number"
                  value="Số điện thoại"
                  className="mb-2" />
                <RequiredStar />
              </div><TextInput
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  placeholder="VD: 0987654321"
                  value={values.phone_number}
                  onChange={handleChange}
                  required /></>)}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 col-span-12">
          <div className="lg:col-span-6 col-span-12">
            <div className="flex flex-col gap-4">
              <div>
                {!isStudent && (<><div className="mb-2 block">
                  <Label
                    htmlFor="email"
                    value="Email đăng nhập"
                    className="mb-2" />
                  <RequiredStar />
                </div><TextInput
                    id="email"
                    name="email"
                    type="text"
                    placeholder="VD: nguyenhuuviet@gmail.com"
                    value={values.email}
                    onChange={handleChange}
                    required />
              </>)}
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
                {/* <TextInput
                  id="avatar_url"
                  name="avatar_url"
                  type="text"
                  placeholder="URL ảnh đại diện"
                  value={values.avatar_url}
                  onChange={handleChange}
                /> */}
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
            <div className="grid grid-cols-2 gap-4">
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
                />
              </div>

              <div>
                <Label
                  className="mb-2 block"
                  htmlFor="first_contact_name"
                  value="SĐT phụ huynh" /><TextInput
                    id="first_contact_tel"
                    name="first_contact_tel"
                    type="text"
                    placeholder="VD: 031303000165"
                    value={values.first_contact_number}
                    onChange={handleChange} />
              </div>

              {/* <div>
                <Label
                  className="mb-2 block"
                  htmlFor="first_contact_name"
                  value="CCCD/CMND phụ huynh"
                />
                <TextInput
                  id="first_contact_name"
                  name=""
                  type="text"
                  placeholder="VD: 031303000165"
                  value={values.first_contact_number}
                  onChange={handleChange}
                />
              </div> */}
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

export default UpdateForm;
