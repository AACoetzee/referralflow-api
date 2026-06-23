//Different insurance companies have different rules.”

const payerRules = {
  Aetna: {
    sleep_study: {
      priorAuthRequired: true,
      requiredDocuments: ["referral_form", "insurance_card", "clinical_notes"],
      queue: "sleep_medicine_intake"
    }
  },
  Cigna: {
    physical_therapy: {
      priorAuthRequired: false,
      requiredDocuments: ["referral_form", "insurance_card"],
      queue: "physical_therapy_intake"
    }
  },
  UnitedHealthcare: {
    imaging: {
      priorAuthRequired: true,
      requiredDocuments: ["referral_form", "insurance_card", "clinical_notes", "imaging_order"],
      queue: "imaging_prior_auth"
    }
  }
};

module.exports = payerRules;