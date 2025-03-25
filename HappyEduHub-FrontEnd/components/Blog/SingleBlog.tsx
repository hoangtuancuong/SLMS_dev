'use client';
import { Blog } from '@/types/blog';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const SingleBlog = ({ blog }: { blog: Blog }) => {
  const { id, title, thumbnail_url, content, author } = blog;
  const [imageSrc, setImageSrc] = useState('/images/default.png');
  const [avatarSrc, setAvatarSrc] = useState('/images/default.png');

  useEffect(() => {
    setImageSrc(getValidImageSrc(thumbnail_url));
    setAvatarSrc(getValidImageSrc(author?.avatar_url));
  }, [thumbnail_url, author?.avatar_url]);
  const getValidImageSrc = (url: string | undefined) => {
    if (!url) return '/images/default.png';
    return url.startsWith('http') || url.startsWith('/')
      ? url
      : '/images/default.png';
  };
  const truncatedContent = (text: string, limit: number) => {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const cleanContent = truncatedContent(title, 20);
  const myLoader = ({ src }) => {
    return src;
  };
  return (
    <div
      className="wow fadeInUp hover:shadow-two dark:hover:shadow-gray-dark group relative overflow-hidden rounded-sm bg-white shadow-one duration-300 dark:bg-dark"
      data-wow-delay=".1s"
    >
      <Link
        href={`/pages/blog-details/${id}`}
        className="relative block aspect-[37/22] w-full"
      >
        <Image
          src={imageSrc}
          loader={myLoader}
          alt={title}
          fill
          className="object-cover"
          onError={() => setImageSrc('/images/default.png')}
        />
      </Link>
      <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
        <h3>
          <Link
            href={`/pages/blog-details/${id}`}
            className="mb-4 block text-xl font-bold text-black hover:text-primary dark:text-white dark:hover:text-primary sm:text-2xl"
          >
            {cleanContent}
          </Link>
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={avatarSrc}
                  loader={myLoader}
                  alt={author.name}
                  fill
                  onError={() => setAvatarSrc('/images/default.png')}
                />
              </div>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-medium text-dark dark:text-white">
                {author.name}
              </h4>
              <p className="text-xs text-body-color">{author.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;
