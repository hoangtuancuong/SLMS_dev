'use client';

import { processGoogleDriveLink } from '@/app/utils/utils';
import { useState } from 'react';

export const TeacherAnchor = (props: {
  teacher: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}) => {
  const [error, setError] = useState<boolean>(false);

  return props.teacher ? (
    <a
      href={`https://profile.SLMS.vn/index.html?id=${props.teacher.id}`}
      target="_blank"
      className="flex items-center gap-1 hover:underline"
    >
      <img
        src={
          !error
            ? processGoogleDriveLink(props.teacher.avatar_url)
            : '/images/default.png'
        }
        alt={props.teacher.name}
        className="w-6 h-6 rounded-full mr-1"
        onError={() => setError(true)}
      />
      <span className="text-sm text-gray-500">{props.teacher.name}</span>
    </a>
  ) : (
    <></>
  );
};
