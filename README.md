# n8n-nodes-rest-accounting

Community nodes to connect n8n to the Rest Accounting API.

## Installation

Place this folder in your n8n custom nodes directory or install as a local package.

```bash
cd n8n-nodes-rest-accounting
npm install
npm run build
```

Then configure n8n to load custom nodes (see n8n documentation).

## Credentials
- Rest Accounting API credentials store:
  - Base URL (e.g., http://localhost:3000)
  - API Key (sent as x-api-key)

## Node Operations
- Health: Get
- Accounts: List, Create, Get, Update
- Journal Entries: Search, Create, Get, Delete
- Reports: Trial Balance, Ledger, Balance Sheet, Profit & Loss

## Notes
- All protected calls require the API key.
- Query parameters support pagination and filters where applicable.
