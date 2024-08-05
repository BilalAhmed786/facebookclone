import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-7xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-lg font-medium rounded-md shadow hover:bg-blue-700 transition-colors duration-200"
        >
          <FaHome className="mr-2" />
          Go Back to Login
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
