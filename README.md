# HDFC Retirement Planning Calculator

A professional, brand-compliant retirement planning tool built with the modern web stack. This calculator enables users to estimate their required retirement corpus and monthly SIP contributions based on scientific financial formulas and HDFC's strict brand guidelines.

## 🔗 Live Demo

**[View Live Application](https://hdfc-retirement-calculator.vercel.app)**

## 🎥 Video Demo

<!-- DRAG AND DROP YOUR VIDEO FILE HERE IN THE GITHUB UI -->
[Upload a video to see it here!]

## 🚀 Key Features

- **Scientific Calculation**: Uses the Present Value of Annuity formula for accurate retirement corpus estimation.
- **Brand Compliant UI**: Adheres to HDFC's mandatory palette (Blue: #224c87, Red: #da3832, Grey: #919090) and typography (Montserrat, Arial, Verdana).
- **Accessibility**: Fully compliant with WCAG 2.1 AA standards, including semantic HTML, ARIA roles, and keyboard navigation.
- **Responsive Design**: Seamless experience across Desktop, Tablet, and Mobile devices.
- **Compliance First**: Integrated mandatory HDFC Mutual Fund legal disclaimer across all views.
- **CMS Integration**: Connected with Drupal for dynamic content management.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.5.9, React, Vanilla CSS
- **Backend**: Node.js 22.11.0
- **CMS**: Drupal 10.5.6
- **Database**: MySQL
- **Environment**: Node.js 22.11.0, NPM 10.9.0

## 📁 Project Structure

```text
retirement_calculator/
├── frontend/          # Unified Next.js application (UI & Integrated API)
├── backend/           # Standalone Node.js API (Legacy/Alternative)
└── drupal_cms/        # Drupal integration & content management
```

## 📐 Scientific Formula

The calculator uses the following formula to determine the Retirement Corpus:

**Retirement Corpus = Annual Expense × [(1 − (1 + r)⁻ᵗ) ÷ r]**

Where:
- **r**: Post-retirement annual return
- **t**: Expected retirement duration (Life Expectancy - Retirement Age)

## ⚖️ Legal Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.

## 🛠️ Installation & Setup

Please refer to the individual `README.md` files in the `frontend` and `backend` directories for specific setup instructions.

---
© 2026 HDFC. All rights reserved.
