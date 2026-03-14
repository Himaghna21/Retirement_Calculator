# Retirement Calculator API Contract

## Overview
The Retirement Calculator API provides financial calculations for retirement planning. All calculations are illustrative and for planning purposes only.

## Base URL
`http://localhost:3000/api`

## Endpoints

### 1. `POST /calculate`
Calculate retirement planning requirements.

#### Request Headers
- `Content-Type: application/json`

#### Request Body Fields

| Field | Type | Range | Required | Description |
|---|---|---|---|---|
| `currentAge` | Integer | 18-79 | Yes | User's current age in years |
| `retirementAge` | Integer | >currentAge, ≤80 | Yes | Planned retirement age in years |
| `currentAnnualExpenses` | Number | 0-10,000,000,000 | Yes | Annual expenses in rupees (₹) |
| `inflationRate` | Number | 0-50 | Yes | Expected annual inflation rate (%) |
| `postRetirementReturn` | Number | 0-50 | Yes | Expected post-retirement annual return (%) |
| `preRetirementReturn` | Number | 0-50 | Yes | Expected pre-retirement annual return (%) |
| `retirementDuration` | Integer | 1-100 | No | Expected retirement duration (years). Default: 85 - retirementAge |

#### Responses

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "retirementAnnualExpense": 4291871.41,
    "requiredCorpus": 45502189.75,
    "requiredMonthlySIP": 8234.56,
    "yearsToRetirement": 25,
    "assumptions": {
      "inflationRate": "6%",
      "preRetirementReturn": "12%",
      "postRetirementReturn": "7%",
      "retirementDuration": "25 years",
      "lifeExpectancyAssumption": "85 years"
    },
    "disclaimer": "This is an illustrative calculation. Actual results may vary based on market conditions and other factors.",
    "calculatedAt": "2026-03-12T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request) - Missing Required Field**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "currentAge": "currentAge is required",
    "retirementAge": "retirementAge is required"
  },
  "statusCode": 400,
  "timestamp": "2026-03-12T10:30:00Z"
}
```

**Error Response (400 Bad Request) - Invalid Value Range**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "currentAge": "currentAge must be between 18 and 79"
  },
  "statusCode": 400,
  "timestamp": "2026-03-12T10:30:00Z"
}
```

**Error Response (400 Bad Request) - Logical Error**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "retirementAge": "Retirement age must be greater than current age"
  },
  "statusCode": 400,
  "timestamp": "2026-03-12T10:30:00Z"
}
```

**Error Response (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "An error occurred during calculation",
  "errors": "Database connection error",
  "statusCode": 500,
  "timestamp": "2026-03-12T10:30:00Z"
}
```

#### Request Examples

**Basic Request with cURL:**
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "currentAge": 35,
    "retirementAge": 60,
    "currentAnnualExpenses": 1000000,
    "inflationRate": 6,
    "postRetirementReturn": 7,
    "preRetirementReturn": 12
  }'
```

**With Custom Retirement Duration:**
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "currentAge": 35,
    "retirementAge": 60,
    "currentAnnualExpenses": 1000000,
    "inflationRate": 6,
    "postRetirementReturn": 7,
    "preRetirementReturn": 12,
    "retirementDuration": 30
  }'
```

**JavaScript/Fetch:**
```javascript
const response = await fetch('/api/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    currentAge: 35,
    retirementAge: 60,
    currentAnnualExpenses: 1000000,
    inflationRate: 6,
    postRetirementReturn: 7,
    preRetirementReturn: 12,
  }),
});

const data = await response.json();
console.log(data);
```

**Python/Requests:**
```python
import requests

url = 'http://localhost:3000/api/calculate'
payload = {
    'currentAge': 35,
    'retirementAge': 60,
    'currentAnnualExpenses': 1000000,
    'inflationRate': 6,
    'postRetirementReturn': 7,
    'preRetirementReturn': 12,
}

response = requests.post(url, json=payload)
data = response.json()
print(data)
```

**Postman:**
```text
Method: POST
URL: http://localhost:3000/api/calculate
Headers:
  Content-Type: application/json

Body (JSON):
{
  "currentAge": 35,
  "retirementAge": 60,
  "currentAnnualExpenses": 1000000,
  "inflationRate": 6,
  "postRetirementReturn": 7,
  "preRetirementReturn": 12
}
```

---

### 2. `GET /health`
Health check endpoint for API monitoring.

#### Request
```http
GET /api/health HTTP/1.1
```

#### Responses

**Success Response (200 OK)**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-12T10:30:00Z",
  "database": "connected"
}
```

**Error Response (503 Service Unavailable)**
```json
{
  "status": "unhealthy",
  "timestamp": "2026-03-12T10:30:00Z",
  "database": "disconnected",
  "error": "Connection timeout"
}
```

**cURL Example**
```bash
curl -X GET http://localhost:3000/api/health
```

---

### 3. `GET /content`
Fetch CMS content (disclaimer, assumptions) from Drupal.

#### Request
```http
GET /api/content HTTP/1.1
```

#### Responses

**Success Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "disclaimer": "<h3>Disclaimer</h3><p>This Retirement Planning Calculator is intended purely for illustrative purposes...</p>",
    "assumptions": {
      "retirement_duration": "20 years (or 85 - Retirement Age)",
      "inflation_assumption": "As per user input",
      "pre_retirement_return": "As per user input",
      "post_retirement_return": "As per user input",
      "life_expectancy": "85 years"
    }
  }
}
```

**cURL Example**
```bash
curl -X GET http://localhost:3000/api/content
```

---

## Response Codes

| Code | Meaning | Scenario |
|---|---|---|
| `200` | Success | Calculation completed successfully or health check passed |
| `400` | Bad Request | Invalid input or validation error |
| `500` | Internal Error | Server-side error (DB, calculation, etc.) |
| `503` | Service Unavailable | Database or critical service down |

---

## Data Types & Formats

### Currency
- **Format:** Indian Rupees (₹)
- **Precision:** 2 decimal places
- **Range:** 0 to 1,000,000,000 (₹100 Crores)
- **Example:** `1234567.89` → Returned as `1234567.89`
- **Display:** Frontend formats as ₹12.34Cr (crores) or ₹1.23L (lakhs)

### Percentage
- **Format:** Percentage (%)
- **Precision:** 2 decimal places
- **Range:** 0 to 50
- **Request:** Sent as number `6.5` (not as string "6.5%")
- **Response:** Returned as string `"6.5%"` in assumptions

### Integer
- **Format:** Whole number (no decimals)
- **Range:** As specified per field
- **Example:** `35` (age in years)

### Timestamp
- **Format:** ISO 8601 with UTC timezone
- **Example:** `2026-03-12T10:30:00Z` or `2026-03-12T10:30:00+00:00`

---

## Calculation Examples

### Example 1: Conservative Scenario
**Request:**
```json
{
  "currentAge": 40,
  "retirementAge": 65,
  "currentAnnualExpenses": 500000,
  "inflationRate": 5,
  "postRetirementReturn": 5,
  "preRetirementReturn": 8
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "retirementAnnualExpense": 1603665.34,
    "requiredCorpus": 19846304.93,
    "requiredMonthlySIP": 1844.67,
    "yearsToRetirement": 25,
    "assumptions": {
      "inflationRate": "5%",
      "preRetirementReturn": "8%",
      "postRetirementReturn": "5%",
      "retirementDuration": "20 years",
      "lifeExpectancyAssumption": "85 years"
    },
    "disclaimer": "This is an illustrative calculation...",
    "calculatedAt": "2026-03-12T10:30:00Z"
  }
}
```

### Example 2: Aggressive Scenario
**Request:**
```json
{
  "currentAge": 30,
  "retirementAge": 55,
  "currentAnnualExpenses": 2000000,
  "inflationRate": 7,
  "postRetirementReturn": 8,
  "preRetirementReturn": 15
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "retirementAnnualExpense": 7639437.27,
    "requiredCorpus": 80250000.00,
    "requiredMonthlySIP": 18500.50,
    "yearsToRetirement": 25,
    "assumptions": {
      "inflationRate": "7%",
      "preRetirementReturn": "15%",
      "postRetirementReturn": "8%",
      "retirementDuration": "30 years",
      "lifeExpectancyAssumption": "85 years"
    },
    "disclaimer": "This is an illustrative calculation...",
    "calculatedAt": "2026-03-12T10:30:00Z"
  }
}
```

### Example 3: Zero Return Rate
**Request:**
```json
{
  "currentAge": 50,
  "retirementAge": 60,
  "currentAnnualExpenses": 1000000,
  "inflationRate": 0,
  "postRetirementReturn": 0,
  "preRetirementReturn": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "retirementAnnualExpense": 1000000.00,
    "requiredCorpus": 25000000.00,
    "requiredMonthlySIP": 208333.33,
    "yearsToRetirement": 10,
    "assumptions": {
      "inflationRate": "0%",
      "preRetirementReturn": "0%",
      "postRetirementReturn": "0%",
      "retirementDuration": "25 years",
      "lifeExpectancyAssumption": "85 years"
    },
    "disclaimer": "This is an illustrative calculation...",
    "calculatedAt": "2026-03-12T10:30:00Z"
  }
}
```

---

## Validation Rules

### Current Age
- **Range:** 18 to 79 years (inclusive)
- **Type:** Integer
- **Validation Error:** "currentAge must be between 18 and 79"

### Retirement Age
- **Range:** Must be > currentAge and ≤ 80
- **Type:** Integer
- **Validation Error:** "Retirement age must be greater than current age"

### Current Annual Expenses
- **Range:** 0 to ₹100,000,000,000 (100 Crores)
- **Type:** Number (decimal allowed)
- **Validation Error:** "currentAnnualExpenses must be greater than 0"

### Inflation Rate
- **Range:** 0 to 50 percent
- **Type:** Number
- **Validation Error:** "inflationRate must be between 0 and 50"

### Post-Retirement Return
- **Range:** 0 to 50 percent
- **Type:** Number
- **Validation Error:** "postRetirementReturn must be between 0 and 50"

### Pre-Retirement Return
- **Range:** 0 to 50 percent
- **Type:** Number
- **Validation Error:** "preRetirementReturn must be between 0 and 50"

### Retirement Duration (Optional)
- **Range:** 1 to 100 years
- **Type:** Integer
- **Default:** 85 - retirementAge
- **Validation Error:** "retirementDuration must be between 1 and 100"

---

## Financial Formulas

### Step 1: Inflate Annual Expenses
```text
Retirement Annual Expense = Current Annual Expense × (1 + inflation_rate)^(years_to_retirement)
```
**Example:**
- Current Expense: ₹1,000,000
- Inflation: 6% per annum
- Years to Retirement: 25
- Result: ₹1,000,000 × (1.06)^25 = ₹4,291,871.41

### Step 2: Calculate Required Corpus (PV of Annuity)
```text
Corpus = Annual Expense × [(1 − (1 + r)^(−t)) ÷ r]
```
Where:
- `r` = Post-retirement annual return (as decimal)
- `t` = Expected retirement duration in years

**Special Case (r = 0):**
```text
Corpus = Annual Expense × Duration (years)
```

**Example:**
- Retirement Expense: ₹4,291,871.41
- Post-retirement Return: 7% per annum
- Duration: 25 years
- Result: ₹4,291,871.41 × [(1 - (1.07)^-25) / 0.07] = ₹45,502,189.75

### Step 3: Calculate Monthly SIP
```text
P = FV ÷ {[((1 + i)^n − 1) ÷ i] × (1 + i)}
```
Where:
- `FV` = Required Corpus (from Step 2)
- `i` = Monthly return rate = (annual return ÷ 12) as decimal
- `n` = Number of months = years to retirement × 12
- `P` = Monthly SIP (what we solve for)

**Special Case (i = 0):**
```text
P = FV ÷ (years × 12)
```

**Example:**
- Required Corpus: ₹45,502,189.75
- Pre-retirement Return: 12% per annum
- Years to Retirement: 25
- Monthly Return: 0.12 ÷ 12 = 0.01 (1%)
- Number of Months: 25 × 12 = 300
- Result: ₹8,234.56 per month

---

## Rate Limiting

- **Current Status:** Not implemented in MVP
- **Future Implementation:**
  - 300 requests per minute per IP
  - Returns 429 (Too Many Requests) when exceeded

## Authentication

- **Current Status:** No authentication required (public API)
- **Future Implementation:**
  - OAuth2 for admin endpoints
  - API keys for rate-limited access
  - Session-based for user data

## CORS

- **Allowed Origins:**
  - `http://localhost:3000` (development)
  - `https://localhost:3000` (local HTTPS)
  - `https://your-production-domain.com` (production)
- **Allowed Methods:** POST, GET, OPTIONS
- **Allowed Headers:** Content-Type, Accept

## Database Storage

The API stores calculation inputs and results for:
- **Analytics:** Track usage patterns and trends
- **Debugging:** Support and troubleshooting
- **Compliance:** Audit trails and compliance records

**Important:** No personally identifiable information (PII) is stored.

---

## Error Response Structure

All error responses follow this structure:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": {
    "fieldName": "Specific field error",
    "anotherField": "Another specific error"
  },
  "statusCode": 400,
  "timestamp": "2026-03-12T10:30:00Z"
}
```
**Fields:**
- `success` (boolean): Always false for errors
- `message` (string): General error description
- `errors` (object): Field-specific validation errors (null if not validation error)
- `statusCode` (number): HTTP status code
- `timestamp` (string): ISO 8601 timestamp

## Success Response Structure

All success responses follow this structure:
```json
{
  "success": true,
  "data": {
    "retirementAnnualExpense": 4291871.41,
    "requiredCorpus": 45502189.75,
    "requiredMonthlySIP": 8234.56,
    "yearsToRetirement": 25,
    "assumptions": {...},
    "disclaimer": "...",
    "calculatedAt": "2026-03-12T10:30:00Z"
  }
}
```
**Fields:**
- `success` (boolean): Always true for successful requests
- `data` (object): Contains calculation results and assumptions

---

## Testing

### Postman Collection
Import this into Postman for easy testing:
```json
{
  "info": {
    "name": "Retirement Calculator API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Calculate Retirement",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"currentAge\": 35, \"retirementAge\": 60, \"currentAnnualExpenses\": 1000000, \"inflationRate\": 6, \"postRetirementReturn\": 7, \"preRetirementReturn\": 12}"
        },
        "url": {"raw": "http://localhost:3000/api/calculate", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["api", "calculate"]}
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": {"raw": "http://localhost:3000/api/health", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["api", "health"]}
      }
    },
    {
      "name": "Get Content",
      "request": {
        "method": "GET",
        "url": {"raw": "http://localhost:3000/api/content", "protocol": "http", "host": ["localhost"], "port": ["3000"], "path": ["api", "content"]}
      }
    }
  ]
}
```

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 -p payload.json -T application/json \
  http://localhost:3000/api/calculate

# Using wrk
wrk -t12 -c400 -d30s \
  -s script.lua \
  http://localhost:3000/api/calculate
```

### Unit Testing
See `__tests__/unit/` for comprehensive unit tests.

### Integration Testing
See `__tests__/integration/api.calculate.test.js` for full API tests.

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-12 | Initial release |
| 1.1 | TBD | Add authentication |
| 1.2 | TBD | Add rate limiting |
| 2.0 | TBD | Add webhooks |

---

## Support

For API issues or questions:
- **Email:** api-support@hdfc.com
- **Slack:** #retirement-calculator-backend
- **GitHub Issues:** [repository-issues]
- **Documentation:** `/docs/`

---

## Related Documentation

- **Calculation Assumptions:** `/docs/assumptions.md`
- **Financial Formulas:** `/docs/assumptions.md#calculation-methodology`
- **Backend Setup:** `/docs/PERSON2_README.md`
- **Integration Guide:** `/docs/drupal-api-integration.md`

---

## Disclaimer

This API provides illustrative calculations for retirement planning purposes only. The results are not investment advice and should not be considered as recommendations. Always consult with a qualified financial advisor before making financial decisions.
