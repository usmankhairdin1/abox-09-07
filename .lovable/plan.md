# Link Lucie Spine from JET Platform workspace

## Goal
Make the standalone `/lucie` governance spine reachable from the operational internal app, as requested.

## Plan
1. Add a "Lucie Release Spine" navigation item to the **Governance** section of the JET Platform workspace in `src/lib/nav-config.ts`.
   - Label: "Lucie Release Spine"
   - Target: `/lucie`
   - Icon: a reference/governance icon (e.g., `BookOpen` or `ListTree`)
   - SCR ID: leave unset or use an existing governance SCR if applicable
2. Verify the link renders in the internal shell's left navigation when the JET workspace is active.
3. Smoke-test that clicking the link navigates to `/lucie` and the Lucie spine layout loads correctly.

## Out of scope
- No changes to `/lucie` route structure or content.
- No integration of Lucie data into operational pages.
