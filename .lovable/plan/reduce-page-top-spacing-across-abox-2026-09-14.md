# Reduce page-top spacing across ABox

## Goal
Tighten the vertical gap between each global header and the first meaningful page label/title across the complete experience, while preserving the established hierarchy and normal spacing within page content.

## Implementation

1. **Homepage**
   - Reduce only the hero’s top padding so “Insurance, tuned to you.” sits closer to the floating header.
   - Keep the hero composition, headline scale, product pills, calls to action, illustration, and lower hero spacing unchanged.

2. **Marketplace and shopping flows**
   - Normalize the route-level top padding used above the shared page header across shopping, plan results/details, comparison, cart, quote, application, review, support, legal, authentication, and employer-facing marketplace pages.
   - Use a compact responsive spacing scale rather than each page’s current larger `py-8` through `py-16` top value.
   - Preserve each page’s bottom padding and all spacing after the page title.

3. **Member and signed-in workspaces**
   - Reduce the shared top gap below the member header.
   - Tighten the shared Agent, Agency, Employer, Marketplace Administration, and JET shell by reducing the page-title panel’s top padding and the gap before page content.
   - Keep page labels and titles intact; do not alter navigation, cards, tables, filters, or page-specific section spacing.

4. **Consistency and safeguards**
   - Apply the adjustment through shared shells and shared page-header patterns where possible, with small route-level changes only where a route owns its top spacing.
   - Keep mobile touch clearance below sticky headers and avoid title/product-selector collisions.
   - Do not reduce intentional spacing inside empty, unavailable, loading, redirect, or centered-state screens unless their first meaningful heading has the same excessive header gap.

## Verification
- Review the homepage plus representative marketplace, quote, results, member, Agent, Agency, Employer, and JET screens.
- Check desktop, tablet, and mobile for a visibly tighter page start, no overlap with sticky headers/product selectors, no horizontal overflow, and unchanged interactions.
- Confirm current build, runtime, and console checks remain clean.
