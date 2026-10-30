## Problem

The shared parser treats dates as month-first even when the tenant writes day-first.
This is the parser problem represented by support ticket #4471, not the separate
booking-v3 hint problem.

## Report count

379 unique reports in the supplied export, across 11 tenants, received from
2026-04-01 through 2026-10-04. The export contains 427 rows but 412 unique report
IDs in total; duplicate export rows are not additional reports.

## Evidence and reproduction

1. Deduplicate `src/lib/data/reports-4471.json` by report ID and retain reports
   whose `mergedInto` is 4471.
2. Resolve each report's tenant from `src/lib/data/tenants/` by handle.
3. Use `causeOf` in `src/lib/kb/causes.ts` with the tenant locale and form version.
4. The parser group has 379 reports. Intake labeled 356 as parser and 23 as hint;
   the tenant-derived cause, not the intake guess, determines this count.
5. In a day-first tenant, an intended 4 May entered as `04/05/2026` can be read by
   the shared month-first parser as 5 April.

The five reports noted as a one-day move are already included in this group,
not evidence of an additional cause from their wording alone.

## Expected outcome

Interpret dates consistently with the tenant's date convention, and verify
ambiguous dates without treating browser locale as tenant configuration.
Track the booking-v3 hint fix separately.

## Knowledge-base evidence

- Source: `src/routes/kb/incidents/4471-findings/+page.svx`
- Rendered page: `rendered/4471-findings.html`
- Reproduce with `npm ci` followed by `npm run render`.

These are export-snapshot counts, not a claim about the desk's current queue.