// src/components/Navbar.jsx
import React from 'react';
// src/components/Navbar.jsx - updated with stakeholders link
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ userRole }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-bold text-xl">AgriChain</span>
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md hover:bg-green-700">Home</Link>
              <Link to="/dashboard" className="px-3 py-2 rounded-md hover:bg-green-700">Dashboard</Link>
              <Link to="/products" className="px-3 py-2 rounded-md hover:bg-green-700">Products</Link>
              <Link to="/stakeholders" className="px-3 py-2 rounded-md hover:bg-green-700">Stakeholders</Link>
              <Link to="/scan-qr" className="px-3 py-2 rounded-md hover:bg-green-700">Trace Product</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            {userRole ? (
              <div className="flex items-center">
                <span className="bg-green-700 text-white px-3 py-1 rounded-md mr-4">
                  {userRole}
                </span>
                <Link to="/register-stakeholder" className="bg-white text-green-800 px-4 py-2 rounded-md hover:bg-gray-100">
                  Register
                </Link>
              </div>
            ) : (
              <Link to="/register-stakeholder" className="bg-white text-green-800 px-4 py-2 rounded-md hover:bg-gray-100">
                Register
              </Link>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none"
            >
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded-md hover:bg-green-700" onClick={toggleMobileMenu}>Home</Link>
          <Link to="/dashboard" className="block px-3 py-2 rounded-md hover:bg-green-700" onClick={toggleMobileMenu}>Dashboard</Link>
          <Link to="/products" className="block px-3 py-2 rounded-md hover:bg-green-700" onClick={toggleMobileMenu}>Products</Link>
          <Link to="/stakeholders" className="block px-3 py-2 rounded-md hover:bg-green-700" onClick={toggleMobileMenu}>Stakeholders</Link>
          <Link to="/scan-qr" className="block px-3 py-2 rounded-md hover:bg-green-700" onClick={toggleMobileMenu}>Trace Product</Link>
          {userRole && (
            <div className="px-3 py-2">
              <span className="bg-green-700 px-2 py-1 rounded-md text-sm">
                Role: {userRole}
              </span>
            </div>
          )}
          <Link
            to="/register-stakeholder"
            className="block px-3 py-2 bg-white text-green-800 rounded-md mt-2"
            onClick={toggleMobileMenu}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  