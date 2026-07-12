# AUDIT_LOG.md — Stage 2 Execution

Framework: UNIVERSAL CODE AUDIT & REMEDIATION PROMPT v3 · Branch: `audit/remediation`
Plan: `AUDIT_AND_PLAN.md`. Baseline this session: `npx vitest run` → **11 passed**; `npm run build` → clean.

**Operator decisions:** `FIX` given without answers to Q1–Q6. Applied defaults: **Q1** = `+974 3326 0393` is the correct number (used in 6 places), header's `+974 4444 0085` replaced (flagged for confirmation). **Deferred for lack of an answer/dependency:** Q2 (prerender dep → Batch 8), Q3/Q4 (listing content + privacy text → Batch 7), Q5 (real hours → F-016 part of Batch 2), Q6 (error-tracker dep → Batch 10).

---

## Batch 1 — Test-harness top-up  [test]

**Files changed**
- `src/lib/asArray.ts` (new) — safe `returnObjects` coercion helper (precondition for Batch 3).
- `src/lib/__tests__/asArray.test.ts` (new) — proves `asArray('key') === []` (the i18next missing-key failure mode) and array passthrough.

**Checks:** `npx vitest run` → before **11 passed** → after **14 passed** (+3). Build gate unaffected.

**Acceptance:** ✅ helper + tests run in the suite; the string→[] behavior that guards F-003 is locked in.

**Definition of Done:** Correct ✅ · Typed ✅ · Tested ✅ · Readable ✅ · comment explains *why* ✅.

**Deliberate compromises:** none.

**Commit:** `83508b7`

---

## Batch 2 — Single source of truth: phone + tel:  [bugfix]

Fixes **F-001** (header advertised `+974 4444 0085` vs `+974 3326 0393` everywhere else) and **F-017** (footer `tel:` contained spaces). **F-016 (hours) DEFERRED** — no answer to Q5 (real hours unknown).

**Files changed**
- `src/components/layout/Header.tsx:233-237` — top-bar number now `company.phone`; `tel:` href space-stripped (matches ContactPage). Retired the hardcoded `+974 4444 0085`.
- `src/components/layout/Footer.tsx:109` — `tel:` href space-stripped.
- `src/test/setup.ts` — added a `ResizeObserver` stub (jsdom lacks it; Header mounts one).
- `src/components/layout/__tests__/phone-consistency.test.tsx` (new) — regression: Header shows `company.phone`, the old number is gone, every `tel:` equals `tel:+97433260393` (no whitespace); Footer likewise.

**Checks:** `npx vitest run` → **16 passed** (was 14). `npm run build` → clean. `grep 4444 0085 src/` → none.

**Acceptance:** ✅ one phone number sitewide; regression test was red before the Header edit (wrong number present), green after.

**Definition of Done:** Correct ✅ · Tested (regression) ✅ · Typed/Linted ✅ (build green) · Readable ✅ · Consistent ✅.

**Deliberate compromises:** **Q1 assumption** — `+974 3326 0393` taken as correct (used in 6 places) and `+974 4444 0085` retired. If `4444 0085` is a real office landline, it must be re-added (in `company`, labeled) — flagged in the final report.

**Things noticed, left alone:** hours copy still inconsistent (F-016) — deferred to Q5.

**Commit:** `phone` below.
