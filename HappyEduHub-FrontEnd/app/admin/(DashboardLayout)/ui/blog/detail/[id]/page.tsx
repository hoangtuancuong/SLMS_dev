'use client';

import React, { useState } from 'react';
import DetailPage from './PageDetail';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <DetailPage id={params.id}></DetailPage>
    </>
  );
};

export default page;
