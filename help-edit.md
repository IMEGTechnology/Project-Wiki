# Editing in Obsidian

> [!NOTE] About this guide
> This guide is for Contributors and Administrators. Pages are written in Obsidian, and Folio is where people read them. This guide covers setting Obsidian up, writing a page so it looks right in Folio, and what Folio does and does not show. Reading and commenting are in [Using Folio](help.md). Reviewing is in [Contributing](help-contrib.md). Written for **Version 0.83.0**.

Folio and Obsidian read the same folder of files. Change a page in one and it is changed in the other, with nothing to copy across. **New here? Do the first two topics.** The rest is a reference you can come back to.

## Open the vault and add the Folio look
%% card: Set Obsidian up once so pages look the same as in Folio | icon: palette | updated: 0.83 | key: get-started %%

Set Obsidian up once. After that, what you see while you write is what readers see.

1. In Obsidian, choose **Open folder as vault** and pick your OneDrive copy of the vault. It is the same folder Folio reads.
2. Open **Settings**, then **Appearance**, then **Themes**, and choose **Folio**. If it is not in the list, ask your Administrator for the Folio theme.
3. Under **Editor**, turn **Readable line length** on. Under **Appearance**, set **Font size** to 16.
4. To see the Guided look, install the free **Style Settings** plugin and switch it on for Folio.

> [!tip]
> Obsidian's own Reading view and Folio now match closely. Headings, tables and pictures all sit the way they will in Folio.

> [!note]- More detail
> **Two looks.** The theme has the same two looks as Folio: Default, and Guided with coloured markers beside the smaller headings. Without Style Settings it shows Default.
>
> **The vault name.** New page opens Obsidian by the vault's name. If it does not open, see Something is wrong in [Contributing](help-contrib.md).
>
> **Not everything matches.** A few things look different in Obsidian, and each topic below says so where it matters.

## Write a new page from its template
%% card: Start with New page, then follow the grey notes | icon: file | updated: 0.83 | key: write-page %%

Every page starts as a template. Folio sets up the file, and you fill it in.

1. In Folio, click **New page** and make the page. See [Contributing](help-contrib.md). It opens in Obsidian.
2. Under each heading, read the grey note. It says what goes there. Write it, then delete the note.
3. Replace every piece of starter text in [square brackets].
4. Keep the Core headings. Keep an Optional heading only if you have something for it. In a One of group, keep at least one.
5. Keep **References** as the last section.

> [!tip]
> Guide boxes, the callouts that start with the word guide, tell you how to write each part. Folio hides them from readers, so deleting them is tidy, not required.

> [!note]- More detail
> **The badges.** In the New page window and in Admin, Templates, each heading is marked Core, Repeat, One of, or Optional. Repeat means you can add more of that heading.
>
> **A summary.** Write one sentence, under 160 characters, in the page's summary property. Folio shows it under the title.
>
> **Saving.** Obsidian saves as you type. The page stays a draft, and marked To be reviewed, until a Contributor approves it.
>
> **Using an AI.** Admin, then Templates, then **AI prompts** copies a ready-made request with the template and the rules. See [Contributing](help-contrib.md).

## Name and move a file
%% card: Three digits, a hyphen, then the title | icon: folder | updated: 0.83 | key: file-names %%

Every page name is a three digit number, a hyphen, then the title. For example `021-Intrusion Detection.md`.

1. Use exactly three digits. Not two, not four.
2. Follow the number with a hyphen, then the title.
3. Leave out these characters: `\ / : * ? " < > | # ^ [ ]`. They break file names or links.
4. Rename and move pages in Obsidian, never in Folio.

> [!tip]
> The number only has to be unique inside its top folder. 10_Processes and 20_Guides can both have a 021.

> [!note]- More detail
> **Why Obsidian.** When you rename or move a page in Obsidian, every link to it follows. Folio never renames a page itself.
>
> **What follows the page.** Its saved pages, comments, review history and usage follow a renamed or moved page the next time Folio looks at the vault. A page that was only renamed keeps its sign-off.
>
> **Do not do both at once.** If a page's name, number and text all change before Folio has looked, it cannot tell which page is which, and its comments show under Comments with no page. Rename a page, or edit it, but not both in one go.
>
> **Numbers.** New page picks the next free number for you. The number is also kept in the page's number property.

## Fill in a page's properties
%% card: The block at the top of a page that says who, when and what | icon: sliders | updated: 0.83 | key: properties %%

Properties are a block at the very top of the file, between two lines of three dashes. Folio reads them. Obsidian shows them as a neat panel.

1. Keep the block at the very top, before anything else in the file.
2. Leave the ones Folio filled in alone: **type**, **number** and **file-in**.
3. Put your name in **author**.
4. Add a **due** date only if the page should be read again by then.
5. Write a one sentence **summary**. Folio shows it under the title.

> [!tip]
> Anything extra you add is kept exactly as you wrote it. Folio only changes what it has to.

> [!note]- More detail
> **What Folio reads.** **status**, **reviewed**, **created**, **author**, **due**, **tags**, **aliases** and **summary**, and the three that New page adds.
>
> **Status.** It has two values, To Be Reviewed and Reviewed. Do not set Reviewed by hand. Approving a page in Review does that, and writes today's date in **reviewed**.
>
> **Due.** It means this page needs looking at again. Review lists a page whose due date has passed.
>
> **Missing properties.** On a page that has been approved, an Administrator finds and fixes them in Vault check. They do not come back to Review.
>
> **Must reads and onboarding** are set in Admin, then Users, not with properties. The old must-read and onboarding properties do nothing now.

## Write the basics
%% card: Bold, headings, lists, quotes and the rest of the syntax | icon: sliders | updated: 0.83 | key: markdown %%

Folio reads standard Obsidian Markdown, so write it in Obsidian the way you normally would.

1. **Bold** is `**bold**`, *italic* is `*italic*`, and ==highlight== is `==highlight==`.
2. Headings start with `#`, `##`, `###` and so on. Use them for where a part sits in the page, not for how big they look.
3. A list item starts with `-` or `1.`. Indent to nest. A task starts with `- [ ]`.
4. A quote starts with `>`. Three dashes alone on a line draw a line across the page.
5. Press Enter once for a new line. Folio keeps every line break you type.

> [!tip]
> Text pasted from an email or a PDF arrives already wrapped at someone else's width. Join those lines back into paragraphs after pasting.

> [!note]- More detail
> **Line breaks.** Standard Markdown joins neighbouring lines into one paragraph. Folio does not, because the shape you see while you type is the shape you meant. A blank line starts a new paragraph.
>
> **Strikethrough** is `~~struck~~`, and inline code is a word between backticks. A footnote is `[^1]` in the text, with `[^1]: The note.` further down.
>
> **Hidden notes.** Text between two `%%` marks shows in the file but never in Folio. Use it for notes to yourself or a future editor. It is not a comment. Comments are made in Folio.
>
> **Tab trees.** One real `-` on the first line makes Folio treat everything tab-indented below it as a list, even with no marker of its own. It is handy for folder diagrams. Every line is its own row, so do not press Enter in the middle of a sentence.
>
> **Tags.** Write `#tag`, or `#parent/child`. They show as small coloured chips. They are display only in Folio, with no click to filter.

## Link to other pages
%% card: Links that keep working when a page is renamed | icon: link | updated: 0.83 | key: wikilinks %%

A link written the Obsidian way follows the page when it is renamed.

1. Type `[[` and start the page name. Obsidian suggests pages as you type.
2. To show different words, write `[[Page name|your words]]`.
3. To link to a heading, write `[[Page name#Heading]]`. For a heading on the same page, `[[#Heading]]`.
4. For a website, write `[words](https://example.com)`.

> [!tip]
> Write `![[Page name]]` to show a page as a clickable card. It does not copy the page in.

> [!note]- More detail
> **Folders and drives.** A web page cannot open Explorer, so clicking a link to a network folder copies its path instead, ready to paste into Explorer's address bar.
>
> **Odd links.** A link to anything other than a normal web, mail, file share or Obsidian address shows as plain text.
>
> **Broken links.** Vault check lists every link that points nowhere, so an Administrator can find them.

## Place pictures
%% card: Beside the text, below it, or two side by side | icon: image | updated: 0.83 | key: pictures %%

Write pictures the normal Obsidian way and Folio places them the same way. The Folio theme shows it in Obsidian too. There are three layouts.

![[ob-pic-beside.png|inlR|320]]
**Beside the text.** Put the picture first, then the paragraph on the very next line. Write `![[photo.png|inlR|240]]` to put it on the right with the text wrapping on the left. `inlL` puts it on the left. Give a wrapped picture no caption, and say what it shows in the text beside it.

![[ob-pic-below.png|inlR|320]]
**Below the text.** Write `![[photo.png]]` on its own line for full width, or `![[photo.png|600]]` for a width in pixels. An italic line straight under it is its caption, like `*The whole site at a glance*`.

![[ob-pic-pair.png|inlR|320]]
**Side by side.** Put two pictures on one line, such as `![[before.png|320]] ![[after.png|320]]`. Make them the same width. A caption underneath covers both.

> [!tip]
> The next heading always starts below a wrapped picture, so the layout never runs on.

> [!note]- More detail
> **Where the file goes.** Put each picture in the attachments folder beside the page, not in one folder for the whole vault. Obsidian creates it for you when you paste a picture into a page. Folio follows the Obsidian setting called "in subfolder under current folder".
>
> **The name has to match exactly,** capital letters included.
>
> **Pictures from the web.** Write `![words](https://example.com/picture.jpg)`.
>
> **While editing.** If the cursor behaves oddly around a wrapped picture in Obsidian, the Folio theme has a Style Settings switch to keep it on its own line while you edit. Reading view always wraps.

## Draw table column widths
%% card: The line of dashes under the header sets how wide each column is | icon: table | updated: 0.83 | key: tables %%

In a table, the line of dashes under the header does two jobs. It sets the alignment, and it sets the widths. The numbers match the picture.

![[ob-table-dash.png|514]]
*Four or more dashes under Notes: that column takes the spare room.*

1. A column with three dashes or fewer is as wide as its words. `|---|---|` gives a compact table.
2. A column with four or more dashes takes the spare room. Draw only the column that needs it, usually Notes.

> [!tip]
> Obsidian ignores dash counts, so a drawn table looks different while you edit. Folio is where the widths show.

> [!note]- More detail
> **Sharing the room.** Two drawn columns of 10 and 30 dashes split the spare room a quarter and three quarters.
>
> **Alignment.** A colon on the left of the dashes aligns left, on both sides centres, and on the right aligns right.
>
> **Margin to margin.** Put `%%wide%%` on its own line above the table. Obsidian hides that line, so only Folio uses it.
>
> **Too many columns.** A table that cannot fit even when wrapped grows into the margins, then scrolls sideways, with **Open full table** above it. Text in a table always wraps.

## Add callouts
%% card: Notes, tips, warnings and folded details | icon: sparkle | updated: 0.83 | key: callouts %%

A callout is a quote with a type on its first line. Write `> [!tip]` and the text on the lines under it.

![[ob-callouts.png|inlR|320]]
Add a title after the type, like `> [!warning] Mind the step`. Add a minus, as in `> [!faq]-`, and the callout starts folded. A plus, as in `[!faq]+`, starts open but lets people fold it. The same types and colours show in Obsidian and in Folio.

> [!tip]
> The types are note, abstract, info, todo, tip, success, question, warning, failure, danger, bug, example and quote.

> [!note]- More detail
> **Nesting.** Callouts nest. Start the inner one with `>>`.
>
> **The copy callout.** Folio has one type of its own. `> [!copy] Standard reply` adds a **Copy** button that puts the text on the clipboard, formatted, ready to paste into email or Word. Use it for wording that has to be exact. In Obsidian it shows as a plain callout titled Copy, with no button.
>
> **What gets copied.** What you see, never the Markdown marks. Bold copies as bold, and a link copies as its words.
>
> **Guide boxes.** A callout of type guide is writer help from a template. Folio never shows one, in any page.

## What Folio does not show
%% card: Things that look different, or do not appear, in Folio | icon: alert | updated: 0.83 | key: not-shown %%

Folio follows Obsidian closely, with a few deliberate gaps.

1. **Raw HTML** shows as typed. Underline has no Markdown form, so use bold or highlight instead.
2. **Mermaid diagrams and maths** show as plain code, not as a diagram or a formula.
3. **Unusual link types** show as plain text.
4. **Tags** are display only.
5. **Tab trees under a bullet** read as a nested list in Folio, which Obsidian's own Reading view does not.

> [!tip]
> If something looks different in Folio, it is almost always one of these five. Write it in Obsidian if you like, and expect it to look different here.

> [!note]- More detail
> **Why raw HTML.** Showing it would let anything pasted into a page run in every reader's browser. Markdown covers nearly everything.
>
> **Further reading.** Folio uses Obsidian's own syntax, so Obsidian's help applies. Search for Obsidian basic formatting syntax, advanced formatting syntax and callouts.

## Something is wrong
%% card: Fixes by what you see | icon: alert | updated: 0.83 | key: trouble %%

Find what you see below and open it. Each one says why it happens, then what to do.

### A picture shows as text in Folio
Cause: the file name does not match exactly, or the picture is not in the attachments folder beside the page.

Fix: check the spelling and capital letters, and move the picture into the attachments folder next to the page.

### A table looks too narrow in Folio
Cause: the line of dashes under the header has three or fewer dashes in every column.

Fix: draw four or more dashes under the column that needs the room, usually Notes.

### My page looks different in Folio
Cause: one of the gaps in What Folio does not show, such as raw HTML or a diagram.

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
