import { Feature } from '@/types/feature';

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph } = feature;
  return (
    <div className="w-full rounded-md bg-white shadow-sm hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300">
      <div className="wow fadeInUp p-6" data-wow-delay=".15s">
        <div className="mx-auto mb-1 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-opacity-10 text-primary transition-all duration-300 hover:translate-y-[-5px]">
          {icon}
        </div>
        <h3 className="mb-5 important:pt-1 text-center text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
          {title}
        </h3>
        <p className="px-4 text-base font-medium leading-relaxed text-body-color">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SingleFeature;
