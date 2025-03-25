import Transaction from "../models/Transaction.js";
import Receipt from "../models/Receipt.js";
import Course from "../models/Course.js";

function createIncludeClause() {
	return {
		model: Receipt,
		as: "receipt",
		attributes: ["id", "course_id", "name", "amount", "deadline", "document_url", "note"],
		include: [
			{
				model: Course,
				as: "course",
				attributes: ["id", "name", "description", "code"]
			}
		]
	};
}

const transactionDto = {
	findAll: async ({ limit, offset }, txn) => {
		return Transaction.findAll({ limit, offset, transaction: txn, include: createIncludeClause() });
	},
	total: async (txn) => {
		return Transaction.count({ include: createIncludeClause(), transaction: txn });
	},
	findByReceiptId: async ({ limit, offset }, receiptId, txn) => {
		return Transaction.findAll({
			where: { receipt_id: receiptId },
			limit,
			offset,
			transaction: txn,
			include: createIncludeClause()
		});
	},
	totalByReceiptId: async (receiptId, txn) => {
		return Transaction.count({ where: { receipt_id: receiptId }, transaction: txn });
	},
	findById: async (id, txn) => {
		return Transaction.findByPk(id, { transaction: txn, include: createIncludeClause() });
	},
	create: async (transaction, txn) => {
		return Transaction.create(transaction, { transaction: txn, include: createIncludeClause() });
	},
	update: async (id, transaction, txn) => {
		await Transaction.update(transaction, { where: { id } }, { transaction: txn });
		return Transaction.findByPk(id, { transaction: txn, include: createIncludeClause() });
	},
	delete: async (id, txn) => {
		return Transaction.destroy({ where: { id }, transaction: txn });
	}
};

export default transactionDto;
