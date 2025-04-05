import { Router } from "express";
import zoomService from "../services/zoom.service.js";
import { YUP_UTILS,catchValidationError } from "../utils/utils.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const zoomRoutes = Router();

/**
 * @swagger
 * /zoom/create-meeting:
 *   post:
 *     security:
 *       - Token: []
 *     summary: Create a meeting
 *     tags: [Zoom]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings"
 *               type:
 *                 type: number
 *               start_time:
 *                 type: string
 *               duration:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Cuộc họp đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ZoomMeeting'
 *       '400':
 *         description: Lỗi dữ liệu đầu vào
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
zoomRoutes.post("/zoom/create-meeting", authMiddleware, roleMiddleware([ROLE.TEACHER, ROLE.ACADEMIC_AFFAIR, ROLE.ADMIN]), async (req, res, next) => {
    const bodySchema = YUP_UTILS.body({
        topic: YUP_UTILS.string("topic").required(),
        type: YUP_UTILS.number("type").required(),
        start_time: YUP_UTILS.date("start_time").required(),
        duration: YUP_UTILS.number("duration").required()
    });
    try {
        req.body = await bodySchema.validate(req.body);
    } catch (error) {
        return catchValidationError(next, error);
    }

    try {
        const meeting = await zoomService.createMeeting(req.body);
        res.status(200).json(meeting);
    } catch (error) {
        return next(error);
    }
});


export { zoomRoutes };
