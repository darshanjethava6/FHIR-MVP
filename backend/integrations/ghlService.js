/**
 * Mock GoHighLevel Integration Service
 * Simulates triggering a workflow in GoHighLevel
 */

export const triggerWorkflow = async (data) => {
  console.log('📞 GHL Workflow Triggered');
  console.log('Data:', JSON.stringify(data, null, 2));
  
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: 'GHL Workflow triggered successfully',
    workflowId: `ghl_${Date.now()}`,
  };
};
