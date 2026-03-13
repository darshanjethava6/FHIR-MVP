import mongoose from 'mongoose';

const ivrConfigSchema = new mongoose.Schema({
  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payer',
    required: true,
    unique: true,
  },
  navigationSteps: [
    {
      step: Number,
      description: String,
      keyPress: String,
      waitTime: Number, // milliseconds
    },
  ],
  authenticationMethod: {
    type: String,
    enum: ['NPI', 'TaxID', 'MemberID'],
    default: 'NPI',
  },
  errorRecovery: {
    npiRejected: {
      action: String,
      fallbackMethod: String,
    },
    menuNotRecognized: {
      action: String,
      retryCount: Number,
    },
  },
  umVendorRouting: {
    enabled: Boolean,
    triggerCondition: String,
    routingSteps: [
      {
        step: Number,
        description: String,
        keyPress: String,
      },
    ],
  },
});

export default mongoose.model('IVRConfig', ivrConfigSchema);
