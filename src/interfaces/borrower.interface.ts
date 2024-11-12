import { Model } from "mongoose";

export interface IBorrowingHistory {
  book_id: string;
  borrow_date: Date;
  return_date?: Date;
  due_date: Date;
  status: string;
}

export interface IBorrower extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
  activeStatus: boolean;
  borrowing_history: IBorrowingHistory[];
  updateOverdueStatus: () => Promise<void>;
}

export interface IBorrowerModel extends Model<IBorrower> {
  checkOverdueStatuses: () => Promise<void>;
}