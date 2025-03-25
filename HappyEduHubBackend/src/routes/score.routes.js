import scoreController from "../controllers/score.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import { Router } from "express";

const scoreRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Score
 *   description: Các API liên quan đến điểm
 */

/**
 * @swagger
 * /scores:
 *   post:
 *     summary: Tạo điểm
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignment_id:
 *                 type: number
 *                 description: ID của bài tập
 *               user_id:
 *                 type: number
 *                 description: ID của người dùng
 *               score:
 *                 type: number
 *                 description: Điểm
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *   security:
 *     - Token: []
 */
scoreRoutes.post(
	"/scores",
	authMiddleware,
	roleMiddleware([ROLE.ACADEMIC_AFFAIR, ROLE.ADMIN, ROLE.TEACHER]),
	scoreController.create
);

/**
 * @swagger
 * /scores/batch:
 *   post:
 *     summary: Tạo điểm theo mảng
 *     tags: [Score]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignment_id:
 *                 type: number
 *                 description: ID của bài tập
 *               score_data:
 *                 type: array
 *                 description: Mảng điểm
 *                 items:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: number
 *                       description: ID của người dùng
 *                     score:
 *                       type: number
 *                       description: Điểm
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *   security:
 *     - Token: []
 */
scoreRoutes.post(
	"/scores/batch",
	authMiddleware,
	roleMiddleware([ROLE.ACADEMIC_AFFAIR, ROLE.ADMIN, ROLE.TEACHER]),
	scoreController.batchCreate
);

/**
 * @swagger
 * /scores/{id}:
 *   put:
 *     summary: Cập nhật điểm
 *     tags: [Score]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *                 description: Điểm
 *               note:
 *                 type: string
 *                 description: Ghi chú
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *   security:
 *     - Token: []
 */
scoreRoutes.put(
	"/scores/:id",
	authMiddleware,
	roleMiddleware([ROLE.ACADEMIC_AFFAIR, ROLE.ADMIN, ROLE.TEACHER]),
	scoreController.update
);

/**
 * @swagger
 * /scores/assignment/{id}:
 *   get:
 *     summary: Lấy điểm theo bài tập
 *     tags: [Score]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignment_id:
 *                   type: number
 *                   description: ID của bài tập
 *                 average_score:
 *                   type: number
 *                   description: Điểm trung bình
 *                 students_score:
 *                   type: array
 *                   description: Điểm của từng học sinh
 *                   items:
 *                     type: object
 *                     properties:
 *                       student_id:
 *                         type: number
 *                         description: ID của học sinh
 *                       score:
 *                         type: number
 *                         description: Điểm
 *                       note:
 *                         type: string
 *                         description: Ghi chú
 *                       created_at:
 *                         type: string
 *                         description: Ngày tạo
 *                       updated_at:
 *                         type: string
 *                         description: Ngày cập nhật
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
 *   security:
 *     - Token: []
 */
scoreRoutes.get(
	"/scores/assignment/:id",
	authMiddleware,
	roleMiddleware([ROLE.ACADEMIC_AFFAIR, ROLE.ADMIN, ROLE.TEACHER]),
	scoreController.getByAssignmentId
);

/**
 * @swagger
 * /scores/course/{courseId}/user/{userId}:
 *   get:
 *     summary: Lấy điểm theo khóa học và học sinh
 *     tags: [Score]
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         type: number
 *       - name: userId
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignment_id:
 *                   type: number
 *                   description: ID của bài tập
 *                 score:
 *                   type: number
 *                   description: Điểm
 *                 note:
 *                   type: string
 *                   description: Ghi chú
 *                 created_at:
 *                   type: string
 *                   description: Ngày tạo
 *                 updated_at:
 *                   type: string
 *                   description: Ngày cập nhật
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
 *   security:
 *     - Token: []
 */
scoreRoutes.get("/scores/course/:courseId/user/:userId", authMiddleware, scoreController.getByCourseIdAndUserId);

export default scoreRoutes;
