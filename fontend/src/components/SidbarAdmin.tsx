import  { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarAdmin = () => {
  const location = useLocation();  // to track current route
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`bg-blue-600 text-white w-64 p-6 h-screen ${isOpen ? 'block' : 'hidden'} md:block`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Library</h2>
        <button
          className="md:hidden text-white"
          onClick={toggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav>
        <ul>
          <li className={`mb-4 ${location.pathname === '/admin' ? 'text-blue-300' : ''}`}>
            <Link to="/admin" className="hover:text-blue-300">Books</Link>
          </li>
          <li className={`mb-4 ${location.pathname === '/admin/borrowers' ? 'text-blue-300' : ''}`}>
            <Link to="/admin/borrowers" className="hover:text-blue-300">Borrowers</Link>
          </li>
          <li className={`mb-4 ${location.pathname === '/admin/history' ? 'text-blue-300' : ''}`}>
            <Link to="/admin/borrowers" className="hover:text-blue-300">All History</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
