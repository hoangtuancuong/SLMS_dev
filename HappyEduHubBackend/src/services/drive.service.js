import { google } from "googleapis";
import path from "path";
import process from "process";
import stream from "stream";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// Get service account key path
const KEY_PATH = path.join(process.cwd(), "service-account.json");

// The authorized client
let client = null;

const driveService = {
	/**
	 * Load or request or authorization to call APIs.
	 */
	async init() {
		client = new google.auth.GoogleAuth({ scopes: SCOPES, keyFile: KEY_PATH });
	},

	/**
	 * Upload a file to Google Drive. The file is publicly accessible.
	 *
	 * @param {Express.Multer.File} file - The file to upload.
	 *
	 * @returns {Promise<drive_v3.Schema$File>} The file from Google Drive.
	 */
	async upload(file) {
		// Get drive client
		const drive = google.drive({ version: "v3", auth: client });

		// Create file
		const uploadedFile = await drive.files
			.create({
				requestBody: {
					name: `${Date.now()}`
				},
				media: {
					mimeType: file.mimetype,
					body: new stream.PassThrough().end(file.buffer)
				},
				fields: "id, name, size, mimeType, webViewLink, webContentLink"
			})
			.then((res) => res.data);

		// Set file permissions
		await drive.permissions
			.create({
				fileId: uploadedFile.id,
				requestBody: { role: "reader", type: "anyone" }
			})
			.then((data) => data);

		return uploadedFile;
	},

	/**
	 * Get a file from Google Drive.
	 *
	 * @param {string} id - The ID of the file to get.
	 *
	 * @returns {Promise<drive_v3.Schema$File>} The file from Google Drive.
	 */
	async get(id) {
		// Get drive client
		const drive = google.drive({ version: "v3", auth: client });

		// Get file
		return drive.files
			.get({
				fileId: id,
				fields: "id, name, size, mimeType, webViewLink, webContentLink"
			})
			.then((res) => res.data);
	},

	/**
	 * Get a list of files from Google Drive.
	 *
	 * @typedef {Object} Params
	 * @property {string} q - The query to search for.
	 * @property {string} pageToken - The page token.
	 * @property {number} pageSize - The page size.
	 *
	 * @param {Params} params
	 *
	 * @returns {Promise<drive_v3.Schema$FileList>} The list of files from Google Drive.
	 */
	async list(params) {
		// Get drive client
		const drive = google.drive({ version: "v3", auth: client });

		// Get file
		return drive.files
			.list({
				...params,
				fields: "nextPageToken, files(id, name, size, mimeType, webViewLink, webContentLink)"
			})
			.then((res) => res.data);
	},

	/**
	 * Delete a file from Google Drive.
	 *
	 * @param {string} id - The ID of the file to delete.
	 *
	 * @returns {Promise<void>}
	 */
	async deleteById(id) {
		// Get drive client
		const drive = google.drive({ version: "v3", auth: client });

		// Delete file
		return drive.files.delete({ fileId: id }).then((res) => res.data);
	},

	/**
	 * Move a file to the trash.
	 *
	 * @param {string} id - The ID of the file to move to the trash.
	 *
	 * @returns {Promise<drive_v3.Schema$File>} The file from Google Drive.
	 */
	async recoverableDeleteById(id) {
		// Get drive client
		const drive = google.drive({ version: "v3", auth: client });

		// Delete file
		return drive.files.update({ fileId: id, requestBody: { trashed: true } }).then((res) => res.data);
	},

	/**
	 * Recover a file from the trash.
	 *
	 * @param {string} id - The ID of the file to recover.
	 *
	 * @returns {Promise<drive_v3.Schema$File>} The file from Google Drive.
	 */
	async recoverById(id) {
		// Get drive client
		const drive = google.drive({ version: "v3", auth: client });

		// Recover file
		return drive.files.update({ fileId: id, requestBody: { trashed: false } }).then((res) => res.data);
	}
};

export default driveService;
