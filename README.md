# ÉCLAT Skin Lab — Skin Type Finder

A modern, professional, mobile-friendly interactive skin analysis web application that helps customers identify their exact skin type and receive tailored skincare recommendations.

![ÉCLAT Skin Lab](https://img.shields.io/badge/Skin%20Type%20Finder-ÉCLAT%20Skin%20Lab-C47C72?style=for-the-badge)
![Tech](https://img.shields.io/badge/Vanilla-HTML5%20%7C%20CSS3%20%7C%20ES6+-E8D5CE?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-221F1E?style=for-the-badge)

---

## Overview

**ÉCLAT Skin Lab** is designed with a minimal, elegant beauty-brand aesthetic (soft cream, beige, white, and blush palette, clean typography, and ample white space—strictly with no gradients or excessive animations). 

The platform guides customers through a 6-step dermatological questionnaire, computes an estimated skin type with transparent scoring, evaluates sensitivity as an independent co-occurring characteristic, and generates a personalized morning and evening routine with ingredient guidance.

---

## Key Features

- **Personalized Diagnostic Quiz**: 6 targeted questions evaluating post-wash feeling, midday shine, pore appearance, reactivity, daily feel, and primary concerns.
- **Transparent Scoring System**: Visual diagnostic breakdown showing percentage weighting across all core skin profiles (Oily, Dry, Combination, Normal).
- **Independent Sensitivity Analysis**: Evaluates skin reactivity (High, Moderate, Low/Resilient) independently, accommodating that any skin type can be sensitive.
- **Conflict & Mixed Profile Detection**: Safely identifies complex or conflicting skin signals (e.g., dehydrated oily barriers) and suggests professional consultation.
- **Customized AM & PM Skincare Routines**: Step-by-step regimen tailored to barrier recovery and protection.
- **Ingredient Guidance**: Lists of *“Ingredients to Love”* and *“Ingredients to Approach with Caution”*.
- **Print & Download**: Clean `@media print` styling for saving results as PDF or printing.
- **WhatsApp Integration**: One-click consultation button with pre-filled message including the customer's skin type and sensitivity profile.
- **Privacy First**: 100% client-side execution; zero tracking, cookies, or data storage without explicit user action.

---

## File Structure

```text
website/
├── index.html       # Semantic HTML5 layout with accessible ARIA landmarks & modals
├── style.css        # Minimalist luxury design system, responsive breakpoints & print styles
├── script.js        # Questionnaire state machine, scoring engine & DOM handlers
└── README.md        # Documentation
```

---

## Local Setup & Quickstart

No dependencies or build steps required. Simply clone and open:

```bash
# Clone the repository
git clone https://github.com/prashantsharma615/website.git

# Navigate into the project directory
cd website

# Run with any local server (e.g., Python 3)
python -m http.server 8080

# Or open directly in your browser
open index.html
```

Visit `http://localhost:8080` in your browser.

---

## Disclaimer

This quiz provides general skincare information and does not diagnose skin conditions. Results are estimates and may vary with weather, products, hormones, and other factors. Consult a board-certified dermatologist for medical diagnosis or chronic cutaneous concerns.

---

## License

MIT License. Designed & developed for ÉCLAT Skin Lab.
