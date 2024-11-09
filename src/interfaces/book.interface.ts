export interface IBook extends Document {
    title: string;
    author: string;
    genre?: string;
    publication_date: Date ;
    isbn: string;
    available: boolean;
    borrower_id?: string ;
    due_date?: Date   ;
  }
  
  