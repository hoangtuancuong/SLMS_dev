'use client';

import React, { useState } from 'react';
import TeacherProfilePage from './TeacherProfilePage';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <TeacherProfilePage id={params.id}></TeacherProfilePage>
    </>
  );
};

export default page;
