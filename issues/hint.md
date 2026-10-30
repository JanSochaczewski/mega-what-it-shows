## Problem

Booking-v3 displays `MM/DD/YYYY` to day-first tenants while the form interprets
the submitted date in the tenant's day-first order. A user following the displayed
hint can therefore record the wrong date. This is separate from the shared parser
problem and needs its own fix and ticket.

## Report count

33 unique reports in the supplied export, across 3 tenants, received from
2026-04-17 through 2026-09-22. Together with the 379 parser reports, these account
for all 412 unique reports merged into support ticket #4471.

## Evidence and reproduction

1. Deduplicate `src/lib/data/reports-4471.json` by report ID and retain reports
   whose `mergedInto` is 4471.
2. Resolve each report's tenant from `src/lib/data/tenants/` by handle.
3. Use `causeOf` in `src/lib/kb/causes.ts`: a day-first tenant, channel `form`,
   and booking-v3's month-first hint identify this problem.
4. The hint group has 33 reports. Intake labeled 18 as hint and 15 as parser;
   do not use those guesses as the cause or count.
5. For a day-first tenant using booking-v3, follow the `MM/DD/YYYY` hint and enter
   `05/04/2026` intending 4 May. Day-first interpretation instead records 5 April.

## Expected outcome

Display a date-format hint that agrees with the tenant-specific form interpretation.
Check day-first booking-v3 tenants explicitly; changing the shared parser alone
does not correct this misleading hint.

## Knowledge-base evidence

- Source: `src/routes/kb/incidents/4471-findings/+page.svx`
- Rendered page: `rendered/4471-findings.html`
- Reproduce with `npm ci` followed by `npm run render`.

These are export-snapshot counts, not a claim about the desk's current queue.