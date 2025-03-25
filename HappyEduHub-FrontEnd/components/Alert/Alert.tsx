import {
  toast,
  ToastContainer,
  ToastOptions,
  TypeOptions,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { createRoot } from 'react-dom/client'; // Thêm dòng này

interface NotificationProps {
  message: string;
  severity: TypeOptions;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  severity,
  duration = 3000,
}) => {
  React.useEffect(() => {
    const options: ToastOptions = {
      type: severity,
      autoClose: duration,
      position: 'bottom-right',
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };
    toast(message, options);
  }, [message, severity, duration]);

  return <ToastContainer />;
};

export function notify(
  message: string,
  severity: TypeOptions,
  duration?: number
) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const root = createRoot(container);

  root.render(
    <Notification message={message} severity={severity} duration={duration} />
  );

  setTimeout(() => {
    root.unmount();
    document.body.removeChild(container);
  }, duration || 3000);
}

export default Notification;
