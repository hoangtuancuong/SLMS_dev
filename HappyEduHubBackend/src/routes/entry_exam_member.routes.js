import express from "express";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import entryExamMemberController from "../controllers/entry_exam_member.controller.js";

const entryExamMemberRoutes = express.Router();
/**
 * @swagger
 * tags:
 *   name: EntryExamMember
 *   description: Các API liên quan đến thành viên và tham gia bài test entry
 */

/**
 * @swagger
 * /entry-exam:
 *   post:
 *     summary: Tạo thành viên bài test entry
 *     tags: [EntryExamMember]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/EntryMemberInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EntryMember"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
entryExamMemberRoutes.post(
	"/entry-exam",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	entryExamMemberController.createMember
);

/**
 * @swagger
 * /entry-exam/exam/{id}:
 *   get:
 *     summary: Lấy danh sách thành viên bài test entry
 *     tags: [EntryExamMember]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *       - name: filter[user_name]
 *         in: query
 *         required: false
 *         type: string
 *       - name: filter[user_id]
 *         in: query
 *         required: false
 *         type: number
 *       - name: filter[from_created_at]
 *         in: query
 *         required: false
 *         type: string
 *       - name: filter[to_created_at]
 *         in: query
 *         required: false
 *         type: string
 *       - name: filter[from_updated_at]
 *         in: query
 *         required: false
 *         type: string
 *       - name: filter[to_updated_at]
 *         in: query
 *         required: false
 *         type: string
 *       - name: sort[created_at]
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - name: sort[updated_at]
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - name: sort[score]
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  data:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/EntryMember'
 *                  meta:
 *                    $ref: '#/components/schemas/Meta'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
entryExamMemberRoutes.get(
	"/entry-exam/exam/:id",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	entryExamMemberController.getMembers
);

/**
 * @swagger
 * /entry-exam/user/{userId}/exam/{examId}:
 *   get:
 *     summary: Lấy thành viên bài test entry
 *     tags: [EntryExamMember]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: number
 *       - name: examId
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EntryMember"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
entryExamMemberRoutes.get(
	"/entry-exam/user/:userId/exam/:examId",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	entryExamMemberController.getMemberByUserId
);

/**
 * @swagger
 * /entry-exam/insert-score:
 *   put:
 *     summary: Thêm điểm cho thành viên bài test entry
 *     tags: [EntryExamMember]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: number
 *             exam_id:
 *               type: number
 *             score:
 *               type: number
 *             note:
 *               type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EntryMember'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
entryExamMemberRoutes.put(
	"/entry-exam/insert-score",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	entryExamMemberController.insertScore
);

/**
 * @swagger
 * /entry-exam/insert-score-by-array:
 *   put:
 *     summary: Thêm điểm cho nhiều thành viên bài test entry
 *     tags: [EntryExamMember]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             exam_id:
 *               type: number
 *             score_data:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: number
 *                   score:
 *                     type: number
 *                   note:
 *                     type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
entryExamMemberRoutes.put(
	"/entry-exam/insert-score-by-array",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	entryExamMemberController.insertScoreByArray
);

/**
 * @swagger
 * /entry-exam/update:
 *   put:
 *     summary: Cập nhật thành viên bài test entry
 *     tags: [EntryExamMember]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *           $ref: "#/components/schemas/EntryMemberInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/EntryMember"
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
entryExamMemberRoutes.put(
	"/entry-exam/update",
	authMiddleware,
	roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]),
	entryExamMemberController.update
);

export default entryExamMemberRoutes;
