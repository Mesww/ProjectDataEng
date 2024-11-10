import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { fetchborrowerById } from '../../api/borrowerApi';
import { fetchBookById } from '../../api/booksApi';
import Books from '../../interfaces/bookInterface';

interface BorrowingHistory {
  _id: string;
  book_id: string;
  borrow_date: string;
}

const HistoryPage = () => {
  const { user } = useAuth();
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingHistory[]>([]);
  const [books, setBooks] = useState<Books[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(user && user.id) {
          const response = await fetchborrowerById(user.id);
        const history = response.borrower.borrowing_history || [];
        setBorrowingHistory(history);

        // Fetch book details for each book_id in borrowing history
        const bookDetails = await Promise.all(
          history.map(async (item: { book_id: string; }) => {
            const bookData = await fetchBookById(item.book_id);
            return { book_id: item.book_id, book: bookData.book.book };
          })
        );

        // Map book details by book_id for easy access
        const bookDetailsMap = bookDetails.reduce((acc, item) => {
          acc[item.book_id] = item.book;
          return acc;
        }, {});

        setBooks(bookDetailsMap);
        }
      } catch (err) {
        setError('Failed to fetch borrowing history or book details');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">History Page</h1>
        <h2 className="text-2xl font-semibold text-center mb-4">Borrowing History</h2>

        {/* Display Loading, Error, or Borrowing History */}
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && borrowingHistory.length === 0 && <p className="text-center">No borrowing history available.</p>}

        {borrowingHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {borrowingHistory.map((history) => {
              const book = books[history.book_id];
              return (
                <div key={history._id} className="bg-white shadow-md rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">Book Details</h3>
                  {book ? (
                    <>
                      <p><strong>Title:</strong> {book.title}</p>
                      <p><strong>Author:</strong> {book.author}</p>
                      <p><strong>Genre:</strong> {book.genre}</p>
                      <p><strong>Publication Date:</strong> {new Date(book.publication_date).toLocaleDateString()}</p>
                      <p><strong>ISBN:</strong> {book.isbn}</p>
                      
                    </>
                  ) : (
                    <p>Loading book details...</p>
                  )}
                   <p className="mt-4"><strong>Borrowed Date:</strong> {new Date(history.borrow_date).toLocaleDateString()}</p>
                  <p ><strong>Due Date:</strong> {new Date(book.due_date).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
