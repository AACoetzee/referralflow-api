// brain of the app

const payerRules = require("./rules");

function checkReferral(referral) {
  const insuranceRules = payerRules[referral.insurance];

  if (!insuranceRules) {
    return {
      status: "manual_review",
      missingDocuments: [],
      priorAuthRequired: false,
      queue: "manual_review",
      message: "No payer rules found for this insurance"
    };
  }

  const serviceRules = insuranceRules[referral.serviceRequested];

  if (!serviceRules) {
    return {
      status: "manual_review",
      missingDocuments: [],
      priorAuthRequired: false,
      queue: "manual_review",
      message: "No service rules found for this insurance and service"
    };
  }

  //Go through every required document. Keep the ones that are not inside the referral documents.
  
  const missingDocuments = serviceRules.requiredDocuments.filter(requiredDoc => {
    return !referral.documents.includes(requiredDoc);
  });

  let status;

  if (missingDocuments.length > 0) {
    status = "needs_more_info";
  } else if (serviceRules.priorAuthRequired) {
    status = "ready_for_prior_auth";
  } else {
    status = "ready_to_schedule";
  }

  return {
    status,
    missingDocuments,
    priorAuthRequired: serviceRules.priorAuthRequired,
    queue: serviceRules.queue,
    message: "Referral checked successfully"
  };
}

module.exports = checkReferral;