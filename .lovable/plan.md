# Plan Results filters and horizontal tiles

## Scope
Update only `/plans` and the shared plan-card presentation needed by that page. Preserve existing data, sorting, carrier counts, pricing, metal colors, cart rules, Plan-AI, navigation, and all other pages.

## Implementation

1. **Expand and number the filter rail**
   - Keep the existing Exchange, Metal tier, Network, Carrier, HSA, and Premium controls.
   - Add working maximum Deductible, maximum Out-of-Pocket Maximum, maximum Primary Care visit cost, and maximum Specialist visit cost filters using existing numeric plan fields.
   - Present every filter group with a subtle ordered number, consistently in desktop and mobile filter panels.
   - Persist every added filter in the existing session-backed browse state and include it in clear/reset and active-filter counts.
   - Continue deriving carrier counts from plans that satisfy every active non-carrier filter.

2. **Create a horizontal Plan Results presentation**
   - Add a page-selectable horizontal variant to the existing plan card instead of replacing its presentation elsewhere.
   - Render `/plans` results as one full-width tile per row on desktop.
   - Reflow the same tile into a readable stack on tablet and mobile, without restoring the desktop two-column grid.

3. **Expose comparison details and preserve actions**
   - Show carrier, plan name, premium, deductible, out-of-pocket maximum, Primary Care visit, Specialist visit, metal tier, network, exchange/HSA badges, rating, and Plan-AI match.
   - Retain Save, Compare, Add to cart, and add a clearly visible Plan details action using the existing plan-detail route.
   - Keep all current handlers and state wiring unchanged.

## Technical details
- Extend `BrowseState` with numeric maximums for deductible, out-of-pocket maximum, PCP copay, and specialist copay, with defaults derived from the current plan-data ranges.
- Apply the same filter predicate to displayed results and carrier availability counts.
- Use existing semantic color tokens, `MetalBadge`, `StatusBadge`, `CarrierMark`, formatting helpers, icons, and control styles.
- Do not add fields or fabricate benefit values; use `deductible`, `oopMax`, `pcpCopay`, and `specialistCopay` from the existing plan model.

## Verification
- Confirm every numbered filter changes results and persists after navigation/refresh in the session.
- Confirm carrier counts respond to the new filters.
- Confirm one plan tile per row on desktop and usable reflow on tablet/mobile, with no horizontal overflow.
- Confirm Save, Compare, Add to cart, and Plan details work and retain their existing state.
- Confirm build/runtime logs are clean and no non-`/plans` page changed visually.
