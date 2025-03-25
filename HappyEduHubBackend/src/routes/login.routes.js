import { Router } from "express";

import loginController from "../controllers/login.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const loginRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Các API liên quan đến đăng nhập và đăng xuất
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginOutput"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 */
loginRoutes.post("/login", loginController.login);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
 *   security:
 *     - Token: []
 */
loginRoutes.get("/logout", authMiddleware, loginController.logout);

export { loginRoutes };
