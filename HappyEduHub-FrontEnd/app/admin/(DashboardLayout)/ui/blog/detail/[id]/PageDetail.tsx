'use client';

import { callApi } from '@/app/utils/api';
import { formattedDate, processGoogleDriveLink } from '@/app/utils/utils';
import { notify } from '@/components/Alert/Alert';
import { Badge } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DetailForm = ({ id }: { id: string }) => {
  const getBadgeInfo = (type: string) => {
    switch (type) {
      case 'POST':
        return 'Bài viết';
      case 'DOCUMENT':
        return 'Tài liệu';
      default:
        return 'Không xác định';
    }
  };
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'POST':
        return 'warning';
      case 'DOCUMENT':
        return 'secondary';
      default:
        return 'error';
    }
  };

  const [isLoading, setLoading] = useState(false);
  const [blog, setBlog] = useState<any>(null);
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState('/images/default.png');
  const myLoader = ({ src }: { src: string }) => src;

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      let response: any;
      try {
        setLoading(true);
        response = await callApi(`blogs/${id}`, 'GET');
        setBlog(response);
        if (response?.thumbnail_url) {
          setImageSrc(response.thumbnail_url);
        }
      } catch (error) {
        notify('Lỗi khi tải dữ liệu bài viết', 'error');
      } finally {
        document.getElementById('content')!.innerHTML = response?.content;
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col rounded-lg shadow-md bg-white dark:bg-darkgray w-full">
      <div className="relative">
        <img
          src={
            imageSrc == '/images/default.png'
              ? imageSrc
              : processGoogleDriveLink(imageSrc)
          }
          alt="Thumbnail"
          className="rounded-lg w-full h-96 object-cover"
          style={{
            maskImage:
              'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)',
          }}
          onError={() => {
            setImageSrc('/images/default.png');
          }}
        />
        <div className="absolute bottom-0 right-0 flex items-center justify-center gap-2 m-2">
          <Badge
            size={'sm'}
            color={`light${getBadgeColor(blog?.type)}`}
            className={`text-${getBadgeColor(blog?.type)} border-2 border-${getBadgeColor(blog?.type)} font-bold text-md py-1`}
          >
            {getBadgeInfo(blog?.type)}
          </Badge>
          <Badge
            size={'sm'}
            color={`light${blog?.is_approved ? 'success' : 'error'}`}
            className={`text-${blog?.is_approved ? 'success' : 'error'} border-2 border-${blog?.is_approve ? 'success' : 'error'} font-bold text-md py-1`}
          >
            {blog?.is_approved ? 'Đã duyệt' : 'Chưa duyệt'}
          </Badge>
        </div>
      </div>
      <h1 className={`text-4xl font-bold mx-4 mt-4`}>{blog?.title}</h1>
      <h3 className="text-sm text-gray-500 mx-4">
        {blog?.author.name + ' - ' + formattedDate(blog?.created_at)}
      </h3>
      <div id="content" className="mt-6 mb-1 mx-4"></div>
    </div>
  );
};

export default DetailForm;
