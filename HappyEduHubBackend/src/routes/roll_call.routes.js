import { Router } from "express";
import rollCallController from "../controllers/roll_call.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const rollCallRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Roll Call
 *   description: Các API liên quan đến điểm danh
 */

/**
 * @swagger
 * /rollcall/lesson/{id}:
 *   get:
 *     summary: Lấy danh sách điểm danh theo tiết học
 *     tags: [Roll Call]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       '200':
 *          content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   lesson_id:
 *                     type: number
 *                   user_id:
 *                     type: number
 *                   status:
 *                     type: string
 *                   note:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                   updated_at:
 *                     type: string
 *                   user:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
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
rollCallRoutes.get(
	"/rollcall/lesson/:id",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR, ROLE.TEACHER]),
	rollCallController.getByLessonId
);

/**
 * @swagger
 * /rollcall/course/{id}:
 *   get:
 *     summary: Lấy danh sách điểm danh theo khóa học
 *     tags: [Roll Call]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       '200':
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 course:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                 lessons:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lessons:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           index:
 *                             type: number
 *                           status:
 *                             type: string
 *                           take_place_at:
 *                             type: string
 *                             format: date-time
 *                           shift:
 *                             type: number
 *                           room:
 *                             type: string
 *                           note:
 *                             type: string
 *                       rollCalls:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: number
 *                           lesson_id:
 *                             type: number
 *                           user_id:
 *                             type: number
 *                           status:
 *                             type: string
 *                           note:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                           user:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                               code:
 *                                 type: string
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
rollCallRoutes.get(
	"/rollcall/course/:id",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR, ROLE.TEACHER]),
	rollCallController.getByCourseId
);

/**
 * @swagger
 * /rollcall:
 *   post:
 *     summary: Tạo điểm danh
 *     tags: [Roll Call]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RollCallInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RollCall'
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
rollCallRoutes.post(
	"/rollcall",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	rollCallController.create
);

/**
 * @swagger
 * /rollcall/{id}:
 *   put:
 *     summary: Cập nhật điểm danh
 *     tags: [Roll Call]
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
 *             $ref: '#/components/schemas/RollCallInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RollCall'
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
rollCallRoutes.put(
	"/rollcall/:id",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	rollCallController.update
);

export default rollCallRoutes;
