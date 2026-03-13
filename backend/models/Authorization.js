import mongoose from 'mongoose';

const authorizationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  cptCode: {
    type: String,
    required: true,
  },
  procedureName: {
    type: String,
    default: '',
  },
  priority: {
    type: String,
    enum: ['Routine', 'Urgent', 'Stat'],
    default: 'Routine',
  },
  modality: {
    type: String,
    default: '',
  },
  orderingProvider: {
    type: String,
    default: '',
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  },
  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payer',
  },
  payerName: {
    type: String,
    required: true,
  },
  umVendor: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Denied', 'Not Required'],
    default: 'Pending',
  },
  appointmentDate: {
    type: Date,
  },
  callLog: {
    type: String,
    default: '',
  },
  callTimestamp: {
    type: Date,
  },
  callDuration: {
    type: Number, // in seconds
    default: 0,
  },
  callRecordingLink: {
    type: String,
    default: '',
  },
  ivrNavigationPath: {
    type: String,
    default: '',
  },
  remarks: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Authorization', authorizationSchema);
