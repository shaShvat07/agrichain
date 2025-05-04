// routes/stakeholderRoutes.js
import express from 'express';
import { body } from 'express-validator';
import * as stakeholderController from '../controllers/stakeholderController.js';

const router = express.Router();

// Validation middleware
const validateStakeholder = [
  body('id').notEmpty().withMessage('Stakeholder ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').notEmpty().withMessage('Role is required'),
  body('location').notEmpty().withMessage('Location is required')
];

// Routes
router.post('/', validateStakeholder, stakeholderController.registerStakeholder);
router.get('/', stakeholderController.getAllStakeholders); // New route for getting all stakeholders
router.get('/:id', stakeholderController.getStakeholderById);
router.get('/role/:role', stakeholderController.getStakeholdersByRole);

// Bureau specific routes
router.post('/bureau', [
  body('id').notEmpty().withMessage('Bureau ID is required'),
  body('name').notEmpty().withMessage('Bureau name is required'),
  body('location').notEmpty().withMessage('Location is required')
], stakeholderController.registerBureau);

router.post('/bureau/approve-farmer', [
  body('bureauId').notEmpty().withMessage('Bureau ID is required'),
  body('farmerId').notEmpty().withMessage('Farmer ID is required')
], stakeholderController.approveFarmer);

export { router as stakeholderRoutes };