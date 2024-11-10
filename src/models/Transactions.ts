import { Schema, model, Document } from 'mongoose';
import { ITransaction } from '../interfaces/transaction.interface';

  
  const transactionSchema = new Schema<ITransaction>({
    book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrower_id: { type: Schema.Types.ObjectId, ref: 'Borrower', required: true },
    borrow_date: { type: Date, default: Date.now },
    due_date: { type: Date, required: true },
    return_date: { type: Date },
  });
  
  const Transaction = model<ITransaction>('Transaction', transactionSchema);
  export default Transaction;