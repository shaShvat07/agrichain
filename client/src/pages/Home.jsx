// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RoleSelector from '../components/RoleSelector';

const Home = ({ onRoleChange }) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="md:flex">
          <div className="p-8 md:w-1/2">
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              Agricultural Supply Chain on Blockchain
            </h1>
            <p className="text-gray-600 mb-6">
              Track agricultural products from farm to table with complete transparency and traceability.
              Our blockchain-based platform ensures data integrity and trust throughout the supply chain.
            </p>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Select your role to get started:
              </label>
              <RoleSelector onRoleChange={onRoleChange} />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Go to Dashboard
              </Link>
              <Link to="/scan-qr" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Trace Product
              </Link>
            </div>
          </div>
          
          <div className="bg-green-700 md:w-1/2 p-8 text-white flex items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Why use AgriChain?</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Complete traceability from farm to consumer</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Tamper-proof records on blockchain</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Quality verification at every stage</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Consumer transparency through QR codes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stakeholders Section */}
      <h2 className="text-2xl font-bold text-green-800 mb-6">Supply Chain Stakeholders</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Farmers</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Register products, record planting, growth stages, and harvests. Gain verification from agricultural bureaus.
          </p>
          <Link to="/register-product" className="text-green-600 hover:text-green-800 font-medium">
            Register a product →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Processors</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Record processing activities, create product batches, and maintain chain of custody for agricultural products.
          </p>
          <Link to="/record-processing" className="text-green-600 hover:text-green-800 font-medium">
            Record processing →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Quality Inspectors</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Verify product quality, issue certifications, and ensure compliance with agricultural standards.
          </p>
          <Link to="/quality-check" className="text-green-600 hover:text-green-800 font-medium">
            Perform quality check →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Distributors</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Track product distribution, manage logistics, and ensure products reach retailers with full traceability.
          </p>
          <Link to="/record-distribution" className="text-green-600 hover:text-green-800 font-medium">
            Record distribution →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Retailers</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Record sales transactions, generate QR codes for consumers, and maintain the final link in the supply chain.
          </p>
          <Link to="/record-sale" className="text-green-600 hover:text-green-800 font-medium">
            Record sale →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Consumers</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Scan product QR codes to view complete supply chain history, verify authenticity, and make informed purchases.
          </p>
          <Link to="/scan-qr" className="text-green-600 hover:text-green-800 font-medium">
            Trace Product
          </Link>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-green-700 text-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Agricultural Blockchain Revolution</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Register as a stakeholder today and become part of our transparent supply chain network. 
          Help build trust with consumers and gain visibility into your products' journey.
        </p>
        <Link to="/register-stakeholder" className="bg-white text-green-700 px-6 py-3 rounded-lg hover:bg-gray-100 inline-block font-medium">
          Register as a Stakeholder
        </Link>
      </div>
    </div>
  );
};

export default Home;