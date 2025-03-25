'use client'
import Header from "@/app/admin/components/dashboard/Header";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Badge, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { callApi } from "@/app/utils/api";
import {
    formattedDate,
    getLessonStatus,
    processGoogleDriveLink,
  } from '@/app/utils/utils';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentCourses, setCurrentCourses] = useState([]);
    const [upcomingCourses, setUpcomingCourses] = useState([]);
    const [completedCourses, setCompletedCourses] = useState([]);

    const shiftDay = {
        0: "Chủ nhật",
        1: "Thứ hai",
        2: "Thứ ba",
        3: "Thứ tư",
        4: "Thứ năm",
        5: "Thứ sáu",
        6: "Thứ bảy"
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await callApi('lessons/today');
                        
            const now = new Date();
            
            const current = [];
            const upcoming = [];
            const completed = [];
            
            data.forEach(lesson => {                
                
                const lessonDate = new Date(lesson.take_place_at);
                const dayOfWeek = lessonDate.getDay();

                console.log( getLessonStatus(lesson.shift))
                const status = getLessonStatus(lesson.shift);
                console.log(status)

                
                const enhancedLesson = {...lesson, day: dayOfWeek, status};
                if (status.text === 'Đang diễn ra') {
                    current.push(enhancedLesson);
                } else if (status.text === 'Sắp diễn ra' || status.text === 'Chưa diễn ra') {
                    upcoming.push(enhancedLesson);
                } else if (status.text === 'Đã diễn ra') {
                    completed.push(enhancedLesson);
                } else {
                    upcoming.push(enhancedLesson);
                }
            });
            
            setCurrentCourses(current);
            setUpcomingCourses(upcoming);
            setCompletedCourses(completed);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const ClassBadge = ({ lesson }) => (
        <div className="relative bg-white pb-3 pt-0 mt-0 px-6 rounded-xl w-full my-4 shadow-xl border border-dashed border-primary transition-all duration-300 hover:-translate-y-2 hover:border-double">
            <div className="mt-2">
                <p className="text-xl font-semibold my-2 text-blue-500">Thông tin buổi học</p>
                <p className="text-lg font-medium text-gray-700">{lesson.course.name}</p>
                <p className="text-gray-500 text-sm mb-2">Mã lớp: {lesson.course.code}</p>
                
                <div className="flex flex-wrap gap-2 text-gray-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex flex-wrap gap-1">
                        <Badge color="pink">{lesson.room}</Badge>
                        <Badge color="indigo">Cơ sở 1</Badge>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 text-gray-400 text-sm my-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex flex-wrap gap-1">
                        <Badge color="purple">{shiftDay[lesson.day]}</Badge>
                        <Badge color="pink">Ca {lesson.shift}</Badge>
                        <Badge color="gray">{new Date(lesson.take_place_at).toLocaleDateString('vi-VN')}</Badge>
                    </div>
                </div>
                <div className="border-t-2"></div>

                <div className="flex justify-between">
                    <div className="my-2">
                        <p className="font-semibold text-base mb-2 text-blue-500">Buổi số</p>
                        <p className="text-gray-700">{lesson.index}</p>
                    </div>
                    <div className="my-2">
                        <p className="font-semibold text-base mb-2 text-blue-500 text-end">Trạng thái</p>
                        <div className="text-base text-gray-400 font-semibold">
                            <div className="space-x-2">
                                <Badge color={lesson.status.color}>{lesson.status.text}</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <Card>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Header title="Lớp học hiện tại" />
                </AccordionSummary>
                <AccordionDetails>
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : currentCourses.length > 0 ? (
                        currentCourses.map((lesson) => (
                            <ClassBadge key={lesson.id} lesson={lesson} />
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            Không có lớp học nào hiện tại
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Header title="Lớp học sắp tới" />
                </AccordionSummary>
                <AccordionDetails>
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : upcomingCourses.length > 0 ? (
                        upcomingCourses.map((lesson) => (
                            <ClassBadge key={lesson.id} lesson={lesson} />
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            Không có lớp học nào sắp tới
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Header title="Lớp học đã hoàn thành" />
                </AccordionSummary>
                <AccordionDetails>
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : completedCourses.length > 0 ? (
                        completedCourses.map((lesson) => (
                            <ClassBadge key={lesson.id} lesson={lesson} />
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            Không có lớp học nào đã hoàn thành
                        </div>
                    )}
                </AccordionDetails>
            </Accordion>
        </Card>
    );
};

export default Dashboard;