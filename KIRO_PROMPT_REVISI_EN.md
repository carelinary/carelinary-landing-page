# Prompt for Kiro AI

You are editing the existing Carelinary landing-page repository, which is already deployed to Vercel at www.carelinary.my.id. Work on a new feature branch, preserve the current architecture and all sections except the two content consolidations below, and make a small, reviewable diff. The repository is a static HTML/CSS/JavaScript site with a Vercel Function in `api/interest.mjs` and Google Apps Script in `apps-script/Code.gs`.

## Required page structure

1. Keep the cinematic five-scene autoplay hero, logo, palette, Cormorant Garamond + Montserrat typography, menu cards, services, membership, environmental section, medical-check-up visual, waiting-list form immediately before FAQ, privacy dialog/page, thank-you dialog, footer, and mobile behavior.
2. Merge the current “Kenali Tantangannya” and “Carelinary Approach” into one section at `#tentang`. Present each customer problem directly beside the Carelinary response: uncertainty about appropriate food, limited time, and monotonous diet. Use cautious pre-launch language. Include a short example of how a menu would be assessed, without naming or inventing a nutritionist.
3. Merge “Program Carelinary” and “Kondisi Kesehatan” into one section at `#program`. Keep two program cards: GERD Care and Cardiometabolic Care. Within these, preserve specific explanations for GERD, diabetes/blood glucose, hypertension/blood pressure, and high cholesterol. Do not leave a redundant `#kondisi` section. Update navigation and anchors so no broken links remain.
4. Keep the heading “Bagaimana satu menu dipertimbangkan?” and use the owner's revised Indonesian paragraph in `index.html` for the hypothetical Grilled Chicken Bowl example. Do not show the eyebrow label “CONTOH PROSES PENILAIAN MENU” or the small closing sentence beginning “Ini contoh alur penilaian yang direncanakan”. Keep the separate menu-section note that nutrition figures are illustrative concept estimates.
5. Do not name an individual dietitian or claim that an individual has already reviewed the recipes. Do not claim medical outcomes, organic certification, a Prodia partnership, or an available clinical service without evidence.
6. Preserve the current menu examples and their estimated nutrition numbers for now. The page must clearly say they are illustrative concept estimates, not recipe-validated values. Do not quietly change them or call them “validated.” The separate `MENU_VALIDATION_STATUS.md` explains what evidence is needed before changing that status.
7. Keep the waiting-list backend gate: all four Vercel variables `GOOGLE_APPS_SCRIPT_URL`, `APPS_SCRIPT_SHARED_SECRET`, `REGISTRATION_ENABLED`, and `PRIVACY_APPROVED` must be correctly configured before accepting a registration. Never place secrets in browser JavaScript, HTML, GitHub, or this chat. Maintain the requirement that the thank-you dialog appears only after the API confirms the matching `submission_id` from Apps Script. Keep the Google Sheet private.
8. Directly below the two hero buttons, keep the star rating card with 4.5/5 and the 100-respondent survey sentence. This is a RevoU coursework concept, not an operating business or a real survey. Keep the concise heading “Simulasi survei kepuasan”; do not restore the removed phrases “Data simulasi tugas RevoU” or “Data ilustratif, bukan hasil survei nyata.” Never rewrite the simulation as an unqualified actual customer survey or testimonial.

## Verification and handoff

- Inspect the actual files before editing. If the supplied revision already implements the content changes, verify it and limit changes to concrete defects.
- Check responsive layout at desktop and mobile widths, navigation links, readable contrast, video fallback, privacy dialog, form placement, FAQ, and no duplicate IDs.
- Run `node --check script.js`, `node --check api/interest.mjs`, and `node --test test/*.test.mjs`. Report exact results.
- Do not merge into `main`, modify Production variables, or activate registration unless the owner explicitly chooses to do so after the Preview and privacy checks.
- Summarize the changed files, Preview URL if available, any unresolved issues, and exact next steps to connect Google Sheets using `PANDUAN_REVISI_DAN_GOOGLE_SHEETS.md`.
