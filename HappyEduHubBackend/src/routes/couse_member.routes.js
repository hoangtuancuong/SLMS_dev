import courseMemberController from "../controllers/course_member.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";
import express from "express";

const courseMemberRoutes = express.Router();
/**
 * @swagger
 * tags:
 *   name: CourseMember
 *   description: Các API liên quan đến thành viên và tham gia khóa học
 */

courseMemberRoutes.post("/members/review-enroll-request", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR]), courseMemberController.reviewEnrollRequest);

/**
 * @swagger
 * /courses/{id}/enroll:
 *   post:
 *     summary: Đăng ký tham gia khóa học
 *     tags: [CourseMember]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
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
 *       404:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
courseMemberRoutes.post(
	"/courses/:id/enroll",
	authMiddleware,
	courseMemberController.enroll
);

courseMemberRoutes.get("/enroll-request", authMiddleware, courseMemberController.getEnrollRequest);

courseMemberRoutes.get("/courses/:id/not-members", authMiddleware, courseMemberController.findNotMembersByCourseId);

/**
 * @swagger
 * /courses/{id}/members:
 *   get:
 *     summary: Lấy danh sách thành viên của khóa học
 *     tags: [CourseMember]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *       - name: limit
 *         in: query
 *         required: false
 *         type: number
 *       - name: offset
 *         in: query
 *         required: false
 *         type: number
 *       - name: filter[status]
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         description: Trạng thái thành viên
 *       - name: filter[role]
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [STUDENT, TEACHER, ADMIN, ACADEMIC_AFFAIR]
 *         description: Vai trò thành viên
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
 *                     $ref: "#/components/schemas/CourseMember"
 *                 metadata:
 *                   $ref: "#/components/schemas/Metadata"
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
courseMemberRoutes.get("/courses/:id/members", authMiddleware, courseMemberController.findMembersByCourseId);

/**
 * @swagger
 * /members/review:
 *   post:
 *     summary: Phê duyệt thành viên
 *     tags: [CourseMember]
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
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
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
courseMemberRoutes.post(
	"/members/review",
	authMiddleware,
	roleMiddleware([ROLE.ACADEMIC_AFFAIR, ROLE.ADMIN]),
	courseMemberController.review
);

courseMemberRoutes.post("/members/:id/bulk-add", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR, ROLE.TEACHER]), courseMemberController.bulkAdd);

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Tạo thành viên
 *     tags: [CourseMember]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CourseMemberInput"
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CourseMember"
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
courseMemberRoutes.post(
	"/members",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]),
	courseMemberController.create
);

/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Cập nhật thành viên
 *     tags: [CourseMember]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CourseMember"
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
courseMemberRoutes.put("/members/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), courseMemberController.update);

/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Xóa thành viên
 *     tags: [CourseMember]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: number
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
courseMemberRoutes.delete(
	"/members/:id",
	authMiddleware,
	roleMiddleware([ROLE.TEACHER, ROLE.ADMIN]),
	courseMemberController.delete
);

courseMemberRoutes.get(
	"/courses/:id/check-enroll",
	authMiddleware,
	roleMiddleware([ROLE.STUDENT]),
	courseMemberController.checkEnroll
);


courseMemberRoutes.post("/members/:id/bulk-delete", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR, ROLE.TEACHER]), courseMemberController.bulkDelete);

// TODO: API trả về file excel danh sách member

export default courseMemberRoutes;
