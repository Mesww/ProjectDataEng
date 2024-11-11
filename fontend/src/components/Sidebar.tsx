import  { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      {/* Sidebar */}
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
            <li className="mb-4">
              <Link to="/" className="hover:text-blue-300">Home</Link>
            </li>
            <li className="mb-4">
              <Link to="/history" className="hover:text-blue-300">History</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {/* Main content will be rendered here */}
      </div>
    </div>
  );
};

export default Sidebar;
