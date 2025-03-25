'use client';

import {  Step, StepLabel, Stepper } from '@mui/material';
import { useState } from 'react';
import { Button, Datepicker, Label, Radio, TextInput } from 'flowbite-react';
import { notify } from '@/components/Alert/Alert';
import { callApi } from '@/app/utils/api';
import { formattedDate } from '@/app/utils/utils';
import { useRouter } from 'next/navigation';

export const SignupPage = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    address: '',
    first_contact_name: '',
    first_contact_tel: '',
    second_contact_name: '',
    second_contact_tel: '',
    cccd: '',
    school: '',
    class: '',
  });

  const handleNext = async () => {
    if (activeStep === 0) {
      if (
        formData.email === '' ||
        formData.password === '' ||
        confirmPassword === ''
      ) {
        notify('Vui lòng nhập đầy đủ thông tin', 'error', null);
        return;
      }
      if (formData.password !== confirmPassword) {
        notify('Mật khẩu không khớp', 'error', null);
        return;
      }
    }
    if (activeStep === 1) {
      if (
        formData.name === '' ||
        formData.gender === '' ||
        formData.date_of_birth === ''
      ) {
        notify('Vui lòng nhập đầy đủ thông tin', 'error', null);
        return;
      }
    }
    if (activeStep === 2) {
      if (
        formData.first_contact_name === '' ||
        formData.first_contact_tel === ''
      ) {
        notify('Vui lòng nhập đầy đủ thông tin', 'error', null);
        return;
      }
      try {
        await callApi('user', 'POST', formData);
      } catch (error) {
        notify(error.message || 'Đăng ký thất bại', 'error', null);
        return;
      }
    }

    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden py-36">
        <div className="container">
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="shadow-three mx-auto rounded-lg max-w-[900px]  bg-white px-10 py-10 dark:bg-dark">
                <h3 className="mb-6 mx-auto text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                  Đăng ký tài khoản học sinh
                </h3>
                <Stepper activeStep={activeStep}>
                  <Step>
                    <StepLabel>
                      <span>Thông tin tài khoản</span>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <span>Thông tin cá nhân</span>
                    </StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>
                      <span>Thông tin khác</span>
                    </StepLabel>
                  </Step>
                </Stepper>

                {activeStep === 0 && (
                  <div className="flex gap-4 flex-col my-8">
                    <div>
                      <Label className="text-sm" htmlFor="username">
                        Tên tài khoản <span className="text-red-500">*</span>
                      </Label>
                      <div className="h-1"></div>
                      <TextInput
                        id="username"
                        name="username"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="happyeduhub@example.com"
                      />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="password">
                        Mật khẩu <span className="text-red-500">*</span>
                      </Label>
                      <div className="h-1"></div>
                      <TextInput
                        id="password"
                        name="password"
                        required
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Mật khẩu"
                      />
                    </div>
                    <div>
                      <Label className="text-sm" htmlFor="confirm-password">
                        Xác nhận mật khẩu{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="h-1"></div>
                      <TextInput
                        id="confirm-password"
                        name="confirm-password"
                        required
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="flex flex-col gap-4 my-8">
                    <div className="flex gap-6 items-center">
                      <div className="w-1/2">
                        <Label className="text-sm" htmlFor="fullname">
                          Họ và tên <span className="text-red-500">*</span>
                        </Label>
                        <div className=" h-1"></div>
                        <TextInput
                          id="fullname"
                          name="fullname"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div className="w-1/2 -mb-6">
                        <div className="flex gap-2 items-center">
                          <Label className="text-sm" htmlFor="gender">
                            Giới tính <span className="text-red-500">*</span>
                          </Label>
                          <Radio
                            id="gender"
                            checked={formData.gender === 'MALE'}
                            name="MALE"
                            required
                            value={'MALE'}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                          />
                          <span>Nam</span>
                          <Radio
                            id="gender"
                            checked={formData.gender === 'FEMALE'}
                            name="FEMALE"
                            required
                            value={'FEMALE'}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                gender: e.target.value,
                              })
                            }
                          />
                          <span>Nữ</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-6 items-center">
                      <div className="w-1/2">
                        <Label className="text-sm" htmlFor="dob">
                          Ngày sinh <span className="text-red-500">*</span>
                        </Label>
                        <div className="h-1"></div>
                        <Datepicker
                          id="dob"
                          name="dob"
                          language="vi"
                          required
                          value={
                            formData.date_of_birth
                              ? formattedDate(formData.date_of_birth)
                              : 'Chọn ngày sinh'
                          }
                          onSelectedDateChanged={(date) =>
                            setFormData({
                              ...formData,
                              date_of_birth: date.toISOString(),
                            })
                          }
                        />
                      </div>
                      <div className="w-1/2">
                        <Label className="text-sm" htmlFor="phone">
                          Số điện thoại
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="phone"
                          name="phone"
                          value={formData.phone_number}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone_number: e.target.value,
                            })
                          }
                          placeholder="0123456789"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm mb-2" htmlFor="address">
                        Địa chỉ
                      </Label>
                      <div className="h-1"></div>
                      <TextInput
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                        placeholder="58 Đà Nẵng, Hải Phòng"
                      />
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="flex gap-4 flex-col my-8">
                    <div className="flex gap-6">
                      <div className="w-1/2">
                        <Label className="text-sm" htmlFor="contact1">
                          Tên liên lạc 1 <span className="text-red-500">*</span>
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="contact1"
                          name="contact1"
                          required
                          value={formData.first_contact_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_contact_name: e.target.value,
                            })
                          }
                          placeholder="happyeduhub@example.com"
                        />
                      </div>
                      <div className="w-1/2">
                        <Label className="text-sm" htmlFor="tel1">
                          Số điện thoại 1{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="tel1"
                          name="tel1"
                          required
                          value={formData.first_contact_tel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              first_contact_tel: e.target.value,
                            })
                          }
                          placeholder="0123456789"
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-1/2">
                        <Label className="text-sm" htmlFor="contact2">
                          Tên liên lạc 2
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="contact2"
                          name="contact2"
                          required
                          value={formData.second_contact_name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              second_contact_name: e.target.value,
                            })
                          }
                          placeholder="happyeduhub@example.com"
                        />
                      </div>
                      <div className="w-1/2">
                        <Label className="text-sm" htmlFor="tel2">
                          Số điện thoại 2
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="tel2"
                          name="tel2"
                          required
                          value={formData.second_contact_tel}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              second_contact_tel: e.target.value,
                            })
                          }
                          placeholder="0123456789"
                        />
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-2/5">
                        <Label className="text-sm" htmlFor="cccd">
                          Số CCCD
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="cccd"
                          name="cccd"
                          required
                          value={formData.cccd}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cccd: e.target.value,
                            })
                          }
                          placeholder="010101010101"
                        />
                      </div>
                      <div className="w-2/5">
                        <Label className="text-sm" htmlFor="school">
                          Trường
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="school"
                          name="school"
                          required
                          value={formData.school}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              school: e.target.value,
                            })
                          }
                          placeholder="0123456789"
                        />
                      </div>
                      <div className="w-1/5">
                        <Label className="text-sm" htmlFor="class">
                          Lớp
                        </Label>
                        <div className="h-1"></div>
                        <TextInput
                          id="class"
                          name="class"
                          required
                          value={formData.class}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              class: e.target.value,
                            })
                          }
                          placeholder="8C"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="flex flex-col gap-2 items-center pt-6">
                    <h3 className="text-2xl font-bold">Đăng ký thành công</h3>
                    <p className="text-gray-500">
                      Bạn đã đăng ký thành công tài khoản học sinh của mình.
                    </p>
                    <div className="h-2"></div>
                    <Button color="info" className="w-48 font-medium" onClick={() => router.push('/pages/signin')}>
                      Đăng nhập ngay
                    </Button>
                  </div>
                )}

                {activeStep !== 3 && (
                  <>
                    <Button
                      color="transparent"
                      className="w-32 font-medium"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Quay lại
                    </Button>
                    <Button
                      color="info"
                      className="w-32 font-medium"
                      onClick={handleNext}
                    >
                      {activeStep === 2 ? 'Đăng ký' : 'Tiếp theo'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: 'alpha' }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default SignupPage;
