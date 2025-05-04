// src/components/RoleSelector.jsx
import React from 'react'

const RoleSelector = ({ onRoleChange, selectedRole }) => {
  const roles = [
    { id: 'farmer', name: 'Farmer' },
    { id: 'processor', name: 'Processor' },
    { id: 'bureau', name: 'Agricultural Bureau' },
    { id: 'inspector', name: 'Quality Inspector' },
    { id: 'distributor', name: 'Distributor' },
    { id: 'retailer', name: 'Retailer' },
    { id: 'consumer', name: 'Consumer' }
  ];
  
  return (
    <div className="relative">
      <select
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
      >
        <option value="">Select Role</option>
        {roles.map(role => (
          <option key={role.id} value={role.name}>
            {role.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default RoleSelector;