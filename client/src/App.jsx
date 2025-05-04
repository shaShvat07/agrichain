// src/App.jsx - Updated with routes for all components
import React from 'react';
// Update in src/App.jsx - add the new import and routes
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Layout components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

// Shared pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import StakeholderList from './pages/StakeholderList';
import StageTransition from './pages/StageTransition'; // Add this import

// Farmer pages
import RegisterProduct from './pages/farmer/RegisterProduct';
import RecordHarvest from './pages/farmer/RecordHarvest';

// Processor pages
import RecordProcessing from './pages/processor/RecordProcessing';

// Quality Inspector pages
import QualityCheck from './pages/inspector/QualityCheck';

// Distributor pages
import RecordDistribution from './pages/distributor/RecordDistribution';

// Retailer pages
import RecordSale from './pages/retailer/RecordSale';

// Bureau pages
import ApproveFarmer from './pages/bureau/ApproveFarmer';

// Consumer pages
import ScanQR from './pages/consumer/ScanQR';

// Authentication & Registration
import RegisterStakeholder from './pages/auth/RegisterStakeholder';

function App() {
  const [userRole, setUserRole] = useState('');
  
  // In a real app, this would be handled by a context provider
  const handleRoleChange = (role) => {
    setUserRole(role);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole} />
      
      <main className="container mx-auto px-4 py-8">
        <Routes>
          {/* Common routes */}
          <Route path="/" element={<Home onRoleChange={handleRoleChange} />} />
          <Route path="/dashboard" element={<Dashboard userRole={userRole} onRoleChange={handleRoleChange} />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/stakeholders" element={<StakeholderList />} />
          
          {/* Stage transition routes */}
          <Route path="/record-planting" element={<StageTransition />} /> {/* Add this route */}
          <Route path="/record-growth" element={<StageTransition />} /> {/* Add this route */}
          
          {/* Farmer routes */}
          <Route path="/register-product" element={<RegisterProduct />} />
          <Route path="/record-harvest" element={<RecordHarvest />} />
          
          {/* Processor routes */}
          <Route path="/record-processing" element={<RecordProcessing />} />
          
          {/* Quality Inspector routes */}
          <Route path="/quality-check" element={<QualityCheck />} />
          
          {/* Distributor routes */}
          <Route path="/record-distribution" element={<RecordDistribution />} />
          
          {/* Retailer routes */}
          <Route path="/record-sale" element={<RecordSale />} />
          
          {/* Bureau routes */}
          <Route path="/approve-farmer" element={<ApproveFarmer />} />
          
          {/* Consumer routes */}
          <Route path="/scan-qr" element={<ScanQR />} />
          
          {/* Authentication & Registration */}
          <Route path="/register-stakeholder" element={<RegisterStakeholder />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="bg-green-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">AgriChain</h3>
              <p className="text-green-200">Blockchain-powered agricultural supply chain</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-green-200">© {new Date().getFullYear()} AgriChain. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;