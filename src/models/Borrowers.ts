import { Schema, model } from 'mongoose';
import { IBorrower, IBorrowerModel, IBorrowingHistory } from '../interfaces/borrower.interface';

const BorrowingHistorySchema = new Schema<IBorrowingHistory>({
  book_id: { type: String, required: true },
  borrow_date: { type: Date, required: true },
  return_date: { type: Date },
  due_date: { type: Date, required: true },
  status: { type: String, required: true, default: 'borrowed' },
  finds: { type: Number, default: 0 }
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
// Fine rate per day for overdue books
const FINE_RATE = 100;
// Instance method to update overdue status and calculate fines for a single borrower
borrowerSchema.methods.updateOverdueStatus = async function () {
  const now = new Date();

  this.borrowing_history.forEach((history: IBorrowingHistory) => {
    if (history.status !== 'returned') {
      if ((history.return_date && history.return_date > history.due_date) ||
          (!history.return_date && now > history.due_date)) {
        
        // Set status to 'overdue'
        history.status = 'overdue';

        // Calculate the overdue days
        const overdueDays = history.return_date 
          ? Math.ceil((history.return_date.getTime() - history.due_date.getTime()) / (1000 * 60 * 60 * 24))
          : Math.ceil((now.getTime() - history.due_date.getTime()) / (1000 * 60 * 60 * 24));

        // Calculate the fine and update `finds`
        history.finds = overdueDays * FINE_RATE;
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
