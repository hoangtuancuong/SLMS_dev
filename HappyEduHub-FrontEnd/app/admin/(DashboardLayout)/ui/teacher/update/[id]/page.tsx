'use client';

import React, { useState } from 'react';
import UpdateForm from '../../../teacher/update/[id]/UpdateForm';

const page = ({ params }: { params: { id: string } }) => {
  return (
    <>
      <UpdateForm id={params.id}></UpdateForm>
    </>
  );
};

export default page;
