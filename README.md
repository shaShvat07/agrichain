# AgriChain: Blockchain-Based Agricultural Supply Chain

A supply chain management system built with Hyperledger Fabric, Express.js, and React that allows tracking agricultural products from farm to table.

## Project Structure

The project is organized into two main parts:

- **client**: React + Vite frontend application
- **server**: Express.js backend with Hyperledger Fabric integration

## Features

- Register agricultural products with unique identifiers
- Track products through the supply chain
- QR code generation for easy product verification
- Role-based access for different stakeholders:
  - Agricultural Bureau (admin)
  - Farmers
  - Processors
  - Distributors
  - Retailers
  - Quality Supervision Bureau
  - Consumers

## Prerequisites

- Node.js (v14+)
- Docker and Docker Compose
- Hyperledger Fabric test network

## Getting Started

### 1. Set up Hyperledger Fabric

Ensure your Hyperledger Fabric test network is running. Follow the official documentation to set up the test network.

### 2. Start the Backend

```bash
cd server
npm install
node scripts/enrollAdmin.js
node scripts/registerUser.js
npm run dev
```

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev
```

The application will be available at http://localhost:5173

## Development 

### Backend Structure

- `controllers/`: HTTP request handlers
- `routes/`: API route definitions
- `services/`: Business logic and blockchain interactions
- `chaincode/`: Smart contract code for Hyperledger Fabric

### Frontend Structure

- `components/`: Reusable UI components
- `pages/`: Page-level components
- `services/`: API service calls
- `context/`: React context for state management

## Deployment

For production deployment, build the frontend and serve it through the Express backend:

```bash
# Build the frontend
cd client
npm run build

# Start the production server
cd ../server
npm start
```# agrichain
# agrichain
