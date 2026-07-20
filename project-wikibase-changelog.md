# Project-WikiBase — Changelog

*One entry per shipped deploy zip. Newest at top. Not a substitute for the session log — this is the short version, for tracking what actually went out the door.*

*Note: v0.8c / v0.8d / v0.8e-1 below are reconstructed from partial notes — those sessions moved the app forward without a session-log entry at the time (a known documentation gap). Everything from v0.9a onward is tracked in full going forward.*

---

## v0.9a-5 — 2026-07-19

**Changed:** `index.html`

- Outline panel now folds. A chevron appears on any heading that has a nested heading below it (leaf headings get no chevron); clicking it hides/shows just its own descendant entries.
- New lock toggle in the Outline toolbar, left of Collapse all / Collapse unused / Expand all: unlocked (default) keeps the Outline's fold state independent of the reader; locked shares the reader's own per-file fold memory, so folding a heading either place folds it both places.
- Outline's Collapse all / Collapse unused / Expand all are now wired up — Collapse unused keeps the active heading and its ancestor chain expanded, same rule as the sidebar and reader fold pill.

---

## v0.9a-4 — 2026-07-19

**Changed:** `index.html`

- Added Collapse all / Collapse unused / Expand all icons to the sidebar (vault browser). Collapse unused keeps the folder path to the currently open file expanded, closes everything else.
- Added a matching fold-control pill (neutral gray, not accent-colored) to the reader panel, left of Properties — same three actions, over the open file's own heading sections. Collapse unused keeps the current heading (per Outline's active-heading tracking) and its ancestor headings expanded.
- Added a Back button: one next to the sidebar toggle in the header, one mirrored top-left of the reader panel (opposite Properties/Edit, same size). Session-only "previous note" history, multiple steps back, resets on reload.
- New/Move header icons are now fully hidden when Settings → Enable editing is off, instead of grayed out. Shown at full weight (matching every other header icon) when it's on.
- Renamed Advanced Settings → "Enable editing (New / Move / Edit)" to "Enable editing".
- The version tag (bottom-right) is now clickable — opens a Changelog view in the reader, same behavior as Help (including the Outline-refresh fix from v0.9a-3, so Outline doesn't show stale headings).
- **Outline panel fold carrots + collapse state deliberately not built this session** — carved out to a dedicated session (spec logged in `kickoff-prompt.md`, section ③b).

---

## v0.9a-3 — 2026-07-16

**Changed:** `index.html`

- Fixed nested callouts — `>>` and `>>>` now render as proper nested callouts/blockquotes (previously only one level of `>` worked).
- Sidebar and right-panel resize handles now require a double-click to collapse, not a single click.
- Fixed a bug where opening Help left the Outline panel showing the previous file's headings; clicking one could error out.
- Rebuilt the Links panel: now shows the current file's own links, categorized as MD Files / Websites / Folders / Other, above the existing (session-scoped) Backlinks list.
- Added per-heading collapse memory — folded sections now persist per file, like Obsidian.
- Tuned spacing above/below headings, especially around the H2 underline.
- **Not fixed, tracked open:** a Markdown file reportedly froze the app once. Held pending reproduction — need the actual file to diagnose properly instead of guessing at a fix.

---

## v0.9a-2 — 2026-07-16

**Changed:** `index.html`

- Added a manual PWA update-available indicator (up-arrow icon, appears when a new version has taken over the service worker; click reloads).
- Reworked the Review tab: vault-wide overview (File changes / New files) always shown at the top, per-file card list unchanged below it.

---

## v0.9a-1 — 2026-07-16

**Changed:** `index.html`

- Moved the file audit out of Settings entirely; folded into the Review changes screen as a "New Files" section.
- Fixed review-card click sometimes highlighting the wrong line in the reader (was matching short blocks, often the title, instead of the actual change).
- Fixed Minimal theme header colors — pulled the real hex values from Obsidian Minimal's own theme.css instead of placeholder colors.

---

## v0.9a — 2026-07-16

**Changed:** `index.html`

- Fixed a boot bug where nested open subfolders got stuck on "Loading…" (only top-level open folders were being preloaded).
- Added Settings → Navigation → "Open last note" (default on) — boot reopens the last file you had open instead of restoring exact folder state.
- Compressed Header colors + Background color into one settings row.
- Added a read-only file audit (flags files WikiBase has never written to, i.e. never touched/reviewed).
- Fixed Minimal theme H1/H2 color swap.

---

## v0.8e-1 — 2026-07-16 *(reconstructed, partial)*

**Changed:** `index.html`

- Minimal theme identity work, H2 underline toggle, image-size syntax (`![[img.png|width]]`), Theme settings sub-grouping.
- Full change detail not captured at the time — flagged as a documentation gap, not reconstructed further.

---

## v0.8d — 2026-07-16 *(reconstructed, partial)*

**Changed:** `index.html`

- Incremental theme/settings work between v0.8c and v0.8e-1. Detail not captured at the time.

---

## v0.8c — 2026-07-16 *(reconstructed, partial)*

**Changed:** `index.html`

- Earliest of the untracked same-day sessions. Detail not captured at the time.
