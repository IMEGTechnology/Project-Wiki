# WikiBase Help — Editing and Markdown

> [!NOTE] About this page
> This page lives with the app, not inside your vault, so it never appears in the navigation tree. Written for **Version 0.18.0**.

**This page covers changing notes** — turning on editing, creating and moving files, the editor, properties, review, and how to write Markdown.

**For using the wiki**, panels, search, bookmarks and themes, see **[Help](help.md)**.

> [!TIP] You do not need this page to leave a comment
> Commenting works for everyone with no setup. See [Comments](help.md).

---

## Contents

1. [[#1. Before you start]] — read-only by default, and how to change that
2. [[#2. Creating and moving files]]
3. [[#3. Editing a note]]
4. [[#4. Properties]]
5. [[#5. Review]] — what happens after someone edits
6. [[#6. Writing Markdown]] — the full syntax reference
7. [[#7. What WikiBase does not render]]

---

## 1. Before you start

WikiBase is **read-only until you turn editing on**, per person. With it off, nothing you click can change a file.

**Settings → Advanced Settings → Enable editing.** Open Settings from your initials badge, top right, then expand Advanced Settings.

That one switch turns on all of it:

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

---

## 5. Review

**Settings → Advanced Settings → Show review tools.** Off by default.

Change records are always written whether or not you have this on. The setting only decides whether you see the review interface, so a reader who never reviews anything is not shown machinery they do not need.

With it on you get a **Review tab** in the right panel, a **bell** with a count of open items, and a **Review Inbox** covering the whole vault.

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

A blank line starts a new one. For a break inside a paragraph, use two trailing spaces or `Shift+Enter`.

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

A YAML block at the **very top** of the file, before anything else. WikiBase reads all of it. Six fields are editable through the Properties panel — Status, Section, Reviewed, Due, Author, Aliases — and anything else you add is preserved untouched.

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

Add `-` after the type for collapsed-by-default, `+` for expanded-but-foldable: `> [!faq]-`.

Callouts nest — `>>` and `>>>` work to any depth:

```md
> [!warning] Outer
> Body text.
>> [!note] Inner
>> Nested body.
```

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
