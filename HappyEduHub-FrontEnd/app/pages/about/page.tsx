import ValuesSection from '@/components/Common/Card';
import { Metadata } from 'next';
import { ListStudent } from '@/components/About/ListStudent';
import Brands from '@/components/Brands';
import VisionMission from '@/components/About/MissonAndView';
import HeroAbout from '@/components/About/Hero';
export const metadata: Metadata = {
  title: 'About Page',
  description: 'This is About Page for Startup Nextjs Template',
  // other metadata
};

const AboutPage = () => {
  return (
    <div className="">
      <HeroAbout />
      <VisionMission />
      <ValuesSection />
      <ListStudent />
      <Brands />
    </div>
  );
};

export default AboutPage;
