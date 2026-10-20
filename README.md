# Playwright with TypeScript

A hands-on test automation project using **Playwright and TypeScript** to practice end-to-end testing, API testing, reusable test architecture, and modern automation best practices.

This repository contains practice exercises and automation examples inspired by Rahul Shetty Academy's Playwright course.

**Repository:** [Playwright-with-Typescript](https://github.com/gaurav150/Playwright-with-Typescript)

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [Configuration](#configuration)
- [Learning Objectives](#learning-objectives)

## Overview

The purpose of this project is to develop practical skills in building maintainable and reliable automation frameworks with Playwright and TypeScript.

The project explores browser automation, API testing, reusable page objects, custom fixtures, data-driven testing, and test execution configuration.

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Type-safe test development |
| Playwright Test | Web and API test automation |
| Node.js | JavaScript runtime |
| npm | Package and dependency management |
| ExcelJS | Reading and writing Excel test data |
| Git and GitHub | Version control and source code management |
| GitHub Actions | CI workflow support |

## Project Structure

```text
Playwright-with-Typescript/
├── .github/
│   └── workflows/       # GitHub Actions workflows
├── pageobjects/         # Page Object Model classes
├── tests/               # Playwright test specifications
├── utils/               # Reusable utilities and helpers
├── .gitignore
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

## Key Features

- **End-to-End Testing:** Automate user journeys and validate web application behavior.
- **Page Object Model (POM):** Separate page-specific locators and actions from test cases.
- **TypeScript:** Use static typing to improve code readability and maintainability.
- **API Testing:** Practice validating API responses and integrating API operations into test workflows.
- **Fixtures:** Reuse setup and test data through Playwright's fixture mechanism.
- **Data-Driven Testing:** Use external test data, including Excel files where applicable.
- **Test Configuration:** Configure browsers, parallel execution, retries, and timeouts.
- **Debugging and Reporting:** Use Playwright traces and HTML reports to investigate failures.
- **CI/CD Practice:** Explore automated test execution through GitHub Actions.

## Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/)
- npm, which is included with Node.js
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) or another TypeScript-compatible editor

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/gaurav150/Playwright-with-Typescript.git
```

### 2. Navigate to the project directory

```bash
cd Playwright-with-Typescript
```

### 3. Install dependencies

```bash
npm ci
```

If you do not have a `package-lock.json` file, use:

```bash
npm install
```

### 4. Install Playwright browsers

```bash
npx playwright install
```

To install only Chromium:

```bash
npx playwright install chromium
```

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run tests in a specific file:

```bash
npx playwright test tests/example.spec.ts
```

Replace `tests/example.spec.ts` with the actual test file you want to execute.

Run tests with the Playwright UI:

```bash
npx playwright test --ui
```

Run tests in debug mode:

```bash
npx playwright test --debug
```

## Test Reports

The project is configured to generate an HTML report.

After test execution, open the report using:

```bash
npx playwright show-report
```

For debugging a failed test, use:

```bash
npx playwright show-trace path/to/trace.zip
```

Replace the example path with the actual trace file generated during test execution.

## Configuration

The `playwright.config.ts` file controls the test execution settings, including:

- Test directory
- Parallel execution
- Retry behavior
- Worker count
- HTML reporting
- Browser configuration
- Trace collection

The current configuration uses Chromium, runs tests in headless mode by default, and adjusts retries and worker count depending on whether tests run locally or in a CI environment.

## Learning Objectives

This repository supports hands-on learning in:

- Playwright with TypeScript
- Browser automation and locator strategies
- Page Object Model design
- Fixtures and reusable test components
- API testing and request handling
- Test data management
- Debugging with Playwright Trace Viewer
- Test execution in CI/CD pipelines

## Author

**Gaurav**

GitHub: [@gaurav150](https://github.com/gaurav150)

---

This repository is maintained for learning, practice, and continuous improvement in test automation engineering.
