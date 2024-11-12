// src/interfaces/borrowerInterface.ts

// Interface for an individual borrowing record in the borrowing history
interface BorrowingRecord {
    book_id: string;
    borrow_date: string;
    return_date?: string; // Optional because some entries may not have a return date
    _id: string;
  }
  
  // Main interface for a borrower
  interface Borrower {
     _id: string;
    name: string;
    email: string;
    phone: string;
    activeStatus: boolean;
    borrowing_history: BorrowingRecord[]; // Array of borrowing records
    role: string;
    // password: string; // Not typically stored in plain text in real applications
  }
  
  export default Borrower;
  