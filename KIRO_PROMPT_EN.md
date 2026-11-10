# Prompt to paste into Kiro AI

You are a senior frontend and serverless engineer reviewing the **existing** Carelinary landing page. Work inside the currently opened GitHub checkout of `carelinary/carelinary-landing-page`. This is a revision of an online site, not a request to generate an unrelated replacement.

## First, read the project

Read `README.md`, `PANDUAN_UPLOAD_DAN_LAUNCH.md`, `MATERIAL_DAN_KEPUTUSAN.md`, `index.html`, `styles.css`, `enhancements.css`, `script.js`, `privacy.html`, `api/interest.mjs`, `apps-script/Code.gs`, `vercel.json`, and the tests. Inspect the existing assets. Summarize any real defects before changing files. Preserve the agreed visual identity: forest green `#183B32`, warm cream `#F7F3EA`, champagne gold `#B79A62`, terracotta `#B7644B`, Cormorant Garamond for headings, Montserrat for body text, the approved plate logo, and the tagline “building a better lifestyle”.

## Product scope and copy

The current launch concept has two initial program focuses: GERD Care and Cardiometabolic Care. These are proposals under professional review, not proven treatment programs. Keep the site honest about pre-launch status. Do not claim Carelinary can cure, prevent, or reverse a disease. Do not claim that all dishes are certified organic, chemical-free, plastic-free, or clinically safe without documented evidence. Health screening, a Prodia partnership, nutritionist staffing, and exact delivery coverage are unconfirmed. Illustrative prices are not final prices.

The homepage must explain the bridge between health need and the service: customers managing cardiometabolic risk or GERD make food decisions daily; busy professionals need a practical way to follow individualized dietary guidance consistently while still enjoying their meals. Keep this concise and natural in Indonesian. Avoid unsupported prevalence or market-demand statistics.

## Required page behavior

1. Keep the existing premium editorial design, responsive layout, and current section content unless an explicit correction below requires a change.
2. Use the approved Carelinary plate mark in the header and footer. Ensure the favicon uses the same mark.
3. Keep the current page architecture but make the hero full-bleed and cinematic. The exact headline is “Nutrisi yang tepat, diracik dengan *cita rasa.*” with “cita rasa.” italicized in gold. Preserve the existing smaller hero paragraph verbatim. Play the five included MP4 concept clips sequentially in the hero, muted and inline, with a visible pause/play control, a still-image poster fallback, and respect for `prefers-reduced-motion`. Label these clips as **illustrations of the concept**, not documentary footage of actual Carelinary production.
4. Keep the waiting-list form **immediately before FAQ**, and use the label “Waiting List” rather than implying that a paid pre-order is already open.
5. The form needs name, email, phone/WhatsApp, delivery area or address, program interest, desired duration (5 or 10 days or consultation), meals per day (1, 2, 3, or consultation), and an unchecked consent box for contact and a possible nutrition consultation. Do not request a diagnosis or laboratory results.
6. The form must call `/api/interest`. The Vercel Function validates input and forwards it to a private Google Apps Script Web App using a shared secret stored **only** in server environment variables and Apps Script Script Properties. The Apps Script must verify the secret, prevent duplicate submission IDs, neutralize spreadsheet formula injection, append to the private `WaitingList` sheet, and send a notification to `carelinaryfoodcatering@gmail.com` when possible.
7. Keep registration disabled until all four server settings are ready: `GOOGLE_APPS_SCRIPT_URL`, `APPS_SCRIPT_SHARED_SECRET`, `REGISTRATION_ENABLED=true`, and `PRIVACY_APPROVED=true`. When disabled, explain plainly that registration has not opened. Never show a false success.
8. Show the Thank You dialog **only after** the backend confirms that the same submission ID was stored. Preserve entered values and show a helpful error when the request fails. Prevent double submission while a request is in progress.
9. Keep a clickable Privacy Policy dialog and full `privacy.html`, revised from the owner's Google Doc to match the **actual** form fields and processors. The source Google Doc described name/Instagram only, whereas the website form collects more information. Do not silently drop those disclosures. The proposed retention is 12 months, but the owner must approve this and the access/deletion process before enabling data collection.
10. Keep the existing GERD and cardiometabolic nutrition disclaimer. The three menu photos are concept examples. Every card must list ingredients, useful nutrients, an evidence-aligned explanation of their role, and estimated calories, carbohydrate, protein and fat. The currently displayed numbers are **illustrative estimates only**: do not present them as laboratory analysis, certified nutrition labels, disease-specific prescriptions, or final customer macros. Final values require a fixed recipe, portion weights, preparation method, and dietitian review. If you can obtain validated recipe data later, replace the estimates and document the method. Preserve the visible personalization disclaimer.
11. Explain four conditions individually: GERD (personal triggers, portion size, lower-fat preparation); diabetes (carbohydrate portions, nonstarchy vegetables, lean protein); high cholesterol (less saturated fat, more unsaturated fat and fiber); hypertension (less sodium and an overall DASH-like eating pattern, with potassium caveat for kidney disease). Keep copy conditional and non-curative. Cite authoritative medical sources already linked in the condition section.
12. Make the membership calculator clearly say that its result is illustrative and excludes services/fees not yet determined. Keep the chosen two-program launch scope consistent across hero, menu, FAQ, and form.
13. Retain other current sections, order, copy and images except the specified changes. The form must be before FAQ. Preserve the site's existing environmental packaging and health-screening concept copy; do not add unverified claims such as certified organic, “chemical-free”, a confirmed Prodia partnership, free checkups, or “absolute safety”.

## Technical review and verification

Check semantic HTML, labels, keyboard navigation, focus outlines, modal behavior, mobile menu, video fallback, image loading, console errors, and layout at 360 px, 768 px, and 1280 px. Check that no real secret is committed. Run `node --check script.js`, `node --check api/interest.mjs`, and `node --test test/*.test.mjs`. Add only tests that verify important behavior, especially disabled registration, invalid input rejection, and confirmed Sheet write before success. Do not submit real personal data during tests.

Verify that Vercel can serve the static root files and `api/interest.mjs` from the project root. Do not configure an output directory named `dist`; this repository does not have one. If you change the Apps Script payload, update the Sheet header instructions and privacy copy accordingly. If you change the consent wording, bump `consent_text_version` consistently in frontend, API, and Apps Script.

## Final report

Return: (a) files changed, (b) important fixes, (c) tests run and results, (d) items requiring business-owner input, and (e) exact Vercel Preview and Production steps. Do not merge to `main`, change DNS, or set `REGISTRATION_ENABLED=true` on Production until the owner has completed the privacy and live-submission checks in the guide.
