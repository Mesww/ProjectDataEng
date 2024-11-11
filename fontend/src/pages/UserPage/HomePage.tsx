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

  const handleCheckout = async (book: Books) => {
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 7);

    const transactionData = {
      book_id: book._id,
      borrower_id: user?.id ?? '',
      borrow_date: borrowDate.toISOString(),
      due_date: dueDate.toISOString(),
      return_date: ""
    };

    try {
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg text-gray-600">Loading your library...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <p className="text-red-600 text-lg font-medium">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome back, <span className="text-blue-600">{user?.name}</span>
            </h1>
            <button
              onClick={logout}
              className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 focus:ring-4 focus:ring-red-200"
            >
              Logout
            </button>
          </div>

          {/* Books Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Available Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-gray-600">by {book.author}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-2">Genre:</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                          {book.genre}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">ISBN:</span> {book.isbn}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Published:</span>{' '}
                        {new Date(book.publication_date).toLocaleDateString()}
                      </p>
                      <div className="flex items-center text-sm">
                        <span className="font-medium mr-2">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full ${
                            book.available
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-50 text-gray-600'
                          }`}
                        >
                          {book.available ? 'Available' : 'Checked Out'}
                        </span>
                      </div>
                      {book.due_date && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Due Date:</span>{' '}
                          {new Date(book.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleCheckout(book)}
                      disabled={!book.available}
                      className={`w-full py-2.5 rounded-lg font-medium transition-colors duration-200 ${
                        book.available
                          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {book.available ? 'Check Out' : 'Not Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;