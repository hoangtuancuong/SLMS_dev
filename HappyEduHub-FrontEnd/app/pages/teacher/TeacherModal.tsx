import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Teacher {
  name: string;
  subject: string;
  yearsOfExperience: number;
  bio: string;
  achievements: string[];
  courses: string[];
  avatar: string;
  teachingPlace: string;
  images: string[];
}

const TeacherModal = ({
  show,
  onClose,
  teacher,
}: {
  show: boolean;
  onClose: () => void;
  teacher: Teacher;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      document.body.classList.add('overflow-hidden');
    } else {
      setTimeout(() => setIsVisible(false), 300);
      document.body.classList.remove('overflow-hidden');
    }
  }, [show]);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setImageVisible(true);
  };

  const handleCloseImage = () => {
    setImageVisible(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Teacher Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity ${
          show ? 'animate-fade-in opacity-100' : 'animate-fade-out opacity-0'
        }`}
      >
        <div className="bg-white shadow-2xl rounded-xl w-full max-w-5xl p-8 flex flex-col relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
          >
            &#x2715;
          </button>

          <div className="flex flex-col md:flex-row items-start mb-6 p-6 bg-blue-50 rounded-lg shadow-md">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg transition-transform duration-300 hover:scale-110">
              <Image
                src={teacher.avatar}
                alt="Avatar"
                layout="fill"
                objectFit="cover"
              />
            </div>

            <div className="ml-6 flex flex-col justify-center text-blue-700">
              <h2 className="text-4xl font-semibold text-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105">
                {teacher.name}
              </h2>

              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-sm text-blue-600">
                  <span className="text-green-500 mr-2">&#x2714;</span>
                  Chuyên môn: <strong>{teacher.subject}</strong>
                </li>
                <li className="flex items-center text-sm text-blue-600">
                  <span className="text-green-500 mr-2">&#x2714;</span>
                  {teacher.yearsOfExperience} năm kinh nghiệm
                </li>
                <li className="flex items-center text-sm text-blue-600">
                  <span className="text-green-500 mr-2">&#x2714;</span>
                  {teacher.teachingPlace}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-blue-100 p-6 rounded-md shadow-md w-full md:w-1/3 transition duration-300 hover:border-4 hover:scale-105">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">
                Tiểu sử
              </h3>
              <p className="text-black">{teacher.bio}</p>
            </div>

            {/* Right Column: Achievements and Courses */}
            <div className="flex flex-col w-full md:w-2/3 gap-6">
              <div className="bg-blue-100 p-6 rounded-md shadow-md transition duration-300 hover:border-4 hover:scale-105">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Thành tựu
                </h3>
                <ul className="text-black">
                  {teacher.achievements.map((achievement, index) => (
                    <li key={index}>- {achievement}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-100 p-6 rounded-md shadow-md transition duration-300 hover:border-4 hover:scale-105">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">
                  Khóa học
                </h3>
                <ul className="text-black">
                  {teacher.courses.map((course, index) => (
                    <li key={index}>- {course}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Thư viện hình ảnh
            </h3>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {teacher.images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 rounded-sm overflow-hidden border-2 border-blue-400 transition duration-150 hover:border-4 cursor-pointer transform hover:scale-110"
                  onClick={() => handleImageClick(image)}
                >
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity ${
            imageVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseImage}
        >
          <div
            className={`relative max-w-4xl w-full h-full transform transition-all duration-500 ${
              imageVisible ? 'scale-100' : 'scale-75'
            }`}
          >
            <Image
              src={selectedImage}
              alt="Selected Image"
              layout="fill"
              objectFit="contain"
            />
            <button
              onClick={handleCloseImage}
              className="absolute top-4 right-4 text-white text-3xl"
            >
              &#x2715;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherModal;
