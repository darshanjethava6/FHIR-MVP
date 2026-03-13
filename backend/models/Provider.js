import mongoose from 'mongoose';

/**
 * Provider Model - Represents Payers (Insurance Companies)
 * This is a simplified model for managing insurance companies/payers
 * with just name and id fields for now
 */
const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Provider', providerSchema);
