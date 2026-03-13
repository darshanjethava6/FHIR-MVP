import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Payer from './models/Payer.js';
import IVRConfig from './models/IVRConfig.js';

dotenv.config();

async function seedIVRConfig() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prior-auth-mvp');
    console.log('✅ Connected to MongoDB');

    // Get all payers
    const payers = await Payer.find();
    
    // Clear existing IVR configs
    await IVRConfig.deleteMany({});
    console.log('🗑️  Cleared existing IVR configs');

    // Create IVR configs for each payer
    for (const payer of payers) {
      let navigationSteps = [];
      let umVendorRouting = { enabled: false };

      // BCBS IVR Config
      if (payer.payerName.includes('Blue Cross')) {
        navigationSteps = [
          { step: 1, description: 'Press 1 for Prior Authorization', keyPress: '1', waitTime: 2000 },
          { step: 2, description: 'Press 2 for Imaging Services', keyPress: '2', waitTime: 2000 },
          { step: 3, description: 'Enter NPI', keyPress: 'NPI', waitTime: 3000 },
        ];
        umVendorRouting = {
          enabled: true,
          triggerCondition: 'If routed to eviCore',
          routingSteps: [
            { step: 1, description: 'Press 3 for Advanced Imaging', keyPress: '3' },
            { step: 2, description: 'Enter Member ID', keyPress: 'MemberID' },
          ],
        };
      }
      // UnitedHealthcare IVR Config
      else if (payer.payerName.includes('UnitedHealthcare')) {
        navigationSteps = [
          { step: 1, description: 'Press 3 for Prior Authorization', keyPress: '3', waitTime: 2000 },
          { step: 2, description: 'Press 1 for Provider Services', keyPress: '1', waitTime: 2000 },
          { step: 3, description: 'Enter NPI', keyPress: 'NPI', waitTime: 3000 },
        ];
        umVendorRouting = {
          enabled: true,
          triggerCondition: 'If routed to AIM',
          routingSteps: [
            { step: 1, description: 'Press 2 for Imaging', keyPress: '2' },
            { step: 2, description: 'Enter Member ID', keyPress: 'MemberID' },
          ],
        };
      }
      // Cigna IVR Config
      else if (payer.payerName.includes('Cigna')) {
        navigationSteps = [
          { step: 1, description: 'Press 2 for Prior Authorization', keyPress: '2', waitTime: 2000 },
          { step: 2, description: 'Press 1 for Provider', keyPress: '1', waitTime: 2000 },
          { step: 3, description: 'Enter NPI', keyPress: 'NPI', waitTime: 3000 },
        ];
        umVendorRouting = {
          enabled: true,
          triggerCondition: 'If routed to CareCore',
          routingSteps: [
            { step: 1, description: 'Press 4 for Imaging Auth', keyPress: '4' },
            { step: 2, description: 'Enter Member ID', keyPress: 'MemberID' },
          ],
        };
      }
      // Default IVR Config
      else {
        navigationSteps = [
          { step: 1, description: 'Press 1 for Prior Authorization', keyPress: '1', waitTime: 2000 },
          { step: 2, description: 'Enter NPI', keyPress: 'NPI', waitTime: 3000 },
        ];
      }

      const ivrConfig = new IVRConfig({
        payerId: payer._id,
        navigationSteps,
        authenticationMethod: 'NPI',
        errorRecovery: {
          npiRejected: {
            action: 'Fallback to Tax ID',
            fallbackMethod: 'TaxID',
          },
          menuNotRecognized: {
            action: 'Retry with alternative path',
            retryCount: 2,
          },
        },
        umVendorRouting,
      });

      await ivrConfig.save();
      console.log(`✅ Created IVR config for ${payer.payerName}`);
    }

    console.log(`✅ Seeded IVR configs for ${payers.length} payers`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed IVR config error:', error);
    process.exit(1);
  }
}

seedIVRConfig();
