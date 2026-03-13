import express from 'express';
import Authorization from '../models/Authorization.js';
import { triggerWorkflow } from '../integrations/ghlService.js';
import { simulateInsuranceCall } from '../integrations/retellService.js';
import { createAuthorizationRequest } from '../services/authorizationEngine.js';

const router = express.Router();

// GET all authorizations with filters
router.get('/', async (req, res) => {
  try {
    const { status, payer, dateFrom, dateTo, patientId } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (payer) {
      query.payerName = { $regex: new RegExp(payer, 'i') };
    }
    
    if (patientId) {
      query.patientId = patientId;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }
    
    const authorizations = await Authorization.find(query)
      .populate('patientId', 'name dob insuranceProvider memberId')
      .populate('payerId', 'payerName ivrPhone umVendor portalLink')
      .populate('providerId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(authorizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET authorization by ID
router.get('/:id', async (req, res) => {
  try {
    const authorization = await Authorization.findById(req.params.id)
      .populate('patientId', 'name dob insuranceProvider memberId medicalHistory')
      .populate('payerId', 'payerName ivrPhone umVendor portalLink')
      .populate('providerId', 'name');
    
    if (!authorization) {
      return res.status(404).json({ error: 'Authorization not found' });
    }
    res.json(authorization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new authorization
router.post('/', async (req, res) => {
  try {
    const { patientId, cptCode, providerId, appointmentDate, remarks, priority, modality, orderingProvider } = req.body;
    
    if (!patientId || !cptCode) {
      return res.status(400).json({ error: 'Patient ID and CPT Code are required' });
    }

    // Use authorization engine to create request
    const result = await createAuthorizationRequest({
      patientId,
      cptCode,
      providerId,
      appointmentDate,
      priority,
      modality,
      orderingProvider,
    });

    const authorization = result.authorization;
    
    // Add remarks if provided
    if (remarks) {
      authorization.remarks = remarks;
      await authorization.save();
    }

    // Simulate GHL workflow trigger (even if not required, for demo purposes)
    await triggerWorkflow({
      authorizationId: authorization._id,
      patientId,
      cptCode,
      payer: authorization.payerName,
      umVendor: authorization.umVendor,
      ivrPhone: result.payerInfo.ivrPhone,
    });

    // Simulate Retell AI call only if requires auth (will update status after 5 seconds)
    if (result.requiresAuth) {
      simulateInsuranceCall(authorization._id);
    }

    // Return authorization with all details
    const populatedAuth = await Authorization.findById(authorization._id)
      .populate('patientId', 'name dob insuranceProvider memberId')
      .populate('payerId', 'payerName ivrPhone umVendor portalLink')
      .populate('providerId', 'name');

    res.status(201).json(populatedAuth);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
