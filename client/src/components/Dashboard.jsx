// src/components/Dashboard.jsx
import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoleSelector from './RoleSelector';
import { stakeholderService, productService } from '../services/api';

const Dashboard = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [Error, setError] = useState('');
  const [IsLoading, setIsLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    products: 0,
    stakeholders: 0,
    recentActivity: []
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch products and stakeholders count using Promise.all for parallel requests
        const [productsData, stakeholdersData] = await Promise.all([
          productService.getAllProducts(),
          stakeholderService.getAllStakeholders()
        ]);

        // Update the dashboard data with real counts
        setDashboardData({
          products: productsData?.data?.length,
          stakeholders: stakeholdersData?.data?.length,
          recentActivity: []
        });

      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedRole]);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-green-800">Supply Chain Dashboard</h1>
        <RoleSelector onRoleChange={handleRoleChange} selectedRole={selectedRole} />
      </div>

      {selectedRole && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Welcome, {selectedRole}</h2>
          <p className="text-gray-600">
            You can manage your supply chain activities from this dashboard.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Products</h3>
          <p className="text-3xl font-bold text-gray-800 mb-4">{dashboardData.products}</p>
          <Link to="/products" className="text-green-600 hover:text-green-800">
            View all products →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Stakeholders</h3>
          <p className="text-3xl font-bold text-gray-800 mb-4">{dashboardData.stakeholders}</p>
          <Link to="/stakeholders" className="text-green-600 hover:text-green-800">
            View all stakeholders →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-green-700 mb-2">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {selectedRole === 'Farmer' && (
              <>
                <Link to="/register-product" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                  Register Product
                </Link>
                <Link to="/record-harvest" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                  Record Harvest
                </Link>
              </>
            )}

            {selectedRole === 'Processor' && (
              <Link to="/record-processing" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                Record Processing
              </Link>
            )}

            {selectedRole === 'Quality Inspector' && (
              <Link to="/quality-check" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                Perform Quality Check
              </Link>
            )}

            {selectedRole === 'Distributor' && (
              <Link to="/record-distribution" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                Record Distribution
              </Link>
            )}

            {selectedRole === 'Retailer' && (
              <Link to="/record-sale" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                Record Sale
              </Link>
            )}

            {selectedRole === 'Agricultural Bureau' && (
              <Link to="/approve-farmer" className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                Approve Farmer
              </Link>
            )}

            <Link to="/scan-qr" className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
              Trace Product
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-green-700 mb-4">Recent Activity</h3>
        {dashboardData.recentActivity.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {dashboardData.recentActivity.map(activity => (
              <li key={activity.id} className="py-3">
                <div className="flex justify-between">
                  <span className="text-gray-800">{activity.action}</span>
                  <span className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span>
                </div>
                <span className="text-sm text-gray-600">By {activity.actor}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;