import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import teacherReviewController from "../controllers/teacher_review.controller.js";

const teacherReviewRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: TeacherReview
 *   description: Các API liên quan đến đánh giá giáo viên
 */

/**
 * @swagger
 * /review:
 *   post:
 *     tags: [TeacherReview]
 *     summary: Tạo review giáo viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
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
 *     security:
 *       - Token: []
 */
teacherReviewRoutes.post("/review", authMiddleware, roleMiddleware([ROLE.STUDENT]), teacherReviewController.create);

/**
 * @swagger
 * /review/teacher/{id}:
 *   get:
 *     tags: [TeacherReview]
 *     summary: Lấy tất cả các review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của teacher
 *       - in: query
 *         name: limit
 *         description: Số lượng review trả về
 *       - in: query
 *         name: offset
 *         description: Số lượng review bỏ qua
 *       - in: query
 *         name: filter[rate]
 *         description: Điểm đánh giá
 *         schema:
 *           type: number
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
 *         name: sort[created_at]
 *         description: Sắp xếp theo thời gian
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[rate]
 *         description: Sắp xếp theo đánh giá
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
 *                     $ref: '#/components/schemas/Review'
 *                 average:
 *                   type: number
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
teacherReviewRoutes.get("/review/teacher/:id", authMiddleware, teacherReviewController.get);

/**
 * @swagger
 * /review/my-review:
 *   get:
 *     tags: [TeacherReview]
 *     summary: Lấy tất cả các review của bản thân
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Số lượng review trả về
 *       - in: query
 *         name: offset
 *         description: Số lượng review bỏ qua
 *       - in: query
 *         name: filter[rate]
 *         description: Điểm đánh giá
 *         schema:
 *           type: number
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
 *         name: sort[created_at]
 *         description: Sắp xếp theo thời gian
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[rate]
 *         description: Sắp xếp theo đánh giá
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
 *                     $ref: '#/components/schemas/Review'
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
teacherReviewRoutes.get(
	"/review/my-review",
	authMiddleware,
	roleMiddleware([ROLE.STUDENT]),
	teacherReviewController.getMyReview
);

/**
 * @swagger
 * /review/{id}:
 *   put:
 *     tags: [TeacherReview]
 *     summary: Cập nhật review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewUpdateInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
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
teacherReviewRoutes.put("/review/:id", authMiddleware, roleMiddleware([ROLE.STUDENT]), teacherReviewController.update);

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     tags: [TeacherReview]
 *     summary: Xóa review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của review
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
teacherReviewRoutes.delete(
	"/review/:id",
	authMiddleware,
	roleMiddleware([ROLE.STUDENT, ROLE.ADMIN]),
	teacherReviewController.delete
);

/**
 * @swagger
 * /review/{id}:
 *   get:
 *     tags: [TeacherReview]
 *     summary: Lấy review theo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của review
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
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
teacherReviewRoutes.get("/review/:id", authMiddleware, teacherReviewController.getById);

export default teacherReviewRoutes;
