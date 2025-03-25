import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import assignmentController from "../controllers/assignment.controller.js";

/**
 * @swagger
 * tags:
 *   name: Assignment
 *   description: Các API liên quan đến assignment
 */
const assignmentRoutes = Router();

/**
 * @swagger
 * /assignment/course/{id}:
 *   get:
 *     tags: [Assignment]
 *     summary: Lấy tất cả các assignment của khóa học
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Số lượng assignment trả về
 *       - in: query
 *         name: offset
 *         description: Số lượng assignment bỏ qua
 *       - in: query
 *         name: filter[name]
 *         description: Tên assignment
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[from_start_time]
 *         description: Thời gian bắt đầu từ
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[to_start_time]
 *         description: Thời gian bắt đầu đến
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[from_end_time]
 *         description: Thời gian kết thúc từ
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[to_end_time]
 *         description: Thời gian kết thúc đến
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[from_created_at]
 *         description: Thời gian tạo từ
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[to_created_at]
 *         description: Thời gian tạo đến
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: filter[assignment_type]
 *         description: Loại assignment
 *         schema:
 *           type: string
 *           enum: [EXCERCISE, TEST]
 *       - in: query
 *         name: sort[start_time]
 *         description: Sắp xếp theo thời gian bắt đầu
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[end_time]
 *         description: Sắp xếp theo thời gian kết thúc
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[created_at]
 *         description: Sắp xếp theo thời gian tạo
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       '200':
 *         description: Tất cả các assignment của khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assignment'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
assignmentRoutes.get(
	"/assignment/course/:id",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.STUDENT, ROLE.ADMIN]),
	assignmentController.get
);

/**
 * @swagger
 * /assignment:
 *   post:
 *     tags: [Assignment]
 *     summary: Tạo assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
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
assignmentRoutes.post(
	"/assignment",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.TEACHER, ROLE.ACADEMIC_AFFAIR]),
	assignmentController.create
);

assignmentRoutes.get("/assignment/my-assignment", authMiddleware, assignmentController.getMyAssignment);

/**
 * @swagger
 * /assignment/{id}:
 *   put:
 *     tags: [Assignment]
 *     summary: Cập nhật assignment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentInput'
 *     responses:
 *       '200':
 *         description: Assignment đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       '401':
 *         description: Unauthorized
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
assignmentRoutes.put(
	"/assignment/:id",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.TEACHER, ROLE.ACADEMIC_AFFAIR]),
	assignmentController.update
);

/**
 * @swagger
 * /assignment/{id}:
 *   delete:
 *     tags: [Assignment]
 *     summary: Xóa assignment
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
assignmentRoutes.delete(
	"/assignment/:id",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.TEACHER, ROLE.ACADEMIC_AFFAIR]),
	assignmentController.delete
);

/**
 * @swagger
 * /assignment/{id}:
 *   get:
 *     tags: [Assignment]
 *     summary: Lấy chi tiết assignment
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
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
assignmentRoutes.get(
	"/assignment/:id",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.STUDENT, ROLE.ADMIN]),
	assignmentController.getDetail
);

export default assignmentRoutes;
