import { useEffect, useState } from "react";
import { fetchBooks } from "../../api/booksApi";
import { addTransaction } from "../../api/transactionApi";
import Books from "../../interfaces/bookInterface";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const [books, setBooks] = useState<Books[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const getBooks = async () => {
      try {
        const response = await fetchBooks();
        const fetchedBooks = response.books.Books;
        setBooks(fetchedBooks);
      } catch (err: unknown) {
        setError((err as { message: string }).message);
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  // Function to handle book checkout
  const handleCheckout = async (book: Books) => {
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7); // Set due date 7 days from now

    const transactionData = {
      book_id: book._id,
      borrower_id: user?.id ?? '',
      borrow_date: borrowDate.toISOString(),
      due_date: dueDate.toISOString(),
      return_date: ""
    };

    try {
      console.log(transactionData)
      await addTransaction(transactionData);
      alert(`Successfully checked out ${book.title}`);
      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b._id === book._id ? { ...b, available: false } : b
        )
      );
    } catch (err) {
      alert(err + " Failed to check out the book.");
    }
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error)
    return <p className="text-center text-xl text-red-500">Error: {error}</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">Welcome {user?.name}</h1>
        <div className="text-center mb-6">
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">Book List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-blue-600">{book.title}</h3>
              <p className="text-gray-600 mt-1">Author: {book.author}</p>
              <p className="text-gray-600">Genre: {book.genre}</p>
              <p className="text-gray-600">ISBN: {book.isbn}</p>
              <p className="text-gray-600">
                Publication Date: {new Date(book.publication_date).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Availability: {book.available ? "Available" : "Checked Out"}
              </p>
              <p className="text-gray-600">
                Due Date: {book.due_date ? new Date(book.due_date).toLocaleDateString() : "N/A"}
              </p>
              <button
                onClick={() => handleCheckout(book)}
                disabled={!book.available}
                className={`mt-4 px-4 py-2 rounded text-white ${
                  book.available ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {book.available ? "Check Out" : "Not Available"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
