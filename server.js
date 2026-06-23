const express = require("express");

const app = express();

app.use(express.json());

const referrals = [];

app.get("/", (req, res) => {
  res.json({
    message: "ReferralFlow API is running"
  });
});

// make endpoint referrals

app.post("/referrals", (req, res) => {
  const referral = {
    id: `ref_${referrals.length + 1}`,
    patientName: req.body.patientName,
    dob: req.body.dob,
    insurance: req.body.insurance,
    serviceRequested: req.body.serviceRequested,
    diagnosisCode: req.body.diagnosisCode,
    documents: req.body.documents || [],
    status: "new"
  };

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

//endpoint for one referral

app.get("/referrals/:id", (req, res) => {
  const referral = referrals.find(item => item.id === req.params.id);

  if (!referral) {
    return res.status(404).json({
      error: "Referral not found"
    });
  }

  res.json(referral);
});


const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});