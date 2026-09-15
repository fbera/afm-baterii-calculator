# Calculator AFM Baterii 2026

Open `index.html` directly in a browser. No install, server, or build is needed.

Romanian calculator based on the supplied Ordinul 1.904/11.09.2026 PDF, annex articles 5–6 and 19, pages 2–3 and 9. The contribution formula was verified from the embedded formula image on page 9.

- Contribution score: `min(50, 30 * (total - funding) / funding)`.
- Capacity score: `min(50, capacity * 2.5)`; minimum capacity 10 kWh.
- Funding limit: `min(15000, 0.75 * total, total - ineligible, 1500 * capacity)`.
- Ineligible costs are part of the total, paid by the applicant. Cost-standard excess is handled automatically; do not enter it again as an ineligible cost.
- Display rounding is two decimals; scores use unrounded numbers internally. The maximum-funding button rounds down to whole bani.
- Both funding shares can be edited manually; they sum to the project total. On leaving a field, amounts are clamped to the allowed interval.
- User preference: minimum AFM funding is 25% of the total. This is a calculator constraint, not a guide requirement. Impossible intervals are disabled.
- The red marker selects the largest allowed AFM amount that earns 50 contribution points (37.5% of total, rounded down to bani and capped by the funding limit). It is selected initially and on reset. Battery points are separate.
- Checks cover these numeric constraints, not the applicant's complete eligibility or selection chances.

Run the isolated calculation checks with `node calculator.test.cjs`. This standalone folder does not use the monorepo's packages or build tools.
