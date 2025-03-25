import { logout } from '@/app/libs/features/authSlice';
import { useDispatch } from 'react-redux';

export default function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(logout());
    window.location.href = '/pages';
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-sm bg-red-500 px-2 py-2 text-base font-medium text-white transition duration-300 hover:bg-red-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="#fff"
          d="M6 2h9a2 2 0 0 1 2 2v2h-2V4H6v16h9v-2h2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2"
        />
        <path
          fill="#fff"
          d="M16.09 15.59L17.5 17l5-5l-5-5l-1.41 1.41L18.67 11H9v2h9.67z"
        />
      </svg>
    </button>
  );
}
