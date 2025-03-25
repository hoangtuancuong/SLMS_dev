import AboutSectionOne from '@/components/About/AboutSectionOne';
import AboutSectionTwo from '@/components/About/AboutSectionTwo';
import NewestCourse from '@/components/Course';
import Brands from '@/components/Brands';
import ScrollUp from '@/components/Common/ScrollUp';
import Contact from '@/components/Contact';
import Features from '@/components/Features';
import Hero from '@/components/Hero';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Video from '@/components/Video';
import { Metadata } from 'next';
import ValuesSection from '@/components/Common/Card';
import FeaturedTeachers from '@/components/Common/StudentList';
export const metadata: Metadata = {
  title: 'SLMS',
  description: 'This is Home for Startup Nextjs Template',
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <ValuesSection />
      <FeaturedTeachers />
      <NewestCourse />
      {/* <Pricing /> */}
      {/* <Contact /> */}
      {/* //<Video /> */}
      {/* <Brands /> */}
      {/* <AboutSectionOne />
      <AboutSectionTwo /> */}
    </>
  );
}
