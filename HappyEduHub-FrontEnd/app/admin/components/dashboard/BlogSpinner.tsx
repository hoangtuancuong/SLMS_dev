import React, { useState, useEffect } from 'react';
import { Spinner } from 'flowbite-react';

const BlogSpinner = ({ isLoading }) => {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLoading]);

  if (!isLoading) {
    return <></>;
  } else
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <Spinner aria-label="Loading spinner" size="xl" color="info" />
      </div>
    );
};

export default BlogSpinner;
