import { Router } from "express";
import transactionController from "../controllers/transaction.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const router = Router();
/**
 * @swagger
 * tags:
 *  name: Transactions
 *  description: Quản lý giao dịch
 */

/**
 * @swagger
 * /transactions:
 *  get:
 *    summary: Lấy danh sách giao dịch
 *    tags: [Transactions]
 *    security:
 *      - Token: []
 *    parameters:
 *      - name: limit
 *        in: query
 *        description: Số lượng giao dịch trên mỗi trang
 *        required: false
 *        type: number
 *      - name: offset
 *        in: query
 *        description: Số trang
 *        required: false
 *        type: number
 *    responses:
 *      "200":
 *        description: Danh sách giao dịch
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Transaction"
 *                meta:
 *                  $ref: "#/components/schemas/Meta"
 */
router.get("/transactions", authMiddleware, transactionController.findAll);

/**
 * @swagger
 * /receipts/{receiptId}/transactions:
 *  get:
 *    summary: Lấy danh sách giao dịch theo khoản thu
 *    tags: [Transactions]
 *    security:
 *      - Token: []
 *    parameters:
 *      - name: receiptId
 *        in: path
 *        description: Id của khoản thu
 *        required: true
 *        type: number
 *      - name: limit
 *        in: query
 *        description: Số lượng giao dịch trên mỗi trang
 *        required: false
 *        type: number
 *      - name: offset
 *        in: query
 *        description: Số trang
 *        required: false
 *        type: number
 *    responses:
 *      "200":
 *        description: Danh sách giao dịch
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: "#/components/schemas/Transaction"
 *                meta:
 *                  $ref: "#/components/schemas/Meta"
 */
router.get(
	"/receipts/:receiptId/transactions",
	authMiddleware,
	transactionController.findByReceiptId
);

/**
 * @swagger
 * /transactions:
 *  post:
 *    summary: Tạo giao dịch
 *    tags: [Transactions]
 *    security:
 *      - Token: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/TransactionInput"
 *    responses:
 *      "201":
 *        description: Giao dịch đã được tạo
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Transaction"
 */
router.post("/transactions", authMiddleware, transactionController.create);

/**
 * @swagger
 * /transactions/{id}:
 *  put:
 *    summary: Cập nhật giao dịch
 *    tags: [Transactions]
 *    security:
 *      - Token: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id của giao dịch
 *        required: true
 *        type: number
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/TransactionUpdateInput"
 *    responses:
 *      "200":
 *        description: Giao dịch đã được cập nhật
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Transaction"
 */
router.put("/transactions/:id", authMiddleware, transactionController.update);

/**
 * @swagger
 * /transactions/{id}:
 *  delete:
 *    summary: Xóa giao dịch
 *    tags: [Transactions]
 *    security:
 *      - Token: []
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id của giao dịch
 *        required: true
 *        type: number
 *    responses:
 *      "200":
 *        description: Giao dịch đã được xóa
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Message"
 */
router.delete("/transactions/:id", authMiddleware,  transactionController.delete);
export default router;
