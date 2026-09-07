# Shopping experience: targeted UI enhancements

Eight targeted changes to the consumer shopping surfaces. No redesign, no new workflows, no branding changes. Existing components (marketplace shell, page header, plan tile, cart store) stay in place and are extended.

## Where each change lands

1. **Products on the landing page** — In the hero of the home page, directly under the "Start shopping" / "Talk to an agent" buttons, add a compact row of product chips (Health, Dental, Vision, Life, Critical Illness, Accident, Hospital Indemnity). Each chip links to the existing product path it already uses. "Start shopping" behaviour is untouched.

2. **Products on every shopping screen** — Add one shared product-switcher strip, placed just under the floating top navigation on the shopping pages: choose path, quote, plans, plan detail, compare, cart, review, coverage. The active product is highlighted; picking another product moves the shopper to that product's plan list, exactly as today's product links do.

3. **State preserved when switching** — The cart, saved and compare selections, and quote answers already persist for the browsing session. Extend the same persistence to the plan-list filters, sort order and search text, and to the compare screen selection, so returning to a screen shows it exactly as it was left. Nothing is cleared on navigation.

4. **Cart visibility in the header** — Add a cart button to the top navigation bar. When the cart has items it shows the item count and monthly total and is visually prominent; when empty it stays quiet and the current empty-cart screen behaviour is unchanged.

5. **Shop-plan button placement** — Once the shopper is past the landing page, the "Shop plans" action no longer sits in the top pill next to the product strip. It moves into the page's own action area (page header / sticky footer bar on the plan and cart screens) so the product switcher stays clear. Same action, same destination.

6. **Headings** — Increase prominence of page and section headings on the shopping screens: larger display size, tighter leading, clearer eyebrow-to-title spacing, consistent section headings. Same fonts and colour tokens as today.

7. **Product icons** — Give each product a fixed icon (tooth, eye, heart/shield, etc. from the icon set already used) shown in the landing chips, the product switcher and the choose-path screen.

8. **Carrier logos on plan tiles** — Add a small circular carrier mark to the top-left of each plan tile, using the carrier's initials on a neutral tinted disc so it reads as a logo without competing with plan details. Tile structure, data and actions are unchanged.

## Technical notes

- New `src/lib/products.ts`: single product catalogue entry (key, label, icon, route) reused by landing chips, switcher and choose-path so the list never diverges.
- New `src/components/abox/product-switcher.tsx` and `src/components/abox/carrier-mark.tsx`.
- `marketplace-shell.tsx`: add cart button driven by `useCart()`/`cartTotals`, and a `product` prop that renders the switcher beneath the pill nav on flow pages only (landing keeps its current nav).
- Filter/sort persistence: extend the existing sessionStorage-backed store pattern (as in `cart-store.ts`) with a small `browse-store` for plan filters, sort, search and compare selection; components read initial state from it.
- Heading changes are confined to `page-header.tsx` and the section headings on the shopping routes.
- All new controls are real buttons/links with focus rings, aria-current on the active product, and text labels alongside icons so meaning is not colour- or icon-only. Chips wrap and scroll horizontally on small screens.

## Out of scope

No changes to business rules, quoting logic, routing structure, auth, internal workspaces, or any non-shopping screen.
