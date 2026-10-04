---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Scaffold & Static Input UI**
  Becomes usable: Running Next.js app with static InputPanel, ContextChips, and page layout.
  Why now: Establishes base setup, dependencies, styling design tokens, and input controls before wiring API endpoints.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > Core Journey (Steps 1-3)`
  Spec ref: `spec.md > Components`, `spec.md > File Structure`, `spec.md > Look and Feel`
  Build: Set up Next.js + Tailwind v4 + Fonts + Zod + Vitest. Build `InputPanel`, `ContextChips`, and static page layout (`src/app/page.tsx`).
  Verify (mechanical): Run dev server and confirm page renders without syntax or runtime errors.
  Learner check: Open app in browser and verify tabs, context chips, and text area render properly.
  Commit: `Add scaffold and static input UI`

- [x] **2. Groq API Route & Samples**
  Becomes usable: Text payload posted to API endpoint processes through Groq server logic or sample data.
  Why now: Proves server-side integration and API data contracts early.
  PRD ref: `prd.md > Core Journey (Step 4)`
  Spec ref: `spec.md > Data Model`, `spec.md > External Services`
  Build: Implement `src/shared/schema.ts`, `src/server/gemini.ts`, `src/server/prompt.ts`, `src/shared/data/samples.ts`, and `src/app/api/analyze/route.ts`.
  Verify (mechanical): Test POST /api/analyze with sample payload using curl/fetch or unit test.
  Learner check: Submit sample text and verify API returns structured JSON response.
  Commit: `Add Gemini API route and request/response schemas`

- [x] **3. Rules Engine, Highlights & Report UI**
  Becomes usable: Deterministic quote validation, highlight mapping, and full report rendering with LaneCards and NextMoveStamp.
  Why now: Core logic for signal highlighting and recommendation stamp must be verified before UI polish.
  PRD ref: `prd.md > Core Journey (Steps 5-6)`
  Spec ref: `spec.md > Components`, `spec.md > Highlight Alignment`
  Build: Implement `src/shared/rules.ts`, `src/shared/highlight.ts`, unit tests (`tests/rules.test.ts`, `tests/highlight.test.ts`), `ReportView`, `PostView`, `LaneCard`, and `NextMoveStamp`.
  Verify (mechanical): Run Vitest (`npm run test` or `npx vitest`) to verify rules and highlight logic pass all tests.
  Learner check: Select a sample post, submit, and confirm report view highlights quotes and shows recommendation stamp.
  Commit: `Implement rules engine, highlight mapping, and report UI`

- [x] **4. Image Handling & OCR**
  Becomes usable: Screenshot upload tab validates and downscales images client-side before API submission.
  Why now: Image handling adds client canvas downscaling and multimodal Gemini processing onto existing API flow.
  PRD ref: `prd.md > Core Journey (Step 2)`
  Spec ref: `spec.md > Image Handling`, `spec.md > Stack`
  Build: Implement `src/client/lib/image.ts` for format/size validation and canvas downscaling; connect screenshot dropzone to API route.
  Verify (mechanical): Submit valid image payload to API route and verify text extraction and signal parsing.
  Learner check: Upload job posting screenshot and verify extracted text renders in report view.
  Commit: `Add client-side image downscaling and screenshot analysis`

- [x] **5. Loading, Error States & Fallback for Sample Posts**
  Becomes usable: Progressive step indicators, friendly error notices, and offline/rate-limit fallback results for sample posts.
  Why now: Ensures robust error handling and smooth visual feedback for all edge cases.
  PRD ref: `prd.md > States and Boundaries`
  Spec ref: `spec.md > Important Failure Modes`
  Build: Implement `LoadingSteps`, `ErrorNotice`, and `src/shared/data/sample-results.ts` fallback logic.
  Verify (mechanical): Trigger error states (e.g. text < 80 chars, rate limit mock) and confirm error messages display correctly.
  Learner check: Test invalid inputs and sample fallback to verify friendly error messaging.
  Commit: `Add loading steps, error states, and sample fallback`

- [x] **6. Visual Polish, Accessibility & Vercel Deployment**
  Becomes usable: Fully polished, accessible, production-ready application deployed to Vercel.
  Why now: Final review pass for visual theme, mobile responsiveness, keyboard accessibility, and production deployment.
  PRD ref: `prd.md > Look and Feel`
  Spec ref: `spec.md > Where It Runs`
  Build: Final responsive pass, contrast check, keyboard navigation, and deploy to Vercel.
  Verify (mechanical): Run `npm run build` locally to confirm zero build/type errors.
  Learner check: Navigate the live app, test on mobile/desktop, and confirm Vercel deployment URL works.
  Commit: `Final polish, accessibility, and production deployment`

## Hands-on Checkpoints

- [x] Early usable behavior explored
- [x] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [x] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Verified server-side deterministic quote validation, highlight mapping, and Groq SDK integration across all 6 build slices.
Route and stops: `src/app/api/analyze/route.ts` -> `src/server/groq.ts` -> `src/shared/rules.ts` -> `src/client/components/ReportView.tsx`.
Edit outcome: Added `fromScreenshot` OCR notification in `PostView.tsx` and updated prompt rules for fresher pay mismatch.
Reflection: Learner successfully completed self-directed build loop with automated verification checks.
Activity mode: Live app and editor code map.

## Revisions

- [Groq AI Provider Switch] — Replaced Gemini with Groq SDK (`groq-sdk`) using structured JSON outputs via `z.toJSONSchema` and 1 retry.
- [Highlighter Colors] — Updated lane colors to translucent tints behind ink text (`#E5484D` red scam, `#F5C400` yellow ghost, `#2F6FDB` blue mismatch).

