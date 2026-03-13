import express from 'express';
import Patient from '../models/Patient.js';
import Authorization from '../models/Authorization.js';
import Payer from '../models/Payer.js';
import Provider from '../models/Provider.js';
import { identifyPayerAndVendor } from '../services/authorizationEngine.js';

const router = express.Router();

// GET all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('providerId', 'name')
      .populate('payerId', 'payerName ivrPhone umVendor')
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET patient by ID with authorization history
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('providerId', 'name')
      .populate('payerId', 'payerName ivrPhone umVendor portalLink');
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get authorization history for this patient
    const authorizations = await Authorization.find({ patientId: patient._id })
      .populate('payerId', 'payerName ivrPhone umVendor')
      .sort({ createdAt: -1 });

    res.json({
      ...patient.toObject(),
      authorizationHistory: authorizations,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new patient
router.post('/', async (req, res) => {
  try {
    const { name, dob, providerId, memberId, medicalHistory } = req.body;
    
    if (!name || !dob || !providerId || !memberId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(400).json({ error: 'Invalid provider selected' });
    }

    // Identify payer and link to patient using provider name
    const payerInfo = await identifyPayerAndVendor(provider.name);

    const patient = new Patient({
      name,
      dob,
      providerId,
      payerId: payerInfo.payerId || null,
      memberId,
      medicalHistory: medicalHistory || '',
      requiresPriorAuth: false, // Will be set based on procedures
    });

    const savedPatient = await patient.save();
    
    // Populate provider and payer info
    const populatedPatient = await Patient.findById(savedPatient._id)
      .populate('providerId', 'name')
      .populate('payerId', 'payerName ivrPhone umVendor portalLink');
    
    res.status(201).json(populatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
