import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { fetchborrowerById } from '../../api/borrowerApi';
import { deleteTransaction, fetchTransactions } from '../../api/transactionApi';
import { fetchBookById } from '../../api/booksApi';

interface Books {
  title: string;
  author: string;
  genre: string;
  publication_date: string;
  isbn: string;
}

interface BorrowingHistory {
  _id: string;
  book_id: string;
  borrow_date: string;
  return_date: string | null;
}

const HistoryPage = () => {
  const { user } = useAuth();
  const [borrowingHistory, setBorrowingHistory] = useState<BorrowingHistory[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [books, setBooks] = useState<{ [key: string]: Books }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user && user.id) {
          const borrowerResponse = await fetchborrowerById(user.id);
          
          if (borrowerResponse && borrowerResponse.borrower) {
            // Sort the history array by borrow_date in descending order (newest first)
            const history = [...(borrowerResponse.borrower.borrowing_history || [])].sort(
              (a, b) => new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime()
            );
            
            setBorrowingHistory(history);

            const transactionResponse = await fetchTransactions();
            const allTransactions = transactionResponse.transactions || [];
            setTransactions(allTransactions);

            const bookDetails = await Promise.all(
              history.map(async (item: { book_id: string }) => {
                const bookData = await fetchBookById(item.book_id);
                return { book_id: item.book_id, book: bookData.book.book };
              })
            );

            const bookDetailsMap = bookDetails.reduce((acc: { [key: string]: any }, item) => {
              acc[item.book_id] = item.book;
              return acc;
            }, {});

            setBooks(bookDetailsMap);
          } else {
            setError('No borrower data found for this user.');
          }
        }
      } catch (err) {
        console.error("Error fetching borrower data:", err);
        setError('Failed to fetch borrowing history or book details');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleReturnBook = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction._id !== transactionId)
      );
      alert('Book returned successfully');
    } catch (err) {
      setError('Failed to return book');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    // Check if the date is yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    // For all other dates
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (history: BorrowingHistory) => {
    const transaction = transactions.find(
      (txn) => txn.book_id === history.book_id && txn.borrower_id === user?.id
    );
    const isReturned = transaction && transaction.return_date;

    if (isReturned || history.return_date) {
      return <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">Returned</span>;
    }
    
    const borrowDate = new Date(history.borrow_date);
    const currentDate = new Date();
    const daysOverdue = Math.floor((currentDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue > 14) {
      return <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Overdue</span>;
    }
    return <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">Borrowed</span>;
  };

  const MainContent = () => (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Borrowing History</h1>
            <p className="text-gray-500 mt-2">Track your book borrowing activity</p>
          </div>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Total Books: {borrowingHistory.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {borrowingHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">📚</div>
            <p className="text-gray-600">No borrowing history available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {borrowingHistory.map((history) => {
              const book = books[history.book_id];
              const transaction = transactions.find(
                (txn) => txn.book_id === history.book_id && txn.borrower_id === user?.id
              );

              return (
                <div 
                  key={history._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {book?.title}
                      </h3>
                      {getStatusBadge(history)}
                    </div>
                    <p className="text-sm text-gray-500">ISBN: {book?.isbn}</p>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* Book Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">👤</span>
                        <span>{book?.author}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">🏷️</span>
                        <span>{book?.genre}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">📅</span>
                        <span>Published: {new Date(book?.publication_date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Borrowing Details */}
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">📥</span>
                        <span>Borrowed: {formatDate(history.borrow_date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="mr-2">📤</span>
                        <span>
                          {history.return_date
                            ? `Returned: ${formatDate(history.return_date)}`
                            : 'Not returned yet'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  {!transaction?.return_date && !history.return_date && (
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => handleReturnBook(transaction._id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                      >
                        Return Book
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen h-screen bg-gray-50">
      <Sidebar />
      <MainContent />
    </div>
  );
};

export default HistoryPage;