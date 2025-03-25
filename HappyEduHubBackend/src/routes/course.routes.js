// NEED TO DECIDE WHAT ROUTES SHOULD BE ADDED

import { Router } from "express";

import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import courseController from "../controllers/course.controller.js";

const courseRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Course
 *   description: Các API liên quan đến khóa học
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Lấy tất cả khóa học
 *     tags: [Course]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng khóa học trên mỗi trang
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Số lượng khóa học bỏ qua
 *       - in: query
 *         name: filter[name]
 *         schema:
 *           type: string
 *         description: Tên khóa học
 *       - in: query
 *         name: filter[tag_ids]
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *         description: Các tag của khóa học
 *       - in: query
 *         name: filter[is_approved]
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Trạng thái duyệt khóa học
 *       - in: query
 *         name: filter[is_private]
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Trạng thái riêng tư khóa học
 *       - in: query
 *         name: filter[from_start_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: filter[to_start_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc
 *       - in: query
 *         name: filter[from_end_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: filter[to_end_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc
 *       - in: query
 *         name: filter[from_fee]
 *         schema:
 *           type: number
 *         description: Giá khóa học
 *       - in: query
 *         name: filter[to_fee]
 *         schema:
 *           type: number
 *         description: Giá khóa học
 *       - in: query
 *         name: filter[code]
 *         schema:
 *           type: string
 *         description: Mã khóa học
 *       - in: query
 *         name: sort[name]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo tên
 *       - in: query
 *         name: sort[start_date]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo ngày bắt đầu
 *       - in: query
 *         name: sort[end_date]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo ngày kết thúc
 *       - in: query
 *         name: sort[fee]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo giá
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Course'
 *                  meta:
 *                    $ref: '#/components/schemas/Meta'
 *       400:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.get("/courses", courseController.find);

/**
 * @swagger
 * /courses/my-courses:
 *   get:
 *     summary: Lấy tất cả khóa học
 *     tags: [Course]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng khóa học trên mỗi trang
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Số lượng khóa học bỏ qua
 *       - in: query
 *         name: filter[name]
 *         schema:
 *           type: string
 *         description: Tên khóa học
 *       - in: query
 *         name: filter[tag_ids]
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *         description: Các tag của khóa học
 *       - in: query
 *         name: filter[is_approved]
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Trạng thái duyệt khóa học
 *       - in: query
 *         name: filter[is_private]
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Trạng thái riêng tư khóa học
 *       - in: query
 *         name: filter[from_start_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: filter[to_start_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc
 *       - in: query
 *         name: filter[from_end_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: filter[to_end_date]
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc
 *       - in: query
 *         name: filter[from_fee]
 *         schema:
 *           type: number
 *         description: Giá khóa học
 *       - in: query
 *         name: filter[to_fee]
 *         schema:
 *           type: number
 *         description: Giá khóa học
 *       - in: query
 *         name: filter[code]
 *         schema:
 *           type: string
 *         description: Mã khóa học
 *       - in: query
 *         name: sort[name]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo tên
 *       - in: query
 *         name: sort[start_date]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo ngày bắt đầu
 *       - in: query
 *         name: sort[end_date]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo ngày kết thúc
 *       - in: query
 *         name: sort[fee]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo giá
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/Course'
 *                  meta:
 *                    $ref: '#/components/schemas/Meta'
 *       400:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.get("/courses/my-courses", authMiddleware, courseController.myCourses);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Tạo khóa học
 *     tags: [Course]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 *       400:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.post("/courses", authMiddleware, roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]), courseController.create);

// WIP
courseRoutes.get("/courses/my-course-schedule", authMiddleware, courseController.myCourseSchedule);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Lấy khóa học theo id
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Id của khóa học
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 *       400:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       404:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.get("/courses/:id", courseController.findById);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Cập nhật khóa học
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Id của khóa học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseUpdateInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 *       400:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       404:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.put("/courses/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), courseController.update);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Xóa khóa học
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Id của khóa học
 *     responses:
 *       200:
 *         description: Khóa học
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Course'
 *       400:
 *         description: Lỗi validation
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Lỗi xác thực
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Lỗi quyền
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Lỗi không tìm thấy
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.delete("/courses/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), courseController.delete);

/**
 * @swagger
 * /courses/{id}/approve:
 *   post:
 *     summary: Duyệt khóa học
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Id của khóa học
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Message'
 *       400:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       404:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.post("/courses/:id/approve", authMiddleware, roleMiddleware([ROLE.ADMIN]), courseController.approve);

/**
 * @swagger
 * /courses/{id}/shifts/{shift_id}/assign-room:
 *   post:
 *     summary: Gán phòng cho ca học
 *     tags: [Course]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Id của khóa học
 *       - in: path
 *         name: shift_id
 *         schema:
 *           type: number
 *         required: true
 *         description: Id của ca học
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room:
 *                 type: string
 *                 required: true
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/Message'
 *       400:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       401:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       403:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *       404:
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
courseRoutes.post(
	"/courses/:id/shifts/:shift_id/assign-room",
	authMiddleware,
	roleMiddleware([ROLE.ACADEMIC_AFFAIR, ROLE.ADMIN]),
	courseController.assignRoom
);

export default courseRoutes;
