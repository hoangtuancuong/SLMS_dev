'use client';

import React, { useState } from 'react';
import StudentProfilePage from './StudentProfilePage';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <StudentProfilePage id={params.id}></StudentProfilePage>
    </>
  );
};

export default page;
