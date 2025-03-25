'use client';
import { useEffect, useState } from 'react';
import { notify } from '@/components/Alert/Alert';
import {
  loginFailure,
  loginRequest,
  loginSuccess,
} from '@/app/libs/features/authSlice';
import { useDispatch } from 'react-redux';
import { callApi } from '@/app/utils/api';
import { useRouter } from 'next/navigation';
import { getCurrentUserRole, getUserData } from '@/app/utils/utils';
import { RoleType } from '@/app/utils/constant';
import BlogSpinner from '@/app/admin/components/dashboard/BlogSpinner';
import { Spinner } from 'flowbite-react';

export default function SigninForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (isRedirecting) return;

    const role = getCurrentUserRole();

    setIsRedirecting(true);
    switch (role) {
      case RoleType.STUDENT:
        router.replace('/admin/ui/student/dashboard');
        break;
      case RoleType.TEACHER:
      case RoleType.ACADEMIC_AFFAIR:
        router.replace('/admin/ui/teacher/dashboard');
        break;
      case RoleType.ADMIN:
        router.replace('/admin/');
        break;
      default:
        router.replace('/pages/signin');
    }
  }, [router, isRedirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginRequest());
    setIsAuthenticating(true);

    try {
      const response = await callApi('login', 'POST', { email, password });
      const data = response;

      if (data.token) {
        dispatch(
          loginSuccess({
            token: data.token,
            user: data.data,
          })
        );

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));

        router.push('/admin');
      } else {
        throw new Error('Login failed');
      }
    } catch (err) {
      dispatch(loginFailure('Login failed'));
      notify('Đăng nhập thất bại', 'error');
    } finally {
      setIsAuthenticating(false)
    }
  };

  const user = getUserData();

  return (
    <form onSubmit={handleSubmit}>
      <BlogSpinner isLoading={isAuthenticating}></BlogSpinner>
      <div className="mb-8">
        <label
          htmlFor="email"
          className="mb-3 block text-sm text-dark dark:text-white"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email của bạn"
          className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
        />
      </div>
      <div className="mb-8">
        <label
          htmlFor="password"
          className="mb-3 block text-sm text-dark dark:text-white"
        >
          Mật khẩu
        </label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu của bạn"
          className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
        />
      </div>
      {/* <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
        <div className="mb-4 sm:mb-0">
        </div>
        <div>
          <a
            href="#0"
            className="text-sm font-medium text-primary hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
      </div> */}
      <div className="mb-6">
        <button className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-sm bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
          Đăng nhập
          {
            ((user)?(<Spinner></Spinner>):(""))
          }
        </button>
      </div>
    </form>
  );
}
