import mongoose from 'mongoose';

const payerSchema = new mongoose.Schema({
  payerName: {
    type: String,
    required: true,
    unique: true,
  },
  ivrPhone: {
    type: String,
    required: true,
  },
  umVendor: {
    type: String,
    required: true,
  },
  portalLink: {
    type: String,
    default: '',
  },
  ivrNavigationScript: {
    type: String,
    default: '',
  },
  npiRequired: {
    type: Boolean,
    default: true,
  },
  taxIdFallback: {
    type: Boolean,
    default: false,
  },
  memberIdPrefix: {
    type: String,
    default: '',
  },
});

export default mongoose.model('Payer', payerSchema);
