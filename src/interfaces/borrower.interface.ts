export interface IBorrower extends Document {
    name: string;
    email: string;
    phone?: string;
    activeStatus: boolean;
    borrowing_history?: Iborrowing_history[];
  }
  export interface Iborrowing_history {
    book_id: string;
    borrow_date: Date;
    return_date?: Date;
  }