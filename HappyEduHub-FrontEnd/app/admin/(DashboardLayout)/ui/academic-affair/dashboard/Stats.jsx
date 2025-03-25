import { Card } from "flowbite-react";

const Stats = () => {
    return (
        <Card className="mb-4 p-4">
            <div className="flex flex-row gap-4">
                <Card className="flex-1 p-4">
                    <p className="text-sm text-gray-500">Request tham gia cần xử lý</p>
                </Card>
                <Card className="flex-1 p-4">
                    <p className="text-sm text-gray-500">Số bài kiểm tra chưa nhập điểm</p>
                </Card>
            </div>
        </Card>
    );
};

export default Stats;
