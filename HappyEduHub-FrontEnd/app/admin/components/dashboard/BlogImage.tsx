import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';

const BlogImage = ({ thumbnail_url, title }) => {
  const [isLoading, setLoading] = useState(true);

  const [imageSrc, setImageSrc] = useState(
    thumbnail_url?.startsWith('http') || thumbnail_url?.startsWith('/')
      ? thumbnail_url
      : '/images/default.png'
  );

  const myLoader = ({ src }) => {
    return src;
  };

  useEffect(() => {
    if (thumbnail_url) {
      setImageSrc(
        thumbnail_url.startsWith('http') || thumbnail_url.startsWith('/')
          ? thumbnail_url
          : '/images/default.png'
      );
    }
  }, [thumbnail_url]);
  return (
    <>
      {' '}
      <BlogSpinner isLoading={isLoading} />
      <Image
        width={50}
        height={50}
        src={imageSrc}
        alt={title || 'Thumbnail'}
        loader={myLoader}
        className="h-[60px] w-[60px] rounded-md"
        onLoad={() => setLoading(false)}
        onError={() => {
          setImageSrc('/images/default.png');
          setLoading(false);
        }}
      />
    </>
  );
};

export default BlogImage;
