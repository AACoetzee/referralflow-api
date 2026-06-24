function extractReferral(rawText) {
  const text = rawText.toLowerCase();

  let insurance = null;
  let serviceRequested = null;
  let diagnosisCode = null;
  const documents = [];

  if (text.includes("aetna")) {
    insurance = "Aetna";
  }

  if (text.includes("cigna")) {
    insurance = "Cigna";
  }

  if (text.includes("unitedhealthcare") || text.includes("united healthcare")) {
    insurance = "UnitedHealthcare";
  }

  if (text.includes("sleep study")) {
    serviceRequested = "sleep_study";
  }

  if (text.includes("physical therapy")) {
    serviceRequested = "physical_therapy";
  }

  if (text.includes("imaging") || text.includes("mri") || text.includes("ct scan")) {
    serviceRequested = "imaging";
  }

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

  const diagnosisMatch = rawText.match(/[A-Z][0-9]{2}\.[0-9]{2}/);

  if (diagnosisMatch) {
    diagnosisCode = diagnosisMatch[0];
  }

  return {
    insurance,
    serviceRequested,
    diagnosisCode,
    documents
  };
}

module.exports = extractReferral;