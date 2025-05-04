// src/pages/NotFound.jsx
import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <svg
          className="h-24 w-24 text-green-600 mb-6 mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-700 mb-6">Page Not Found</h2>
        
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
          >
            Go Back Home
          </Link>
          
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full"
          >
            View Products
          </Link>
        </div>
        
        <div className="mt-10">
          <p className="text-sm text-gray-500">
            Lost? Try searching for what you're looking for or checking your URL.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;