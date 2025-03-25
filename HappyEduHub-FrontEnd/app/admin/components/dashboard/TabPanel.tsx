'use client';
import { ReactNode, useState, useEffect } from 'react';

interface Tab {
  key: string;
  title: string;
  icon?: ReactNode;
  component?: ReactNode;
}

interface TabPanelProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (key: string) => void;
  rightButton?: {
    icon?: ReactNode;
    text: string;
    href: string;
  };
}

const TabPanel = ({
  tabs,
  activeTab,
  setActiveTab,
  rightButton,
}: TabPanelProps) => {
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (prevActiveTab !== activeTab) {
      setIsAnimating(true);
      setPrevActiveTab(activeTab);

      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [activeTab, prevActiveTab]);

  return (
    <div className="border-b border-blue-200 mb-6">
      <nav className="flex space-x-4 relative">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
                            relative flex items-center rounded-t-sm gap-2 px-4 py-3 font-medium 
                            transition-all duration-300 ease-in-out
                            ${
                              activeTab === tab.key
                                ? 'text-blue-600 animate-fade-in'
                                : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                            }
                        `}
          >
            {tab.icon && (
              <span className="transition-transform duration-300 ease-in-out">
                {tab.icon}
              </span>
            )}
            <span className="transition-transform duration-300 ease-in-out">
              {tab.title}
            </span>

            <span
              className={`
                                absolute bottom-0 left-0 h-1 bg-blue-500
                                transition-all duration-300 ease-in-out
                                ${
                                  activeTab === tab.key
                                    ? 'w-full transform scale-x-100 origin-left'
                                    : 'w-0 transform scale-x-0'
                                }
                                ${isAnimating && activeTab === tab.key ? 'animate-tab-slide-in' : ''}
                            `}
            ></span>
          </button>
        ))}

        {rightButton && (
          <a className="float-right ml-auto" href={rightButton.href}>
            <button
              className="
                                relative flex items-center rounded-t-sm gap-2 px-4 py-3 
                                text-gray-600 font-medium bg-indigo-300 
                                transition-all duration-300 ease-in-out 
                                hover:text-white hover:bg-indigo-500
                            "
            >
              {rightButton.icon && <span>{rightButton.icon}</span>}
              <span>{rightButton.text}</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 transition-all duration-300"></span>
            </button>
          </a>
        )}
      </nav>
    </div>
  );
};

export default TabPanel;
