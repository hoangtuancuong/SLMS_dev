import Link from 'next/link';
import { Icon } from '@iconify/react';

const Header2 = ({ icon, title, buttons = [] }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h5 className="card-title text-xl font-bold flex items-center gap-2">
        {icon && <Icon icon={icon} width={24} />}
        {title}
      </h5>
      <div className="flex items-center gap-3">
        {buttons.map((button, index) => (
          <Link
            key={index}
            href={button.link}
            onClick={button.onClick}
            className={`bg-${button.color || 'primary'} hover:bg-${button.color || 'primary'}-dark text-white text-sm px-4 py-2 rounded-md transition flex items-center gap-2 hover:shadow-md hover:shadow-${button.shadowColor || 'blue'}-200 group`}
          >
            {button.icon && (
              <Icon
                icon={button.icon}
                width={20}
                className="transition-transform group-hover:rotate-90"
              />
            )}
            {button.text}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Header2;
