# Retirement Calculator - Financial Assumptions

## Overview
This document outlines all assumptions used in the Retirement Planning Calculator and how they affect calculations.

## Input Assumptions

### 1. Current Age
- **Range:** 18 - 79 years
- **Type:** Integer
- **Description:** The user's current age in years
- **Impact:** Used to calculate years to retirement

### 2. Retirement Age
- **Range:** Current Age + 1 to 80 years
- **Type:** Integer
- **Description:** The planned age at which the user wants to retire
- **Impact:** Determines the accumulation period and retirement duration

### 3. Current Annual Expenses
- **Range:** ₹0 to ₹100 Crores
- **Type:** Decimal (2 places)
- **Unit:** Indian Rupees (₹)
- **Description:** Total annual spending in the current year
- **Impact:** Used as the base for inflation calculation

### 4. Expected Inflation Rate
- **Range:** 0% - 50% per annum
- **Type:** Decimal (2 places)
- **Unit:** Percentage (%)
- **Description:** Expected average annual inflation rate
- **Impact:** Adjusts current expenses to retirement-year rupees

### 5. Post-Retirement Return
- **Range:** 0% - 50% per annum
- **Type:** Decimal (2 places)
- **Unit:** Percentage (%)
- **Description:** Expected annual investment return during retirement
- **Impact:** Determines how long the corpus will last (higher returns = lower corpus needed)

### 6. Pre-Retirement Return
- **Range:** 0% - 50% per annum
- **Type:** Decimal (2 places)
- **Unit:** Percentage (%)
- **Description:** Expected annual investment return before retirement
- **Impact:** Determines the SIP amount needed (higher returns = lower SIP needed)

## System Assumptions

### 1. Life Expectancy
- **Assumed Age:** 85 years
- **Source:** Standard Indian life expectancy assumption
- **Impact:** Determines default retirement duration
- **Formula:** Retirement Duration = 85 - Retirement Age
- **Example:** Retiring at 60 means planning for 25 years of retirement

### 2. Retirement Duration Flexibility
- **Default:** Calculated from life expectancy (85 years)
- **Optional Override:** User can specify custom retirement duration
- **Impact:** Changes corpus requirement (longer duration = higher corpus)

### 3. SIP Payment Frequency
- **Frequency:** Monthly
- **Timing:** Assumed to be made at the beginning of each month (annuity due)
- **Impact:** Monthly return = Annual Return ÷ 12

### 4. Inflation Application
- **Formula:** Retirement Expense = Current Expense × (1 + Inflation Rate)^(Years to Retirement)
- **Assumption:** Inflation compounds annually
- **Impact:** Expenses grow exponentially over time

### 5. Investment Returns
- **Pre-Retirement:** Assumed to compound monthly (12 times per year)
- **Post-Retirement:** Assumed to be constant throughout retirement
- **Assumption:** No tax or fees are deducted
- **Impact:** Simplified for illustration

## Calculation Methodology

### Step 1: Inflate Annual Expenses
Retirement Annual Expense = Current Annual Expense × (1 + Inflation Rate)^(Years to Retirement)

**Example:**
- Current Expense: ₹1,000,000
- Inflation: 6% per annum
- Years to Retirement: 25
- Result: ₹1,000,000 × (1.06)^25 = ₹4,291,871.41

### Step 2: Calculate Required Corpus
Corpus = Retirement Annual Expense × [(1 - (1 + r)^(-t)) ÷ r]

Where:
- r = Post-retirement return (annual, as decimal)
- t = Retirement duration (years)

**Example:**
- Retirement Expense: ₹4,291,871.41
- Post-retirement Return: 7% per annum
- Duration: 25 years
- Result: ₹4,291,871.41 × PV Factor = ₹45,502,189.75

**Edge Case (r = 0):**
Corpus = Retirement Annual Expense × Retirement Duration

### Step 3: Calculate Monthly SIP
P = FV ÷ {[((1 + i)^n - 1) ÷ i] × (1 + i)}

Where:
- FV = Required Corpus
- i = Monthly return rate = (Annual Return ÷ 12) as decimal
- n = Number of months = Years to Retirement × 12
- P = Monthly SIP (what we solve for)

**Example:**
- Required Corpus: ₹45,502,189.75
- Pre-retirement Return: 12% per annum
- Years to Retirement: 25
- Monthly Return: 0.12 ÷ 12 = 0.01 (1%)
- Number of Months: 25 × 12 = 300
- Result: ₹45,502,189.75 ÷ FV Factor = ₹8,234.56

## Important Caveats

1. **Market Volatility:** Actual returns vary yearly; this assumes constant average returns
2. **Inflation Variation:** Actual inflation may differ significantly
3. **Tax Impact:** Calculations don't include income tax, capital gains tax, or other taxes
4. **Fees:** Investment management fees are not deducted
5. **Life Expectancy:** 85 years is an assumption; actual lifespan may vary
6. **Expense Changes:** Assumes expense growth due to inflation; actual needs may vary
7. **One-time Costs:** Doesn't account for major expenses (health, family events)
8. **Longevity Risk:** No provision for living beyond age 85

## Sensitivity Analysis

The calculator is sensitive to these factors:

| Factor | Effect | Example |
|--------|--------|---------|
| Inflation Rate +1% | Corpus increases ~10-15% | 6% → 7% increases corpus significantly |
| Return Rate +1% | Corpus decreases ~10-15% | 7% → 8% decreases corpus requirement |
| Retirement Age +1 year | Both corpus and SIP decrease | Retiring at 61 vs 60 reduces burden |
| Expense Change +10% | Corpus increases ~10% | ₹1M → ₹1.1M expense increases corpus |

## References

- Present Value of Annuity Formula: Standard financial mathematics
- Indian Life Expectancy: Based on LIC and government statistics
- Inflation Calculation: Compound interest formula
- SIP Calculation: Annuity Due (payments at beginning of month)

## Important Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.

## Questions?

For clarification on any assumption, please contact the Financial Planning team.