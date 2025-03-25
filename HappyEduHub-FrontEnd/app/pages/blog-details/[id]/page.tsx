'use client';

import React, { useState } from 'react';
import BlogDetailsPage from '../pageDetail';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <BlogDetailsPage id={params.id}></BlogDetailsPage>
    </>
  );
};

export default page;
