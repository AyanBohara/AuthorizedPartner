# Authorized Partner - QA Automation

## 1. Overview

This repository contains browser-based quality assurance automation for the
Authorized Partner web application. The test suite uses Playwright with
TypeScript to verify the public Playwright smoke flow and the Authorized
Partner agent sign-up journey.

The automation was written from a user perspective: it opens the application,
uses accessible controls where possible, completes each visible step, and
asserts important checkpoints instead of only checking that clicks were
accepted.

## 2. QA scope

### In scope

- Application landing-page navigation
- Login and sign-up navigation
- Account setup form:
  - First name and last name
  - Email address
  - Country code and phone number
  - Password and confirmation password
- OTP verification hand-off
- Agency details
- Professional experience
- Verification and preferences
- File-upload interaction
- Chromium browser smoke coverage

### Not currently in scope

- API, database, and service-level testing
- Security or penetration testing
- Cross-browser execution (Firefox and WebKit are configured as optional
  projects but are currently disabled)
- Mobile viewport coverage
- Email delivery and real OTP service validation
- Accessibility compliance certification
- Performance, load, and reliability testing

## 3. Test environment

| Item | Value |
| --- | --- |
| Test framework | Playwright Test |
| Language | TypeScript |
| Browser | Chromium / Desktop Chrome profile |
| Application under test | `https://authorized-partner.vercel.app/` |
| Test directory | `tests/` |
| Reporter | Playwright HTML reporter |
| Default timeout | Playwright default timeout (30 seconds) |
| CI behavior | Two retries and one worker when `CI` is set |

## 4. Repository structure

```text
.
├── tests/
│   ├── example.spec.ts
│   └── signup_automation_script.spec.ts
├── playwright.config.ts
├── package.json
├── package-lock.json
└── reaadme.md
```

Generated folders such as `playwright-report/` and `test-results/` are local
execution artifacts and are excluded from version control.

## 5. Installation

Requirements:

- Node.js and npm
- Network access to the application under test
- A supported Playwright browser

Install dependencies:

```bash
npm ci
npx playwright install chromium
```

## 6. Running the tests

Run the complete suite:

```bash
npx playwright test
```

Run only the Authorized Partner sign-up test:

```bash
npx playwright test tests/signup_automation_script.spec.ts
```

Run the Playwright example smoke tests:

```bash
npx playwright test tests/example.spec.ts
```

Run with the browser visible:

```bash
npx playwright test tests/signup_automation_script.spec.ts --headed
```

Open the latest HTML report:

```bash
npx playwright show-report
```

Useful diagnostic options:

```bash
npx playwright test tests/signup_automation_script.spec.ts --debug
npx playwright test tests/signup_automation_script.spec.ts --trace on
```

## 7. What was tested

### TC-01: Playwright documentation title smoke test

1. Open `https://playwright.dev/`.
2. Verify that the page title contains `Playwright`.

**Expected result:** The title assertion passes.

### TC-02: Playwright documentation navigation smoke test

1. Open `https://playwright.dev/`.
2. Select **Get started**.
3. Verify that the **Installation** heading is visible.

**Expected result:** The navigation and heading assertion pass.

### TC-03: Authorized Partner account setup

1. Open the Authorized Partner landing page.
2. Navigate to **Login**, then **Sign Up**.
3. Accept the account setup prerequisite.
4. Select **Continue**.
5. Verify the **Complete Your Agent Profile in Steps** heading.
6. Enter personal information, country code, phone number, and matching
   passwords.
7. Select **Next**.

**Expected result:** The OTP verification step is displayed and can be
completed with a valid verification code.

### TC-04: OTP verification and agency profile

1. Enter the OTP.
2. Select **Verify Code**.
3. Complete agency information.
4. Select the operating country.
5. Continue to professional experience.

**Expected result:** The user advances to the next profile step without
validation or navigation errors.

### TC-05: Professional experience and preferences

1. Select the relevant experience duration.
2. Enter recruitment, focus-area, and success-metric values.
3. Select applicable services.
4. Enter business registration and preferred-country information.
5. Select institution preferences.
6. Upload a supporting document.

**Expected result:** All values are accepted and the profile can proceed to
submission or completion.

## 8. Execution result and defect found

The two example smoke tests are implemented as independent checks. The
Authorized Partner flow successfully navigates through account setup and
reaches the profile form. The end-to-end sign-up test does not complete.

### DEF-001: OTP input is not available after account setup

| Field | Details |
| --- | --- |
| Severity | High |
| Priority | High |
| Status | Open / requires application or test-data investigation |
| Area | Sign-up, OTP verification |
| Reproduction | Run `npx playwright test tests/signup_automation_script.spec.ts` |
| Failing step | `input[autocomplete="one-time-code"]` |
| Observed result | The locator is not found within 30 seconds; the page remains on the personal-details form |
| Expected result | A visible OTP input and verification action should appear after selecting **Next** |

### Evidence

The Playwright report shows:

```text
Error: locator.fill: Test timeout of 30000ms exceeded
waiting for locator('input[autocomplete="one-time-code"]')
```

The captured page state still contains the personal-details fields and the
**Next** button. It does not contain the expected OTP input. This means the
failure is not merely a slow locator; the application did not reach the state
required by the next test step.

### Likely investigation areas

1. Confirm whether the account form accepted the submitted email and phone
   number.
2. Check browser console and network responses after **Next**.
3. Verify whether OTP delivery or backend registration failed.
4. Confirm whether a newly generated test account is required for every run.
5. Inspect the current OTP component accessibility attributes and update the
   selector only if the field is visibly present under a different attribute.

The test should not be “fixed” by adding an arbitrary sleep or by disabling the
OTP assertion. The application state and the test data must first be made
deterministic.

## 9. QA approach used

The test was developed using the following QA practices:

1. **Risk-based coverage:** The account creation journey was prioritized
   because it is a business-critical onboarding path.
2. **User-visible checkpoints:** Assertions verify meaningful headings and
   state transitions, not only successful clicks.
3. **Accessible locators:** Roles, labels, placeholders, and names are used
   where available so tests better reflect user interaction.
4. **Failure evidence:** The HTML report and page snapshot are retained to
   identify the exact failing state.
5. **Defect isolation:** The failure is reported at the first unavailable
   application state rather than allowing later steps to produce misleading
   errors.
6. **Repeatability:** The flow is executable from the command line and uses a
   fixed browser project and test directory.
7. **Environment awareness:** OTP, email, external application availability,
   and uploaded test files are treated as dependencies rather than silently
   mocked.

## 10. Recommended improvements

### Test automation

- Add `test.step()` blocks for each onboarding phase.
- Replace fixed `waitForTimeout()` calls with assertions for the next visible
  state or a specific network response.
- Use stable `data-testid` attributes for custom dropdowns and OTP controls.
- Move test data and file paths to environment variables or fixtures.
- Generate unique email addresses for repeatable test runs.
- Add explicit assertions after each **Next** action.
- Add cleanup or a documented test-account lifecycle.
- Add optional Firefox, WebKit, and mobile projects after the Chromium flow is
  stable.
- Add CI scripts such as `test`, `test:headed`, and `report` to `package.json`.

### Application under test

- Ensure the OTP transition reports actionable validation and server errors.
- Provide a deterministic non-production OTP mechanism for automated tests.
- Expose stable accessible names and test IDs for custom form controls.
- Return clear UI feedback when registration or OTP delivery fails.

## 11. Definition of done for this QA task

The onboarding flow should be considered ready for regression use when:

- The account setup step consistently advances to OTP verification.
- The OTP field is visible and has a stable accessible locator.
- Valid OTP verification advances to agency details.
- Required-field and invalid-input behavior is covered.
- The complete flow passes repeatedly with isolated test data.
- The test passes in CI with the configured retry policy.
- An HTML report is available for every CI execution.

## 12. Current conclusion

The automation provides a useful Chromium smoke baseline and successfully
identifies a blocking issue at the account-setup-to-OTP transition. The next
QA action is to investigate the application response and test-account/OTP
setup, then rerun the complete onboarding flow. Until that is resolved, the
Authorized Partner registration journey should be treated as **not ready for
an automated regression pass**.