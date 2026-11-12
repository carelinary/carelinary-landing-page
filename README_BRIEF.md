# Carelinary landing page — RevoU brief revision

This folder is a complete static landing page and its form backend. It is based on the current GitHub `main` version and keeps the existing visual identity, five cinematic clips, program information, menu cards, FAQ, privacy popup, and favicon.

## What changed

- The star rating and survey claim were removed.
- The waiting list form now appears inside the hero, in the first desktop viewport.
- The hero explains the organic ingredient and fine dining concept, and the five scene video plays automatically without a pause button.
- The first 100 registrants voucher message is placed directly below the waiting list form. This is draft promotional copy; the owner must confirm redemption rules and the ability to honour the voucher before publishing it.
- The challenge, program, menu, service, membership, CTA, and FAQ sections follow the requested revised wording and order.
- Membership examples now include breakfast and up to three meals per day.
- The form asks for **Name** and **Instagram Username** only. The system also generates a submission reference and timestamp for duplicate protection and auditing; visitors do not enter those fields.
- The form's Privacy Policy popup link is directly below the form.
- The Thank You popup and privacy wording clearly say Carelinary is in prelaunch.
- New submissions go to a separate private Google Sheet tab named `Leads Brief`, with both UTC and readable WIB submission timestamps; existing `WaitingList` entries are left intact.

## Local preview

Run `node dev-server.mjs` in this folder, then open `http://127.0.0.1:5500/`. The form is disabled locally unless the four environment variables below are set. Run `node --test test/*.test.mjs` to verify the page and API.

## Environment variables

Set these on Vercel Preview first, then on Production after a successful full test:

| Variable | Value |
|---|---|
| `GOOGLE_APPS_SCRIPT_URL` | URL of the **new** Apps Script web app, ending in `/exec` |
| `APPS_SCRIPT_SHARED_SECRET` | The same new private random secret as `SHARED_SECRET` in Apps Script Properties |
| `REGISTRATION_ENABLED` | `true` |
| `PRIVACY_APPROVED` | `true`, only after the owner approves the revised privacy text |

Never put the secret into a GitHub file or public screenshot. Any previously shown secret should be rotated for the new integration.

## Release sequence

Follow [PANDUAN_BRIEF_DAN_LAUNCH.md](PANDUAN_BRIEF_DAN_LAUNCH.md). Use a separate Apps Script project for this revision so the currently live, older form keeps working during preview. Once the new form successfully writes to `Leads Brief` in Preview, merge the GitHub branch, set the Production variables, and redeploy.
