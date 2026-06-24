const express = require("express");

const app = express();
const checkReferral = require("./referralChecker");
const extractReferral = require("./extractReferral");

app.use(express.json());

const referrals = [];

app.get("/", (req, res) => {
  res.json({
    message: "ReferralFlow API is running"
  });
});

// make endpoint referrals and check insurance

app.post("/referrals", (req, res) => {
  const referral = {
    id: `ref_${referrals.length + 1}`,
    patientName: req.body.patientName,
    dob: req.body.dob,
    insurance: req.body.insurance,
    serviceRequested: req.body.serviceRequested,
    diagnosisCode: req.body.diagnosisCode,
    documents: req.body.documents || []
  };

  const checkResult = checkReferral(referral);

  referral.status = checkResult.status;
  referral.missingDocuments = checkResult.missingDocuments;
  referral.priorAuthRequired = checkResult.priorAuthRequired;
  referral.queue = checkResult.queue;
  referral.message = checkResult.message;

  referrals.push(referral);

  res.status(201).json(referral);
});

// Get referral info
app.get("/referrals", (req, res) => {
  res.json(referrals);
});

//get referral through id
app.get("/referrals/:id", (req, res) => {
  const referral = referrals.find(item => item.id === req.params.id);

  if (!referral) {
    return res.status(404).json({
      error: "Referral not found"
    });
  }

  res.json(referral);
});

//update referral when missing documents are added
app.patch("/referrals/:id/documents", (req, res) => {
  const referral = referrals.find(item => item.id === req.params.id);

  if (!referral) {
    return res.status(404).json({
      error: "Referral not found"
    });
  }

  const newDocuments = req.body.documents || [];

  referral.documents = [...new Set([...referral.documents, ...newDocuments])];

  const checkResult = checkReferral(referral);

  referral.status = checkResult.status;
  referral.missingDocuments = checkResult.missingDocuments;
  referral.priorAuthRequired = checkResult.priorAuthRequired;
  referral.queue = checkResult.queue;
  referral.message = checkResult.message;

  res.json(referral);
});

// queue endpoint returns all referrals in that queue.

app.get("/queues/:queueName", (req, res) => {
  const queueName = req.params.queueName;

  const queueReferrals = referrals.filter(referral => {
    return referral.queue === queueName;
  });

  res.json({
    queue: queueName,
    count: queueReferrals.length,
    referrals: queueReferrals
  });
});

// extract raw text

app.post("/referrals/extract", (req, res) => {
  const rawText = req.body.rawText;

  if (!rawText) {
    return res.status(400).json({
      error: "rawText is required"
    });
  }

  const extractedData = extractReferral(rawText);

  res.json({
    rawText,
    extractedData
  });
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});