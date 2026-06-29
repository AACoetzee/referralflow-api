function extractReferral(rawText) {
  const text = rawText.toLowerCase();

  let patientName = null;
  let dob = null;
  let insurance = null;
  let serviceRequested = null;
  let diagnosisCode = null;
  const documents = [];

  // Extract patient name
const nameMatch = rawText.match(/patient\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)/i);

  if (nameMatch) {
    patientName = `${nameMatch[1]} ${nameMatch[2]}`;
  }

  // Extract DOB in MM/DD/YYYY format
  const dobMatch = rawText.match(/\b\d{2}\/\d{2}\/\d{4}\b/);

  if (dobMatch) {
    const parts = dobMatch[0].split("/");
    dob = `${parts[2]}-${parts[0]}-${parts[1]}`;
  }

  // Extract insurance
  if (text.includes("aetna")) {
    insurance = "Aetna";
  }

  if (text.includes("cigna")) {
    insurance = "Cigna";
  }

  if (text.includes("unitedhealthcare") || text.includes("united healthcare")) {
    insurance = "UnitedHealthcare";
  }

  // Extract service requested
  if (text.includes("sleep study")) {
    serviceRequested = "sleep_study";
  }

  if (text.includes("physical therapy")) {
    serviceRequested = "physical_therapy";
  }

  if (text.includes("imaging") || text.includes("mri") || text.includes("ct scan")) {
    serviceRequested = "imaging";
  }

  // Extract documents
  if (text.includes("referral form")) {
    documents.push("referral_form");
  }

  if (text.includes("insurance card")) {
    documents.push("insurance_card");
  }

  if (text.includes("clinical notes")) {
    documents.push("clinical_notes");
  }

  if (text.includes("imaging order")) {
    documents.push("imaging_order");
  }

  // Extract diagnosis code like G47.33
  const diagnosisMatch = rawText.match(/[A-Z][0-9]{2}\.[0-9]{2}/);

  if (diagnosisMatch) {
    diagnosisCode = diagnosisMatch[0];
  }

  return {
    patientName,
    dob,
    insurance,
    serviceRequested,
    diagnosisCode,
    documents
  };
}

module.exports = extractReferral;