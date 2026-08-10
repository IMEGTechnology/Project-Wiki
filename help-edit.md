# WikiBase Help — Editing and Markdown

> [!NOTE] About this page
> This page lives with the app, not inside your vault, so it never appears in the navigation tree. Written for **Version 0.32.1**.

**This page covers changing notes** — turning on editing, creating and moving files, the editor, properties, review, and how to write Markdown.

**For using the wiki**, panels, search, bookmarks and themes, see **[Help](help.md)**.

> [!TIP] You do not need this page to leave a comment
> Commenting works for everyone with no setup. See [Comments](help.md).

---

## Contents

1. [[#1. Before you start]] — read-only by default, and how to change that
2. [[#2. Creating and moving files]]
3. [[#3. Editing a note]]
4. [[#4. Properties]] — including the two that drive What's New
5. [[#5. Review]] — what happens after someone edits
6. [[#6. Writing Markdown]] — the full syntax reference
7. [[#7. What WikiBase does not render]]

---

## 1. Before you start

WikiBase is **read-only until you move up a tier**, per person and per PC. On the default **User** tier, nothing you click can change a file.

**Settings → Advanced Settings → Access → Contributor.** Open Settings from your initials badge, top right, expand Advanced Settings, and pick Contributor from the dropdown. You will be asked for the Contributor password. If nobody has set one yet, it lets you straight through and Settings tells you so.

Dropping back to User never asks for anything.

That one change turns on all of it:

- **New** and **Move** in the header
- **Edit** and **Properties** at the reader's top right
- Clickable task checkboxes in the reader

If your name is not on the `editors` list in the app's config, these stay unavailable even with the setting on. Ask whoever manages the app to add you.

> [!IMPORTANT] Two apps, one set of files
> Your vault is the same folder Obsidian opens. Edit a note here and it is edited there, and the reverse. There is no separate WikiBase copy to reconcile.

---

## 2. Creating and moving files

**New at the vault root** — the **+** in the header. Choose file or folder, type a name, Create. The `.md` is added for you.

**New inside a folder** — hover that folder's row in the sidebar and click the **+** that appears on it. Folders can only be created at the root.

**Move a file** — the **⇄** in the header. Pick the file, pick the destination. Its comments and change-log sidecars move with it automatically, so nothing is orphaned.

New files are created with the full property block already filled in, plus an H1 of the file's own name, so they behave properly in Obsidian's own Properties view:

```yaml
---
tags: []
aliases: []
status: Needs Review
reviewed: false
created: 2026-08-03
due: 
section: 
author: Your Name
edited-by: Your Name
edited-at: 2026-08-03T09:14
---
```

`due` and `section` are left blank for you to fill in; the rest are filled from your profile and today's date.

---

## 3. Editing a note

The **pencil** at the reader's top right opens the raw Markdown in a plain text editor with colour-coded syntax.

It is **not** a live-preview editor. You see Markdown while editing, and rendered output when you save. This was a deliberate choice: a live-preview editor is where most of the risk in an app like this lives, and the wiki is read far more often than it is written.

**Link autocomplete** — typing `[[` offers file names. `[[file#` or `[[#` offers that file's headings. Arrow keys to move, Enter or Tab to pick, Esc to dismiss.

**What happens when you save:**

1. WikiBase checks nobody else saved the file while you had it open. If they did, it stops and tells you rather than overwriting them.
2. The note's status is set to **Needs Review** and **reviewed** is unticked.
3. A line-by-line record of what changed is appended to that note's `.changes.md` sidecar.

That third step is what makes [[#5. Review]] possible, and it happens whether or not anyone has review tools switched on.

**Ticking a checkbox is different.** `- [ ]` items are clickable straight from the reader, and ticking one writes quietly — no change-log entry, no status flip. It is a status tick, not an edit.

---

## 4. Properties

The **sliders icon** next to the pencil opens the note's properties.

| Field | Type |
|---|---|
| Tags | Frontmatter tags and inline `#tags` combined, matching Obsidian |
| Status | Dropdown: In Progress, Draft, Needs Review, In Review, Reviewed, Master, Archived |
| Reviewed | Checkbox |
| Due | Date picker |
| Section | Text |
| Author | Click to edit |
| Aliases | Click to edit |
| Created | Read-only |
| Modified | Read-only |

Property edits **apply quietly** — no change-log entry and no status flip, since Status and Reviewed *are* the review controls. Changing them is the act of reviewing, not something to be reviewed.

Anything not listed here, edit in the file's own frontmatter, see [[#Properties, frontmatter]].

### Flagging a page in What's New

Two optional properties change how a note appears in [What's New](help.md). Neither has a field in the Properties panel yet — add them in the file's own frontmatter, or in Obsidian.

```yaml
---
must-read: true
onboarding: true
---
```

| Property | What it does |
|---|---|
| `must-read` | Puts the note in the **Required reading** group with an orange pill, and excludes it from Mark all seen — so a bulk clear can never wipe it unread. It stops being required 30 days after it first surfaced **to each person**, counted per reader rather than from the file's date, so someone on leave still gets their full window. After that it keeps its unseen dot and stays in the list until they actually open it. |
| `onboarding` | Marks the note as one a new starter should read. Never expires. Separate from `must-read` on purpose: one key cannot mean both "everyone needs to see this change" and "this is part of learning the job". |

Both default to absent, which means false. No existing file needs changing.

**Use `must-read` sparingly.** Its whole value is that it overrides someone's Mark all seen, and that only works while it stays rare.

---

## 5. Review

**Review is part of the Contributor tier**, the same tier as editing. There is no separate switch for it.

That pairing is deliberate: only an edit made in the app writes a change record, so a reviewer who cannot edit would be looking at an empty list.

Change records are always written whether or not anyone is on Contributor. The tier only decides whether you see the review interface, so a reader who never reviews anything is not shown machinery they do not need.

On Contributor you get a **Review tab** in the right panel, a **bell** with a count of open items, and a **Review Inbox** covering the whole vault.

### It is sequential, per file

The oldest unresolved change on a file is the only one you can act on. Later ones show **⏳ queued** until it is dealt with. This stops changes being resolved out of order, which would make the revert below unsafe.

| Action | What happens |
|---|---|
| **Accept** | The change stands. When every entry on a file is accepted, the note flips to Reviewed. |
| **Reject** | **The file is reverted** to its state before that edit, and any later pending changes on it are discarded. |
| **Accept all** | Accepts every open entry on that file at once. |

> [!WARNING] Reject undoes the edit
> Rejecting does not just flag a change for the author. It restores the previous version of the file. Use it when the edit should not stand at all. If you just want to raise a question about it, leave a comment instead.

### New Files

A second section of the review screen lists files WikiBase has never touched — usually notes added straight from Obsidian, which have no `status` property because only this app writes one.

Clicking one opens it alongside its Properties so you can fill them in. **Update** adds only the property keys that are actually missing and never overwrites what is already there. Nothing is written automatically.

### Changes made in Obsidian

Most edits to your vault do not happen in WikiBase. It is a reader, and people write in Obsidian. Those edits show up too, as **Vault change** items in orange.

WikiBase notices them by comparing the note against the last version somebody approved. Approving does **not** mean the change was allowed through — it already happened, and nothing WikiBase does can undo it. It means a competent person has seen it.

Clicking a Vault change row opens the note with the change marked where it actually sits, and a bar at the bottom of the reader:

| Marking | Means |
|---|---|
| **Green, NEW SECTION** | This heading was not there last time. |
| **Amber, CHANGED** | This section's text is different. |
| **Red, dashed, REMOVED** | This section is **gone**. WikiBase draws it back in so you can see what went. It is not part of the file and is never written back. |

Use **↑ prev** and **↓ next** to walk the changes, then:

| Button | What happens |
|---|---|
| **Approve file** | Records that you read it, in your own audit log. The note is not touched. |
| **Flag** | Posts an ordinary comment on the file. **No revert** — see the warning below. |
| **Version history ↗** | Reminds you where to find who changed it: right-click the file in the synced vault folder. |

> [!NOTE] Why Flag does not revert
> Reject reverts an edit made *in this app*, because the app still has the text it wrote. A change made in Obsidian is different: the file has already synced to everyone, and someone may have it open right now. Overwriting it would destroy their work. So Flag raises the problem and a person fixes it, which is the only safe answer.

### A file whose only change is a new heading

That is additive: nothing was altered and nothing was lost. Those sort into **New section** in yellow, under *Needs acknowledgement*, where **Acknowledge all** clears them in one go. Everything else needs opening.

### Where approvals are recorded

Each person writes their own file at `zSystem/audit/YYYY-MM-<your email>.md`. Rows are only ever added, never changed, so two people approving at the same moment cannot collide. The record is permanent and carries your name.

Anyone on Contributor can approve anything, including their own edits. That is a deliberate choice for a small team: the log makes a careless approval findable afterwards, which is the honest trade when there may only be two of you.

> [!TIP] The first run is quiet on purpose
> The first time someone opens WikiBase on Contributor, the whole vault is recorded as approved. Otherwise day one would open with every note in the queue, which tells you nothing.

---

## 6. Writing Markdown

Everything here is standard Obsidian Markdown. Write it in either app and it renders the same in both.

### Text

| What | Syntax | Renders as |
|---|---|---|
| Bold | `**Bold text**` | **Bold text** |
| Italic | `*Italic text*` | *Italic text* |
| Bold and italic | `***Both***` | ***Both*** |
| Strikethrough | `~~Struck~~` | ~~Struck~~ |
| Highlight | `==Highlighted==` | ==Highlighted== |
| Inline code | `` `code` `` | `code` |

### Headings

```md
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

All six levels render, fold and appear in the Outline. Their colours, underlines and capitals are set per reader under Theme → Headings, so do not use a particular level just because of how it looks on your screen — use it because of where it sits in the structure.

### Paragraphs

A blank line starts a new one.

**Every line break you type is kept.** Press Enter once and the next line starts on its own line, exactly as it looks while you are writing it in Obsidian. You do not need two trailing spaces or `Shift+Enter`, though both still work.

This is deliberate, and it is not what standard Markdown does. Most Markdown renderers merge consecutive lines into one flowing paragraph, and WikiBase did too before version 0.24.0. The change was made because pages here are written in Obsidian's editor, so the shape you see while typing is the shape you meant.

**One thing to watch.** Text pasted from an email or a PDF often arrives already wrapped at someone else's line width, and it will render with those wraps intact, giving short ragged lines. Join those lines back together after pasting and it flows normally.

### Links and embeds

| What | Syntax |
|---|---|
| Wikilink | `[[Note Name]]` |
| Aliased | `[[Note Name\|Display text]]` |
| Heading in another note | `[[Note Name#Heading]]` |
| Heading in this note | `[[#Heading]]` |
| External | `[Link text](https://example.com)` |
| Note embed | `![[Note Name]]` — a clickable stub card, not transcluded |
| Image, vault | `![[image.png]]`, or `![[image.png\|600]]` to set width |
| Image, external | `![alt](https://example.com/image.jpg)` |

Typing `[[` in the editor offers completion for all of the wiki forms, so you rarely have to type a note name in full.

### Images

Put the image in the **attachments subfolder beside the note**, not in one shared folder for the whole vault. WikiBase follows Obsidian's **"in subfolder under current folder"** setting, so `![[image.png]]` looks in that subfolder of the current note's own folder. Obsidian creates it for you when you paste an image into a note.

The filename must match exactly, including case.

### Lists

```md
- Unordered item
  - Nested item

1. Ordered item
   1. Nested item

- [ ] Incomplete task
- [x] Completed task
```

Nesting works with real tabs or 2-space indents, matching Obsidian's own rule. There is no distinction between bullet, numbered and checkbox lists.

### Tab trees under a bullet

> [!INFO] A deliberate difference from Obsidian
> This is one place WikiBase does not match Obsidian's reading view, on purpose.

One real `-` (or `1.`, or `- [ ]`) on the **first line** makes WikiBase treat everything tab-indented below it as a list, even where none of those lines have their own marker:

```md
- Project Directory/
	BidPhase
		00_Support Documents
	Construction
```

That renders as a full nested tree — fold arrows, guide lines, everything — from the one marker at the top. Useful for folder diagrams and org charts that were never meant to be a "real" list.

**The trade-off, on purpose:** inside a list this way, every line is its own row. It is never merged as wrapped continuation text of the row above, because there is no marker to say which you meant. If two sentences should read together under one row, write them as one line and let it wrap. Do not press Enter between them.

### Quotes, rules and code

```md
> Quoted text.
> — Attribution
```

`---`, `***` or `___` alone on a line draws a horizontal rule.

````md
```js
console.log("hello")
```
````

The language label after the opening backticks is optional and drives the syntax colouring.

### Footnotes

```md
This needs a citation[^1].

[^1]: The citation text.
```

### Hidden comments

`%% text %%` is visible only in the raw file. It never renders in the reader, by design. Use it for notes to yourself or to a future editor.

This is different from a WikiBase **comment**, which is a threaded note posted from the Comments tab and stored in a sidecar file. See [Comments](help.md).

### Tables

```md
| Left | Center | Right |
|:--|:--:|--:|
| a | b | c |
```

Tables are content-width and left-justified, matching Obsidian, and only wrap when they would otherwise overflow the column.

### Properties, frontmatter

```yaml
---
tags:
  - construction-admin
status: In Progress
reviewed: false
due: 2026-11-15
---
```

A YAML block at the **very top** of the file, before anything else. WikiBase reads all of it. Six fields are editable through the Properties panel — Status, Section, Reviewed, Due, Author, Aliases — and anything else you add is preserved untouched. `must-read` and `onboarding` are read here but have no panel field yet, see [[#Flagging a page in What's New]].

### Callouts

```md
> [!tip] Optional custom title
> Body text here.
```

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
| `copy` | — | 📄 |

`copy` is WikiBase's own addition and behaves differently from the rest — see below.

Add `-` after the type for collapsed-by-default, `+` for expanded-but-foldable: `> [!faq]-`.

Callouts nest — `>>` and `>>>` work to any depth:

```md
> [!warning] Outer
> Body text.
>> [!note] Inner
>> Nested body.
```

### The copy callout

`[!copy]` is WikiBase's own type, not one of Obsidian's. It renders like any other callout but adds a **Copy** button to its title row, which puts the block's text on the clipboard as plain text.

```md
> [!copy] Standard reply
> Thanks for reaching out. Your ticket number is [NUMBER]
> and someone will be in touch within one business day.
```

Use it for text people are meant to paste somewhere else: a standard reply, a mailing address, a form of words that has to be exact. It's deliberately opt-in — no other callout gets a button, so the affordance only shows up where you asked for it.

What lands on the clipboard is what you see, not the Markdown source. `**Bold**` copies as `Bold`, `[[Some Note|this note]]` copies as `this note`, and the leading `>` is never included. Bullet and number markers are kept, since a list should still look like a list when it's pasted. Tables come across tab-separated, which is what a spreadsheet or a mail client expects. Fenced code is copied exactly as written, markers and all.

**On line breaks.** Your hard line breaks are preserved. Press Enter and you get a new line in the clipboard; leave a `>` on its own for a blank line and you get a paragraph gap. A line that simply looks wrapped on screen is not a break and costs you nothing, so write a paragraph as one long line and let it wrap. Note that a rendered callout still joins consecutive lines into one paragraph, exactly as Obsidian does — only the copied text keeps your breaks.

Opening the same note in Obsidian is safe. Obsidian doesn't recognise the type, so it draws a plain note-styled callout titled "Copy" and shows the text normally. There's no button and nothing breaks, because the button only ever exists at render time. Nothing is written to the file.

### Tags

`#tag` for a flat tag, `#parent/child` for a nested one. They render as coloured chips and are display-only in WikiBase — no click-to-filter yet, though Obsidian will still index them normally.

---

## 7. What WikiBase does not render

| | Why |
|---|---|
| **Raw HTML** | Typed HTML shows as literal text. Rendering author-supplied HTML would let anything pasted into a note run as code in every reader's browser. Markdown covers nearly everything; the one real gap is underline, which Markdown has no syntax for — use `**bold**` or `==highlight==` instead. Obsidian is more permissive here, so a note using raw HTML looks different in the two apps. |
| **Unusual link schemes** | Links to anything other than a normal web, mail, file share or Obsidian address render as plain text, for the same reason. |
| **Mermaid diagrams and MathJax** | Deferred. They display as plain code blocks, not rendered output. Write them if you want them in Obsidian; just expect a code block here. |
| **Clicking a tag to filter** | Not built. Tags are display-only. |

---

## Further reading

WikiBase follows Obsidian's own Markdown syntax, so Obsidian's documentation applies directly:

- [Basic formatting syntax](https://obsidian.md/help/syntax)
- [Advanced formatting syntax](https://obsidian.md/help/advanced-syntax)
- [Callouts](https://obsidian.md/help/callouts)
- [Tags](https://obsidian.md/help/tags)
- [Properties](https://obsidian.md/help/properties)
- [Obsidian Help home](https://obsidian.md/help)

---

Back to **[Help](help.md)** for panels, search, bookmarks and themes.
