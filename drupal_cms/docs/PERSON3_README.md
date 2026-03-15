# Person 3 — Integration Lead, Compliance & Drupal Setup Guide

## Overview
You are responsible for:
1. **Drupal CMS Setup** - Configure and manage content
2. **Integration Testing** - E2E and integration tests
3. **Brand Compliance** - Verify HDFC guidelines adherence
4. **Final QA** - Sign-off checklist before deployment

## Technology Stack
- **Drupal:** 10.5.6
- **PHP:** 8.1+
- **MySQL:** 5.7+ (InnoDB)
- **Testing:** Playwright, Jest
- **CMS Content:** JSON:API endpoints

## Getting Started

### 1. Drupal Installation

```bash
# Clone or download Drupal project
cd retirement-calculator-cms

# Install dependencies
composer install

# Setup database (see drupal-setup.md)
mysql -u root -p < setup.sql

# Configure settings
nano web/sites/default/settings.php

# Install Drupal
cd web
php core/scripts/drupal install standard

# Enable modules
../vendor/bin/drush module:install jsonapi jsonapi_extras cors -y
../vendor/bin/drush module:install retirement_calculator -y
```

### 2. Create Initial Content
Via Drupal UI: `/admin/content/add/calculator_content`

Create 2 nodes:

**Disclaimer**
- **Title:** "Disclaimer"
- **Body:** This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
- **Status:** Published

**Assumptions**
- **Title:** "Assumptions"
- **Body:** (copy assumptions list)
- **Status:** Published

### 3. Test JSON:API Integration
```bash
# Test Drupal API
curl http://localhost:8000/jsonapi/node/calculator_content

# Should return JSON with both nodes
```

### 4. Verify Frontend Integration
```bash
# Start Next.js frontend
npm run dev

# Verify disclaimer and assumptions load from Drupal
# Check browser console for any fetch errors
```

## File Structure
```text
drupal/
├── config/
│   ├── core.extension.yml          # Enabled modules
│   ├── jsonapi.settings.yml        # JSON:API config
│   ├── cors.settings.yml           # CORS config
│   └── services.yml                # Service configuration

├── modules/
│   └── retirement_calculator/
│       ├── retirement_calculator.info.yml
│       ├── retirement_calculator.module
│       └── retirement_calculator.install

└── settings.php                    # Main Drupal config

lib/compliance/
├── brandChecker.js                 # Brand color/font validation
└── complianceChecklist.js          # Full compliance checklist

__tests__/
├── integration/
│   └── drupal.content.test.js      # Drupal API tests
└── e2e/
    ├── calculator.flow.test.js     # User flow tests
    ├── accessibility.test.js       # A11y tests
    └── responsive.test.js          # Responsive design tests

scripts/
└── generateComplianceReport.js     # Compliance report generator

docs/
├── drupal-setup.md                 # Drupal installation guide
├── compliance-checklist.md         # Full compliance checklist
└── PERSON3_README.md               # This file
```

## Key Responsibilities

### 1. Drupal CMS Setup
- [ ] Install Drupal 10.5.6
- [ ] Enable JSON:API module
- [ ] Configure CORS for Next.js
- [ ] Create `calculator_content` node type
- [ ] Create Disclaimer and Assumptions nodes
- [ ] Test JSON:API endpoints

### 2. Frontend-Backend Integration
- [ ] Verify Next.js fetches from Drupal
- [ ] Test fallback when Drupal unavailable
- [ ] Verify CORS headers correct
- [ ] Cache headers configured

### 3. Brand Compliance Verification
- [x] Check colors: Only #224c87, #da3832, #919090
- [x] Check fonts: Only Montserrat, Arial, Verdana
- [x] Check imagery: No growth arrows, currency icons, or charts
- [x] Check language: No promotional phrases or exaggerated metaphors
- [x] Check disclaimer: Exact mandatory wording, 14px+, 4.5:1 contrast

### 4. Accessibility Audit
- [ ] Lighthouse score: 95+
- [ ] axe DevTools: 0 violations
- [ ] Keyboard navigation: Full flow works
- [ ] Screen reader: NVDA/VoiceOver test
- [ ] Color contrast: All 4.5:1+
- [ ] Responsive: 375px, 768px, 1280px

### 5. Testing & QA
- [ ] Unit tests: >80% coverage
- [ ] Integration tests: API + Drupal
- [ ] E2E tests: Full user flows
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
- [ ] Mobile responsive: All viewports

### 6. Compliance Sign-Off
- [ ] Complete compliance checklist
- [ ] Generate compliance report
- [ ] Document all findings
- [ ] Get approval from stakeholders

## Integration Points

### With Person 1 (Frontend)
- **Content Source:** Drupal via `/api/content` endpoint
- **Disclaimer Fetching:** `utils/drupalClient.js`
- **Assumptions Display:** Results panel shows assumptions
- **Status:** Frontend integration tests pass

### With Person 2 (Backend)
- **API Endpoint:** `POST /api/calculate`
- **Database:** MySQL (`calculator_results` table)
- **Health Check:** `GET /api/health`
- **Status:** API tests pass

## Deployment Checklist
*Before production deployment:*

**Disclaimer & Compliance**
- [ ] Full HDFC disclaimer visible (not scrolled)
- [ ] Font size 14px+, contrast 4.5:1+
- [ ] Results labeled "illustrative"
- [ ] Assumptions disclosed

**Technical Stack**
- [ ] Next.js 15.5.9 confirmed
- [ ] Node 22.11.0 confirmed
- [ ] Drupal 10.5.6 confirmed
- [ ] MySQL schema deployed
- [ ] All migrations applied

**Accessibility**
- [ ] Lighthouse score ≥95
- [ ] axe DevTools: 0 violations
- [ ] Keyboard navigation works
- [ ] Screen reader test passed
- [ ] All text 4.5:1 contrast+

**Brand Compliance**
- [ ] Only HDFC colors used
- [ ] Only HDFC fonts used
- [ ] No financial imagery
- [ ] No promotional language
- [ ] All sections accessible

**Testing**
- [ ] Unit tests passing (>80% coverage)
- [ ] Integration tests passing
- [ ] E2E tests on 3+ browsers
- [ ] Mobile responsive (375px, 768px, 1280px)

**Documentation**
- [ ] API contract finalized
- [ ] Assumptions documented
- [ ] Drupal setup documented
- [ ] Compliance report generated
- [ ] README.md complete

**Security**
- [ ] HTTPS configured
- [ ] CORS properly restricted
- [ ] Input validation confirmed
- [ ] No PII in database
- [ ] Dependencies up to date

## Running Tests

### Integration Tests
```bash
npm test -- __tests__/integration/
```

### E2E Tests (Playwright)
```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npx playwright test

# Run specific test
npx playwright test calculator.e2e.test.js

# Debug mode
npx playwright test --debug

# View report
npx playwright show-report
```

### Brand Compliance Check
```bash
node scripts/generateComplianceReport.js
```

## Common Issues & Solutions

**Issue: Drupal JSON:API Returns 403**
*Solution:*
- Enable JSON:API module: `drush module:install jsonapi -y`
- Clear cache: `drush cache:rebuild`
- Check permissions: Admin > People > Permissions > JSON:API

**Issue: CORS Error in Browser**
*Solution:*
- Verify CORS enabled in Drupal:
  ```bash
  drush config:get cors.config enabled
  ```
- Update `services.yml` with frontend URL
- Clear cache: `drush cache:rebuild`
- Verify response headers:
  ```bash
  curl -I http://localhost:8000/jsonapi/node/calculator_content
  ```

**Issue: Lighthouse Accessibility Score Low**
*Solution:*
- Run axe DevTools to identify violations
- Check contrast with WebAIM tool
- Verify semantic HTML in components
- Test keyboard navigation manually
- Test with screen reader

**Issue: E2E Tests Failing**
*Solution:*
- Ensure dev server is running: `npm run dev`
- Check Playwright version: `npx playwright --version`
- Clear browser cache: `npx playwright clean`
- Run in headed mode to debug:
  ```bash
  npx playwright test --headed
  ```

## Timeline

**Week 1: Drupal setup**
- [ ] Install Drupal 10.5.6
- [ ] Enable required modules
- [ ] Create content type
- [ ] Create initial content
- [ ] Test JSON:API

**Week 2: Integration & brand review**
- [ ] Connect frontend to Drupal
- [ ] Verify brand compliance
- [ ] Run accessibility audit
- [ ] Document findings

**Week 3: Testing & refinement**
- [ ] Run E2E tests
- [ ] Cross-browser testing
- [ ] Fix accessibility issues
- [ ] Generate reports

**Week 4: Final sign-off**
- [ ] Complete compliance checklist
- [ ] Get approvals
- [ ] Deploy to staging
- [ ] Final production verification

## Questions or Blockers?
Contact:
- **Person 1 (Frontend):** For UI/styling issues
- **Person 2 (Backend):** For API/calculation issues
- **Project Lead:** For approvals/deployment

## Support Resources
- **Drupal Docs:** https://www.drupal.org/documentation
- **JSON:API:** https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module
- **Playwright:** https://playwright.dev
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/
- **HDFC Brand Guidelines:** [Internal Reference]

## 13. Final Compliance Report Template

```markdown name=docs/compliance-report-template.md
# Retirement Planning Calculator - Compliance Report

**Report Date:** [YYYY-MM-DD]
**Auditor:** Person 3 (Integration Lead)
**Overall Status:** ☐ APPROVED / ☐ PENDING FIXES / ☐ REJECTED

---

## Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Compliance Checks | 45 | |
| Passed | [XX] | ✓ |
| Failed | [XX] | ✗ |
| Skipped | [XX] | ⊘ |
| **Compliance Score** | **[XX]%** | |

---

## 1. Disclaimer & Legal Compliance

| Check | Status | Notes |
|-------|--------|-------|
| Disclaimer visible on page | ✓/✗ | |
| Not hidden behind scroll | ✓/✗ | |
| Font size ≥ 14px | ✓/✗ | |
| Contrast ratio ≥ 4.5:1 | ✓/✗ | |
| Text matches HDFC wording | ✓/✗ | |

**Critical Issues:** [List any]
**Recommendations:** [List any]

---

## 2. Accessibility (WCAG 2.1 AA)

### Automated Testing
| Tool | Score | Target | Status |
|------|-------|--------|--------|
| Lighthouse | [XX]/100 | 95+ | ✓/✗ |
| axe DevTools | [X] violations | 0 | ✓/✗ |

### Manual Testing
| Test | Result | Status |
|------|--------|--------|
| Keyboard navigation | [Result] | ✓/✗ |
| Screen reader (NVDA) | [Result] | ✓/✗ |
| Color contrast | [Result] | ✓/✗ |
| Focus indicators | [Result] | ✓/✗ |

---

## 3. Brand Compliance

| Element | Approved | Used | Status |
|---------|----------|------|--------|
| Blue (#224c87) | ✓ | ✓ | ✓ |
| Red (#da3832) | ✓ | ✓ | ✓ |
| Grey (#919090) | ✓ | ✓ | ✓ |
| Montserrat | ✓ | ✓ | ✓ |
| Arial | ✓ | ✓ | ✓ |
| Verdana | ✓ | ✓ | ✓ |
| Financial imagery | ✗ | ✗ | ✓ |
| Promotional language | ✗ | ✗ | ✓ |

---

## 4. Technical Stack Verification

| Component | Required | Actual | Status |
|-----------|----------|--------|--------|
| Next.js | 15.5.9 | [X.X.X] | ✓/✗ |
| Node.js | 22.11.0 | [X.X.X] | ✓/✗ |
| NPM | 10.9.0 | [X.X.X] | ✓/✗ |
| Drupal | 10.5.6 | [X.X.X] | ✓/✗ |
| PHP | 8.1+ | [X.X.X] | ✓/✗ |
| MySQL | 5.7+ | [X.X.X] | ✓/✗ |

---

## 5. Testing Results

| Test Suite | Coverage | Status |
|------------|----------|--------|
| Unit Tests | [XX]% | ✓/✗ |
| Integration Tests | [XX]% | ✓/✗ |
| E2E Tests | [Browsers] | ✓/✗ |
| Responsive Tests | [Viewports] | ✓/✗ |

---

## 6. Critical Issues

- [ ] [Issue 1]
- [ ] [Issue 2]
- [ ] [Issue 3]

---

## 7. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| QA Lead (Person 3) | [Name] | [Date] | |
| Product Manager | [Name] | [Date] | |
| Technical Lead | [Name] | [Date] | |

---

## Final Recommendation

**The Retirement Planning Calculator is:**

☐ **APPROVED** for production deployment
☐ **APPROVED WITH CONDITIONS** - Fix [issues] before deploy
☐ **REJECTED** - Must resolve [critical issues]

**Deployment Date:** [Proposed date]
```