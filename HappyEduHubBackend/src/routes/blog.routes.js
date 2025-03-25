import { Router } from "express";

import blogController from "../controllers/blog.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Các API liên quan đến blog
 */
const blogRoutes = Router();

/**
 * @swagger
 * /blogs:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Lấy danh sách blog
 *     description: API này dùng để lấy danh sách blog.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng blog cần lấy
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Số lượng blog cần bỏ qua
 *       - in: query
 *         name: filter[title]
 *         schema:
 *           type: string
 *           description: Tên blog
 *       - in: query
 *         name: filter[author_id]
 *         schema:
 *           type: number
 *           description: Id của người viết blog
 *       - in: query
 *         name: filter[from_created_at]
 *         schema:
 *           type: string
 *           description: Ngày bắt đầu tạo blog
 *       - in: query
 *         name: filter[to_created_at]
 *         schema:
 *           type: string
 *           description: Ngày kết thúc tạo blog
 *       - in: query
 *         name: filter[is_approved]
 *         schema:
 *           type: boolean
 *           description: Trạng thái duyệt blog
 *       - in: query
 *         name: filter[type]
 *         schema:
 *           type: string
 *           description: Loại blog
 *           enum: [POST, DOCUMENT]
 *       - in: query
 *         name: filter[author_name]
 *         schema:
 *           type: string
 *           description: Tên tác giả
 *       - in: query
 *         name: sort[title]
 *         schema:
 *           type: string
 *           description: Sắp xếp theo tên blog
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[created_at]
 *         schema:
 *           type: string
 *           description: Sắp xếp theo ngày tạo blog
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
 *                     $ref: "#/components/schemas/Blog"
 *                 meta:
 *                   $ref: "#/components/schemas/Meta"
 *       '400':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 */
blogRoutes.get("/blogs", blogController.find);

/**
 * @swagger
 * /blogs/{id}:
 *   get:
 *     tags:
 *       - Blog
 *     summary: Lấy thông tin blog theo id
 *     description: API này dùng để lấy thông tin blog theo id.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blog"
 *       '400':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 */
blogRoutes.get("/blogs/:id", blogController.findById);

/**
 * @swagger
 * /blogs:
 *   post:
 *     tags:
 *       - Blog
 *     summary: Tạo blog mới
 *     description: API này dùng để tạo blog mới. Người dùng cần được xác thực để truy cập.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BlogInput"
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blog"
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '400':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
blogRoutes.post("/blogs", authMiddleware, blogController.create);

/**
 * @swagger
 * /blogs/{id}:
 *   put:
 *     tags:
 *       - Blog
 *     summary: Cập nhật blog
 *     description: API này dùng để cập nhật blog. Người dùng cần được xác thực và có quyền hạn phù hợp để truy cập.
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
 *             $ref: "#/components/schemas/BlogInput"
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Blog"
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
blogRoutes.put("/blogs/:id", authMiddleware, blogController.update);

/**
 * @swagger
 * /blogs/{id}:
 *   delete:
 *     tags:
 *       - Blog
 *     summary: Xóa blog
 *     description: API này dùng để xóa blog. Người dùng cần được xác thực và có quyền hạn phù hợp để truy cập.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
blogRoutes.delete("/blogs/:id", authMiddleware, blogController.delete);

/**
 * @swagger
 * /blogs/{id}/approve:
 *   post:
 *     tags:
 *       - Blog
 *     summary: Duyệt blog
 *     description: API này dùng để duyệt blog. Chỉ dành cho admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
 *       '400':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
blogRoutes.post("/blogs/:id/approve", authMiddleware, roleMiddleware([ROLE.ADMIN]), blogController.adminOnly.approve);

/**
 * @swagger
 * /blogs/approve:
 *   post:
 *     tags:
 *       - Blog
 *     summary: Duyệt nhiều blog
 *     description: API này dùng để duyệt nhiều blog. Chỉ dành cho admin.
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
 *                   type: integer
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
 *       '400':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '401':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '403':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       '404':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
blogRoutes.post("/blogs/approve", authMiddleware, roleMiddleware([ROLE.ADMIN]), blogController.adminOnly.batchApprove);
export { blogRoutes };
