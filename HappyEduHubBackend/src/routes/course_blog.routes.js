import { Router } from "express";

import courseBlogController from "../controllers/course_blog.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const courseBlogRouter = Router();
/**
 * @swagger
 * tags:
 *   name: CourseBlog
 *   description: Các API liên quan đến blog của khóa học
 */

/**
 * @swagger
 * /courses/{id}/blogs:
 *   get:
 *     summary: Lấy danh sách blog của khóa học
 *     tags: [CourseBlog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Id của khóa học
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Số lượng blog hiển thị
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         required: false
 *         description: Số lượng blog bỏ qua
 *       - in: query
 *         name: filter[title]
 *         schema:
 *           type: string
 *         description: Tiêu đề blog
 *       - in: query
 *         name: filter[author_id]
 *         schema:
 *           type: number
 *         description: Id của tác giả
 *       - in: query
 *         name: filter[type]
 *         schema:
 *           type: string
 *         description: Loại blog
 *       - in: query
 *         name: sort[created_at]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo ngày tạo
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *     security:
 *       - Token: []
 */
courseBlogRouter.get("/courses/:id/blogs", authMiddleware, courseBlogController.findBlogsByCourseId);

/**
 * @swagger
 * /courses/{id}/blogs:
 *   post:
 *     summary: Thêm blog vào khóa học
 *     tags: [CourseBlog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
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
 *     security:
 *       - Token: []
 */
courseBlogRouter.post(
	"/courses/:id/add-blog",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]),
	courseBlogController.addBlogToCourse
);

/**
 * @swagger
 * /courses/{id}/remove-blog:
 *   delete:
 *     summary: Xóa blog khỏi khóa học
 *     tags: [CourseBlog]
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
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
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
 *     security:
 *       - Token: []
 */
courseBlogRouter.delete(
	"/courses/:id/remove-blog",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]),
	courseBlogController.removeBlogFromCourse
);

export default courseBlogRouter;
