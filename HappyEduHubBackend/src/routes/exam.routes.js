import { Router } from "express";
import examController from "../controllers/exam.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const examRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Exam
 *   description: Các API liên quan đến exam
 */

/**
 * @swagger
 * /exam:
 *   post:
 *     tags: [Exam]
 *     summary: Tạo exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExamInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
examRoutes.post(
	"/exam",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR, ROLE.TEACHER]),
	examController.create
);

/**
 * @swagger
 * /exam/get-all:
 *   get:
 *     tags: [Exam]
 *     summary: Lấy tất cả các exam
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Số lượng exam trả về
 *       - in: query
 *         name: offset
 *         description: Số lượng exam bỏ qua
 *       - in: query
 *         name: filter[name]
 *         description: Tên exam
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[from_created_at]
 *         description: Thời gian tạo từ ngày
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[to_created_at]
 *         description: Thời gian tạo đến ngày
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[is_private]
 *         description: Bài test có được công khai hay không
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: filter[teacher_id]
 *         description: Id giáo viên tạo bài test
 *         schema:
 *           type: number
 *       - in: query
 *         name: filter[exam_type]
 *         description: Loại bài test
 *         schema:
 *           type: string
 *           enum: [ENTRY_EXAM, ASSIGNMENT]
 *       - in: query
 *         name: sort[created_at]
 *         description: Sắp xếp theo thời gian
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exam'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
examRoutes.get(
	"/exam/get-all",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR, ROLE.TEACHER]),
	examController.findAll
);

/**
 * @swagger
 * /exam/get-public-exam:
 *   get:
 *     tags: [Exam]
 *     summary: Lấy tất cả các exam được public
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Số lượng exam trả về
 *       - in: query
 *         name: offset
 *         description: Số lượng exam bỏ qua
 *       - in: query
 *         name: filter[name]
 *         description: Tên exam
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[from_created_at]
 *         description: Thời gian tạo từ ngày
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[to_created_at]
 *         description: Thời gian tạo đến ngày
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[teacher_id]
 *         description: Id giáo viên tạo bài test
 *         schema:
 *           type: number
 *       - in: query
 *         name: filter[exam_type]
 *         description: Loại bài test
 *         schema:
 *           type: string
 *           enum: [ENTRY_EXAM, ASSIGNMENT]
 *       - in: query
 *         name: sort[created_at]
 *         description: Sắp xếp theo thời gian
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exam'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
examRoutes.get(
	"/exam/get-public-exam",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.TEACHER]),
	examController.findAllPublicExam
);

/**
 * @swagger
 * /exam/get-my-exam:
 *   get:
 *     tags: [Exam]
 *     summary: Lấy tất cả các exam của bản thân
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Số lượng exam trả về
 *       - in: query
 *         name: offset
 *         description: Số lượng exam bỏ qua
 *       - in: query
 *         name: filter[name]
 *         description: Tên exam
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[from_created_at]
 *         description: Thời gian tạo từ ngày
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[to_created_at]
 *         description: Thời gian tạo đến ngày
 *       - in: query
 *         name: filter[is_private]
 *         description: Bài test có được công khai hay không
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: filter[exam_type]
 *         description: Loại bài test
 *         schema:
 *           type: string
 *           enum: [ENTRY_EXAM, ASSIGNMENT]
 *       - in: query
 *         name: sort[created_at]
 *         description: Sắp xếp theo thời gian
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exam'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
examRoutes.get(
	"/exam/get-my-exam",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]),
	examController.findMyExam
);

/**
 * @swagger
 * /exam/{id}:
 *   get:
 *     tags: [Exam]
 *     summary: Lấy exam theo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của exam
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
examRoutes.get("/exam/:id", authMiddleware, examController.getExamById);

/**
 * @swagger
 * /exam/{id}:
 *   put:
 *     tags: [Exam]
 *     summary: Cập nhật exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của exam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExamInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Exam'
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
examRoutes.put("/exam/:id", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.TEACHER]), examController.update);

/**
 * @swagger
 * /exam/{id}:
 *   delete:
 *     tags: [Exam]
 *     summary: Xóa exam
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của exam
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
examRoutes.delete("/exam/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), examController.delete);

export { examRoutes };
