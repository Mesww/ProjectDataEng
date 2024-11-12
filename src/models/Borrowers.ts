import { Schema, model } from 'mongoose';
import { IBorrower, IBorrowerModel, IBorrowingHistory } from '../interfaces/borrower.interface';

const BorrowingHistorySchema = new Schema<IBorrowingHistory>({
  book_id: { type: String, required: true },
  borrow_date: { type: Date, required: true },
  return_date: { type: Date },
  due_date: { type: Date, required: true },
  status: { type: String, required: true, default: 'borrowed' }
});

const borrowerSchema = new Schema<IBorrower>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  activeStatus: { type: Boolean, default: true },
  borrowing_history: { type: [BorrowingHistorySchema], default: [] }
});

// Instance method to update overdue status for a single borrower
borrowerSchema.methods.updateOverdueStatus = async function () {
  const now = new Date();
  this.borrowing_history.forEach((history:IBorrowingHistory) => {
    if (history.status !== 'returned') {
      if ((history.return_date && history.return_date > history.due_date) || 
          (!history.return_date && now > history.due_date)) {
        history.status = 'overdue';
      }
    }
  });
  await this.save();
};

// Static method to check overdue statuses for all borrowers
borrowerSchema.statics.checkOverdueStatuses = async function () {
  const borrowers = await this.find();
  await Promise.all(borrowers.map((borrower:IBorrower) => borrower.updateOverdueStatus()));
};

const Borrower = model<IBorrower, IBorrowerModel>('Borrower', borrowerSchema);
export { Borrower, BorrowingHistorySchema };
export default Borrower;
