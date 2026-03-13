import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import patientRoutes from './routes/patients.js';
import authorizationRoutes from './routes/authorizations.js';
import payerRoutes from './routes/payers.js';
import providerRoutes from './routes/providers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prior-auth-mvp')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/patients', patientRoutes);
app.use('/api/authorizations', authorizationRoutes);
app.use('/api/payers', payerRoutes);
app.use('/api/providers', providerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Prior Authorization API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
