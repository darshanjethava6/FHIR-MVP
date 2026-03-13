import Patient from '../models/Patient.js';
import Payer from '../models/Payer.js';
import Authorization from '../models/Authorization.js';
import IVRConfig from '../models/IVRConfig.js';
import Provider from '../models/Provider.js';

/**
 * Authorization Request Engine
 * Automatically detects when a procedure requires prior authorization
 * and routes to the correct payer/UM vendor
 */

// CPT codes that typically require prior authorization for imaging
const REQUIRES_AUTH_CPT_CODES = [
  '70450', // CT Head
  '70460', // CT Head with contrast
  '70470', // CT Neck
  '72141', // MRI Brain
  '72146', // MRI Brain with contrast
  '72156', // MRI Cervical Spine
  '72157', // MRI Cervical Spine with contrast
  '73721', // MRI Lower Extremity
  '74150', // CT Abdomen
  '74160', // CT Abdomen with contrast
];

export const checkRequiresPriorAuth = (cptCode) => {
  return REQUIRES_AUTH_CPT_CODES.includes(cptCode);
};

export const getProcedureName = (cptCode) => {
  const procedureMap = {
    '70450': 'CT Head without contrast',
    '70460': 'CT Head with contrast',
    '70470': 'CT Neck',
    '72141': 'MRI Brain without contrast',
    '72146': 'MRI Brain with contrast',
    '72156': 'MRI Cervical Spine without contrast',
    '72157': 'MRI Cervical Spine with contrast',
    '73721': 'MRI Lower Extremity',
    '74150': 'CT Abdomen without contrast',
    '74160': 'CT Abdomen with contrast',
  };
  return procedureMap[cptCode] || `Procedure ${cptCode}`;
};

export const identifyPayerAndVendor = async (payerName) => {
  try {
    const payer = await Payer.findOne({
      payerName: { $regex: new RegExp(payerName, 'i') },
    });

    if (!payer) {
      return {
        payerId: null,
        payerName,
        umVendor: null,
        ivrPhone: null,
      };
    }

    return {
      payerId: payer._id,
      payerName: payer.payerName,
      umVendor: payer.umVendor,
      ivrPhone: payer.ivrPhone,
    };
  } catch (error) {
    console.error('Error identifying payer:', error);
    return {
      payerId: null,
      payerName,
      umVendor: null,
      ivrPhone: null,
    };
  }
};

export const getIVRConfig = async (payerId) => {
  try {
    const config = await IVRConfig.findOne({ payerId }).populate('payerId');
    return config;
  } catch (error) {
    console.error('Error fetching IVR config:', error);
    return null;
  }
};

export const createAuthorizationRequest = async (data) => {
  const { patientId, cptCode, providerId, appointmentDate, priority, modality, orderingProvider } = data;

  // Check if procedure requires prior auth
  const requiresAuth = checkRequiresPriorAuth(cptCode);

  // Get patient and identify payer
  const patient = await Patient.findById(patientId).populate('providerId', 'name');
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Get provider name for payer identification
  const providerName = patient.providerId?.name || '';
  if (!providerName) {
    throw new Error('Patient provider not found');
  }

  const payerInfo = await identifyPayerAndVendor(providerName);

  // Create authorization record (always create, but set status based on requiresAuth)
  const authorization = new Authorization({
    patientId,
    cptCode,
    procedureName: getProcedureName(cptCode),
    providerId: providerId || undefined,
    payerId: payerInfo.payerId,
    payerName: payerInfo.payerName || providerName,
    umVendor: payerInfo.umVendor || '',
    appointmentDate: appointmentDate ? new Date(appointmentDate) : null,
    priority: priority || 'Routine',
    modality: modality || '',
    orderingProvider: orderingProvider || '',
    status: requiresAuth ? 'Pending' : 'Not Required',
  });

  await authorization.save();

  // Get IVR config if payer is found
  let ivrConfig = null;
  if (payerInfo.payerId) {
    ivrConfig = await getIVRConfig(payerInfo.payerId);
  }

  return {
    authorization,
    payerInfo,
    ivrConfig,
    requiresAuth,
  };
};
