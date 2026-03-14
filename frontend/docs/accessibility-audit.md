# WCAG 2.1 AA Accessibility Audit Checklist

## Automated Testing
- [ ] Run Lighthouse audit - Target Score: 95+
  - Command: `npm run a11y:audit`
- [ ] Run axe-core scan - Zero critical/serious violations
- [ ] Run eslint-jsx-a11y checks
- [ ] Review all reported violations

## Manual Keyboard Navigation
- [ ] Tab through all interactive elements in logical order
- [ ] Shift+Tab backwards navigation works
- [ ] All buttons are activated with Enter or Space
- [ ] Form submission works with keyboard only
- [ ] Focus indicators are visible on all focusable elements
- [ ] No keyboard traps exist

## Screen Reader Testing (NVDA + Chrome)
- [ ] All form labels are properly associated with inputs
- [ ] Error messages are announced correctly
- [ ] Results panel is announced when visible
- [ ] Disclaimer section is announced
- [ ] All headings are in correct hierarchical order
- [ ] Skip-to-content link works
- [ ] Live regions announce updates properly

## Screen Reader Testing (VoiceOver + Safari)
- [ ] Repeat all NVDA tests with VoiceOver
- [ ] Test on macOS and iOS if applicable
- [ ] Rotor navigation (headings, landmarks, form fields)

## Color Contrast
- [ ] All text meets minimum 4.5:1 contrast ratio (WCAG AA)
- [ ] Tested with WebAIM Contrast Checker
- [ ] Form borders and placeholders are readable
- [ ] Error states are clearly visible with text + color

## Form Accessibility
- [ ] All form fields have visible labels
- [ ] Labels are connected via `for` attribute
- [ ] Required fields are marked and announced
- [ ] Helper text is associated with inputs via aria-describedby
- [ ] Error messages use aria-describedby
- [ ] Form instructions are clear and visible

## Images and Icons
- [ ] All images have meaningful alt text
- [ ] Decorative images use alt=""
- [ ] Icons have aria-labels or screen reader text
- [ ] SVG logos have aria-labels

## Responsive Design
- [ ] Mobile (375px) - All elements functional
- [ ] Tablet (768px) - Layout adapts properly
- [ ] Desktop (1280px) - All features visible
- [ ] Landscape orientation works on mobile
- [ ] Touch targets are minimum 44x44px

## Semantic HTML
- [ ] Uses semantic tags: <main>, <header>, <footer>, <section>, <nav>
- [ ] Heading hierarchy is correct (no skipping h1→h3)
- [ ] Forms use proper <form> and <input> elements
- [ ] Buttons use <button> element
- [ ] Links use <a> element

## ARIA Implementation
- [ ] Only used where semantic HTML is insufficient
- [ ] aria-live regions used for dynamic updates
- [ ] aria-label used for elements without visible text
- [ ] aria-describedby for form helpers/errors
- [ ] aria-expanded for collapsible sections
- [ ] aria-busy during loading states
- [ ] aria-invalid for form errors

## Disclaimer Section
- [ ] Disclaimer is visible without scrolling (desktop)
- [ ] Font size minimum 14px
- [ ] Contrast ratio 4.5:1 or better
- [ ] Text is easy to understand
- [ ] No hidden content or collapsed state

## Testing Browsers
- [ ] Chrome + Extensions (axe, WAVE)
- [ ] Firefox + Screen Reader
- [ ] Safari + VoiceOver
- [ ] Edge + Extensions

## Document & Tools Used
- [ ] WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- [ ] axe DevTools: https://www.deque.com/axe/devtools/
- [ ] NVDA: https://www.nvaccess.org/
- [ ] Lighthouse: Built into Chrome DevTools

## Sign-Off
- Date: _______________
- Auditor: _______________
- Score: _______________
- Critical Issues: [ ] None [ ] Pending Fix
- Approval: [ ] APPROVED [ ] NEEDS FIXES