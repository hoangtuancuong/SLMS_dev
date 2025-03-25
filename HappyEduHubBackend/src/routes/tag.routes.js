import { Router } from "express";

import tagController from "../controllers/tag.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const tagRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Tag
 *   description: Các API liên quan đến tag
 */

/**
 * @swagger
 * /tags:
 *   get:
 *     tags: [Tag]
 *     summary: Lấy tất cả các tag
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
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
tagRoutes.get("/tags", tagController.find);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     tags: [Tag]
 *     summary: Lấy tag theo id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của tag
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
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
tagRoutes.get("/tags/:id", tagController.findById);

/**
 * @swagger
 * /tags:
 *   post:
 *     tags: [Tag]
 *     summary: Tạo tag mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
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
tagRoutes.post("/tags", authMiddleware, roleMiddleware([ROLE.ADMIN]), tagController.create);

/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     tags: [Tag]
 *     summary: Cập nhật tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
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
tagRoutes.put("/tags/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), tagController.update);

/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     tags: [Tag]
 *     summary: Xóa tag
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Id của tag
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
tagRoutes.delete("/tags/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), tagController.delete);

export { tagRoutes };
