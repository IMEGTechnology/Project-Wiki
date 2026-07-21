# WikiBase Help

> [!NOTE] About this file
> This file lives at the app level and is not part of your vault. It will never appear in the navigation tree. Press the **?** icon in the header to return here at any time.

---

## Navigation

### Sidebar (left panel)

The left panel shows your vault folder tree.

- **Toggle open/close** — click the sidebar icon at the far left of the header bar (three vertical lines).
- **Expand a folder** — click any folder row. Files load on first expand and are cached until the page reloads.
- **Folder sort order** — folders with a numeric prefix (e.g. `00_Identity`, `01_Inbox`) sort in numeric order. Folders without a prefix sort alphabetically after those.
- **File counts** — the badge next to each folder shows how many `.md` files it contains. Turn off in Settings.
- **Strip folder prefixes** — hide the `NN_` prefix from folder names in the tree. Toggle in Settings. Off by default.
- **Resize** — drag the thin line on the right edge of the sidebar to make it wider or narrower.
- **Snap to close** — drag the sidebar narrow enough (below ~80px) and release. It snaps shut. Use the header icon to reopen.
- **Auto-reset** — if you expand the right panel while the sidebar is wider than its default size, the sidebar resets to default automatically to keep the reader readable.

### What the nav ignores

The following are never shown in the tree:

- Any file ending in `.comments.md` or `.changes.md`
- Any file or folder starting with `.`
- Any folder named `zSystem` (holds comments and change-log sidecars, one per folder)
- Any folder matching your Obsidian attachments-subfolder setting (see Images below)
- The `/config/`, `/themes/`, and `/assets/` folders
- `help.md` (this file — it lives at the app level, not inside the vault)

---

## Reading files

### Opening a file

Click any file in the navigation tree. The reader panel loads and renders it as formatted content.

### Markdown rendering

WikiBase renders standard Markdown plus Obsidian extras:

| Element | Syntax |
|---|---|
| Headings | `# H1` through `###### H6` |
| Bold | `**text**` or `__text__` |
| Italic | `*text*` or `_text_` |
| Bold + italic | `***text***` |
| Strikethrough | `~~text~~` |
| Highlight | `==text==` |
| Inline code | `` `code` `` |
| Code block | ```` ``` ```` with optional language label |
| Table | Standard GFM pipes |
| Task list | `- [ ]` and `- [x]` |
| Unordered list | `-`, `*`, or `+` |
| Ordered list | `1.` |
| Blockquote | `> text` |
| Horizontal rule | `---`, `***`, or `___` |
| Image | `![[image.png]]` or `![alt](url)` |
| Internal link | `[[Note Name]]` or `[[Note\|Alias]]` |
| Note embed | `![[Note Name]]` — renders as a clickable stub card |
| Tag | `#tag` — rendered as a chip |

### Collapsible headings

Every heading is collapsible. Click the heading text to fold or unfold its section. Child headings fold with their parent.

### Internal links

`[[Note Name]]` links resolve against every file loaded so far. Links to files in folders you have not yet expanded show as muted/dashed — expand that folder and the link activates.

`[[Note#Heading]]` and `[[#Heading]]` scroll to the target heading within the same note.

### Callouts

Obsidian-style callouts are fully supported:

> [!TIP]
> Use `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!DANGER]`, and more. Custom titles work too: `> [!WARNING] Watch out`.

Supported types: `NOTE`, `INFO`, `TIP`, `HINT`, `IMPORTANT`, `SUCCESS`, `DONE`, `TODO`, `WARNING`, `CAUTION`, `ATTENTION`, `DANGER`, `ERROR`, `BUG`, `QUESTION`, `EXAMPLE`, `QUOTE`, `ABSTRACT`.

---

## Formatting reference

A complete guide to every Markdown element WikiBase supports — the syntax to write it, and how it renders. This mirrors [obsidian.md/help](https://obsidian.md/help), so anything written here works identically whether you're editing in Obsidian or reading in WikiBase.

### Text formatting

| What | Syntax | Renders as |
|---|---|---|
| Bold | `**Bold text**` | **Bold text** |
| Italic | `*Italic text*` | *Italic text* |
| Bold + italic | `***Bold and italic***` | ***Bold and italic*** |
| Strikethrough | `~~Struck text~~` | ~~Struck text~~ |
| Highlight | `==Highlighted text==` | ==Highlighted text== |
| Bold with nested italic | `**Bold and _nested italic_**` | **Bold and _nested italic_** |

### Headings

```md
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

All six levels are supported and color-coded per theme (see Themes). Click any heading to fold its section.

### Paragraphs and line breaks

A blank line starts a new paragraph. For a line break *within* a paragraph, add two trailing spaces or press `Shift+Enter`.

### Links

| What | Syntax |
|---|---|
| Wikilink | `[[Note Name]]` |
| Aliased | `[[Note Name\|Display text]]` |
| Heading anchor (another note) | `[[Note Name#Heading]]` |
| Heading anchor (same note) | `[[#Heading]]` |
| External link | `[Link text](https://example.com)` |
| Note embed | `![[Note Name]]` — clickable stub card, no transclusion |
| Image embed (vault) | `![[image.png]]` — resolved from your note's own attachments subfolder |
| Image embed (external) | `![alt](https://example.com/image.jpg)` |

Unresolved links — pointing to a note in a folder you haven't expanded yet, or one that doesn't exist — show muted and dashed. Expanding the right folder resolves them automatically.

### Images

WikiBase matches Obsidian's **"in subfolder under current folder"** attachment setting: each note's images live in a subfolder next to it (named whatever your Obsidian setting uses — "Attachments" by default here), not one shared folder for the whole vault. `![[image.png]]` looks for the image in that subfolder of the *current* note's own folder.

That subfolder name is hidden from the nav tree automatically, same as `zSystem`. If images aren't rendering, the most common cause is the subfolder name configured in `index.html` not matching what Obsidian actually created — check with whoever manages the app.

### Quotes

```md
> Quoted text goes here.
> — Attribution
```

### Lists

```md
- Unordered item
  - Nested item

1. Ordered item
   1. Nested item

- [ ] Incomplete task
- [x] Completed task
```

Nesting works with real tabs or 2-space indents, matching Obsidian's own rule — no distinction between bullet, numbered, and checkbox lists.

#### Tab trees under a bullet — EXPERIMENTAL, added 2026-07-21

One real `-` (or `1.`, or `- [ ]`) on the **first line** is enough to make WikiBase treat everything tab-indented below it as a list, even if none of those lines have their own marker:

```md
- Project Directory/
	BidPhase
		00_Support Documents
	Construction
```

This renders as a full nested tree — fold arrows, guide lines, everything — using just the one marker at the top to trigger it. Useful for folder-tree style notes (file-directory diagrams, org charts) that were never meant to be a "real" list, just indented text.

**Trade-off, on purpose:** once inside a list this way, every line is always its own row — never merged as wrapped continuation text of the row above, even if that's what you meant. There's no marker to say "this describes the line above" vs. "this is a new line," so WikiBase always picks "new line." If you want two sentences to read together under one row, write them as a single line and let it wrap — don't press Enter between them.

This is a deliberate, revertible change (was: a marker-less indented line merged into the item above's text instead of becoming its own row) — flagged here so it isn't forgotten if it needs to be undone. See `renderSingleBlock`'s `'list'` case in `index.html` for the one-line revert.

### Horizontal rule

`---`, `***`, or `___` on its own line.

### Code

Inline: `` `code` `` — Block: triple backtick, with an optional language label for syntax highlighting.

````md
```js
console.log("hello")
```
````

### Footnotes

```md
This needs a citation[^1].

[^1]: The citation text.
```

### Comments

```md
%% This is hidden in reading view %%
```

Comments are only visible when editing the raw file. They never render in WikiBase's reader — this is expected, not a bug.

### Tags

`#tag` for a flat tag, `#parent/child` for a nested one. Renders as a colored chip. Tags are inert in WikiBase v1 — no click-to-filter yet.

### Tables

```md
| Left | Center | Right |
|:--|:--:|--:|
| a | b | c |
```

### HTML

HTML typed into a note does not render. It displays as literal text, so `<u>underline</u>` shows the tags rather than underlining the word.

This is deliberate. Rendering author-supplied HTML would let anything pasted into a note run as code in every reader's browser, so WikiBase treats note content as text and nothing else. Obsidian is more permissive here, which means a note using raw HTML will look different in the two apps.

Markdown covers nearly everything you would reach for HTML to do. The one real gap is underline, which Markdown has no syntax for. Use `**bold**` or `==highlight==` instead.

Links pointing at anything other than a normal web, mail, file share, or Obsidian address are shown as plain text rather than clickable links, for the same reason.

### Properties (frontmatter)

```yaml
---
tags:
  - construction-admin
status: In Progress
reviewed: false
due: 2026-11-15
---
```

YAML block at the very top of the file. WikiBase reads and displays properties, and lets you edit several of them (Status, Section, Reviewed, Due, Author, Aliases) through the Properties panel — see that section below. Anything not listed there, edit the file directly or use Obsidian.

### Diagrams and math *(not yet supported)*

Mermaid diagrams (` ```mermaid `) and MathJax (`$...$`) are part of Obsidian's syntax but are deferred in WikiBase — they display as plain code blocks, not rendered diagrams or equations.

### Callouts — all supported types

| Type | Aliases | Icon |
|---|---|---|
| `note` | — | 📝 |
| `abstract` | `summary`, `tldr` | 📋 |
| `info` | — | ℹ️ |
| `todo` | — | ☑️ |
| `tip` | `hint`, `important` | 🔥 |
| `success` | `check`, `done` | ✅ |
| `question` | `help`, `faq` | ❓ |
| `warning` | `caution`, `attention` | ⚠️ |
| `failure` | `fail`, `missing` | ❌ |
| `danger` | `error` | ⚡ |
| `bug` | — | 🐛 |
| `example` | — | ☰ |
| `quote` | `cite` | ❝ |

```md
> [!tip] Optional custom title
> Body text here.
```

Add `-` after the type for collapsed-by-default, or `+` for expanded-but-foldable: `> [!faq]-`.

---

## Links, guides, and further reading

WikiBase follows Obsidian's own Markdown syntax exactly — anything written above works the same way if the file is opened directly in Obsidian.

For more detail than this page covers:

- [Basic formatting syntax](https://obsidian.md/help/syntax)
- [Advanced formatting syntax](https://obsidian.md/help/advanced-syntax) — tables, diagrams, math
- [Callouts](https://obsidian.md/help/callouts)
- [Tags](https://obsidian.md/help/tags)
- [Properties](https://obsidian.md/help/properties)
- [HTML content](https://obsidian.md/help/html)
- [Obsidian Help home](https://obsidian.md/help) — the full official documentation

---

## Layout and panels

### Reader width

The reader panel always maintains a minimum width based on your screen size:

| Screen width | Reader minimum |
|---|---|
| 1920px and above | 1200px |
| 1440px – 1919px | 900px |
| Below 1440px | 600px |

The panels on either side will stop expanding before they push the reader below these values.

### Right panel

The right panel appears on the right side of the reader. It has an icon nav bar at the top, fly-out content sections below, and a pinned Comments strip at the bottom.

- **Toggle** — click the right-panel icon in the header (mirrored sidebar icon, left of the Settings gear).
- **Resize** — drag the thin line on the left edge of the right panel.
- **Snap to close** — drag it narrow enough and release to snap it shut.

**Icon nav bar** — four icons, left-justified. Click an icon to open or close that section. The active icon shows a blue underline. Multiple sections can be open simultaneously.

| Icon | Section | What it shows |
|---|---|---|
| List | Outline | H1/H2/H3 headings for the current note. Click to scroll. Active heading highlights as you scroll. |
| Link | Links | Files that link to the current note via `[[wikilink]]`. Only files opened this session are scanned. |
| Graph | Graph | Vault link graph (coming in a future update). |
| Search | Search | Search results. Use `⌘K` / `Ctrl+K` to trigger. |

**Fly-out sections** — open below the nav in the order you click the icons. Drag the handle between any two open sections to adjust their heights. Click the icon again to close its section.

**Comments strip** — pinned at the bottom of the right panel. Always visible. See the Comments section below.

### Resizing both panels

Both the sidebar and right panel are independently resizable. Drag widths save automatically and restore when you reload the page. Toggling a panel closed and reopening it restores your last dragged size.

---

## Settings

Click the **gear icon** in the header to open Settings.

| Setting | Default | What it does |
|---|---|---|
| Strip folder prefixes | Off | Hides `NN_` prefix from folder names in the tree |
| Show file counts | On | Shows the file count badge on each folder |
| Theme | Dark | Sun/moon icon in the header switches Dark/Light. Header color palette is a separate dropdown here. See Themes below. |
| Show review tools | Off | Reveals the review bell, change views, and mark-reviewed controls (see Review mode below) |
| Enable editing | Off | Turns on New / Move / Edit. When off, those icons stay visible but grayed out — turning this on is what actually allows writes, not just showing the buttons |

Settings persist across reloads via your browser's local storage.

---

## Comments

The Comments strip is pinned at the bottom of the right panel. It is collapsed by default and loads when you expand it.

**Expanding** — click the Comments header bar to expand or collapse. The bell icon and unread badge are always visible even when collapsed.

**Unread badge** — the red number on the bell icon shows how many new comments exist across the vault.

**Two views — selectable when expanded:**

- **This file** — comments attached to the currently open note. Post new comments here.
- **Vault** — all comments across the vault in one list. New comments show a red dot.

**Posting a comment** — switch to the "This file" tab, select a type, write your comment, and click Post. The comment is written to the sidecar `.comments.md` file in your local vault folder — OneDrive carries it to the rest of the team. You can also click the **+** button while on either tab — it always posts to the currently open file.

**Closing a comment** — click "Mark closed" on any open comment. Closed comments appear dimmed.

**Comment types:**

| Type | Use for |
|---|---|
| 📝 Note | General observations or context |
| ❓ Question | Something that needs an answer |
| ✅ Action | A task that needs to be completed |
| 🚩 Flag | Something that needs attention |

**Comment file format** — comments are stored as HTML comment blocks in the sidecar `.comments.md` file. They are invisible when you open that file in Obsidian.

### Setting up comment notifications

SharePoint can email you when `.comments.md` files change. To set up a daily digest:

1. Go to the vault folder in SharePoint (in the browser).
2. Hover over the vault folder, click the three-dot menu, and choose **Alert me**.
3. Set **Send alerts for these changes** to **All changes**.
4. Set **When to send alerts** to **Send a daily summary**.
5. Click OK.

You will receive one email per day summarizing any new or updated comments across the vault. If you only want alerts for specific files, set the alert on the individual `.comments.md` file instead of the folder.

---

## Search

Press `⌘K` (Mac) or `Ctrl+K` (Windows) to open the search fly-out in the right panel. Searches filenames and content across the full vault. Results show a highlighted snippet and the file path.

---

## Themes

Two themes: **Dark** and **Light**. (Minimal+Things was explored and tabled for a future update.)

**Header colors** — a separate choice from Dark/Light. Five palettes: Colorblind-safe, Mono blue, Amber, Jewel tones, Gray + accent. Default is **Jewel tones**. Lives in the Settings dropdown as its own control.

**Theme toggle** — a sun/moon icon sits directly in the header next to the gear. Settings only holds the header color palette dropdown.

**Nav folder colors** — folders and subfolders cycle through a small color set based on their position in the tree, with matching icons on every folder and file.

**Callouts** — all 13 Obsidian callout types render in theme-matched colors, grouped the same way Obsidian groups them (note/info/todo share blue, failure/danger/bug share red, and so on).

**Theme file packaging** — theme CSS lives in separate files in `/themes/`, auto-detected on load. A new custom theme can be added later by dropping a CSS file in, no app changes needed.

Your theme and header-palette choice save to your browser's `localStorage`, alongside your other settings (folder-prefix, file-count badges, panel widths). Each staff member works from one assigned PC, so this is enough — no cross-device sync is needed. Clearing browser data or a PC reimage resets you to defaults.

---

## Editor mode

Read-only until you turn it on. Go to **Settings → Enable editing** (off by default). Once on, the New, Move, and Edit icons in the header become clickable instead of grayed out. Staff who haven't turned this on can still leave comments — commenting never requires Editor mode.

- **New** (header, next to the sidebar toggle) — create a new file or folder, at the vault root or inside whichever folder you have selected.
- **Move** — relocate an existing file to a different folder. Its comments and change-log sidecar move with it automatically.
- **Edit** (floats top-right of the reader, only when a file is open) — opens the raw Markdown in a plain-text editor. Saving appends an entry to that note's change log and flags it "Needs Review" for whoever reviews changes.

If your name isn't on the `editors` list in `index.html`'s `CONFIG`, these stay grayed out even with the setting on — ask whoever manages the app to add you.

## Properties panel

A header icon on each open note (next to Edit) opens a flyout showing its properties: Tags, Status, Reviewed, Due, Created, Modified, Author, Section, Aliases. Status, Section, and Reviewed are dropdowns/checkbox; Due is a date picker; Author and Aliases are click-to-edit text; Created and Modified stay read-only. Tags in the flyout combine frontmatter tags and inline `#tags`, matching Obsidian. Same Enable-editing gating as above.

---

## Installing WikiBase

WikiBase is a web app hosted on GitHub Pages — there's a link, not a file to copy around. Installing it as an app (rather than just bookmarking the page) matters: it's what lets your browser remember your vault folder permanently instead of asking every time.

**One-time setup:**

1. Open the WikiBase link in **Chrome or Edge**.
2. Install it: address bar → the install icon (a small monitor with an arrow), or **⋯ menu → Apps → Install this site as an app**.
3. Click **Open vault folder…** and pick your local OneDrive-synced copy of the vault.
4. When Chrome asks **Allow this time / Allow on every visit / Don't allow**, choose **Allow on every visit**. This is the step that stops the app from asking again every launch.

**Daily use:** open it from wherever you installed it (Start menu, taskbar, desktop). It should load straight to your vault with no prompt.

**If you see a "Reconnect to vault" button** instead of loading straight in, click it and choose **Allow on every visit** again. This happens if the browser's permission got reset (a Chrome/Edge update or clearing site data can do this) — it's not something wrong with your vault or your notes.

**Teams tab:** your team lead can add WikiBase to a channel via **+ Add a tab → Website**, pasting the same link. It renders the same app inside Teams.

---

## Troubleshooting

**A "Reconnect to vault" button shows up instead of loading directly**
Your browser's permission to the vault folder was reset. Click the button, choose **Allow on every visit** when prompted, and it should stop happening on future launches. See "Installing WikiBase" above.

**Vault shows "Could not load vault"**
The app couldn't open the vault folder it remembers. The folder may have been moved, renamed, or unsynced from OneDrive. Click **Open a different folder…** and re-pick it.

**A link shows as muted/dashed**
The target note is in a folder you have not expanded yet. Open that folder in the sidebar and the link will resolve.

**My panel width did not restore**
Panel widths save to browser local storage. If you cleared your browser data or opened in a private window, widths will reset to defaults.

**Images are not loading**
Images must be in the attachments subfolder next to the note that references them (see Images above), and the file name must match exactly (case-sensitive). If every image across the whole vault is broken, the subfolder name in `index.html` likely doesn't match your actual Obsidian setting — flag it to whoever manages the app.

**New/Move/Edit icons are grayed out and won't click**
Turn on **Settings → Enable editing**. If they're still grayed out after that, your name isn't on the app's editors list — ask whoever manages WikiBase to add you.
