import { Schema, model, Document } from 'mongoose';
import { IBook } from '../interfaces/book.interface';

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  publication_date: { type: Date, required: true },
  isbn: { type: String, unique: true, required: true },
  available: { type: Boolean, default: true },
  borrower_id: { type: String, default: null },
  due_date: { type: Date, default: null },
});

const Book = model<IBook>('Books', bookSchema);
export default Book;