/**
 * Comprehensive Compliance Checklist
 * All requirements before deployment
 */

export const FULL_COMPLIANCE_CHECKLIST = {
  // Disclaimer Section
  disclaimer: {
    category: 'Compliance & Legal',
    checks: [
      {
        id: 'disclaimer-visible',
        description: 'Full HDFC disclaimer is present on calculator page',
        requirement: 'REQUIRED',
        verification: 'Visual inspection',
      },
      {
        id: 'disclaimer-not-hidden',
        description: 'Disclaimer is not hidden behind scroll or toggle on desktop',
        requirement: 'REQUIRED',
        verification: 'Desktop viewport (1280px) - no scrolling needed',
      },
      {
        id: 'disclaimer-font-size',
        description: 'Disclaimer font size minimum 14px',
        requirement: 'REQUIRED (WCAG)',
        verification: 'CSS inspection: font-size >= 14px',
      },
      {
        id: 'disclaimer-contrast',
        description: 'Disclaimer contrast ratio >= 4.5:1',
        requirement: 'REQUIRED (WCAG AA)',
        verification: 'WebAIM Contrast Checker',
      },
      {
        id: 'disclaimer-text-match',
        description: 'Disclaimer text matches mandated HDFC wording exactly',
        requirement: 'REQUIRED',
        verification: 'Word-for-word comparison',
      },
    ],
  },

  // Financial Transparency
  transparency: {
    category: 'Financial Transparency',
    checks: [
      {
        id: 'assumptions-visible',
        description: 'All assumptions are visible and clearly labeled',
        requirement: 'REQUIRED',
        verification: 'Visual inspection of assumptions panel',
      },
      {
        id: 'assumptions-editable',
        description: 'No assumption is hardcoded invisibly',
        requirement: 'REQUIRED',
        verification: 'All assumptions fetched from Drupal or API',
      },
      {
        id: 'results-labeled',
        description: 'Results are labeled "illustrative" or "estimated"',
        requirement: 'REQUIRED',
        verification: 'Check result labels in UI',
      },
      {
        id: 'retirement-duration-customizable',
        description: 'Retirement duration can be customized by user',
        requirement: 'RECOMMENDED',
        verification: 'Check if input field or dropdown exists',
      },
    ],
  },

  // Technical Stack
  technical: {
    category: 'Technical Requirements',
    checks: [
      {
        id: 'nextjs-version',
        description: 'Next.js version is 15.5.9',
        requirement: 'REQUIRED',
        verification: 'package.json: "next": "15.5.9"',
      },
      {
        id: 'nodejs-version',
        description: 'Node.js version is 22.11.0',
        requirement: 'REQUIRED',
        verification: '.nvmrc or package.json engines field',
      },
      {
        id: 'npm-version',
        description: 'NPM version is 10.9.0',
        requirement: 'REQUIRED',
        verification: 'package-lock.json or npm --version',
      },
      {
        id: 'drupal-version',
        description: 'Drupal version is 10.5.6',
        requirement: 'REQUIRED',
        verification: 'drupal/core: "10.5.6" in composer.json',
      },
      {
        id: 'php-version',
        description: 'PHP version is 8.1+',
        requirement: 'REQUIRED',
        verification: 'Drupal composer.json php requirement',
      },
      {
        id: 'mysql-schema',
        description: 'MySQL schema deployed and functional',
        requirement: 'REQUIRED',
        verification: 'Database migration: npm run db:setup',
      },
    ],
  },

  // Accessibility
  accessibility: {
    category: 'Accessibility (WCAG 2.1 AA)',
    checks: [
      {
        id: 'lighthouse-score',
        description: 'Lighthouse accessibility score >= 95',
        requirement: 'REQUIRED',
        verification: 'Chrome DevTools > Lighthouse > Accessibility',
      },
      {
        id: 'axe-violations',
        description: 'axe DevTools: 0 critical/serious violations',
        requirement: 'REQUIRED',
        verification: 'Browser extension: axe DevTools',
      },
      {
        id: 'keyboard-navigation',
        description: 'Full form functionality with keyboard only',
        requirement: 'REQUIRED',
        verification: 'Test without mouse: Tab, Shift+Tab, Enter',
      },
      {
        id: 'screen-reader-test',
        description: 'Screen reader announces all content correctly',
        requirement: 'REQUIRED',
        verification: 'NVDA + Chrome OR VoiceOver + Safari',
      },
      {
        id: 'color-contrast',
        description: 'All text meets 4.5:1 contrast ratio',
        requirement: 'REQUIRED',
        verification: 'WebAIM Contrast Checker for all text',
      },
    ],
  },

  // Branding
  branding: {
    category: 'Brand Compliance',
    checks: [
      {
        id: 'approved-colors-only',
        description: 'Only approved colors used (#224c87, #da3832, #919090)',
        requirement: 'REQUIRED',
        verification: 'CSS inspection - no other colors',
      },
      {
        id: 'approved-fonts-only',
        description: 'Only approved fonts used (Montserrat, Arial, Verdana)',
        requirement: 'REQUIRED',
        verification: 'CSS inspection - no other fonts',
      },
      {
        id: 'no-financial-imagery',
        description: 'Zero financial imagery (arrows, money, charts)',
        requirement: 'REQUIRED',
        verification: 'Visual inspection - no SVG/images',
      },
      {
        id: 'neutral-language',
        description: 'No promotional language (no "grow wealth", "invest today")',
        requirement: 'REQUIRED',
        verification: 'Text inspection - check for prohibited phrases',
      },
      {
        id: 'illustrative-notice',
        description: 'Results labeled as "for illustration purposes only"',
        requirement: 'REQUIRED',
        verification: 'Check result labels and disclaimers',
      },
    ],
  },

  // Testing
  testing: {
    category: 'Testing & QA',
    checks: [
      {
        id: 'unit-tests-pass',
        description: 'All unit tests passing (npm test)',
        requirement: 'REQUIRED',
        verification: 'npm test - 0 failures',
      },
      {
        id: 'integration-tests-pass',
        description: 'API integration tests passing',
        requirement: 'REQUIRED',
        verification: 'npm test __tests__/integration/',
      },
      {
        id: 'e2e-tests-pass',
        description: 'End-to-end user flow tests passing',
        requirement: 'REQUIRED',
        verification: 'npm run test:e2e',
      },
      {
        id: 'cross-browser-tested',
        description: 'Tested on Chrome, Firefox, Safari, Edge',
        requirement: 'REQUIRED',
        verification: 'Manual or automated cross-browser testing',
      },
      {
        id: 'mobile-responsive',
        description: 'Works on mobile (375px), tablet (768px), desktop (1280px)',
        requirement: 'REQUIRED',
        verification: 'Device testing or emulation',
      },
    ],
  },

  // Security
  security: {
    category: 'Security & Data Protection',
    checks: [
      {
        id: 'no-pii-stored',
        description: 'No personally identifiable information stored',
        requirement: 'REQUIRED',
        verification: 'Database schema review - no PII in calculator_results',
      },
      {
        id: 'https-configured',
        description: 'HTTPS configured for production',
        requirement: 'REQUIRED',
        verification: 'Production URL loads over HTTPS',
      },
      {
        id: 'input-validation',
        description: 'All inputs validated and sanitized',
        requirement: 'REQUIRED',
        verification: 'Code review - validation in place',
      },
      {
        id: 'csrf-protection',
        description: 'CSRF protection enabled on forms',
        requirement: 'REQUIRED',
        verification: 'Form includes CSRF token',
      },
      {
        id: 'rate-limiting-ready',
        description: 'Rate limiting infrastructure in place or planned',
        requirement: 'RECOMMENDED',
        verification: 'Backend API documentation',
      },
    ],
  },

  // Documentation
  documentation: {
    category: 'Documentation',
    checks: [
      {
        id: 'api-documented',
        description: 'API contract fully documented',
        requirement: 'REQUIRED',
        verification: 'docs/api-contract.md exists and complete',
      },
      {
        id: 'assumptions-documented',
        description: 'All financial assumptions documented',
        requirement: 'REQUIRED',
        verification: 'docs/assumptions.md exists and detailed',
      },
      {
        id: 'drupal-documented',
        description: 'Drupal setup and configuration documented',
        requirement: 'REQUIRED',
        verification: 'docs/drupal-setup.md exists',
      },
      {
        id: 'compliance-documented',
        description: 'Compliance checklist and audit results documented',
        requirement: 'REQUIRED',
        verification: 'docs/compliance-checklist-YYYY-MM-DD.md',
      },
      {
        id: 'readme-complete',
        description: 'README.md has setup and usage instructions',
        requirement: 'REQUIRED',
        verification: 'Root README.md is comprehensive',
      },
    ],
  },
};

/**
 * Generate compliance report
 * @param {Object} results - Mapping of check IDs to pass/fail status
 * @returns {Object} Compliance report
 */
export const generateComplianceReport = (results) => {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    },
    byCategory: {},
    criticalFailures: [],
    overallCompliant: false,
  };

  Object.entries(FULL_COMPLIANCE_CHECKLIST).forEach(([key, category]) => {
    report.byCategory[category.category] = {
      passed: 0,
      failed: 0,
      total: category.checks.length,
      checks: [],
    };

    category.checks.forEach((check) => {
      const status = results[check.id];
      report.summary.total += 1;

      if (status === true) {
        report.summary.passed += 1;
        report.byCategory[category.category].passed += 1;
      } else if (status === false) {
        report.summary.failed += 1;
        report.byCategory[category.category].failed += 1;
        
        if (check.requirement === 'REQUIRED') {
          report.criticalFailures.push(check.description);
        }
      } else {
        report.summary.skipped += 1;
      }

      report.byCategory[category.category].checks.push({
        id: check.id,
        description: check.description,
        requirement: check.requirement,
        status,
      });
    });
  });

  report.overallCompliant = report.summary.failed === 0 && report.criticalFailures.length === 0;

  return report;
};