import { Router } from "express";

import courseLessonController from "../controllers/course_lesson.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const courseLessonRouter = Router();
/**
 * @swagger
 * tags:
 *   name: CourseLesson
 *   description: Các API liên quan đến tiết học
 */

/**
 * @swagger
 * /courses/{id}/lessons:
 *   get:
 *     summary: Lấy danh sách tiết học của khóa học
 *     tags: [CourseLesson]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *         description: ID của khóa học
 *       - name: filter[from_take_place_at]
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu
 *       - name: filter[to_take_place_at]
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseLesson'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
courseLessonRouter.get("/courses/:id/lessons", authMiddleware, courseLessonController.find);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Cập nhật tiết học
 *     tags: [CourseLesson]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *         description: ID của tiết học
 *       - name: body
 *         in: body
 *         required: true
 *         type: object
 *         description: Thông tin tiết học
 *         schema:
 *           $ref: '#/definitions/CourseLessonInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseLesson'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
courseLessonRouter.put("/lessons/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), courseLessonController.update);

/**
 * @swagger
 * /lessons/{id}/cancel:
 *   post:
 *     summary: Hủy tiết học
 *     tags: [CourseLesson]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *         description: ID của tiết học
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseLesson'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
courseLessonRouter.post(
	"/lessons/:id/cancel",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN]),
	courseLessonController.cancel
);

/**
 * @swagger
 * /lessons/today:
 *   get:
 *     summary: Lấy danh sách tiết học hôm nay
 *     tags: [CourseLesson]
 *     security:
 *       - Token: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 course_id:
 *                   type: integer
 *                 index:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 take_place_at:
 *                   type: string
 *                   format: date-time
 *                 shift:
 *                   type: integer
 *                 room:
 *                   type: string
 *                 note:
 *                   type: string
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                 course:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     fee:
 *                       type: number
 *                     start_date:
 *                       type: string
 *                       format: date-time
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                     code:
 *                       type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phone_number:
 *                             type: string
 *                           code:
 *                             type: string
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
courseLessonRouter.get("/lessons/today", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR], [ROLE.TROGIANG]), courseLessonController.getTodayLesson);

/**
 * @swagger
 * /lessons/my-schedule:
 *   post:
 *     summary: Lấy lịch học của tôi
 *     tags: [CourseLesson]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: start_date
 *         in: body
 *         required: true
 *         type: string
 *         description: Ngày bắt đầu
 *       - name: end_date
 *         in: body
 *         required: true
 *         type: string
 *         description: Ngày kết thúc
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   course_id:
 *                     type: integer
 *                   index:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   take_place_at:
 *                     type: string
 *                     format: date-time
 *                   shift:
 *                     type: integer
 *                   room:
 *                     type: string
 *                   note:
 *                     type: string
 *                     nullable: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                   course:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       fee:
 *                         type: number
 *                       start_date:
 *                         type: string
 *                         format: date-time
 *                       end_date:
 *                         type: string
 *                         format: date-time
 *                       code:
 *                         type: string
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
courseLessonRouter.post("/lessons/my-schedule", authMiddleware, courseLessonController.getMySchedule);

export default courseLessonRouter;
