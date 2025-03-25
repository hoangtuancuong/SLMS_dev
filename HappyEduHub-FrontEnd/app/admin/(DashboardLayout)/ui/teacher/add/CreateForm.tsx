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
  const [galleryImages, setGalleryImages] = useState([]);
  const [avatarImage, setAvatarImage] = useState(null);
  const [heroImage, setHeroImage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { values, handleChange, resetForm, setValues } = useForm({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    date_of_birth: '',
    role: 'TEACHER',
    avatar_url: '',
    is_thaiphien: false,
    gender: 'MALE',
    address: '',
    subject_id: 1,
    portfolio: {},
  });
  const [portfolios, setPortfolios] = useState({
    hero_image: '',
    hoc_ham: '',
    school: [],
    start_teaching_year: '',
    bio: '',
    teaching_philosophy: '',
    achievements: [],
    career: [],
    images: [],
    teaching_grades: [],
    gallery: [],
  });

  const handlePortfolioChange = (e) => {
    const { name, value } = e.target;
    setPortfolios((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatar_url = portfolios.hero_image;

      if (avatarImage) {
        console.log('Uploading avatar:', avatarImage);
        const avatarResponse = await uploadFile(avatarImage);
        if (!avatarResponse) throw new Error('Lỗi khi upload avatar');
        notify('Upload thành công avatar', 'success');
        avatar_url = avatarResponse.web_view_link;
      }

      let hero_image_url = portfolios.hero_image;
      if (heroImage) {
        console.log('Uploading hero image:', heroImage);
        const heroResponse = await uploadFile(heroImage);
        if (!heroResponse) throw new Error('Lỗi khi upload hero image');
        notify('Upload thành công ảnh portfolio', 'success');
        hero_image_url = heroResponse.web_view_link;
      }

      const uploadedGallery = await Promise.all(
        galleryImages.map(async (file) => {
          console.log('Uploading gallery image:', file);
          const response = await uploadFile(file);
          if (!response) return null;
          notify('Upload thành công ảnh ' + file.name, 'success');
          return response.web_view_link;
        })
      );

      const filteredGallery = uploadedGallery.filter(Boolean);

      const updatedPortfolio = {
        ...portfolios,
        hero_image: hero_image_url,
        gallery: filteredGallery,
      };

      setPortfolios(updatedPortfolio);

      await new Promise((resolve) => setTimeout(resolve, 300));

      const body = {
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        phone_number: values.phone_number.trim(),
        date_of_birth: values.date_of_birth.trim(),
        role: values.role.trim(),
        avatar_url: avatar_url.trim(),
        is_thaiphien: values.is_thaiphien,
        gender: values.gender.trim(),
        address: values.address.trim(),
        subject_id: Number(values.subject_id),
        portfolio: updatedPortfolio,
      };

      console.log('Body gửi lên API:', body);
      const response = await callApi('user/create-by-admin', 'POST', body);

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

  const handleAchievementChange = (index, field, value) => {
    setPortfolios((prev) => {
      const updatedAchievements = [...prev.achievements];
      updatedAchievements[index] = {
        ...updatedAchievements[index],
        [field]: value,
      };
      return { ...prev, achievements: updatedAchievements };
    });
  };

  const removeAchievement = (index) => {
    setPortfolios((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const addAchievement = () => {
    setPortfolios((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { name: '', desc: '' }],
    }));
  };

  const handleCareerChange = (index, field, value) => {
    const updatedCareer = [...portfolios.career];
    updatedCareer[index] = { ...updatedCareer[index], [field]: value };
    setPortfolios((prev) => ({ ...prev, career: updatedCareer }));
  };

  const addCareer = () => {
    setPortfolios((prev) => ({
      ...prev,
      career: [
        ...prev.career,
        { start_year: '', end_year: '', school: '', role: '', desc: '' },
      ],
    }));
  };

  const removeCareer = (index) => {
    setPortfolios((prev) => ({
      ...prev,
      career: prev.career.filter((_, i) => i !== index),
    }));
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="rounded-sm shadow-md bg-white dark:bg-darkgray p-6 w-full"
    >
      <BlogSpinner isLoading={isLoading} />
      <Header
        icon="solar:document-bold"
        title="Thêm mới giáo viên"
        showButton={false}
        buttonIcon={undefined}
        buttonText={undefined}
        buttonLink={undefined}
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
              <div className="mb-2 block">
                <Label
                  htmlFor="phone_number"
                  value="Số điện thoại"
                  className="mb-2"
                />
                <RequiredStar />
              </div>
              <TextInput
                id="phone_number"
                name="phone_number"
                type="text"
                placeholder="VD: 0987654321"
                value={values.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="subject"
                  value="Môn học giảng dạy"
                  className="mb-2"
                />
                <RequiredStar />
              </div>
              <Select
                id="subject"
                name="subject_id"
                value={values.subject_id}
                onChange={handleChange}
                required
              >
                <option value="">Chọn môn học</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
                {/* <option value="OTHER">Khác</option> */}
              </Select>
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
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" value="Mật khẩu" className="mb-2" />
                  <RequiredStar />
                </div>
                <TextInput
                  id="password"
                  name="password"
                  type="text"
                  placeholder="Nhập mật khẩu"
                  value={values.password}
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
              <div className="mb-2 block">
                <div className="flex items-center justify-between ">
                  <Label
                    htmlFor="is_thaiphien"
                    value="Là giáo viên trường THPT Thái Phiên"
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
            Thông tin chi tiết
          </Accordion.Title>
          <Accordion.Content>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  className="mb-2 block"
                  htmlFor="school"
                  value="Trường giảng dạy"
                />
                <TextInput
                  id="school"
                  name="school"
                  type="text"
                  placeholder="Nhập tên trường"
                  value={portfolios.school}
                  onChange={handlePortfolioChange}
                />
              </div>

              <div>
                <Label
                  className="mb-2 block"
                  htmlFor="start_teaching_year"
                  value="Năm bắt đầu giảng dạy"
                />
                <TextInput
                  id="start_teaching_year"
                  name="start_teaching_year"
                  type="text"
                  placeholder="Nhập năm"
                  value={portfolios.start_teaching_year}
                  onChange={handlePortfolioChange}
                />
              </div>

              <div className="col-span-2">
                <Label className="mb-2 block">Khối giảng dạy</Label>
                <div className="grid grid-cols-4 gap-4">
                  {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                    <label key={grade} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={grade}
                        checked={portfolios.teaching_grades.includes(grade)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setPortfolios((prev) => ({
                            ...prev,
                            teaching_grades: isChecked
                              ? [...prev.teaching_grades, grade] // Thêm nếu chọn
                              : prev.teaching_grades.filter((g) => g !== grade), // Xóa nếu bỏ chọn
                          }));
                        }}
                      />
                      Khối {grade}
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <Label
                  className="mb-2 block"
                  htmlFor="hoc_ham"
                  value="Học hàm"
                />
                <Select
                  className="flex-1"
                  required
                  name="hoc_ham"
                  value={portfolios.hoc_ham}
                  onChange={handlePortfolioChange}
                >
                  <option value="">---</option>
                  <option value="Cử nhân">Cử nhân</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </Select>
              </div>

              <div className="col-span-2">
                <Label className="mb-2 block" htmlFor="bio" value="Tiểu sử" />
                <Textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  placeholder="VD: Cô Trang là một giáo viên tận tâm với nhiều năm kinh nghiệm giảng dạy và truyền đạt kiến thức. Cô không chỉ chú trọng đến việc giúp học sinh nắm vững kiến thức mà còn khuyến khích tư duy sáng tạo và phát triển kỹ năng mềm. Với phong cách giảng dạy gần gũi, cô luôn tạo ra môi trường học tập tích cực, giúp học sinh tự tin và yêu thích môn học."
                  value={portfolios.bio}
                  onChange={handlePortfolioChange}
                />
              </div>

              <div className="col-span-2">
                <Label
                  className="mb-2 block"
                  htmlFor="teaching_philosophy"
                  value="Triết lý giảng dạy"
                />
                <Textarea
                  id="teaching_philosophy"
                  name="teaching_philosophy"
                  rows={3}
                  placeholder="Chú trọng rèn luyện kĩ năng, bám sát cấu trúc đề thi, giúp học sinh viết nhanh, đúng chuẩn và sáng tạo."
                  value={portfolios.teaching_philosophy}
                  onChange={handlePortfolioChange}
                />
              </div>
              <div className="col-span-2">
                <Label
                  htmlFor="dropzone-file"
                  className="mb-2 block"
                  value="Ảnh bìa"
                />
                <div className="flex justify-center">
                  <Label
                    className={`flex flex-1 h-64 w-full cursor-pointer flex-col items-center justify-center ${!heroImage ? 'rounded-lg' : 'rounded-l-lg'} border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                  >
                    {!heroImage ? (
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <Icon
                          icon="fa-solid:images"
                          width={24}
                          className="mb-4 text-gray-500 dark:text-gray-400"
                        />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            Nhấn hoặc kéo thả ảnh vào đây để tải ảnh lên
                          </span>
                        </p>
                        <p className="text-xs italic text-gray-500 dark:text-gray-400">
                          {'(Ảnh có kích cỡ tối đa 5MB.)'}
                        </p>
                      </div>
                    ) : (
                      <img
                        id="show-hero-image-img"
                        src=""
                        alt=""
                        className="h-[15.75rem] object-contain"
                      />
                    )}
                    <FileInput
                      id="hero_image"
                      name="hero_image"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) {
                          const img = document.getElementById(
                            'show-hero-image-img'
                          );
                          img.classList.add('hidden');
                          const div = document.getElementById(
                            'show-hero-image-delete'
                          );
                          div.classList.add('hidden');
                          setHeroImage(null);
                        } else if (file.size > 5 * 1024 * 1024) {
                          notify(
                            'Kích cỡ ảnh không được vượt quá 5MB',
                            'error'
                          );
                        } else {
                          reader.onload = (e) => {
                            const img = document.getElementById(
                              'show-hero-image-img'
                            ) as HTMLImageElement;
                            console.log(img);
                            img.src = e.target.result as string;
                            img.classList.remove('hidden');
                            const div = document.getElementById(
                              'show-hero-image-delete'
                            );
                            div.classList.remove('hidden');
                          };
                          reader.readAsDataURL(file);
                          setHeroImage(file);
                        }
                      }}
                    />
                  </Label>
                  <div
                    id="show-hero-image-delete"
                    className="hidden cursor-pointer h-[15.75rem] bg-red-500 w-8 rounded-r-lg flex items-center justify-center"
                    onClick={(e) => {
                      const img = document.getElementById(
                        'show-hero-image-img'
                      );
                      img.classList.add('hidden');
                      const div = document.getElementById(
                        'show-hero-image-delete'
                      );
                      div.classList.add('hidden');
                      setHeroImage(null);
                    }}
                  >
                    <Icon
                      icon="solar:trash-bin-trash-bold"
                      width={24}
                      color="white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel data-accordion="open">
          <Accordion.Title className="border-0 focus:outline-none focus:ring-0">
            Mốc thời gian sự nghiệp
          </Accordion.Title>
          <Accordion.Content>
            {portfolios.career.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg shadow-md flex items-stretch gap-4 mt-3"
              >
                <div className="grid grid-cols-1 gap-4 flex-1 ml-3 my-3">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-1 items-center gap-4">
                      <span className="font-medium text-black">Từ năm</span>
                      <Select
                        className="flex-1"
                        required
                        value={item.start_year}
                        onChange={(e) =>
                          handleCareerChange(
                            index,
                            'start_year',
                            e.target.value
                          )
                        }
                      >
                        {[
                          <option key="" value="">
                            ---
                          </option>,
                          ...Array.from({ length: 75 }, (_, i) => (
                            <option
                              key={new Date().getFullYear() - i}
                              value={new Date().getFullYear() - i}
                            >
                              {new Date().getFullYear() - i}
                            </option>
                          )),
                        ]}
                      </Select>
                      <span className="font-medium text-black">đến năm</span>
                      <Select
                        className="flex-1"
                        required
                        value={item.end_year}
                        onChange={(e) =>
                          handleCareerChange(index, 'end_year', e.target.value)
                        }
                      >
                        {[
                          <option key="" value="">
                            ---
                          </option>,
                          ...Array.from({ length: 75 }, (_, i) => (
                            <option
                              key={new Date().getFullYear() - i}
                              value={new Date().getFullYear() - i}
                            >
                              {new Date().getFullYear() - i}
                            </option>
                          )),
                        ]}
                      </Select>
                      <span className="font-medium text-black">tại</span>
                    </div>
                    <TextInput
                      className="flex-1"
                      placeholder="Trường"
                      value={item.school}
                      onChange={(e) =>
                        handleCareerChange(index, 'school', e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-medium text-black">với vai trò</span>
                    <Select
                      className="flex-1"
                      required
                      value={item.role}
                      onChange={(e) =>
                        handleCareerChange(index, 'role', e.target.value)
                      }
                    >
                      <option value="">---</option>
                      <option value="Sinh viên">Sinh viên</option>
                      <option value="Học viên">Học viên</option>
                      <option value="Trợ giảng">Trợ giảng</option>
                      <option value="Giáo viên">Giáo viên</option>
                    </Select>
                  </div>
                  <Textarea
                    className="flex-1"
                    placeholder="Mô tả (nếu có)"
                    rows={3}
                    value={item.desc}
                    onChange={(e) =>
                      handleCareerChange(index, 'desc', e.target.value)
                    }
                  />
                </div>
                <div
                  className="cursor-pointer bg-red-500 w-[5%] rounded-r-lg flex items-center justify-center"
                  onClick={() => removeCareer(index)}
                >
                  <Icon
                    icon="solar:trash-bin-trash-bold"
                    width={24}
                    color="white"
                  />
                </div>
              </div>
            ))}
            <Button
              color="primary"
              type="submit"
              onClick={addCareer}
              className="w-full mt-2"
            >
              Thêm sự nghiệp
            </Button>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel data-accordion="open">
          <Accordion.Title className="border-0 focus:outline-none focus:ring-0">
            Thành tích & Giải thưởng
          </Accordion.Title>
          <Accordion.Content>
            {portfolios.achievements.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-md flex items-center gap-4 mt-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <TextInput
                    placeholder="Tên giải thưởng"
                    value={item.name}
                    onChange={(e) =>
                      handleAchievementChange(index, 'name', e.target.value)
                    }
                  />

                  <TextInput
                    placeholder="Mô tả"
                    value={item.desc}
                    onChange={(e) =>
                      handleAchievementChange(index, 'desc', e.target.value)
                    }
                  />
                </div>

                <Button
                  onClick={() => removeAchievement(index)}
                  color="failure"
                >
                  <Icon icon="solar:trash-bin-trash-bold" width={20} />
                </Button>
              </div>
            ))}

            <Button
              color="primary"
              type="button"
              onClick={addAchievement}
              className="w-full mt-2"
            >
              Thêm thành tích
            </Button>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel data-accordion="open">
          <Accordion.Title className="border-0 focus:outline-none focus:ring-0">
            Hình ảnh của tôi
          </Accordion.Title>
          <Accordion.Content>
            <Label className="mb-2 block" value="Tải ảnh lên (tối đa 15 ảnh)" />

            <div className="flex justify-center">
              <Label className="flex flex-1 h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <Icon
                    icon="fa-solid:images"
                    width={24}
                    className="mb-4 text-gray-500 dark:text-gray-400"
                  />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">
                      Nhấn hoặc kéo thả ảnh vào đây
                    </span>
                  </p>
                  <p className="text-xs italic text-gray-500 dark:text-gray-400">
                    (Tối đa 15 ảnh, dung lượng tối đa 5MB mỗi ảnh)
                  </p>
                </div>

                <FileInput
                  id="gallery"
                  name="gallery"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length + galleryImages.length > 15) {
                      notify('Bạn chỉ có thể tải lên tối đa 15 ảnh', 'error');
                      return;
                    }

                    const validFiles = files.filter(
                      (file) => file.size <= 5 * 1024 * 1024
                    );
                    if (validFiles.length !== files.length) {
                      notify('Một số ảnh vượt quá dung lượng 5MB', 'error');
                    }

                    setGalleryImages((prev) => [...prev, ...validFiles]);
                  }}
                />
              </Label>
            </div>

            {galleryImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {galleryImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(src)}
                      className="h-auto w-full object-cover rounded-lg"
                      alt={`gallery-${index}`}
                    />
                    {/* <button
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setGalleryImages(galleryImages.filter((_, i) => i !== index));
                      }}
                    >
                      <Icon icon="solar:trash-bin-trash-bold" width={18} />
                    </button> */}
                  </div>
                ))}
              </div>
            )}

            {/* Remove all images button */}
            {galleryImages.length > 0 && (
              <Button
                color="danger"
                className="w-full mt-4 bg-bg-color-danger"
                onClick={() => setGalleryImages([])}
              >
                Xóa tất cả ảnh
              </Button>
            )}
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
