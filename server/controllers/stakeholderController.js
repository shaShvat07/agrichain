// controllers/stakeholderController.js
import { validationResult } from 'express-validator';
import * as fabricService from '../services/fabricService.js';

// Register a new stakeholder
export const registerStakeholder = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, role, location } = req.body;
    
    // Call fabric service to register stakeholder
    const result = await fabricService.registerStakeholder(id, name, role, location);
    
    res.status(201).json({
      status: 'success',
      message: `Stakeholder ${id} has been registered`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Get stakeholder by ID
export const getStakeholderById = async (req, res, next) => {
  try {
    const stakeholderId = req.params.id;
    
    // Call fabric service to get the stakeholder
    const stakeholder = await fabricService.getStakeholder(stakeholderId);
    
    res.json({
      status: 'success',
      data: stakeholder
    });
  } catch (error) {
    next(error);
  }
};

// Get all stakeholders
export const getAllStakeholders = async (req, res, next) => {
  try {
    // Call fabric service to get all stakeholders
    const stakeholders = await fabricService.getAllStakeholders();
    
    res.json({
      status: 'success',
      data: stakeholders
    });
  } catch (error) {
    next(error);
  }
};

// Get stakeholders by role
export const getStakeholdersByRole = async (req, res, next) => {
  try {
    const role = req.params.role;
    
    // Call fabric service to get stakeholders by role
    const stakeholders = await fabricService.getStakeholdersByRole(role);
    
    res.json({
      status: 'success',
      data: stakeholders
    });
  } catch (error) {
    next(error);
  }
};

// Register a new agricultural bureau
export const registerBureau = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name } = req.body;
    
    // Register bureau as a regular stakeholder with the "Agricultural Bureau" role
    const result = await fabricService.registerStakeholder(id, name, "Agricultural Bureau", req.body.location || "");
    
    res.status(201).json({
      status: 'success',
      message: `Agricultural Bureau ${id} has been registered`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Approve farmer by bureau
export const approveFarmer = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { bureauId, farmerId } = req.body;
    
    // Call fabric service to approve farmer
    const result = await fabricService.approveFarmer(bureauId, farmerId);
    
    res.status(200).json({
      status: 'success',
      message: `Farmer ${farmerId} has been approved by Bureau ${bureauId}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};