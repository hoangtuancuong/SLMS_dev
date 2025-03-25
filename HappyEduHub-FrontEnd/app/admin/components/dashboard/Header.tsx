import Link from 'next/link';
import { Icon } from '@iconify/react';

const Header = (props) => {
  const {
    icon,
    title,
    showButton,
    buttonIcon,
    buttonText,
    buttonLink,
    buttonOnClick,
    showSecondButton,
    secondButtonIcon,
    secondButtonText,
    secondButtonLink,
    secondButtonOnClick,
  } = props;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h5 className="card-title text-xl font-bold flex items-center gap-2">
        {icon && <Icon icon={icon} width={24} />}
        {title}
      </h5>
      <div className="flex items-center gap-3">
        {showButton && (
          <Link
            href={buttonLink}
            onClick={buttonOnClick}
            className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2 rounded-md transition flex items-center gap-2 hover:shadow-md hover:shadow-blue-200 group"
          >
            {buttonIcon && (
              <Icon
                icon={buttonIcon}
                width={20}
                className="transition-transform group-hover:rotate-90"
              />
            )}
            {buttonText}
          </Link>
        )}
        {showSecondButton && (
          <Link
            href={secondButtonLink}
            onClick={secondButtonOnClick}
            className="bg-secondary hover:bg-secondary-dark text-white text-sm px-4 py-2 rounded-md transition flex items-center gap-2 hover:shadow-md hover:shadow-green-200 group"
          >
            {secondButtonIcon && (
              <Icon
                icon={secondButtonIcon}
                width={20}
                className="transition-transform group-hover:rotate-90"
              />
            )}
            {secondButtonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
