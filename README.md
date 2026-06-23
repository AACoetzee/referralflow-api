# ReferralFlow API

A small Express API for creating and viewing patient referrals.

## Setup

```sh
npm install
npm start
```

The API runs at `http://localhost:3000`.

## Endpoints

- `GET /` - health/status message
- `POST /referrals` - create a referral
- `GET /referrals` - list referrals
- `GET /referrals/:id` - get a referral by ID
