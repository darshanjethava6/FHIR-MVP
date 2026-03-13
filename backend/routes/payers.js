import express from 'express';
import Payer from '../models/Payer.js';

const router = express.Router();

// GET all payers
router.get('/', async (req, res) => {
  try {
    const payers = await Payer.find().sort({ payerName: 1 });
    res.json(payers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET payer by ID
router.get('/:id', async (req, res) => {
  try {
    const payer = await Payer.findById(req.params.id);
    if (!payer) {
      return res.status(404).json({ error: 'Payer not found' });
    }
    res.json(payer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
