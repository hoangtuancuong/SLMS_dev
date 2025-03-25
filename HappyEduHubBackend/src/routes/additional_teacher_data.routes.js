import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import additionalTeacherDataController from "../controllers/additional_teacher_data.controller.js";

const additionalTeacherDataRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Additional Teacher Data
 *   description: Quản lý thông tin giáo viên
 */

/**
 * @swagger
 * /teacher-data/{id}:
 *   post:
 *     summary: Tạo thông tin thêm giáo viên
 *     tags: [Additional Teacher Data]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của người dùng
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_id:
 *                 type: number
 *                 description: ID của môn học
 *               portfolio:
 *                 type: object
 *                 description: Portfolio của giáo viên
 *
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
 */
additionalTeacherDataRoutes.post(
	"/teacher-data/:id",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]),
	additionalTeacherDataController.create
);

/**
 * @swagger
 * /teacher-data/{id}:
 *   put:
 *     summary: Cập nhật thông tin thêm giáo viên
 *     tags: [Additional Teacher Data]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của người dùng
 *         required: true
 *         type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject_id:
 *                 type: number
 *                 description: ID của môn học
 *               portfolio:
 *                 type: object
 *                 description: Portfolio của giáo viên
 *
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
additionalTeacherDataRoutes.put(
	"/teacher-data/:id",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]),
	additionalTeacherDataController.update
);

export default additionalTeacherDataRoutes;
