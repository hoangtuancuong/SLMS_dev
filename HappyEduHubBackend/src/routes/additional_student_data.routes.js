import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import additionalStudentDataController from "../controllers/additional_student_data.controller.js";

const additionalStudentDataRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: AdditionalStudentData
 *   description: Các API liên quan đến additional_student_data
 */

/**
 * @swagger
 * /student-data/{id}:
 *   post:
 *     tags: [AdditionalStudentData]
 *     summary: Tạo additional_student_data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdditionalStudentDataInput'
 *     responses:
 *       '200':
 *         description: AdditionalStudentData mới được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdditionalStudentData'
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
additionalStudentDataRoutes.post(
	"/student-data/:id",
	authMiddleware,
	roleMiddleware([ROLE.STUDENT, ROLE.ADMIN]),
	additionalStudentDataController.create
);

/**
 * @swagger
 * /student-data/{id}:
 *   put:
 *     tags: [AdditionalStudentData]
 *     summary: Cập nhật additional_student_data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdditionalStudentDataInput'
 *     responses:
 *       '200':
 *         description: AdditionalStudentData mới được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdditionalStudentData'
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
additionalStudentDataRoutes.put(
	"/student-data/:id",
	authMiddleware,
	roleMiddleware([ROLE.STUDENT, ROLE.ADMIN]),
	additionalStudentDataController.update
);

export default additionalStudentDataRoutes;
