# ReferralFlow API

ReferralFlow API is a small Express service for creating patient referrals, checking payer-specific intake requirements, and routing referrals into the right work queue.

Referrals are stored in memory for now, so data resets when the server restarts.

## Features

- Create referrals with patient, insurance, diagnosis, service, and document details
- Check referrals against payer rules
- Flag missing required documents
- Identify whether prior authorization is required
- Route referrals into intake or prior authorization queues
- Add missing documents and automatically re-check referral status

## Setup

```sh
npm install
npm start
```

The API runs at `http://localhost:3000`.

## Endpoints

### Health Check

```http
GET /
```

Returns a status message confirming that the API is running.

### Create Referral

```http
POST /referrals
```

Example request:

```json
{
  "patientName": "Jane Doe",
  "dob": "1988-04-12",
  "insurance": "Aetna",
  "serviceRequested": "sleep_study",
  "diagnosisCode": "G47.33",
  "documents": ["referral_form", "insurance_card"]
}
```

Example response:

```json
{
  "id": "ref_1",
  "patientName": "Jane Doe",
  "dob": "1988-04-12",
  "insurance": "Aetna",
  "serviceRequested": "sleep_study",
  "diagnosisCode": "G47.33",
  "documents": ["referral_form", "insurance_card"],
  "status": "needs_more_info",
  "missingDocuments": ["clinical_notes"],
  "priorAuthRequired": true,
  "queue": "sleep_medicine_intake",
  "message": "Referral checked successfully"
}
```

### List Referrals

```http
GET /referrals
```

Returns all referrals created since the server started.

### Get Referral By ID

```http
GET /referrals/:id
```

Returns one referral, or a `404` response if it does not exist.

### Add Referral Documents

```http
PATCH /referrals/:id/documents
```

Example request:

```json
{
  "documents": ["clinical_notes"]
}
```

Adds the documents, removes duplicates, and re-checks the referral.

### View Queue

```http
GET /queues/:queueName
```

Example:

```http
GET /queues/sleep_medicine_intake
```

Returns all referrals currently assigned to that queue.

## Current Payer Rules

| Insurance | Service | Prior Auth | Required Documents | Queue |
| --- | --- | --- | --- | --- |
| Aetna | `sleep_study` | Yes | `referral_form`, `insurance_card`, `clinical_notes` | `sleep_medicine_intake` |
| Cigna | `physical_therapy` | No | `referral_form`, `insurance_card` | `physical_therapy_intake` |
| UnitedHealthcare | `imaging` | Yes | `referral_form`, `insurance_card`, `clinical_notes`, `imaging_order` | `imaging_prior_auth` |

If no matching insurance or service rule exists, the referral is routed to `manual_review`.
