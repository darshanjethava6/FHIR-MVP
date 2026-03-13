import Authorization from '../models/Authorization.js';
import IVRConfig from '../models/IVRConfig.js';

/**
 * Mock Retell AI Integration Service
 * Simulates an IVR call to insurance provider using IVR configuration
 */

export const simulateInsuranceCall = async (authorizationId) => {
  console.log(`📱 Simulating Retell AI call for authorization: ${authorizationId}`);
  
  const callStartTime = Date.now();
  
  // Simulate call duration (5 seconds)
  setTimeout(async () => {
    try {
      const authorization = await Authorization.findById(authorizationId)
        .populate('payerId');
      
      if (!authorization) {
        console.error(`Authorization ${authorizationId} not found`);
        return;
      }

      // Get IVR config if payer exists
      let ivrNavigationPath = '';
      if (authorization.payerId) {
        const ivrConfig = await IVRConfig.findOne({ payerId: authorization.payerId._id });
        if (ivrConfig && ivrConfig.navigationSteps) {
          ivrNavigationPath = ivrConfig.navigationSteps
            .map((step) => `Step ${step.step}: ${step.description} (Press ${step.keyPress})`)
            .join(' → ');
        }
      }

      // Simulate IVR navigation
      const navigationSteps = [
        'Connected to IVR system',
        'Selected "Prior Authorization" option',
        'Entered NPI',
        authorization.umVendor ? `Routed to ${authorization.umVendor}` : 'Routed to main menu',
        'Entered Member ID',
        'Entered CPT Code',
        'Received authorization decision',
      ];

      // Randomly determine status (simulating AI call result)
      const statuses = ['Approved', 'Denied', 'Not Required'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      const callEndTime = Date.now();
      const callDuration = ((callEndTime - callStartTime) / 1000).toFixed(1);
      
      // Generate detailed call log
      const callLog = `
IVR Call Log - ${new Date().toISOString()}
===========================================
Payer: ${authorization.payerName}
Phone: ${authorization.payerId?.ivrPhone || 'N/A'}
UM Vendor: ${authorization.umVendor || 'N/A'}

Navigation Steps:
${navigationSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

${ivrNavigationPath ? `IVR Path: ${ivrNavigationPath}\n` : ''}
Call Duration: ${callDuration}s
Result: ${randomStatus}
===========================================
      `.trim();
      
      // Generate mock call recording link
      const callRecordingLink = `https://retell-ai-demo.com/recordings/${authorizationId}_${Date.now()}`;
      
      authorization.status = randomStatus;
      authorization.callLog = callLog;
      authorization.callTimestamp = new Date();
      authorization.callDuration = parseFloat(callDuration);
      authorization.callRecordingLink = callRecordingLink;
      authorization.ivrNavigationPath = ivrNavigationPath || navigationSteps.join(' → ');
      authorization.updatedAt = new Date();
      
      await authorization.save();
      
      console.log(`✅ Authorization ${authorizationId} updated to status: ${randomStatus}`);
      console.log(`📞 Call duration: ${callDuration}s`);
    } catch (error) {
      console.error(`❌ Error updating authorization ${authorizationId}:`, error);
    }
  }, 5000); // 5 second delay
  
  return {
    success: true,
    message: 'Insurance call simulation initiated',
    callId: `retell_${Date.now()}`,
  };
};
