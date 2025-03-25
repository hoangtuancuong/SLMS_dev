import { Router } from "express";

import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import awardController from "../controllers/award.controller.js";
import { ROLE } from "../utils/const.js";

const awardRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Award
 *   description: Các API liên quan đến Award
 */

/**
 * @swagger
 * /awards:
 *   get:
 *     summary: Lấy nhiều Award
 *     tags: [Award]
 *     parameters:
 *       - in: query
 *         name: limit
 *         default: 10
 *         schema:
 *           type: integer
 *         description: Số lượng Award muốn lấy
 *       - in: query
 *         name: offset
 *         default: 0
 *         schema:
 *           type: integer
 *         description: Số lượng Award muốn bỏ qua
 *       - in: query
 *         name: filter[user_id]
 *         schema:
 *           type: integer
 *         description: ID của người dùng
 *       - in: query
 *         name: filter[from_time]
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Ngày bắt đầu
 *       - in: query
 *         name: filter[to_time]
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Ngày kết thúc
 *       - in: query
 *         name: filter[type]
 *         schema:
 *           type: string
 *           enum: [IMAGE, DEGREE, CONTEST, PAPER, OTHER]
 *         description: Loại thành tựu
 *       - in: query
 *         name: sort[time]
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sắp xếp theo thời gian
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
 *                     $ref: '#/components/schemas/Award'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
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
 *     security:
 *       - Token: []
 */
awardRoutes.get("/awards", authMiddleware, roleMiddleware([ROLE.ADMIN]), awardController.find);

/**
 * @swagger
 * /awards/{id}:
 *   get:
 *     summary: Lấy một Award
 *     tags: [Award]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của Award
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Award'
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
awardRoutes.get("/awards/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), awardController.findById);

/**
 * @swagger
 * /awards:
 *   post:
 *     summary: Tạo một Award
 *     tags: [Award]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AwardInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Award'
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
 *     security:
 *       - Token: []
 */
awardRoutes.post("/awards", authMiddleware, roleMiddleware([ROLE.ADMIN]), awardController.create);

/**
 * @swagger
 * /awards/{id}:
 *   put:
 *     summary: Cập nhật một Award
 *     tags: [Award]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AwardInput'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Award'
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
awardRoutes.put("/awards/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), awardController.update);

/**
 * @swagger
 * /awards/{id}:
 *   delete:
 *     summary: Xóa một Award
 *     tags: [Award]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của Award
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
awardRoutes.delete("/awards/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), awardController.delete);

export default awardRoutes;
