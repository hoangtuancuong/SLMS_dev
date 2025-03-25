import { Router } from "express";
import receiptController from "../controllers/receipt.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Receipt
 *   description: Quản lý khoản thu
 */

/**
 * @swagger
 * /receipts:
 *   get:
 *     summary: Lấy danh sách khoản thu
 *     tags: [Receipt]
 *     security:
 *       - Token: []
 *     responses:
 *       200:
 *         description: Danh sách khoản thu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 */
router.get("/receipts", authMiddleware, receiptController.findAll);

/**
 * @swagger
 * /courses/{courseId}/receipts:
 *   get:
 *     summary: Lấy danh sách khoản thu của khóa học
 *     tags: [Receipt]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Danh sách khoản thu của khóa học
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Receipt'
 */
router.get("/courses/:courseId/receipts", authMiddleware, receiptController.findByCourseId);

/**
 * @swagger
 * /receipts:
 *   post:
 *     summary: Tạo khoản thu
 *     tags: [Receipt]
 *     security:
 *       - Token: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReceiptInput'
 *     responses:
 *       201:
 *         description: Khoản thu đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 */
router.post(
	"/receipts",
	authMiddleware,
	receiptController.create
);

/**
 * @swagger
 * /receipts/{id}:
 *   put:
 *     summary: Cập nhật khoản thu
 *     tags: [Receipt]
 *     security:
 *       - Token: []
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
 *             $ref: '#/components/schemas/ReceiptUpdateInput'
 *     responses:
 *       200:
 *         description: Khoản thu đã được cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Receipt'
 */
router.put(
	"/receipts/:id",
	authMiddleware,
	receiptController.update
);

/**
 * @swagger
 * /receipts/{id}:
 *   delete:
 *     summary: Xóa khoản thu
 *     tags: [Receipt]
 *     security:
 *       - Token: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         description: Khoản thu đã được xóa
 */
router.delete("/receipts/:id", authMiddleware,  receiptController.delete);

export default router;
