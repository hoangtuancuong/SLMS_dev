'use client';
import React from 'react';
import SharePost from '@/components/Blog/SharePost';
import { useEffect, useState, useRef } from 'react';
import { callApi } from '@/app/utils/api';
import { notify } from '@/components/Alert/Alert';
import Image from 'next/image';
import Breadcrumb from '@/components/Common/Breadcrumb';
import { avatarClasses } from '@mui/material';

const BlogDetailsPage = ({ id }) => {
  const [isLoading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);
  const [imageSrc, setImageSrc] = useState('/images/default.png');
  const [avatarSrc, setAvatarSrc] = useState('/images/default.png');
  const myLoader = ({ src }: { src: string }) => src;

  const fetched = useRef(false);

  useEffect(() => {
    if (!id || fetched.current) return;
    fetched.current = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await callApi(`blogs/${id}`, 'GET');
        setBlog(response);
        setImageSrc(
          blog?.thumbnail_url.startsWith('http') ||
            blog?.thumbnail_url.startsWith('/')
            ? blog?.thumbnail_url
            : '/images/default.png'
        );
        setAvatarSrc(
          blog?.author?.avatar_url.startsWith('http') ||
            blog?.author?.avatar_url.startsWith('/')
            ? blog?.author?.avatar_url
            : '/images/default.png'
        );
      } catch (error) {
        notify('Lỗi khi tải dữ liệu bài viết', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">Đang tải...</div>
      </div>
    );

  if (!blog) return null;

  return (
    <>
      <Breadcrumb pageName="" description="" />
      <article className="max-w-4xl mx-auto justify-between px-6 pt-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{blog.title}</h1>

        <div className="flex items-center gap-8 mb-12 text-gray-600">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm"> Tác giả bài viết:</p>
            </div>
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={avatarSrc}
                loader={myLoader}
                alt={blog.author.avatar_url}
                fill
                onError={() => setAvatarSrc('/images/default.png')}
              />
            </div>
            <div>
              <p className=" font-bold text-black"> {blog.author.name}</p>
            </div>
          </div>

          <div className="ml-auto flex items-end gap-4">
            <time className="text-sm">
              {' '}
              Ngày tạo: {formatDate(blog.created_at)}
            </time>
          </div>
        </div>

        {
          <div className="relative w-full h-[480px] mb-12 rounded-xl overflow-hidden">
            <Image
              src={imageSrc}
              alt={blog.title}
              fill
              loader={myLoader}
              className="object-cover"
              onError={() => setImageSrc('/images/default.png')}
            />
          </div>
        }

        <div className="prose max-w-none mb-12">
          <div
            className="text-gray-700 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        <div className="py-8 border-t border-gray-200">
          <SharePost />
        </div>
      </article>
    </>
  );
};

export default BlogDetailsPage;
