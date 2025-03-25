'use client';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import Header from '@/app/admin/components/dashboard/Header';
import RequiredStar from '@/app/admin/components/dashboard/RequiredStar';
import useForm from '@/app/hooks/useForm';
import { callApi } from '@/app/utils/api';
import { processGoogleDriveLink, uploadFile } from '@/app/utils/utils';
import { notify } from '@/components/Alert/Alert';
import { Icon } from '@iconify/react';
import { Button, FileInput, Label, Select, TextInput } from 'flowbite-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const UpdateForm = ({ id }: { id: String }) => {
  const [thumbFile, setThumbFile] = useState(null);

  const [isLoading, setLoading] = useState(false);
  const { values, handleChange, resetForm, setValues } = useForm({
    title: '',
    thumb: '',
    content: '',
    type: '',
  });
  const [imageSrc, setImageSrc] = useState(
    values?.thumbnail_url?.startsWith('http') ||
      values?.thumbnail_urll?.startsWith('/')
      ? values?.thumbnail_url
      : '/images/default.png'
  );
  const myLoader = ({ src }) => {
    return src;
  };

  // Fetch bài viết từ API khi `id` thay đổi
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await callApi(`blogs/${id}`, 'GET');
        setValues({
          title: response.title || '',
          thumb: response.thumbnail_url || '',
          content: response.content || '',
          type: response.type || '',
        });
      } catch (error) {
        notify('Lỗi khi tải dữ liệu bài viết', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Xử lý sự kiện thay đổi nội dung bài viết
  const handleEditorChange = (value: string) => {
    setValues((prev) => ({
      ...prev,
      content: value,
    }));
  };

  // Xử lý submit cập nhật bài viết
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let response;
    if (thumbFile) {
      response = await uploadFile(thumbFile);
      if (!response) throw new Error('Lỗi khi upload ảnh thumbnail');
    }

    if (!values.title.trim() || !values.content.trim() || !values.type.trim()) {
      notify('Vui lòng điền đầy đủ thông tin!', 'warning');
      return;
    }

    const body: any = {
      title: values.title.trim(),
      content: values.content.trim(),
      type: values.type.trim(),
    };
    if (response) {
      body.thumbnail_url = response.web_view_link;
    }

    try {
      setLoading(true);
      await callApi(`blogs/${id}`, 'PUT', body);
      notify('Cập nhật bài viết thành công', 'success');
      window.location.href = '/admin/ui/blog';
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      notify(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg shadow-md bg-white dark:bg-darkgray p-6 w-full"
    >
      <BlogSpinner isLoading={isLoading} />
      <Header
        icon="solar:document-bold"
        title="Chỉnh sửa bài viết"
        showButton={false}
        buttonIcon={undefined}
        buttonText={undefined}
        buttonLink={undefined}
      />

      <div className="flex flex-col">
        <div className="flex gap-6 items-stretch">
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <div className="flex">
                <Label htmlFor="title" value="Tiêu đề" className="mb-2 block" />
                <RequiredStar />
              </div>
              <TextInput
                id="title"
                name="title"
                type="text"
                placeholder="Nhập tiêu đề bài viết"
                value={values.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <div className="flex">
                <Label
                  htmlFor="type"
                  value="Loại bài viết"
                  className="mb-2 block"
                />
                <RequiredStar />
              </div>
              <Select
                id="type"
                name="type"
                value={values.type}
                onChange={handleChange}
                required
              >
                <option value="">---</option>
                <option value="POST">Bài viết</option>
                <option value="DOCUMENT">Tài liệu</option>
              </Select>
            </div>
          </div>
          <div className="flex-1">
            {/* <Label htmlFor="thumb" value="Thumbnail" className="mb-2 block" />
            <TextInput
              id="thumb"
              name="thumb"
              type="text"
              placeholder="Nhập link thumbnail"
              value={values.thumb}
              onChange={handleChange}
            /> */}

            <div className="flex flex-col justify-center">
              <Label htmlFor="thumb" value="Thumbnail" className="mb-2 block" />
              <div className="flex">
                <Label
                  className={`${!thumbFile && !values.thumb ? 'rounded-lg' : 'rounded-l-lg'} h-full flex flex-1 w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
                >
                  {!thumbFile && !values.thumb && (
                    <div className="flex flex-col items-center justify-center h-32">
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
                        {'(Ảnh có kích cỡ tối đa 5MB.)'}
                      </p>
                    </div>
                  )}
                  {(thumbFile || values.thumb) && (
                    <div className="flex w-full justify-between items-center h-32">
                      <img
                        src={
                          thumbFile
                            ? URL.createObjectURL(thumbFile)
                            : processGoogleDriveLink(values.thumb)
                        }
                        className="ml-6 w-5/6 h-5/6 object-contain"
                        alt="Thumbnail"
                      />
                    </div>
                  )}
                  <FileInput
                    id="thumb"
                    name="thumb"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) {
                        setThumbFile(null);
                      } else if (file.size > 5 * 1024 * 1024) {
                        notify('Kích cỡ ảnh không được vượt quá 5MB', 'error');
                      } else {
                        setThumbFile(file);
                      }
                    }}
                  />
                </Label>
                {(thumbFile || values.thumb) && (
                  <div
                    className="cursor-pointer self-stretch bg-red-500 w-8 rounded-r-lg flex items-center justify-center"
                    onClick={(e) => {
                      if (thumbFile) {
                        setThumbFile(null);
                      } else if (values.thumb) {
                        setValues({
                          ...values,
                          thumb: '',
                        });
                      }
                    }}
                  >
                    <Icon
                      icon="solar:trash-bin-trash-bold"
                      width={24}
                      color="white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <div className="flex">
            <Label
              htmlFor="content"
              value="Nội dung bài viết"
              className="mb-2 block"
            />
            <RequiredStar />
          </div>
          <ReactQuill
            theme="snow"
            value={values.content}
            onChange={handleEditorChange}
            className="overflow-y-auto"
            placeholder="Nhập nội dung bài viết..."
          />
        </div>

        <div className="flex gap-3">
          <Button color="primary" type="submit">
            Lưu bài viết
          </Button>
          <Button color="gray" type="button" onClick={resetForm}>
            Xoá form
          </Button>
        </div>
      </div>
    </form>
  );
};

export default UpdateForm;
