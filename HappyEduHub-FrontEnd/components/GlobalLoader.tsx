import Image from 'next/image';
import { useEffect } from 'react';

const GlobalLoader = ({ isLoading }: { isLoading: boolean }) => {
  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  if (isLoading)
    return (
      <div
        id="globalLoader"
        className={`fixed inset-0 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Image
          src="/images/loading.gif"
          width={150}
          height={150}
          alt="Loading..."
        />
      </div>
    );
  else return <></>;
};

export default GlobalLoader;
