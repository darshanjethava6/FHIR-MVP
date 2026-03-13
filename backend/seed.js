import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Payer from './models/Payer.js';

dotenv.config();

const payers = [
  {
    payerName: 'Blue Cross Blue Shield',
    ivrPhone: '1-800-555-0101',
    umVendor: 'Evicore',
    portalLink: 'https://www.bcbs.com/provider-portal',
    ivrNavigationScript: 'Press 1 for Prior Auth → Press 2 for Imaging → Enter NPI',
    npiRequired: true,
    taxIdFallback: true,
    memberIdPrefix: '',
  },
  {
    payerName: 'UnitedHealthcare',
    ivrPhone: '1-800-555-0102',
    umVendor: 'AIM',
    portalLink: 'https://www.uhc.com/provider-portal',
    ivrNavigationScript: 'Press 3 for Prior Auth → Press 1 for Provider → Enter NPI',
    npiRequired: true,
    taxIdFallback: false,
    memberIdPrefix: '',
  },
  {
    payerName: 'Cigna',
    ivrPhone: '1-800-555-0103',
    umVendor: 'CareCore',
    portalLink: 'https://www.cigna.com/provider-portal',
    ivrNavigationScript: 'Press 2 for Prior Auth → Press 1 for Provider → Enter NPI',
    npiRequired: true,
    taxIdFallback: true,
    memberIdPrefix: '',
  },
  {
    payerName: 'Aetna',
    ivrPhone: '1-800-555-0104',
    umVendor: 'Evicore',
    portalLink: 'https://www.aetna.com/provider-portal',
    ivrNavigationScript: 'Press 1 for Prior Auth → Enter NPI',
    npiRequired: true,
    taxIdFallback: true,
    memberIdPrefix: '',
  },
  {
    payerName: 'Humana',
    ivrPhone: '1-800-555-0105',
    umVendor: 'AIM',
    portalLink: 'https://www.humana.com/provider-portal',
    ivrNavigationScript: 'Press 2 for Prior Auth → Enter NPI',
    npiRequired: true,
    taxIdFallback: false,
    memberIdPrefix: '',
  },
  {
    payerName: 'Elevance Health',
    ivrPhone: '1-800-555-0106',
    umVendor: 'Evicore',
    portalLink: 'https://www.elevancehealth.com/provider-portal',
    ivrNavigationScript: 'Press 1 for Prior Auth → Enter NPI',
    npiRequired: true,
    taxIdFallback: true,
    memberIdPrefix: '',
  },
  {
    payerName: 'Centene',
    ivrPhone: '1-800-555-0107',
    umVendor: 'AIM',
    portalLink: 'https://www.centene.com/provider-portal',
    ivrNavigationScript: 'Press 3 for Prior Auth → Enter NPI',
    npiRequired: true,
    taxIdFallback: false,
    memberIdPrefix: '',
  },
  {
    payerName: 'Kaiser Permanente',
    ivrPhone: '1-800-555-0108',
    umVendor: 'CareCore',
    portalLink: 'https://www.kp.org/provider-portal',
    ivrNavigationScript: 'Press 2 for Prior Auth → Enter NPI',
    npiRequired: true,
    taxIdFallback: true,
    memberIdPrefix: '',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prior-auth-mvp');
    console.log('✅ Connected to MongoDB');

    // Clear existing payers
    await Payer.deleteMany({});
    console.log('🗑️  Cleared existing payers');

    // Insert seed payers
    await Payer.insertMany(payers);
    console.log(`✅ Seeded ${payers.length} payers`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
