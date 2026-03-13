import mongoose from 'mongoose';

/**
 * Patient Model
 * 
 * Required Fields:
 * - name: Patient's full name
 * - dob: Date of birth
 * - providerId: Reference to Provider (Insurance Company/Payer)
 * - memberId: Insurance member ID
 * 
 * Optional Fields:
 * - payerId: Reference to Payer (auto-populated from provider lookup)
 * - medicalHistory: Patient's medical history notes
 * - requiresPriorAuth: Flag for prior auth requirements (auto-set)
 * - createdAt: Timestamp (auto-set)
 */
const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payer',
    required: false, // Auto-populated from provider lookup
  },
  memberId: {
    type: String,
    required: true,
  },
  medicalHistory: {
    type: String,
    default: '',
    required: false,
  },
  requiresPriorAuth: {
    type: Boolean,
    default: false,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

export default mongoose.model('Patient', patientSchema);
