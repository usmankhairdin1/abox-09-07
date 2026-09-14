# Global decorative masthead cleanup

## Scope confirmed

Remove the repeated `line → eyebrow label → pulsing dot` treatment wherever it is used as a page or section masthead. Preserve page titles, content, navigation, behavior, branding, and unrelated status/activity indicators.

## Implementation

1. **Shared page headers**
   - Remove the decorative masthead from the shared marketplace `PageHeader`, which covers shopping, plans, compare, cart, quote/application, member, legal, support, and related pages.
   - Keep each actual page title, description, and actions intact.
   - Collapse the masthead-specific top gap so the title begins higher; retain only normal title-to-description and section spacing.

2. **Internal application shell**
   - Remove the same treatment from the shared internal shell used by Agent, Agency, Employer, Marketplace Administration, and JET pages.
   - Keep the real page title and actions.
   - Remove the masthead-only spacing above the title while preserving the shell’s existing card, navigation, and content spacing.

3. **Direct and landing-page instances**
   - Remove all direct instances from the landing hero and its product, Plan-AI, employer, and trust sections.
   - Remove the duplicate direct instance on the application home and the phase marker treatment on placeholder screens.
   - Adjust only the immediately dependent `margin-top`/wrapper spacing so headings and content move upward naturally.

4. **Component safety**
   - Remove now-unused imports and retire the shared `MastheadMark` implementation only if the final usage scan confirms no legitimate remaining consumers.
   - Keep unrelated eyebrow text, dividers, dots, and pulse indicators that do not form this exact three-part decorative masthead pattern—for example live-status dots and assistant activity indicators.

## Verification

- Search the complete source tree for `MastheadMark`, its hairline animation, and its pulsing-ring signature; confirm no decorative masthead occurrence remains.
- Check representative landing, shopping, quote/results, member, Agent/Agency, Employer, Marketplace Administration, and JET screens.
- Verify desktop, tablet, and mobile layouts have no leftover blank band and that page titles remain present.
- Confirm navigation and interactions still work, with no build, runtime, console, or responsive regressions.

## Files expected to change

- Shared decorative/header components under `src/components/abox/`
- The landing page and application home where the treatment is called directly
- No routes, business logic, data, navigation configuration, colors, typography tokens, or unrelated components
