# Plan: Prominent Hero Product Pills on Landing Page

## Scope
Only the hero section of the ABox landing page (`src/routes/index.tsx` → `Hero` → `ProductSwitcher variant="chips"`).

No changes to:
- "Shop by product" cards
- Pathway cards / Guide Me / Browse Myself
- Other pages, flows, navigation, auth, branding, or components

## Current State
The hero renders `<ProductSwitcher variant="chips" />` with small pills:
- Height: `min-h-9`
- Padding: `px-3 py-1.5`
- Icon: `h-4 w-4`
- Text: `text-sm`
- Spacing: `gap-1.5`
- Border: `border-border`
- Background: `bg-card`

The pathway cards below use much heavier visual weight: `p-7`, `rounded-2xl`, `h-16 w-16` icon tiles, `text-3xl` headings, hover lift, and `card-brackets` / `edge-sheen` treatment.

## Proposed Change
Increase the hero product pills’ visual importance so they read as a primary navigation element inside the hero, comparable to the pathway cards, without converting them into cards.

### Targeted adjustments to the `chips` variant only
- **Height:** from `min-h-9` to `min-h-12 md:min-h-14`
- **Horizontal padding:** from `px-3` to `px-5 md:px-6`
- **Vertical padding:** from `py-1.5` to `py-2.5 md:py-3`
- **Icon size:** from `h-4 w-4` to `h-5 w-5 md:h-6 md:w-6`
- **Typography:** from `text-sm font-medium` to `text-base md:text-lg font-semibold`
- **Pill spacing:** from `gap-1.5` to `gap-2 md:gap-3`
- **Border:** keep `rounded-full`, use `border-border-strong` / `border-strong` for more definition
- **Background:** `bg-card` with subtle `bg-primary/5` hover or active state, keeping the existing active `bg-primary-soft text-primary`
- **Hover/active:** add `hover:-translate-y-0.5 hover:border-primary/50` and a clean shadow (`shadow-card`) so they feel tactile like the pathway cards
- **Container spacing:** adjust `mt-8` hero wrapper spacing only if needed to prevent overlap

All values come from the existing design system tokens (`--shadow-card`, `--border-strong`, `--primary`, `--primary-soft`, `--card`, `--accent`) and existing utilities (`card-brackets` / `edge-sheen` will **not** be used because pills must stay pills).

## Responsive Behavior
- Pills remain in a wrapping/snap-x row.
- Mobile: keep larger tap targets (`min-h-12`, larger icon/text), wrap cleanly.
- Tablet/Desktop: pills grow to `min-h-14` and scale icon/text.
- No horizontal overflow; existing `overflow-x-auto md:flex-wrap` behavior preserved.

## Verification
After the edit, verify the hero product pills at:
- Desktop (≥1280px)
- Tablet (≈768px)
- Mobile (≈375px)

Confirm they are clearly more prominent, do not overlap the headline/CTA, still route correctly, and that the rest of the page (pathway cards, Shop by product cards, footer, nav) is untouched.

## Implementation Steps
1. Modify `src/components/abox/product-switcher.tsx` to add a larger `chips` styling mode.
2. Optionally adjust the hero wrapper spacing in `src/routes/index.tsx` if the larger pills cause local crowding.
3. Build and visually inspect the hero at three viewport sizes.
