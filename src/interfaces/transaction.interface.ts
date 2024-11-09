import { Schema } from "mongoose";

export interface ITransaction extends Document {
    book_id: Schema.Types.ObjectId;
    borrower_id: Schema.Types.ObjectId;
    borrow_date: Date;
    due_date: Date;
    return_date?: Date;
   
  }