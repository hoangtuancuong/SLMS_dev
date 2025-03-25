import React from 'react';
import { Card } from 'flowbite-react';

const VisionMission = () => {
  const missions = [
    {
      title: 'Nâng cao chất lượng học tập',
      description:
        'Tuyển chọn đội ngũ giáo viên giỏi, tâm huyết và yêu trẻ, đồng hành cùng học sinh trong quá trình phát triển.',
    },
    {
      title: 'Phát triển phương pháp học tập thông minh',
      description:
        'Ứng dụng phương pháp giảng dạy tiên tiến, cá nhân hóa việc học tập hiệu quả và khoa học.',
    },
    {
      title: 'Tạo dựng môi trường học tập tích cực',
      description:
        'Đội ngũ trợ giảng hỗ trợ học thuật và đồng hành cùng học sinh vượt qua khó khăn.',
    },
    {
      title: 'Hỗ trợ giáo viên phát triển sự nghiệp',
      description:
        'Đảm bảo thu nhập ổn định, tạo môi trường làm việc chuyên nghiệp để giáo viên yên tâm cống hiến.',
    },
  ];

  return (
    <section className="bg-gray-light relative z-10 py-16 md:py-20 lg:py-28">
      <Card className="w-[100%] mx-auto bg-gray-light shadow-none border-none">
        <h2 className="text-5xl font-bold text-center text-blue-600 mb-4">
          SỨ MỆNH
        </h2>
        <div className="flex flex-wrap justify-between gap-6 mt -6">
          {missions.map((mission, index) => (
            <Card
              key={index}
              className="bg-white shadow-two rounded-sm w-[22%]"
            >
              <h3 className="font-bold text-center text-lg mb-2 text-blue-600">
                {mission.title}
              </h3>
              <p className="text-center text-base font-medium">
                {mission.description}
              </p>
            </Card>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default VisionMission;
