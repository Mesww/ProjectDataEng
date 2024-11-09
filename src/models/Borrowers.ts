import { Schema, model, Document } from 'mongoose';
import { IBorrower, Iborrowing_history } from '../interfaces/borrower.interface';

  const BorrowingHistorySchema = new Schema<Iborrowing_history>({
    book_id: { type: String, required: true },
    borrow_date: { type: Date, required: true },
    return_date: { type: Date }
  });

  const borrowerSchema = new Schema<IBorrower>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    activeStatus: { type: Boolean, default: true },
    borrowing_history: { type: [BorrowingHistorySchema], default: [] }
  });
  
  const Borrower = model<IBorrower>('Borrower', borrowerSchema);
  export { Borrower, BorrowingHistorySchema };
  export default Borrower;
  