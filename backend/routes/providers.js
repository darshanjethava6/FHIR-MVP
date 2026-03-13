import express from 'express';
import Provider from '../models/Provider.js';

/**
 * Providers Routes
 * Note: "Provider" model represents Payers (Insurance Companies)
 * This is a simplified model for managing insurance companies/payers
 */
const router = express.Router();

// GET all payers (insurance companies)
router.get('/', async (req, res) => {
  try {
    const providers = await Provider.find().sort({ name: 1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET payer by ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ error: 'Payer not found' });
    }
    
    res.json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new payer (insurance company)
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Payer name is required' });
    }

    const provider = new Provider({
      name,
    });

    await provider.save();
    res.status(201).json(provider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
