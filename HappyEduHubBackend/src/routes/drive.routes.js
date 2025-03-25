import express from "express";
import multer from "multer";
import driveController from "../controllers/drive.controller.js";
import { authMiddleware, roleMiddleware } from "../middlewares/auth.middleware.js";
import { ROLE } from "../utils/const.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Drive
 *   description: Drive API
 */

/**
 * @swagger
 * /drive/upload:
 *   post:
 *     summary: Upload a file to Drive
 *     tags: [Drive]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     security:
 *       - Token: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriveFileMetadata'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post("/drive/upload",
    (req, _, next) => {
        // Set timeout to 30 seconds.
        req.socket.timeout = 30 * 1000;
        return next();
    },
    authMiddleware,
    roleMiddleware([ROLE.ADMIN, ROLE.ACADEMIC_AFFAIR, ROLE.TEACHER]),
    (req, res, next) => {
        const upload = multer({ storage: multer.memoryStorage() }).single("file");
        upload(req, res, function (err) {
            if (err) return next(err);
            return next();
        });
    },
    driveController.upload);

/**
 * @swagger
 * /drive/files:
 *   get:
 *     summary: Get all files in Drive
 *     tags: [Drive]
 *     parameters:
 *       - name: q
 *         in: query
 *         description: "The query to search for files. Empty to get all. (How to use: https://developers.google.com/drive/api/v3/search-files)"
 *         required: false
 *         type: string
 *       - name: pageToken
 *         in: query
 *         description: The page token to get the next page of files.
 *         required: false
 *         type: string
 *       - name: pageSize
 *         in: query
 *         description: The number of files to return per page.
 *         required: false
 *         type: number
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DriveFileMetadata'
 *                 nextPageToken:
 *                   type: string
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
router.get("/drive/files", authMiddleware, driveController.findFiles);

/**
 * @swagger
 * /drive/files/{id}:
 *   get:
 *     summary: Get a file by ID
 *     tags: [Drive]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the file to get.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DriveFileMetadata'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
router.get("/drive/files/:id", authMiddleware, driveController.findFilesById);

/**
 * @swagger
 * /drive/files/{id}:
 *   delete:
 *     summary: Delete a file by ID
 *     tags: [Drive]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the file to delete.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Message'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
router.delete("/drive/files/:id", authMiddleware, roleMiddleware([ROLE.ADMIN]), driveController.deleteById);

/**
 * @swagger
 * /drive/files/{id}/trash:
 *   post:
 *     summary: Move a file to the trash
 *     tags: [Drive]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the file to move to the trash.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Message'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
router.post("/drive/files/:id/trash", authMiddleware, roleMiddleware([ROLE.ADMIN]), driveController.recoverableDeleteById);

/**
 * @swagger
 * /drive/files/{id}/recover:
 *   post:
 *     summary: Recover a file by ID
 *     tags: [Drive]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the file to recover.
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/Message'
 *       400:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *     security:
 *       - Token: []
 */
router.post("/drive/files/:id/recover", authMiddleware, roleMiddleware([ROLE.ADMIN]), driveController.recoverById);

export default router;
