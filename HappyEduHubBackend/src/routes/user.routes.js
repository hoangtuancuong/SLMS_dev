import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const userRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: Các API liên quan đến người dùng
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Tạo người dùng học sinh (Đăng ký)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserInput"
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
 */
userRoutes.post("/user", userController.register);

/**
 * @swagger
 * /user/update:
 *   put:
 *     deprecated: true
 *     summary: Update thông tin người dùng (Làm ơn, đừng dùng cái này nữa.)
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *               address:
 *                 type: string
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
 *     security:
 *       - Token: []
 */
userRoutes.put("/user/update", authMiddleware, userController.update);

/**
 * @swagger
 * /user/create-by-admin:
 *   post:
 *     summary: Admin tạo tài khoản cho người dùng
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserAdminInput"
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
 *     security:
 *       - Token: []
 */
userRoutes.post("/user/create-by-admin", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.TEACHER, ROLE.ACADEMIC_AFFAIR]), userController.addByAdmin);

/**
 * @swagger
 * /user/{id}/update-by-admin:
 *   put:
 *     summary: Admin cập nhật thông tin người dùng
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserAdminInput"
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
 *     security:
 *       - Token: []
 */
userRoutes.put("/user/:id/update-by-admin", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT]), userController.updateByAdmin);

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [User]
 *     summary: Lấy tất cả user
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Số lượng user trả về
 *       - in: query
 *         name: offset
 *         description: Số lượng user bỏ qua
 *       - in: query
 *         name: filter[name]
 *         description: Tên user
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[email]
 *         description: Email user
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[role]
 *         description: Role user
 *         schema:
 *           type: string
 *           enum: [TEACHER, STUDENT, ADMIN, ACADEMIC_AFFAIR]
 *       - in: query
 *         name: filter[phone_number]
 *         description: Số điện thoại user
 *         schema:
 *           type: string
 *       - in: query
 *         name: filter[date_of_birth]
 *         description: Ngày sinh user
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sort[name]
 *         description: Sắp xếp theo tên
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[phone_number]
 *         description: Sắp xếp theo số điện thoại
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[email]
 *         description: Sắp xếp theo email
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[role]
 *         description: Sắp xếp theo role
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sort[date_of_birth]
 *         description: Sắp xếp theo ngày sinh
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
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
 *                     $ref: '#/components/schemas/User'
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
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
userRoutes.get("/user", userController.get);

/**
 * @swagger
 * /user/my-info:
 *   get:
 *     summary: Lấy thông tin cá nhân
 *     tags: [User]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       403:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiError"
 *     security:
 *       - Token: []
 */
userRoutes.get("/user/my-info", authMiddleware, userController.getMyInfo);

/**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Thay đổi mật khẩu
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordInput"
 *     responses:
 *       200:
 *         description: Thay đổi mật khẩu thành công
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
 *     security:
 *       - Token: []
 */
userRoutes.put("/user/change-password", authMiddleware, userController.changePassword);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
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
userRoutes.get("/user/:id", userController.find);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Xóa người dùng theo id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa người dùng theo id thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Message"
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
userRoutes.delete("/user/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), userController.delete);

/**
 * @swagger
 * /user/bulk-student-create:
 *   post:
 *     summary: Tạo nhiều tài khoản học sinh
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_data
 *             properties:
 *               student_data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - email
 *                     - phone_number
 *                     - date_of_birth
 *                     - gender
 *                     - is_thaiphien
 *                     - first_contact_name
 *                     - first_contact_tel
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                       format: email
 *                     phone_number:
 *                       type: string
 *                       minLength: 10
 *                       maxLength: 10
 *                     date_of_birth:
 *                       type: string
 *                       format: date-time
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE, OTHER]
 *                     address:
 *                       type: string
 *                     is_thaiphien:
 *                       type: boolean
 *                     first_contact_name:
 *                       type: string
 *                     first_contact_tel:
 *                       type: string
 *                       minLength: 10
 *                       maxLength: 10
 *                     second_contact_name:
 *                       type: string
 *                     second_contact_tel:
 *                       type: string
 *                       minLength: 10
 *                       maxLength: 10
 *                     homeroom_teacher_id:
 *                       type: integer
 *                     cccd:
 *                       type: string
 *                     class:
 *                       type: string
 *                     school:
 *                       type: string
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
 *     security:
 *       - Token: []
 */
userRoutes.post("/user/bulk-student-create", authMiddleware, roleMiddleware([ROLE.ADMIN, ROLE.TEACHER, ROLE.ACADEMIC_AFFAI]), userController.bulkStudentCreate);

export { userRoutes };
