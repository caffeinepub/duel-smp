# Specification

## Summary
**Goal:** Fix the build/deployment workflow so builds reliably start and complete, ensure required static assets are present to avoid failures, and surface initialization errors in the UI.

**Planned changes:**
- Investigate and repair the build/deployment trigger so a build visibly starts when triggered and completes successfully (or reports the first actionable error).
- Ensure statically referenced frontend assets exist under `frontend/public` with the exact expected paths/names (including the generated banner and logo used by `frontend/src/components/AppLayout.tsx`).
- Add a minimal, English, user-facing error state for frontend initialization failures (e.g., actor creation/initial queries) that does not prevent navigation tabs from rendering.

**User-visible outcome:** Deployments reliably start and either complete or show clear build errors; the app loads without missing banner/logo asset errors; if backend connectivity/initialization fails, users see a clear English message with a retry suggestion instead of a blank or non-responsive UI.
