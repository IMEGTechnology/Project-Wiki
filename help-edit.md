# Editing in Obsidian

> [!NOTE] About this guide
> This guide is for Contributors and Administrators. Pages are written in Obsidian, and Folio is where people read them. This guide covers setting Obsidian up, writing a page so it looks right in Folio, and what Folio does and does not show. Reading and commenting are in [Using Folio](help.md). Reviewing is in [Contributing](help-contrib.md). Written for **Version 0.86.0**.

Folio and Obsidian read the same folder of files. Change a page in one and it is changed in the other, with nothing to copy across. **New here? Do the first two topics.** The rest is a reference you can come back to. For every rule here written out as a finished page, open **Admin**, then **Templates**, then the **Sample** tab.

## Open the vault and add the Folio look
%% card: Set Obsidian up once so pages look the same as in Folio | icon: palette | updated: 0.83 | key: get-started %%

Set Obsidian up once. After that, what you see while you write is what readers see.

1. In Obsidian, choose **Open folder as vault** and pick your OneDrive copy of the vault. It is the same folder Folio reads.
2. Open **Settings**, then **Appearance**, then **Themes**, and choose **Folio**. If it is not in the list, ask your Administrator for the Folio theme.
3. Under **Editor**, turn **Readable line length** on. Under **Appearance**, set **Font size** to 16.
4. To see the Guided look, install the free **Style Settings** plugin and switch it on for Folio.

> [!tip]
> Obsidian's own Reading view and Folio now match closely. Headings, tables and pictures all sit the way they will in Folio.

> [!note]+ More detail
> **Two looks.** The theme has the same two looks as Folio: Default, and Guided with coloured markers beside the smaller headings. Without Style Settings it shows Default.
>
> **The vault name.** New page opens Obsidian by the vault's name, so keep the same vault name on every computer. If it does not open, see Something is wrong in [Contributing](help-contrib.md).
>
> **Not everything matches.** A few things look different in Obsidian, and each topic below says so where it matters.

## Write a new page from its template
%% card: Start with New page, then follow the grey notes | icon: file | updated: 0.86 | key: write-page %%

Every page starts as a template. Folio sets up the file, and you fill it in.

1. In Folio, click **New page** and make the page. See [Contributing](help-contrib.md). It opens in Obsidian.
2. Under each heading, read the grey note. It says what goes there. Write it, then delete the note.
3. Replace every piece of starter text in [square brackets].
4. Keep the Core headings. Keep an Optional heading only if you have something for it. In a One of group, keep at least one.
5. Keep **References** as the last section.

> [!tip]
> Guide boxes, the callouts that start with the word guide, tell you how to write each part. Folio hides them from readers, so deleting them is tidy, not required.

> [!note]+ More detail
> **The badges.** In the New page window and in Admin, Templates, each heading is marked Core, Repeat, One of, or Optional. Repeat means you can add more of that heading.
>
> **A summary.** Write one sentence, under 160 characters, in the page's summary property. Folio shows it under the title.
>
> **Saving.** Obsidian saves as you type. The page stays a draft, and marked To be reviewed, until a Contributor approves it.
>
> **Before you send it for review.** Summary filled in. Every [square bracket] replaced. Every section the template needs is there. Every full width picture has a caption. Each link works when you click it in Folio. Grey notes deleted.
>
> **Using an AI.** Admin, then Templates, then **AI prompts** copies a ready-made request with the template and the Format rules. **Write a page** turns your notes into a first draft. **Check a page** lists what breaks the rules without rewriting anything. Check every fact an AI writes. See [Contributing](help-contrib.md).

## Name, move and file a page
%% card: Three digits, a hyphen, then the title, and filing a draft | icon: folder | updated: 0.86 | key: file-names %%

Every page name is a three digit number, a hyphen, then the title. For example `021-Intrusion Detection.md`.

1. Use exactly three digits. Not two, not four.
2. Follow the number with a hyphen, then the title.
3. Leave out these characters: `\ / : * ? " < > | # ^ [ ]`. They break file names or links.
4. Rename and move pages in Obsidian, never in Folio.
5. To file an approved draft, drag it in Obsidian from Working Drafts into the folder its **file-in** property names.

> [!tip]
> The number only has to be unique inside its top folder. 10_Processes and 20_Guides can both have a 021.

> [!note]+ More detail
> **Why Obsidian.** When you rename or move a page in Obsidian, every link to it follows. Folio never renames or moves a page itself.
>
> **What follows the page.** Its saved pages, comments, review history and usage follow a renamed or moved page the next time Folio looks at the vault. A page that was only renamed or moved keeps its sign-off.
>
> **Do not do both at once.** If a page's name, number and text all change before Folio has looked, it cannot tell which page is which, and its comments show under Comments with no page. Rename a page, or edit it, but not both in one go.
>
> **Numbers.** New page picks the next free number for you, and writes it in the page's number property too. A page moved into a different top folder may need a new number there. Vault check lists any number used twice.
>
> **The title.** The words after the number are the page title Folio shows. Keep it under about 60 characters, and the same as the heading at the top of the page. The format check flags a title that does not match the file name.

## Fill in a page's properties
%% card: The block at the top of a page that says who, when and what | icon: sliders | updated: 0.86 | key: properties %%

Properties are a block at the very top of the file, between two lines of three dashes. Folio reads them. Obsidian shows them as a neat panel.

1. Keep the block at the very top, before anything else in the file.
2. Leave the ones Folio filled in alone: **type**, **number** and **file-in**.
3. Put your name in **author**.
4. Write a one sentence **summary**, under 160 characters. Folio shows it under the title.
5. Keep **tags**, **aliases** and **due** even when they are empty. Leave the value blank if it does not apply.

This is a finished block, in the house order:

```yaml
---
type: guide
summary: What a new person does in their first five days, and who helps.
status: Reviewed
reviewed: 2026-09-24
created: 2026-08-03
author: Priya Shah
number: 001
tags: [onboarding, company]
aliases: []
due:
---
```

> [!tip]
> Anything extra you add is kept exactly as you wrote it. Folio only changes what it has to.

> [!note]+ More detail
> **What each one is for.** **type** is the template the page was made from. **status** and **reviewed** say whether it has been signed off, and when. **created** is the day it was made. **tags** group pages, for example `[onboarding, company]`. **aliases** are other names people might search for, for example `[ACP, panel]`. **due** is a date the page should be looked at again.
>
> **Status.** It has two values, To Be Reviewed and Reviewed. Do not set Reviewed by hand. Approving a page in Review does that, and writes today's date in **reviewed**.
>
> **Due.** Review lists a page whose due date has passed, so it gets looked at again.
>
> **Missing properties.** A page missing any of status, reviewed, created, author, tags, aliases or due is listed in Vault check, under Format health, where an Administrator can add the missing lines in one go. Missing properties never put a page on the Review list.
>
> **Order.** Folio does not mind the order, but the format check notes a block out of the house order above.
>
> **Must reads and onboarding** are set in Admin, then Users, not with properties. The old must-read and onboarding properties do nothing now.

## Write the basics
%% card: Headings, bold, lists and paragraphs, the house way | icon: pencil | updated: 0.86 | key: markdown %%

Folio reads standard Obsidian Markdown. Write it the way you would explain something to a new colleague: short paragraphs, plain words, one idea at a time.

1. Use `##` for sections and `###` for parts inside a section. Most pages need nothing deeper. Keep headings to six words or fewer.
2. **Bold** one key term per paragraph at most, with `**bold**`. Keep italics for picture captions.
3. A list item starts with `-`, or `1.` when order matters. Press Tab to nest it, two levels at most. A tick box, `- [ ]`, is for things to check.
4. Keep paragraphs to about 120 words, with a blank line between them.
5. Press Enter once for a new line. Folio keeps every line break you type.

```md
## Mounting heights
Card readers mount on the **latch side** of the door, 1.0 m above the finished floor.

1. Confirm the backing is in place.
2. Mount the reader.
	1. Level it.
```

> [!tip]
> Text pasted from an email or a PDF arrives already wrapped at someone else's width. Join those lines back into paragraphs after pasting.

> [!note]+ More detail
> **Headings.** No numbers, bold or links in a heading, and no full stop. A link to a heading breaks if the heading is renamed, so rename with care. The template decides whether a fourth level is allowed.
>
> **Line breaks.** Standard Markdown joins neighbouring lines into one paragraph. Folio does not, because the shape you see while you type is the shape you meant. A blank line starts a new paragraph.
>
> **Left out on purpose.** Highlight, underline, strikethrough and emoji all show in Folio, but the format check flags them. Use a callout, or bold for one term. See Leave out what Folio does not use.
>
> **Exact text.** A word between backticks shows in a fixed-width font. For a command or a setting, use a code block: three backticks, the language name such as `powershell` or `text`, the lines, then three backticks. Folio adds a Copy button.
>
> **Hidden notes.** Text between two `%%` marks shows in the file but never in Folio. Use it for notes to yourself or a future editor. It is not a comment. Comments are made in Folio.
>
> **Tab trees.** One real `-` on the first line makes Folio treat everything tab-indented below it as a list, even with no marker of its own. It is handy for folder diagrams. Every line is its own row, so do not press Enter in the middle of a sentence.

## Link to other pages
%% card: Links that keep working when a page is renamed | icon: link | updated: 0.86 | key: wikilinks %%

A link written the Obsidian way follows the page when it is renamed. Type two square brackets and Obsidian suggests pages as you type.

1. For a page, type `[[` and start the page name.
2. To show your own words, add a bar: `[[Page name|your words]]`.
3. To link to one section, add a hash and the heading: `[[Page name#Heading]]`. For a heading on the same page, `[[#Heading]]`.
4. For a website, put words in square brackets and the address in round ones: `[words](https://example.com)`.

```md
[[Door Hardware Schedule]]                     a page in the vault
[[Door Hardware Schedule|the hardware sets]]   the same page, with your own words
[[Card Readers#Mounting heights]]              a section of a page
[on their site](https://example.com)           a web page, with words
```

> [!tip]
> Link the first time you mention another page, not every time, and use words that say where the link goes. Never "click here".

> [!note]+ More detail
> **In Folio.** A link opens the page, or jumps to the section. **More**, then **Links**, in the page bar shows every page that links to the one you are on, so you can check what points at it before you change it.
>
> **A link Folio cannot follow** shows faded with a dashed line. Often that is only a folder not opened yet in Vault Files. If it stays faded, the link is broken. Vault check lists every broken link, so an Administrator can find them.
>
> **Bare addresses.** An address typed on its own, with no words, is flagged by the format check. Give it words.
>
> **Folders and drives.** A web page cannot open Explorer, so clicking a link to a network folder copies its path instead, ready to paste into Explorer's address bar.
>
> **Odd links.** A link to anything other than a normal web, mail, file share or Obsidian address shows as plain text.
>
> **Embedding a page.** An exclamation mark before a page link shows that page as a clickable card in Folio, not a copy of it. The format check flags it. Use a plain link.

## Place pictures
%% card: Beside the text, below it, or two side by side | icon: image | updated: 0.86 | key: pictures %%

Drag a picture into Obsidian, or paste it. Obsidian saves the file in the attachments folder beside the page and writes the line for you. Then add what you want after the file name. There are three layouts, and Folio places each one the same way the Folio theme does in Obsidian.

![[ob-pic-beside.png|inlR|320]]
**Beside the text, for photos.** Put the picture first, then the paragraph on the very next line. `![[photo.png|inlR|240]]` puts it on the right with the text wrapping on the left. `inlL` puts it on the left. Pick one of three widths: 180 small, 240 medium, 320 large. Give a wrapped picture no caption, and say what it shows in the text beside it.

![[ob-pic-below.png|inlR|320]]
**Below the text, for drawings and plans.** `![[plan.png]]` on its own line shows it full width. `![[plan.png|600]]` sets a width in pixels. An italic line straight under it is its caption, starting with Figure and a number.

![[ob-pic-pair.png|inlR|320]]
**Side by side, for before and after.** Put two pictures on one line, at the same width, such as `![[before.png|320]] ![[after.png|320]]`. One italic caption underneath covers both.

```md
![[plan.png]]
*Figure 1. Level 1 data halls, reader doors marked in red.*

![[photo.png|inlR|240]]
The reader sits on the latch side of the door.

![[before.png|320]] ![[after.png|320]]
*Figure 2. The same cabinet before and after the cabling was dressed.*
```

> [!tip]
> The next heading always starts below a wrapped picture, so the layout never runs on.

> [!note]+ More detail
> **Captions.** The format check notes a full width picture with no caption line under it. A picture beside the text is never asked for one.
>
> **Where the file goes.** In the attachments folder beside the page, not in one folder for the whole vault. Obsidian does this for you when you paste. Folio follows the Obsidian setting called "in subfolder under current folder".
>
> **The name has to match exactly,** capital letters included. Name the file for what it shows, such as `reader-latch-side.png`, not `IMG_4471.png`.
>
> **Size.** A picture beside the text never takes more than about half the column, so the text stays readable. Above 320 it is better below the text.
>
> **What readers can do.** Every picture can be clicked to see it large, with its caption.
>
> **Do not use a picture of text or of a table.** Type it, so search can find it.
>
> **Pictures from the web.** Write `![words](https://example.com/picture.jpg)`.
>
> **While editing.** If the cursor behaves oddly around a wrapped picture in Obsidian, the Folio theme has a Style Settings switch to keep it on its own line while you edit. Reading view always wraps.

## Draw table column widths
%% card: The line of dashes under the header sets how wide each column is | icon: table | updated: 0.86 | key: tables %%

In a table, the line of dashes under the header does two jobs. It sets the alignment, and it sets how wide each column is. You never need to line the bars up by hand: in Obsidian, right-click an empty line and choose **Insert**, then **Table**. Tab moves to the next cell and Enter adds a row.

1. Keep a header row, with the line of dashes straight under it.
2. Three dashes or fewer, `---`, make a column as wide as its words. A table of only those is compact.
3. Four or more dashes, `--------`, give a column the spare room. Draw only the column that needs it, usually Notes.
4. For a schedule that needs the whole width, put `%%wide%%` on its own line straight above the table.

![[ob-table-plain.png|514]]
*Three dashes in every column: the table is only as wide as its words.*

![[ob-table-dash.png|514]]
*Four or more dashes under Notes: that column takes the spare room.*

```md
| Tag | Device      | Notes                         |
| :-- | :--         | :---------                    |
| CR  | Card reader | Latch side, centre at 1.0 m   |
```

![[ob-table-wide.png|760]]
*With the wide line above it, the table runs margin to margin.*

> [!tip]
> Obsidian ignores dash counts, so a drawn table looks the same as a plain one while you edit. Folio is where the widths show.

> [!note]+ More detail
> **Sharing the room.** Two drawn columns share the spare room by their dash counts. 10 and 30 dashes split it a quarter and three quarters. The plain columns beside them stay tight, about 22 characters wide, and wrap after that.
>
> **Alignment.** A colon on the left of the dashes, `:--`, aligns left. On both sides, `:-:`, it centres. On the right, `--:`, it aligns right, which suits numbers.
>
> **Wide with plain columns.** `%%wide%%` above a table with no drawn column lets it use the whole reading width, shared by what is in each column. Obsidian hides that line, so only Folio uses it.
>
> **Too much to fit.** Text in a table always wraps. A table that still cannot fit grows into the margins, and one wider than the reading area scrolls sideways, with **Open full table** above it. The header row stays in view while a reader scrolls a long table.
>
> **Inside a callout or a list,** a table stays the width of the box it sits in.
>
> **Rows of periods.** A row where every cell is only periods, five or more, is hidden in Folio. Some Obsidian table tools add these to widen a column. It still sets widths, but drawn dashes are the better way.
>
> **House rules.** At most six columns unless the table is marked wide. Units go in the header, such as Height (m), or beside every value. No pictures, lists or line breaks inside a cell.

## Add callouts
%% card: Seven kinds of box, each with one meaning | icon: sparkle | updated: 0.86 | key: callouts %%

A callout is a coloured box that makes one thing stand out. Write `> [!tip]` on the first line and the text on the lines under it, each starting with `>`. The house uses seven kinds, and each one means one thing, so readers learn the colours once.

![[ob-callouts.png|inlR|320]]
Add a short title after the kind, such as `> [!warning] Mind the step`, or leave it blank to use the kind's name. Add a minus, `> [!question]-`, and the callout starts folded. A plus, `[!note]+`, starts open but can be folded.

| Kind | Type this | Use it for |
| :-- | :-- | :------- |
| Summary | `> [!abstract]` | The short version: objectives, key facts |
| Note | `> [!note]` | Background or an exception |
| Tip | `> [!tip]` | A faster or better way |
| Warning | `> [!warning]` | A common mistake and how to avoid it |
| Danger | `> [!danger]` | A safety or security risk only |
| Copy | `> [!copy]` | Text people paste elsewhere. Folio adds a Copy button |
| Question | `> [!question]-` | Answers, folded so readers try first |

> [!tip]
> One callout per point. Two warnings in a row is fine. Five means the section needs rewriting.

> [!note]+ More detail
> **Other kinds.** Obsidian has more, such as bug and example. Folio shows them, but the format check flags any kind outside the seven.
>
> **No callout inside a callout.** Folio can show one, but the format check flags it.
>
> **The copy callout.** `> [!copy] Standard reply` adds a **Copy** button that puts the text on the clipboard, formatted, ready to paste into email or Word. Mark what changes in [square brackets]. In Obsidian it shows as a plain callout titled Copy, with no button.
>
> **What gets copied.** What you see, never the Markdown marks. Bold copies as bold, and a link copies as its words.
>
> **Guide boxes.** A callout of type guide is writer help from a template. Folio never shows one, in any page.

## Keep a page inside the format rules
%% card: The limits the format check holds every page to | icon: check | updated: 0.86 | key: format-rules %%

Folio checks every page's shape against a set of Format rules. It never judges what a page says. An Administrator sees the results in Vault check, and a page that breaks a rule can still be approved. These are the starting rules. Your Administrator can change the numbers, so open **Admin**, then **Templates**, then **Format rules** to see your vault's.

| Rule | Starting value |
| :-- | :------- |
| Deepest heading | `###`, or `####` in a Reference page |
| Words per heading | 6 |
| Words per paragraph, section, page | 120, 400, 2,500 (5,000 for Reference) |
| Summary | Filled in, 160 characters at most |
| Title | Matches the file name, 60 characters at most |
| Levels in a list | 2 |
| Table columns | 6, unless marked wide |
| Callout kinds | The seven in Add callouts, none inside another |
| Code blocks | Name their language |
| Left over | No [square brackets], guide boxes, or grey notes on a reviewed page |

1. Before you send a page for review, copy the **Check a page** prompt from **Admin**, then **Templates**, then **AI prompts**, and give it your page. It lists what breaks the rules, section by section, and rewrites nothing.
2. Fix what it lists in Obsidian.

> [!tip]
> A word count rule is a nudge, not a wall. A long section that stays on one subject is fine. A long one that wanders is two sections.

> [!note]+ More detail
> **Levels.** Each rule is a warning or just information. Information rows are lighter, and none of them stop anything.
>
> **The template's own sections.** The check also looks for the template's Core sections, a One of group with nothing in it, sections out of the template's order, and headings the template does not know.
>
> **Code blocks are skipped.** Anything inside a code block is never checked, so a page can show examples of what not to do.
>
> **Pages with no type** are checked against these rules only, one level lighter.

## Leave out what Folio does not use
%% card: Things the house leaves out, and things Folio shows as typed | icon: alert | updated: 0.86 | key: not-shown %%

Obsidian can do more than Folio uses. Some of these show differently in Folio. Others show, but the house leaves them out so pages read the same way everywhere.

| Leave out | Why | Use instead |
| :-- | :------- | :------ |
| Highlight, underline, strikethrough | Colour noise, and weak for colour-blind readers | A callout, or bold for one term |
| Footnotes | Folio shows them as typed, and readers lose their place | References at the end |
| Embedding a whole page | It shows as a card, and the format check flags it | A link to the page |
| Tags typed in the text | Tags live in properties | The tags property |
| Horizontal lines | Folio already separates sections | A new section |
| Diagrams or maths written as code | Folio shows the code, not the drawing | A picture of the diagram |
| Raw HTML | Folio shows it as typed | Plain Markdown |

> [!tip]
> If something looks different in Folio, it is almost always one of these. Write it in Obsidian if you like, and expect it to look different here.

> [!note]+ More detail
> **Why raw HTML.** Showing it would let anything pasted into a page run in every reader's browser. Markdown covers nearly everything.
>
> **Tab trees under a bullet** read as a nested list in Folio, which Obsidian's own Reading view does not.
>
> **Further reading.** Folio uses Obsidian's own syntax, so Obsidian's help applies. Search for Obsidian basic formatting syntax, advanced formatting syntax and callouts.

## Something is wrong
%% card: Fixes by what you see | icon: alert | updated: 0.86 | key: trouble %%

Find what you see below and open it. Each one says why it happens, then what to do.

### A picture shows as text in Folio
Cause: the file name does not match exactly, or the picture is not in the attachments folder beside the page.

Fix: check the spelling and capital letters, and move the picture into the attachments folder next to the page.

### A table looks too narrow in Folio
Cause: the line of dashes under the header has three or fewer dashes in every column.

Fix: draw four or more dashes under the column that needs the room, usually Notes.

### A table runs into the margins or scrolls sideways
Cause: it has more columns, or longer words, than the reading column can hold even with the text wrapped.

Fix: cut a column, or split the table in two. If the page really needs it wide, put `%%wide%%` above it.

### A footnote shows as a number in square brackets
Cause: Folio does not draw footnotes.

Fix: move the note into the text, or into References at the end of the page.

### My page looks different in Folio
Cause: one of the things in Leave out what Folio does not use, such as raw HTML or a diagram.

Fix: use Markdown for it instead, or accept that it looks different in Folio.

### The grey notes or guide boxes show in Obsidian
Cause: only Folio hides them. Obsidian shows them, folded or grey, because they are part of the file.

Fix: delete them as you write, or let a Contributor remove them when approving the page.

### A link goes nowhere
Cause: the page was renamed without Obsidian following the link, or the name is spelled differently.

Fix: retype the link with `[[` so Obsidian suggests the right page. An Administrator can list every broken link in Vault check.

### The theme is not in Obsidian's list
Cause: the Folio theme has not been added to this vault yet.

Fix: ask your Administrator for the Folio theme.
