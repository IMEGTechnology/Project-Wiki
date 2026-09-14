# Project-WikiBase — Changelog

*One entry per shipped deploy. Newest at top. Not a substitute for the session log — this is the short version, for tracking what actually went out the door.*

*Packaging (changed 2026-08-03, from 0.19.1 on): deploys are a plain `deploy/` folder in the project root, not a versioned zip. Deployment now happens from this PC straight into the repository, so a zip was one unpack step with nothing to show for it. The folder is overwritten in place each release; the version it holds is whatever the badge in `index.html` says.*

*Versioning (locked 2026-07-22): `MAJOR.MINOR.PATCH`. MAJOR stays `0` for the whole beta — moves to `1` at full release. MINOR bumps when a session ships new user-facing capability; PATCH bumps when a session only fixes or polishes what's already shipped. MINOR always resets PATCH to `0`. Everything below `0.12.0` was originally shipped under an older `vX.Y[-N]` tag — those are noted per entry for traceability against already-shipped deploy zips. Everything from `0.12.1` onward is native to this scheme.*

*Note: the entries reconstructed as v0.8c / v0.8d / v0.8e-1 below are from partial notes — those sessions moved the app forward without a session-log entry at the time (a known documentation gap). Everything from v0.9a onward was tracked in full going forward.*

## 0.61.0 — 2026-09-13

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; updated `supporting/button-scale-sample.html`, `supporting/tests/b2-home.test.js`, `supporting/tests/round2-destinations.test.js`.

*J3, the button scale applied. Home's six doors and Admin's five tabs both draw from one scale now, and a same-day colour review swapped teal out before any of it was built.*

### Home: sample C

Every door gets an icon, the label is centred instead of left-aligned, and the sub-line is only revealed on hover — opacity and max-height, never `display`, so the button's own height never changes and nothing below the row moves. Doors are an equal flex row now rather than an uneven grid: the centred, ellipsised label no longer needs Continue reading wider or Admin narrower. Hovering grows the door under the pointer and narrows the rest to fit; below 900px that behaviour turns off and the sub-line is shown at rest instead, since a single shrinking row doesn't suit a touch width.

### Admin: sample 2, carrying sample 3's counts

One `.seg2` segmented control replaces five loose `.rt-tab` pills, and each tab that has a vault-wide number now shows it — Review and Vault check's counts read off numbers the app already computes (`reviewDashboardTotal()`, and hard+warn from a Vault check run), Comments off `state.cmtOpenCount`, the same vault-wide total the inbox badge already used. Usage and Access carry none, by design: one is a report, the other has nothing to count.

### The colour review, before any of it was built

Jayson flagged teal (Help's original colour) as too close to green at a glance. Measured: teal sits at ~175° on the wheel, almost exactly midway between green (~139°) and blue (~217°), so the first idea — nudge green toward blue — would have closed that gap further, not opened it, and it would have touched the same token the app uses for diff-add elsewhere. Landed on a swap instead: **purple moved onto Help**, since it read calm enough for the door people use most; **a new rose token** (`#e11d48` light / `#fb7185` dark) **took Admin**, the door hidden below Contributor that almost nobody opens, so the warmest colour in the set barely registers. Teal's token is unchanged and still used elsewhere (callouts, code fences, Review's `.rv-owe-teal`).

### Tests

`b2-home.test.js`'s uneven-grid assertions replaced with checks for the new flex layout, the hover-grow rule and the four colour groups. `round2-destinations.test.js`'s tab-count check now queries `.seg2 button` instead of `.rt-tab`. **Full suite re-run: 3,106 passed**, the same two standing `usage-analytics.test.js` reds (open since S66, untouched by this release) — nothing regressed.

### Still open

Whether the hover-resize feel holds up in daily use — the cheaper fallback (reveal the sub-line without resizing) is recorded in the CSS comment above `.ch-doors` if it doesn't. And whether purple carrying both Help and Admin's old "the one family the reader never uses" meaning is fine now that it means two things.

---

## 0.60.0 — 2026-09-13

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/j2b-banner.test.js` and `supporting/button-scale-sample.html`; updated `supporting/review-redesign-sample.html`, `supporting/tests/review-actions.test.js`, `review-bugfix-0321.test.js`, `vault-audit.test.js`, `home-isolation.test.js`, `frontmatter-and-tables.test.js`, `j2-review-b.test.js`.

*J2b, the second half. Four bottom bars become one, properties are edited where you are already looking, and questions get a bottom banner for the first time.*

### One banner instead of four bars

The bottom of the review flow was four separate bars — the walk bar, the diff bar, the audit bar and the detail bar — each with its own layout. Two of them pushed the close control to the right edge with `margin-left:auto`, a third used a spacer span, and the buttons landed in a different place for every kind of item. Walking a queue moved the controls under the cursor at every step.

There is one banner now, rendered from one spec, in an order that never changes: the walk position on the left, then the page, then what kind of item it is, then the actions and the close control on the right. The type's own detail sits below.

**The rule that keeps it one shape at every width:** the kind text and the title give up room and ellipse; the action cluster never gives up anything, and the bar does not wrap. A bar that wraps is a bar whose buttons move, which is the fault the whole surface exists to remove.

### Questions and escalations have a banner at last

They were the only item types in the queue with no bottom surface at all: clicking one opened the Comments pane in the right column and left the bottom of the screen empty, so a walk changed shape halfway along. They get the same bar as everything else, with the thread and a reply box as the detail, and four actions — jump to the section the question was raised against, assign or escalate, set or clear a due date, and close.

Assign and a due date are **two new optional attributes on the comment tag**, written only when set, exactly the way `hid` and `replyTo` already are. Every comments file written before this version is byte-for-byte what it was. **Assign is a typed name, not a picked one** — there is still no roster anywhere in the app, the same gap the review dashboard recorded at S42.

### Properties are edited in the banner

Every declared key is a field. The **Edit properties** button and its trip to the Properties flyout in the reader's opposite corner are both gone: the banner was already listing every key and its value, so being sent somewhere else to change one was a round trip with nothing in it.

**A save writes the properties and nothing else.** No baseline, no status flip, no approval. Approval stays a separate, explicit press. That is the v0.56.0 lesson applied deliberately rather than rediscovered — a property fill used to sign off content nobody had read.

An absent key and an explicit `false` stay different, on both sides: an unchecked box over a key that was never set writes nothing, and an empty text field over an absent key writes nothing either. **That second half was found by the revert pass, not by writing the check first** — reverting "write only what changed" to "write every field" left every existing check green.

### The Comments tab badge counts this page

Jayson's item 5, "comments are behaving as vault-level". Settled by rendering it: the reader's own comment badge read 2 while the Comments tab badge beside it read 19, on the same page, at the same moment. The pane's content, the reader badge and Outline's per-heading dots were all per-page and correct. **Only the tab badge was fed the vault-wide total**, because one line wrote the same number into it and into the vault-wide inbox badge — two elements that mean different things.

Each tool now declares what its own badge counts, so the next tool with a badge cannot inherit the wrong number by a caller forgetting. The inbox badge still gets the vault-wide total, which was always the right number there.

### One function closes the banner, whatever is in it

Every route that leaves a page has to close the bottom surface, and each of those routes used to write out the list of closers. Adding a fourth item type is exactly when that costs you. The list lives in one function now. **Leaving a walk also closes the open item**, which it did not before: the walk bar hid and the diff or audit bar stayed, standing over the dashboard still describing a page you had left.

### What the render found that no check could, seventh session running

Four separate breaks of the one-shape promise, none of them visible to jsdom, which measures every element as zero:

- Status chips sitting on the action side pushed the close control onto a second line. They are in the body now: a set of facts that varies by item type must never sit where it can move a button.
- Button labels wrapped, which made the bar taller — the same break by another route.
- The walk position stacked "Page 1 of 3" into three lines.
- Everything that could shrink shrank into stubs: the position read "Page", the chips read "§…" and "Ass…". No overflow, and no information either.

And one fault that was mine contradicting the spec I was building: the walk's buttons sat on the left with its position. The position is a label and stays left; the buttons are actions and belong where the actions are.

### Subtracted

**Skip**, which duplicated the walk's own Next. **Assign and Due as two buttons** opening the same panel, now one. A second mechanism that restored the strip height, disagreeing with the first about the 60%-of-window cap. And `postComment` read the author name straight from config, so an unreplaced `[PLACEHOLDER]` could be written into a comment as somebody's name; it uses the same guard as everywhere else now.

### Also

`supporting/button-scale-sample.html` is new: one button scale, three sizes and three treatments, with five samples for Home's door row and three for Admin, drawn from it. Nothing is applied yet — Jayson's items 15 and 16, awaiting his pick.

## 0.59.0 — 2026-09-13

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/j2-review-b.test.js`; updated `supporting/tests/review-dashboard.test.js`, `review-actions.test.js`, `review-bugfix-0321.test.js`, `vault-audit.test.js`, `p10-vault-check.test.js`, `frontmatter-and-tables.test.js`.

*J2, first half. Review becomes one list of pages, oldest first, and the property repairs move to Vault check.*

### Review is a list of pages now, not a list of items

The three severity bands are gone. They sorted items, and a person reviews a page: a page that had been edited in Obsidian, carried an open question and was overdue appeared as three rows in three bands and took three separate visits. It is one row now, saying all three things, and clearing the page removes the row.

The list is ordered **oldest first**, and the walk follows the order on screen rather than a band order of its own, so nothing can sit unseen at the bottom of a collapsed band. A page's age is the oldest thing it owes: the timestamp on a question, an escalation or a pending edit where there is one, and otherwise when the page itself was last modified. A page with no readable date sorts last rather than first, because not knowing how long something has waited is not the same as knowing it has waited longest.

Each row carries **Review page**, and a page owing exactly one thing that can be closed without reading it also carries that button (Approve, Clear due date). A page owing several does not: the button would be acting on one of the things in a row that lists three.

### Missing properties left Review for Vault check

Jayson's split, and the rule now lives in one function rather than three filter lines inside the scan:

- A page with **no `status` key at all** has never been approved. That is an approval, and it stays in Review as a New page with its missing keys named on its own row.
- A page that **has a status and is missing keys** is a repair, and repairs are Vault check's.

The consequence worth having is that a repair run from Vault check can no longer manufacture review work, so the band-hop between completion and acknowledgement closes by construction rather than by a rule someone has to remember.

Vault check gained the findings, one per page, banded by what is absent: a missing required key is a hard failure, a gap in the optional-but-expected set is a warning. **Fill all** moved there with the rows it clears, and each row carries its own Repair. Both go through the one writer of missing keys in the app, so a repair here and a fill anywhere else cannot drift, and both inherit the v0.56.0 guard that stops a fill signing off content nobody approved.

**Vault check's "Open Review" pointer row is deleted.** P10 added it because the missing-author fact lived in Review and printing it twice would have been two lists of one thing. The fact has moved, so the pointer had nothing left to point at.

### What was deleted rather than left pointing at nothing

The band collapse state, the per-band counts, the band headings, `Fill all`'s Review-side helpers and the bulk button that read them are all gone rather than kept aimed at a shape nobody renders — the fault this project found twice in one column at v0.58.0. Acknowledge all survived, unchanged in what it does, under a name that no longer claims there is a band 2.

### Tests

New `j2-review-b.test.js`, **46 checks**, asserting what the person would see and what the sort actually produced rather than that a function exists. Six existing suites were updated where they encoded a decision this release reverses; each rewritten check now asserts the new rule and says what the old one got right, and the deletions are asserted as absences so a band heading or a bulk button that quietly came back would fail rather than pass unnoticed.

**46 suites, 3,042 checks + 8 smoke. Green except the two standing `usage-analytics.test.js` reds**, open since S66, confirmed pre-existing by running the whole suite before the first edit and untouched by this release.

Six fixes were reverted one at a time in a scratch copy and confirmed to turn the suite red. **Two came back green on the first pass and one of them was a real hole**: the repair check called `vcRepairProps()` directly rather than going through the button's own dispatcher, so deleting the dispatcher's branch left it passing while the button would have run the wrong repair. That is the call-site-not-callee fault this project has now recorded five times, and the check now goes in the way the button does. The other green revert was a bad revert that never applied, which is worth separating from a hole: a revert that changes nothing proves nothing either way.

### One thing the render caught, as usual

The filter chip row was set never to shrink, so on a reading column narrower than the chips the last chip was sliced off by the edge instead of wrapping. It has presumably been that way since the bar was built. jsdom measures every element as zero and cannot see a clip, so nothing in the harness could ever have found it.

---

## 0.58.1 — 2026-09-13

**Changed:** `index.html`; updated `supporting/tests/fold-consolidation.test.js`.

*Pre-1.0 test-vault pass. Local connect was crashing outright on a stale saved value, plus two small diagnostics added while chasing it.*

### Boot crashed on a leftover value, every time, on any folder

Connecting a vault threw `last.folderId.split is not a function` on every attempt, always landing back on the same "Folio could not open that folder" / "Welcome back" screen regardless of which folder was picked. The cause was not the vault or the folder: `wb_last_file`, the "last file you had open" record Folio keeps in the browser, can carry a `folderId` left over from an older version that is no longer a plain path string. Boot's ancestor-chain restore trusted that shape blindly and called `.split()` on it. It now checks the type first and skips the record if it doesn't match, the same way stale persisted state is handled elsewhere in this file.

First reported against a build believed to date back to around 0.50.0, when Admin, Saved, Search results and What's New started opening as full destinations rather than a side panel — a plausible origin for a non-file record reaching `wb_last_file`, though the exact write site was not traced.

### Two small diagnostics, added while chasing the above

- **Account menu → Connected** now shows the folder's name (`— test-vault`, etc.) so a mismatched connection is visible at a glance. Browsers only ever expose a folder's name through this API, never a full path, so a name match is the limit of what this can show.
- **"Open a different folder…" now opens starting at the currently-connected (or last-saved) folder** via `showDirectoryPicker`'s `startIn`, instead of wherever Chrome last remembered on its own.

### Tests

`fold-consolidation.test.js` gained one check asserting the type guard is present in boot's ancestor-chain read, alongside the existing check for that block. 173 passed, 0 failed. `usage-analytics.test.js`'s two pre-existing failures (Most read row counts) are carried forward from before this release, untouched by it, and are tracked as a known issue rather than fixed here.

---

## 0.58.0 — 2026-09-11

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/j1b-right-stack.test.js`.

*The right column stacks instead of swapping. Jayson's item 6, and the cleanup he asked for alongside it.*

### Outline no longer disappears

Opening Comments or Links used to **replace** the Outline. That is why the side column could feel like it had been taken over, and why the only way back to the Outline was to click away from what you had just opened.

The Outline is now permanent. Opening a companion **stacks it underneath** rather than swapping it in, and you can drag the divider between them to give either one more room. With only the Outline open nothing changes at all: one panel, no divider, no strip.

Nothing else about how the column behaves has changed. Moving to another page still clears the companions and leaves the Outline, exactly as before.

### The ✕ works, and the arrows are gone

The ✕ on a panel's header **did nothing** in the current interface. It was written for the older two-column layout and was removing the panel from a list this interface does not read. It closes the panel now.

The arrows beside it moved a panel to the *other* side column. There is only one companion column here, so the control pointed at nothing. Removed. The older interface, which does have two, keeps them.

The Outline has no ✕, because it is always there.

### Panels remember their height

Set the Outline tall and Comments short, close Comments, open it again later: it comes back the way you left it. Each panel's height is remembered separately.

### All comments has left the side column

The **All comments** button at the foot of the Comments panel is gone from the current interface. That vault-wide view moved to Admin at 0.54.0, and Home links to it, so the button was a third door to the same room sitting inside a panel that is about one page.

## 0.57.0 — 2026-09-11

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/j1-everyday.test.js` and `supporting/right-panel-stack-sample.html`.

*Five everyday annoyances from Jayson's own list, the ones he hits every time he opens the app. Four shipped, one is a question with a drawing attached. New user-facing behaviour (a report popup), so MINOR.*

### The two side columns stopped fighting each other

Widening one side column shoved the other back to its default width, and then **recorded that shove as your own choice** — so the column you had sized never came back, on this or any later visit. Both halves of that were one rule in one place.

The rule existed to stop a widened column crushing the reading area. It was never what protected the reading area: both gestures already refuse to go past the reading minimum on their own. All the shove did was take room from one column to give to the other.

So in the current interface it is gone. Each side adjusts on its own, is limited only by how much room is actually free, and keeps the width you left it at. The old interface keeps the old behaviour, because there a saved width is the only memory a panel has.

*Behind it: the exception that forbids recording the shove was written at one of the two places that shove, and not the other. It is now one piece of code both of them use, rather than a rule each one has to remember.*

### Arriving from search highlights the section you landed in

Opening a saved item has always highlighted the heading it lands on. Arriving from a search result marked the matching line and left the heading alone, so nothing told your eye which section you had arrived in. That is why this read as something that used to work and stopped: it worked on one of the two ways in.

A search arrival now highlights both — the section header and the matching line.

### Report is a real button, and it opens a popup

The Report button under each page was wired up at 0.56.0 but was still **painted** as unavailable: half faded, with a "not allowed" cursor. A working control had been reading as dead for three releases.

It is now a live control with a flag on it. Clicking it opens a small popup: write what is wrong, Submit, and it goes away, with a confirmation. It no longer summons the Comments panel into the side column and leaves it there.

Reports still land in exactly the same place as before — the page's own comments — so they appear in that page's Comments panel and in the vault-wide list like any other flag.

### The favourite icon fills when a page is saved

Saving a page has always switched the icon in the reader to a solid one, and the solid version never arrived on screen: a styling rule was overriding it, silently, so the icon stayed an outline while the same icon in the Outline panel filled correctly. Both now look the same. The "more" menu's three dots, which had the same problem, are solid dots again rather than hollow rings.

### Still open

**Stacking the right panel's three tabs** was not built. "Like the original" reads two different ways — all three panels visible at once, or just the tab labels running down the side — and they are different changes with different consequences. Three versions are drawn at `supporting/right-panel-stack-sample.html` for a decision.

The rename of **Links** to **Backlinks** was dropped: that panel lists the links this page points *at*, in four groups, and carries backlinks as one section at the bottom, so the new name would have described its smallest part.

## 0.56.0 — 2026-09-11

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/review-actions.test.js`.

*Five defects in the review flow, found while auditing it against Jayson's report that it "seems to be working weird." Every one of them was silent, and one was losing work. New user-facing behaviour (the app can now say an action worked), so MINOR.*

### Filling in properties was deleting review items

**The serious one.** Folio keeps a baseline for each page: a record of the content as it was when somebody last approved it. A page edited in Obsidian is compared against that baseline, and the difference is what appears in Review as "edited in Obsidian."

Filling in a page's missing properties wrote a **new baseline**, at the page's current content. That line exists so a page dropped into the vault after the first run starts being watched, which is right. For every other page it did the opposite: a page that already had a baseline *and* an unapproved change had that change quietly folded into the new baseline. The difference then came out as nothing, and the item left Review with nobody having looked at it. **Fill all did that to every page in the band in one press.**

A baseline is a record that a person approved this content. Filling in properties is not a person approving content, so it no longer writes one. A page with no baseline still gets one, which is the only case the line was ever for.

**If you have run a property fill, the changes it swallowed are not recoverable from the log.** Re-approving them means looking at those pages again.

### Approving from the review strip replaced the page you were reading

Every review action can be pressed from two places: a row on the dashboard, where the reader is showing the dashboard, or the strip at the bottom of the page you are reviewing. All of them redrew the dashboard into the reader afterwards. On the dashboard that is correct. Mid-review it replaced the page you were looking at with the dashboard, which is most of what "working weird" was describing.

### The review bar at the bottom never went away

Open a change that was made in Obsidian, then open a different page: the bar stayed, still describing the page you left, with its Approve button aimed at a file no longer on screen. The rule that the bottom strip leaves with its page has been in the code since it was written; this bar was added later and was never added to the rule.

### Nothing ever said whether an action had worked

Accept, Approve, Fill properties, Clear due date: each one wrote to the vault and said nothing at all, so a write that worked, a write that was slow and a write that failed were indistinguishable. **Every one of them now confirms, and names the reason when it fails.** Failures no longer interrupt with a dialog box.

### And the review walk now keeps up with the work

The list you walk with **Next** was built when the walk started and never touched again, so an item you had just dealt with was offered again and the "N left" count never went down. Resolving an item now drops it and opens the next one; resolving the last one ends the walk and returns you to the dashboard.

## 0.55.1 — 2026-09-10

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/connect-failure.test.js`.

*One bug report, root-caused, plus the reporting that would have made it a five-minute problem. Fixes only, so PATCH.*

### Connecting to a vault could stop dead, with nothing said

Reported twice in one morning: the folder picker opens, a folder can be chosen, and then nothing happens. Afterwards every button on the screen appears dead while the picker itself still opens. That is one fault, not three.

**The store that remembers the vault folder between launches opens a small browser database, and an open request has a third outcome besides success and failure: it can be blocked.** Another Folio tab or the installed app still holding it, or a site-data clear whose cleanup has not finished, and the browser fires `blocked` and then waits, with no deadline, for the other connection to close. There was no handler for it, so that wait became the app's wait. The promise never settled, so `await` never returned, nothing was ever thrown, and the `try/catch` written around it specifically to make this step best-effort could not fire, because a hang is not a failure. Every route into a vault queues behind that one line, which is why the picker still opened (it runs first) while everything after it was already stopped.

It now fails on a five-second deadline and names which of the three outcomes it hit. **Remembering the folder is best-effort again, which is what the comment above it always claimed it was.**

### A failure while opening the vault was being written where nobody could see it

Since the beginning, a vault that will not load has written its reason into the sidebar. During the walkthrough the first-run overlay covers the entire app, so that message has been landing behind it, unread, every time. What the person sees is an unchanged screen, which is indistinguishable from a button that did not fire.

**The connect and reconnect screens now report their own failures**, in place, with the reason quoted and the three things that account for nearly every case: another Folio still open, a folder the computer guards (Desktop, Documents and Downloads are protected on a Mac and the browser has to be granted each one), or a folder that has not finished syncing. The report box scrolls rather than the card, so the buttons stay on screen however long the message runs.

**Two smaller silences went with it.** Declining the browser's permission prompt said nothing and left the screen as it was; dismissing the picker was treated as "changed their mind" and said nothing, even though a refused folder arrives the same way and is not the same thing. Both now say what is true and what to do about it.

**And the screen says when it is working.** Opening a folder can take a real moment, and until now nothing on screen changed while it did.

### A failed connect no longer claims to have succeeded

Found while testing the above. Opening a vault marks the app connected on the way in, and nothing put that back on failure, so the retry screen greeted the person with **"Already connected"** and a Continue button that walked them into an app with no vault behind it. Worse than the failure it was reporting. The state is now put back before anything reads it.

## 0.55.0 — 2026-09-09

**Changed:** `index.html`, `manifest.json`, `sw.js`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/b3-frame.test.js`; updated `supporting/tests/docks.test.js`, `section18-shell.test.js`, `session-d-fixes.test.js`.

*Four items off Jayson's 9 Sep review, all about the app's frame and how you get into it. New capability, so MINOR.*

### The side columns adjust again, and the fitted width stops cutting names off

**Hide and show do not change.** That was the instruction and it is the shape of the whole item: the auto-collapse shipped at 0.44.2 still decides whether the right column is there at all. What comes back is adjustment. The drag handles were hidden in the new shell by two lines of styling since Session 62; the grip returns, the flare does not, because clicking the flare closes a panel and a second way to close the right column would contradict both B2 and the auto-collapse. A drag now stops at a floor instead of falling through into a close, and click-to-collapse is gated off behind the same test.

**A column with no width of your own now opens fitted to its content** rather than at a fixed 220 that truncated any long file name or heading, which is what was reported. Drag one and that width is remembered, per device, and wins from then on. The fitted default is deliberately never written down: recording it would freeze the column at whatever the first page happened to contain and stop it tracking content, which is the opposite of what fitting is for.

**Padding at the app's left and right edges.** It goes on the content, never on the frame, and only at the two real window edges: widening the frame would change every width the drag ceiling, the fit and the reader minimum are computed from.

### Two bugs behind that, both found by rendering it

**The fit was measuring placeholders.** It ran on the first sidebar render of a session, when every open folder still reads "Loading…" while its files are fetched. It measured three placeholder words, found them narrow, and left the column at its default with the long name still truncated — the exact bug it was written to fix. It now waits for a real row.

**And a pre-existing one, here since v0.32.1.** Fitting a column resets the OTHER column to its default first, so the ceiling is computed against a sane neighbour, then read that neighbour's width back to do the arithmetic. That panel carries a 0.18s width transition, so the read returned the width it was animating away from, not the one just set. Every fit performed beside a wider neighbour has therefore landed short of the room available. Measured live: a 1440 window fitted the sidebar to 215px where 312 was free — and 215 still truncated the name. Fixed by using the value we set rather than asking the DOM for it. No check could have caught this: jsdom has no transitions, so all 2,700 of them measured a world where the bug does not exist.

### Links open in the app, and the install offer stops being wrong

Following a Folio link opens a browser tab. In that tab Folio could not tell it was already installed, so it offered to **install an app you already had** — the banner Jayson reported alongside the link itself. Folio now records the one moment it can know for certain, while running as the installed app, and a later tab on the same machine reads that record: no install offer, and the one-time browser switch explained instead, at the bottom of the banner slot's existing priority and dismissed for good once acknowledged.

**A custom link scheme was considered and held in reserve.** It would guarantee the app opens, but a made-up scheme is a dead link for anyone without Folio installed and does not reliably become clickable in Outlook or Teams, which trades a browser annoyance for a link that sometimes cannot be clicked at all. `manifest.json` also now asks for the window you already have open rather than a second one.

### The taskbar icon can change without a reinstall

The icon is captured by the browser at install. Chrome only revisits it when the manifest's own text changes, so replacing the image in place changed nothing it could see and the old icon survived until somebody reinstalled — what happened at the 0.35.0 rename. The icon URLs now carry a version to bump whenever the art changes, and the rule is written into `sw.js`, since JSON cannot hold a comment. Recorded honestly: on macOS the icon is baked into the app bundle at install and a reinstall may still be needed. This is for the Windows machines the staff run.

### Home is a place the browser knows about

Open since Session 68. Home never wrote an address, so the browser had no record of it and Back could never return there. Home now has one, with three rules: arriving at boot replaces rather than adds, so Back still leaves Folio instead of bouncing off a phantom entry; Home clicked twice is one entry, not two; and coming back to Home lands on the same replace branch, which is what stops it looping. A shared link still beats everything at startup, unchanged.

## 0.54.0 — 2026-09-09

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/comment-threads.test.js`; updated `supporting/tests/section18-shell.test.js`, `session-a-shell.test.js`, `walkthrough.test.js`, `p10-vault-check.test.js`, `round2-destinations.test.js`, `review-dashboard.test.js`, `help-split.test.js`; redrawn `help-assets/fig-04-header-bar.svg`.

*Two disabled buttons wired up, a genuine indexing bug fixed along the way, and the help page brought current with the shell it now describes. New capability, so MINOR.*

### Comments: replies, collapsed closed threads, a locked target, and a move to Admin

Report (disabled since 0.51.1) and Comment on this section (drawn but disabled since Session A) both now open the same composer the Comments panel has always used, no second composer built. Report presets to Flag and targets the page as a whole; the section button locks in the heading you pointed at.

**The post target used to follow whatever heading was in view**, so scrolling while typing could silently move where a comment landed. It now locks the moment you start typing.

**Replies.** Every comment carries a Reply button; a reply threads under the comment it answers as its own entry, with its own author and timestamp, rather than an edit to the original. The sidecar format's `replyTo` attribute is new and optional, so a `.comments.md` file written before this release still reads exactly as it did.

**Closed comments collapse.** A closed comment with no open replies shows only its first line; click it to expand. One still under discussion (an open reply beneath a closed parent) stays expanded, since something under it needs attention. Jayson's framing: "comments are just comments, you should be able to close comments but still see them."

**The vault-wide board moved into Admin**, as All comments beside Review, replacing the footer button on the Comments panel itself. A companion describes the page beside it; a vault-wide board is a destination, and the footer button was the one place that rule was still broken.

**A pre-existing bug surfaced by that move, and fixed:** the board's Mark closed button used a comment's position in the *filtered* list as its identity rather than its true index in the file. Under the default Open filter, a file with one closed comment ahead of an open one closed the wrong comment, silently, since the feature shipped. Fixed by carrying the original index through the filter instead of recomputing it.

`closeCommentAt()` deleted: a third close-a-comment implementation nothing ever called, agreed at Session 76.

### The help page now describes the shell people are actually running

`help.md` was still written primarily for Folio's original two-panel layout, with the console shell mentioned as a minor opt-in curiosity. That shell has been the default for new installs since Session 1 (v0.39.0) and the old one is scheduled for deletion at the very next session (P11), so the framing was backwards and about to become actively misleading. Sections 2, 4 and 5 rewritten with the current shell as the primary subject: the header bar, the page controls above the reader, companions versus destinations (a page-shaped tool sits beside the page; a vault-wide one takes the middle over), the first-run guided tour, Vault Files, quick search, and Saved replacing the old Bookmarks-and-Favorites pair. Sections 1, 3, 6 and 7 needed smaller touches for the same reason: the "screen at a glance" summary, the Comment/Highlight state on a heading's hover row, the Comments walkthrough, and the quick-reference tables all named controls that had moved or been renamed.

**Five of the nine help figures no longer match anything this page describes** (the old dock model's panel edges and stacking, the old reader chrome, the old Bookmarks-to-tab flow) and their embeds were dropped rather than left showing the wrong picture. The files are still on disk; deleting or redrawing them is a separate call. `fig-04-header-bar.svg`, the one figure this session's own header-bar rewrite made stale, was redrawn to match.

### Tests

New suite `comment-threads.test.js`, 55 checks: reply threading and flattening, fold/collapse, the locked-target regression (types, scrolls, posts, asserts the comment landed where the composer said it would), the Admin board move, and a direct regression test for the original-index bug above. Six existing suites updated for intentional behavior changes (Comment no longer disabled, the Admin screen's tab count, `closeCommentAt()` gone). `help-split.test.js`'s figure count updated from 9 to 4, with the dropped five named in a comment.

## 0.53.0 — 2026-09-09

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/frontmatter-and-tables.test.js`; updated `supporting/tests/table-spacer.test.js`, `review-bugfix-0321.test.js`

*A bug that was quietly damaging pages, plus the property groundwork for staged onboarding. New capability, so MINOR.*

### Properties were being lost, and a second block written on top

This is the important one, and it has been happening on the live vault.

Folio read a page's properties only when the very first character of the
file was a dash. Four ordinary things break that, and every one of them
happens in a folder synced between machines:

- **Windows line endings.** Any file ever saved by a Windows editor.
- **A byte order mark**, which Notepad and several exports add invisibly.
- **A blank line** before the properties block.
- **A trailing space** after the dashes.

When any of those was true, Folio concluded the page had no properties at
all. The review dashboard then listed it as a new file, and "Fill
properties" wrote a **second** properties block above the real one.
Obsidian reads the first block it finds, so from that moment the page's
real status, author and must-read flag were being ignored everywhere.

All four now read correctly, and writing a property can no longer create a
second block. Windows line endings survive a write instead of being
silently converted. Reading and writing now agree about where a block
starts, which is what turned a parsing miss into lost data in the first
place.

**Obsidian's own list format is read too.** Properties written as

    tags:
      - standards
      - security

used to come through empty, so a vault authored in Obsidian's property
editor showed no tags at all in Folio.

### Repairing the pages already affected

Fixing the reader does not undo what was already written, so the vault
check has a new finding: **Duplicate properties**, with a **Repair**
button beside it.

Repair merges the two blocks and keeps **the page's own values**. The
lower block is the original, so where the two disagree, it wins; anything
only the app wrote is kept rather than thrown away. The body of the page is
not touched, and running it twice does nothing the second time. It asks
before writing.

Run a vault check from the Admin screen to see whether any of your pages
are affected.

### Two new properties, for staged onboarding

- **Must-read start** — a date. The must-read window opens here.
- **Onboarding due** — a whole number of days after somebody's account was
  created. A 7 on one page, a 14 on another and a 90 on a third is a staged
  path rather than forty pages landing on a new hire's first morning.

Both are in the Properties panel and in the review dashboard's property
strip. **Due is unchanged** and still means "this page needs looking at
again", which is what the review dashboard's Due list has always acted on.

Accounts now record the date they were created, which is what onboarding
is measured from. Accounts that already existed are dated 1 July 2026,
rather than today, so nobody who has been here for months is handed an
onboarding path they finished long ago.

**These are properties only in this release.** Nothing yet reads them to
decide what anybody sees, and the existing 30-day must-read behaviour is
untouched. The rules that use them are 1.1, after a conversation about how
the staging should feel.

### The property strip stopped crying wolf

The review dashboard's property strip counted must-read and onboarding as
missing properties on every page, which was already wrong and would have
become "four properties are not set" on every page in the vault once the
two new ones landed. It now counts the same way the Missing properties list
does, and names the editorial tags separately instead of reporting them as
gaps.

### Table columns can be aligned from the width row

Alignment has worked from the separator row since 0.40.0 — `:---` for left,
`---:` for right, `:---:` for centred — and that is still the best place to
put it, because a table written that way lines up in Obsidian too.

You can now put the same colons on the **row of periods** you use to set
column widths:

    |:.....|:.....:|.....:|

The number of periods does not matter, `|:.|` works, and the colons no
longer print as stray characters on the page. If both rows carry colons the
separator row wins, so a table that already declares its alignment the
standard way cannot be quietly overridden by a width row further down.

One thing to know: colons on the periods row are a Folio convention.
Obsidian will show that row as an odd-looking data row.

## 0.52.0 — 2026-09-09

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; added `supporting/tests/moves-links-version.test.js`; updated `supporting/tests/install-setup-health.test.js`, `rename-and-trim.test.js`

*Three fixes from Jayson's pre-1.0 review, plus a dead-code sweep. New capability in the saved store and the link renderer, so MINOR.*

### Saved items survive a move, from any machine

A saved item is remembered by its path, and a path is not an identity. Move
a note into another folder or another vault and the saved item points at
nothing.

Rename repair has existed since 0.34.0, but it only ever worked for a
computer that was *running* across the move: it pairs the before and after
from an index kept in that browser's own storage. A laptop that was shut
through a reorganisation never learns the pairing, and its owner's saved
item stays broken with nothing left to explain why. That is the case that
matters while a vault is being reorganised, because the reorganising
happens on one machine and everyone else's is closed.

Every saved item now carries a fingerprint of the page's content, kept in
your own record in the vault rather than in one browser. It travels with
you, so any machine can find a moved page again at any later date, however
long afterwards, and whether or not it saw the move happen. Moves between
vaults are covered by the same mechanism.

Only a fingerprint is used, never a modified date: OneDrive rewrites the
date as a file passes through it, and matching on that would quietly point
a saved item at the *wrong* page, which is worse than leaving it broken.

### Repair, where there used to be only Remove all

When a saved item did break, the single thing Folio offered was a button
that deleted it. Deleting somebody's saved page because a folder got
renamed was never a repair.

Anything unambiguous is now simply fixed, silently, on the next scan.
Anything that needs a person is collected in a new **Repair** screen: each
broken item on one row, showing where it used to be, whether the match is
the same *file* or only the same *name*, and where it would go. Every row
can also be left alone or removed on its own. Remove all is still there,
inside that screen, as one choice among several rather than the only one.

Items saved before this release carry no fingerprint yet and will be
offered by name. They gain one the first time their page is seen in place.

### Links that were never links

A link written without the `https://` — `[IMEG](www.imeg.com)` — was
resolved against Folio's own web address rather than the internet, so
clicking it appeared to do nothing but reload the page. That is now read
as the web address it plainly is, and opens in your default browser.

Bare addresses typed as plain text (`https://imeg.com` on its own, with no
markdown around it) are now links, the way they are in Obsidian. Sentence
punctuation stays in the sentence, an address inside backticks stays code,
and an address already inside a markdown link is not linked twice.

A relative path that cannot lead anywhere — `../Archive/spec.pdf` — is now
shown greyed out with an explanation on hover, instead of looking like a
working link that reloads the app.

The Links panel classifies all of the above exactly as the page renders
it, so the list beside a page and the page itself can no longer disagree.

### The version number moved to the account menu

Out of the header, into the account menu under the three setup checks,
where it is always shown. The header keeps only what is *actionable*:
install while not installed, update while one is waiting. Neither of those
changed. The version still opens the changelog when clicked.

### Sweep

A pass over the whole file for anything unused, unreachable or silent.
Removed: four functions nothing called (`destOn`, `ensureRightPanelOpen`,
`toggleRightPanel`, and the click branch for `data-wb-chsec`, whose markup
stopped existing at 0.50.0), one unread constant (`THEME_SECTIONS`), and
five CSS rules with no user (`.hdr-count`, `.s-inline-row`,
`.s-inline-col`, `#ot-toolbar .ot-sep`, `.rp-pane-header`).

Failing to remember the connected folder no longer fails silently. It is
still best-effort and still never blocks a launch, but it now says what it
cost you — that the next launch will ask for the folder again — rather
than leaving a reconnect prompt with no explanation anywhere.

## 0.51.1 — 2026-09-06

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; updated `supporting/tests/b2-home.test.js`, `install-setup-health.test.js`, `p10-vault-check.test.js`, `section18-shell.test.js`, `session2-reading.test.js`

*Same-day fixes to 0.51.0, off a screenshot review. Polish, not new capability.*

### The version indicator now actually waits its turn

It was reading the wrong flag: dismissing the "Install Folio" prompt made
the version number appear even though the app still was not installed. It
now checks installed state directly, so it only shows once nothing needs
the icon -- exactly the rule it was meant to follow from the start. Moved
to sit just left of the light/dark toggle, ahead of Help and the avatar.

### The Admin door only shows to people who can use it

Home showed the Admin tile to every tier, reviewer or not, and only
refused the click after landing on a locked tab. Reversing that -- the
door itself is now hidden below Contributor, so there is nothing to click
that was never going to open.

### The page footer moved to the bottom of the page

Author, Updated, Due and the vault name were rendering as a strap right
under the title -- a footer's worth of information reading like a
subheading. Moved it below the body, where a footer belongs, and added a
Report button beside it, right-justified, disabled for now with a note
that it lands in 1.1.

### Home's door row, tidied

"Continue Reading" now gets enough room to sit on one line. Admin gave up
some of that width and lost a subtext line it didn't need ("what's on the
other four doors already tells you what's behind them"). "How Folio
works" moved onto the same baseline as the rest of the row, with "Help
File" as its own subtext, matching how every other door already reads.

### The bookmark fill, everywhere it lives

The reader's own Save button and the small bookmark icon that appears
over a heading were not filling in on save, even though the same fill in
the Outline panel worked correctly. Two separate causes: the Save button
had the right icon swap but no colour change to go with it, and the
heading icon was never told to refresh itself after a toggle -- only
Outline was. Both now match.

---

---

## 0.51.0 — 2026-09-06

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`

*Pre-1.0 revision, round 2, the last two items: 2e and 2f. Quick pass, not a numbered session.*

### The chrome stops drawing lines it doesn't need

The new shell's top bar drew a hairline under itself even where the sidebar
and right panel already sit at the header's own background tone. Dropped
the line and made the match literal (`var(--bg-header)` instead of the
coincidentally-equal `--bg-sidebar`), so the two can't drift apart later.
The Saved slide-over's own head got the same treatment -- no border, header
tone -- so it reads as a continuation of the top bar rather than a second
block stacked under it. The boundary with the reading column is untouched:
it was always a tone change, never a line, and stays that way.

### A version indicator for the new shell

The old shell has always had one, tucked in the bottom corner of the right
panel -- but that panel collapses to nothing on Home, on any page with no
outline, and behind every destination, so the new shell had no reliable
place showing what build was running short of opening Settings. Added one
to the header, in the same slot Install and Update already share: Install
shows while the app isn't installed, Update's own notice is the banner's
job in this shell, and the version -- click through to the changelog,
same viewer as Help -- shows only once neither of those needs the icon.
Its text is read from the existing button rather than a second hardcoded
string, so there is still exactly one manual version string in `index.html`
to bump on every ship. The old shell's own corner tag is hidden while the
new shell is on, so the two don't show at once.

---

## 0.50.0 — 2026-09-06

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`; new `supporting/tests/round2-destinations.test.js`; updated `supporting/tests/b2-home.test.js`, `install-setup-health.test.js`, `p9-admin.test.js`, `p10-vault-check.test.js`, `section18-shell.test.js`, `session-b-shell.test.js`, `session-d-fixes.test.js`, `session2-reading.test.js` and `supporting/tests/README.md`

*Pre-1.0 revision, round 2. Two bugs off a screenshot, and the destination question B2 raised and left open.*

### A place you go is not a panel beside a page

Saved, search results and Admin all opened in the 290px slide-over that was drawn for things you read **alongside** a page. B2 wrote down the test that says they should not — a companion belongs beside the page, a destination replaces it — and then only applied it to the companions. P10 widened the Admin slide to 560px, which fixed one screen and left the shape wrong.

**A destination now takes the reading column**, at the reading column's own width, the same way Home already does. It gets a title and a Close, and Close goes back to the page you were reading rather than dumping you on the front door.

- **Admin** opens full width, with all four tabs in a row instead of stacked into a companion's measure, and **lands on the tab you asked for**. Its Home door remembers the last tab you were on and, when that tab is above your tier, opens the first one you can actually use. Opening onto a locked room is not an entry point.
- **Saved** opens the real Saved list. **Its Home door goes straight there** rather than to the small flyout 0.47.0 added: that flyout was the better of two answers while the only alternative was the 290px slide, and it stops being so now.
- **Search results** gained somewhere to go at all. The palette stops at 30 content matches and has never had a way to the rest; it now ends with **See all results**, which opens the full Search pane in the reading column with the query already run.
- **What's New** needed nothing. It has rendered into the reading column since it was built, so it was already the thing the other three became.

Companions are unchanged: Outline, Comments and Backlinks still belong beside the page and still open in the right-hand column.

### Two fixes off one screenshot

- **A table's header pins to the top of the reading panel again.** It was pinning 30px down, with live rows scrolling through the gap above it. The panel reserves that 30px for the "you are here" section bar, which this look has not drawn since 0.41.1 — the space was being held for something that is not there. Not the Chromium bug fixed at 0.40.0; that fix is intact.
- **The Must read and Onboarding bars are visible.** The count, the name and the "2 left to read" line all drew; the coloured bar between them measured zero pixels tall and had never once been seen. It was built from inline text, and a height set on inline text is ignored by every browser.
- Paired with the first: **content now fades as it passes under the reader bar** instead of cutting off at a hard edge. A pinned table header paints over the fade rather than through it.
- Also, found while looking at the above: **"Save this page" no longer shows on a screen with no page.** It has been outside that rule since 0.43.0 and nobody could see it, because the only screen without a page was Home, which hides that whole bar.

### Tests

New suite `round2-destinations.test.js`, 62 checks, including the pair that keeps the table-header fix honest: the offset is zero **because** the bar is not drawn, so un-hiding the bar without restoring the offset goes red. Eight existing suites updated where behaviour deliberately changed, asserting the new intent rather than the new string. Two of them (`b2-home`, and the deploy checks in `release-integrity`) were already red on arrival from 0.49.1 and are green again.

---

## 0.49.1 — 2026-09-06

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`

*Quick pass, pre-1.0 revision. Three small fixes ahead of the 1.0 readiness check.*

- **First run's last tour step no longer names editing.** The "You, and your settings" callout described turning editing on, which a User-tier reader can't do and shouldn't be told about. Line now stops at the settings/walkthrough re-run mention.
- **"Open last note" removed from Settings.** It never controlled whether a note reopened, only whether the sidebar tree pre-expanded to it at boot — a confusing name for what is now unconditional behaviour, matching Home's own "Continue reading" door. The toggle, its listener and its persisted read are gone; the tree still expands to the last-read note on boot.
- **Home's "leave a comment on the page" line is plain text again.** It was wired to `chDoor('continue')` — clicking it opened Continue reading, not a comment composer, because no quick-comment flow exists yet (that's the 1.1 popup on the roadmap). Underline and click handler removed until that ships.

---

## 0.49.0 — 2026-09-05

**Changed:** `index.html`, `help.md`, `help-edit.md`; new `supporting/tests/p10-vault-check.test.js`; updated `supporting/tests/section18-shell.test.js`, `session2-reading.test.js` and `supporting/tests/README.md`

*P10. Vault check: content-quality checking behind the Admin door, a shared dismissal file, and one quiet notice for the reader.*

### The fourth tab

**Vault check** joins Review, Usage and Access inside Admin, gated at Administrator like the other two. The door on Home still opens at Contributor and its sub-line now names all four. Seven checks in three bands:

- **Hard failure** — a link that resolves to nothing.
- **Warning** — two pages covering the same ground; the same heading twice in one page.
- **Information** — a page nothing links to; a page nobody has touched in a year; a page long enough to be several pages.

A run reads every page through the search index that already exists, works everything out in the browser, and **stores nothing**. A stored result set would be wrong the moment somebody fixed a page.

### Two checks that already existed, counted rather than listed twice

A page with no author is already Review's **Missing properties**, and a page past its `due` date is already Review's **Due** list. Vault check reports the missing-author count as one row that opens Review, instead of drawing a second list of the same files. `Stale` is deliberately the different question nothing else asks: nobody has edited this page at all, whether or not a due date was ever set.

### Near-duplicate detection

Two passes, both over the search index: shared headings and close titles first, then body-term overlap. A pair has to clear both, or clear body terms alone by a wide margin. Pairs are named, never merged, and the list is capped so a first run on a large vault cannot bury everything else.

### Dismiss with a note

Some overlap is deliberate, so a dismissal **requires** a reason and is shared: it is written to `zSystem/vaultcheck.json` beside the vault list and the app settings, carries who wrote it and when, and the next person to run the check inherits it. A failed write dismisses nothing and says so. Dismissals can be brought back.

### What a reader sees

One quiet notice under the byline, on a page carrying a broken link, naming the link. It is worked out **live from that page's own text** rather than read off a stored run, which is what makes it right the moment the link is fixed, and it honours a dismissal — an admin saying "this one is fine" means it everywhere.

### The Admin slide got wider

Found by rendering it rather than by any check: at the 290px a companion pane gets, a vault-check row wrapped a page name onto three lines and the severity tallies onto two. The Admin slide alone now opens at 560px, because Admin is the one destination in there pretending to be a companion. Review and Usage get the room too.

---

## 0.48.0 — 2026-09-05

**Changed:** `index.html`; new `supporting/tests/p9-admin.test.js`; updated `supporting/tests/access-tiers.test.js`, `b2-home.test.js`, `install-setup-health.test.js`, `session-a-shell.test.js` and `supporting/tests/README.md`

*P9. The Admin screen goes in behind the tier, the S38 correction that put editing at Contributor gets reversed back to Administrator, and zero-result searches start logging.*

### New file, Move file, Edit — back to Administrator

S38 moved these to Contributor on the reasoning that Review and editing were "one rung" of trust. Real use said otherwise: Contributor is the review tier, not the change tier, and letting a Contributor create, move or rewrite a page put every one of them one click from doing something only an Administrator should undo. `editingAllowed()` now returns `atLeast('admin')` instead of `atLeast('contributor')`; `reviewAllowed()` — genuinely a different permission — is untouched, so Contributor keeps the review tools it already had. Edit follows New and Move's own rule while it's at it: **hidden, not greyed,** when the tier isn't there.

### Admin: one door, three tabs, gated individually

The ghost **Admin** door from B2 — always there, never clickable, "designed properly when the admin work lands" — is real now. Unlike the tools inside it, **the door itself opens for Contributor**: something has to be reachable below Administrator or a User has no way to see there's anywhere to climb toward, and the tier-climbing dropdown in Settings was never hidden for the same reason.

Inside, three tabs: **Review** (Contributor, since reviewing was always Contributor's own tool), **Usage** and **Access** (Administrator, locked with a plain "needs Administrator" message rather than removed). Vault-change and new-section items turned out to already live inside Review's own queue, not a separate destination, so the screen is three tabs, not the four the concept mockup carried.

Review and Usage are the same panes the old shell has always had, not copies — `renderAdminTab()` parks whichever tab isn't showing in `#beta-pane-park` and reparents the requested one into the tab body, so `getElementById('rp-review')` always resolves to one real node, never a rebuilt one. Access is new: a tier-password changer, deliberately separate from the tier-climbing dropdown in Settings, which keeps doing that one job. Usage's own path out of the account menu now opens through the Admin screen in the new shell, closes over Review in `BETA_MORE_TOOLS`, and the account-menu Usage item hides itself once the new shell is on, since Admin is where it lives there now.

### Zero-result searches start logging

Capture only, per the tracker — no viewer this session. Mirrors Usage Analytics' own shape exactly: buffered in memory and to `localStorage`, one file per person per month under `zSystem/SearchLog`, rewritten in full and merged by day+query on each flush rather than appended, flushed on `pagehide`. Hooked into both places a query can come back empty — the command palette and the docked search pane — behind the same 2-character floor both already enforce before searching at all.

**Tests:** 34 suites, **2,395 checks measured**, all green except the two pre-existing `usage-analytics` failures open since 0.43.0; `release-integrity` runs last, once the release itself exists. New: `p9-admin.test.js` (33 checks) — the tab lock re-evaluates on tier change rather than on last render, panes survive repeated tab switching without detaching, and the zero-result log's parse/serialize/merge round-trip. Four suites updated to the new intent per the project's own rule: `access-tiers.test.js` (the S38 reversal, New/Move/Edit hidden below Administrator again), `b2-home.test.js` (Admin door is live, not a ghost), `install-setup-health.test.js` (Usage's path through Admin in the new shell), and `session-a-shell.test.js` (Review left `BETA_MORE_TOOLS`, Contributor no longer sees Review or Edit there).

---

## 0.47.0 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/b2-home.test.js`, `reconnect-vault.test.js`, `saved-list.test.js`, `section18-shell.test.js` and `supporting/tests/README.md`

*Quick pass — four small asks handled ahead of P9, plus one thing a render caught that none of the four asked for.*

### Browse the vault takes a default page

Settings gains **Default page** (Admin only), the same `<select>`-from-`allMdFiles()` shape as Move file rather than a new picker. Set it and **Browse the vault** opens straight to that page, app-wide, for everyone, with a light-grey **(Default)** tag on the door so it's visible without saying how many pages the vault holds. Leave it unset and Browse still opens the tree, exactly as before.

### Saved becomes a flyout off the door

Saved no longer leaves Home for the full slide-over. It opens a small anchored flyout instead — capped, scrollable, with **See everything saved** through to the full pane for anything that doesn't fit. Reuses `betaAnchorPanel()` (generalized from the search palette's own anchoring, jsdom-zero-rect fallback included) rather than a second positioning system.

### File and section, one line

What's New and Recently opened both used to stack a file above its changed sections or its folder. Both now read on one line — file, then section or folder, ellipsis if it doesn't fit — on the full What's New page and on Home's own What's New and Recently opened lists.

### Saved rows: file, then section, colour-coded

Saved drops its header-plus-children shape for one flat row per save — file name, then a colour-coded dot (accent for a whole page, muted for a section) and the section title when there is one, nothing extra when there isn't. One renderer, `savedItemRowHTML()`, feeds the new flyout, the full Saved pane, *and* — found only by rendering Home and looking, not by reasoning about the diff — **Home's own Saved rail**, which the first three surfaces missed and was still drawing the old grouped markup. All three now read alike.

Two bugs the render pass also caught and fixed on the way: the new Default-page modal had no CSS at all (`#dp-overlay`/`#dp-modal` were never joined to the shared `#create-overlay, #move-overlay` / `#create-modal, #move-modal` rules, so it rendered as an unstyled block at the foot of the page instead of a centered dialog), and the harness itself needed `exitConsoleHome()` to see the full What's New page at all — a gap in the test setup, not the app.

**Tests:** 34 suites, **2,384 checks measured**, all green except the two pre-existing `usage-analytics` failures open since 0.43.0. Four suites updated to the new intent rather than the new strings, per the project's own rule: `b2-home.test.js` (Home's Saved rail is flat rows now, not grouped), `saved-list.test.js` (the full pane's per-row markup), `section18-shell.test.js` (Browse's default-page branch, Saved's flyout), and `reconnect-vault.test.js` (seven dropdown items, not six, with Default page added).

---

## 0.46.0 — 2026-09-05

**Changed:** `index.html`; new `supporting/tests/b2-home.test.js`; updated `supporting/tests/multi-vault.test.js`, `section18-shell.test.js`, `session-b-shell.test.js`, `session-d-fixes.test.js` and `supporting/tests/README.md`

*Session B2. The Home screen rebuilt around one width, and the right column given a rule that removes four separate reports at once.*

### Home is one width, not four

The landing stacked four measures inside one page: the heading and its note at 34rem, the search button at 34rem, the two lists at 790px and the doors at 790px, all inside a 940px column. Nothing lined up with anything, which is what read as unfinished. Every element is now full width or a declared share of it.

The opening paragraph runs the full width in two shorter blocks, and carries one underlined action, **leave a comment on the page**, because a wiki nobody corrects goes stale and commenting is the correction path.

### Vaults moved up, doors rebuilt

The vault chips sit directly under the search now, where they answer "what am I looking at" before anything else on the page asks for attention. A vault that is listed but not on this machine is clickable and **explains what is missing rather than pretending it can reconnect** — in phase 1 every vault lives inside the one folder already granted, so there is nothing separate to reconnect. At phase 2, when each vault has its own grant, that same click becomes the reconnect and the markup does not change. A greyed **+ Connect a vault** advertises that phase rather than hiding it.

Six doors in six equal cells. **Browse the vault was one door doing two jobs**, so **Continue reading** took the second one: it opens the last page you had open, which survives closing the browser or the app, and Browse keeps the tree. Every door carries live state under its name except **How Folio works**, which has none to carry. **Admin** occupies a cell as a greyed placeholder, so the widths are identical whether or not you are an admin; it gets designed properly when the admin work lands.

### Two panels, and what you owe

Left is the vault, what changed and what you were reading. Right is you. Both stretch to one height, which is what stops the screen looking lopsided.

**Must read** and **Onboarding** meters, both reading numbers Folio already stored — the frontmatter tags plus what this device has seen — so nothing new is written anywhere. They expand on a click, they hide themselves when there is nothing owed, and they come back the moment something arrives. **They never read zero while they are showing**: onboarding counts the setup already finished at first run, must-read counts against everything ever assigned rather than what is outstanding, and the fill has a floor so a real but tiny fraction still draws.

**Saved is grouped.** Sections nest under the page they were taken from, which is how the data was always stored — the flat list this replaces was the wrong drawing of it. Whole-page saves are marked, and Show all expands in place rather than sending you somewhere else to read four more rows.

### The search panel lands on the bar

Jayson: *"it opens a window below the search to type, defeating the purpose of the search bar."* Correct, and the cause was geometry rather than machinery. The header search is a button, and the panel opened at a fixed point 60 pixels down the screen no matter what summoned it, which put it just under the bar — carrying an input of its own. Two boxes doing one job.

The panel is now measured onto whatever opened it: same left, same top, same width, so the bar reads as having expanded. Home's full-width search gets the same treatment, which is why nothing on that page is pushed down any more. Ctrl+K and anything with no measurable anchor fall back to the centred panel as before.

### The right column: companions and destinations

One rule settles four reports. **A page companion describes the page you are reading and belongs beside it. A vault destination is a place you go.** Outline, Comments and Backlinks are companions and now share the right column, one at a time, with a tab strip that appears only when there is a choice. Comments and Backlinks are summoned from the page tools and **leave the moment a different page opens**, so a pane can no longer sit over the next file describing the last one.

Everything still using the slide-over — Saved, Review, Usage, search results — now **stands the companion column down instead of covering it**, and closes itself on navigation.

The column is drawn only when it has something to show. No "open a page to see its outline" message, and no manual toggle.

### A file:// failure says so

`loadAppDoc()` detects that Folio was opened straight off the disk, where a browser will not let a page fetch another file at all, and says that. It was telling people the file had been left out of a push while the file sat beside `index.html`. Same lesson as 0.45.5, one layer further down.

### Fixed while looking rather than measuring

The "Later" tag inside the Admin door stretched edge to edge, drawing its border as a rule under the word, because a door is a column flex container. Timestamps in Recently opened wrapped to two lines and pulled their rows out of alignment. Both were invisible to every check in the suite and obvious in a render.

**Tests:** 34 suites, **2,380 checks measured**, all green except the two pre-existing `usage-analytics` failures open since 0.43.0. `b2-home.test.js` carries revert checks for the three mechanisms that can regress without a symptom: the palette's anchor, the companion routing, and the reset on navigation. Two real regressions were caught by the sweep and fixed — `openConsoleHome()` reset the column before the old-shell guard rather than after it, and the walkthrough's Comments callout still anchored to the slide-over, which `frTourRect()` would have dropped silently.

---

## 0.45.5 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/help-split.test.js`, `supporting/tests/walkthrough.test.js` and `supporting/tests/session2-reading.test.js`

*The last of Jayson's walkthrough notes, plus the real reason two of his reports could not be acted on.*

### Comments marks the button, not the column

Ringing the whole Outline column as a secondary marker read as noise beside the one real subject. The panel keeps the spotlight, the button that opens it keeps its marker, and the copy still says the per-heading counts appear in the Outline.

### Help and the changelog now say what actually went wrong

Jayson reported the full guide and the Help button broken twice, and neither report could be acted on from what the app said, because the app said the same thing for every possible failure: *"Help file not found. Add help.md to the app folder."* That is a guess, not a diagnosis, and it was wrong in two different ways.

**The fetch and the render were inside one `try`.** A file that downloaded perfectly and then failed to render was reported as missing — sending you to look in the folder, where the file was sitting exactly where it should be. And a genuine 404 never said **which address** it had tried, so a wrong path looked identical to a missing file.

Both docs load through one function now. Fetch and parse are separate, the fallback to a copy in the connected folder is tried only on a real fetch failure, and the message names the status the server gave and the exact address tried. A render failure says so plainly and says the file is where it should be. **The app can now tell you which of the two it is, from the screen, without anybody having to guess at it from a distance.**

### Also

A test that pinned a literal slab of source (including a message that happened to sit near the call it cared about) went red for a refactor that did not change the behaviour it was testing. Rewritten to assert the order it actually cares about, which is this project's own standing rule.

### Verification

33 suites, 2,293 checks measured, all green except the two pre-existing `usage-analytics.test.js` failures open since S66. Reconnect smoke 8 of 8. New checks cover the status and address appearing in a failed load, and that a render failure is never reported as a missing file.

---

## 0.45.4 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/walkthrough.test.js`

*Jayson's fourth review pass on the walkthrough: the tour order, and tying the three places comments live into one step.*

### The order walks the app now

It used to walk the code. New order: the top bar, then the left column, then the page you are reading, then the right column, then the account cluster **last**, because it is the one step that is not about reading the vault.

**Comments moved to ninth, after everything that mentions commenting has been introduced** — the button in the page tools, the comment entry in the section tools, and the per-heading counts in the Outline. The panel now arrives as the place all three lead to, instead of appearing before any of them.

Two of those positions are load-bearing rather than taste, so the suite pins them: comments after section tools and after the Outline, and the account cluster last.

### One callout, three places

The Comments step now marks all three at once. The panel is the subject and keeps the spotlight; **the button that opens it and the Outline column that counts them per heading get their own dashed markers**, so the link between them is something you see rather than something you read.

This also answers where the standalone Comments-button callout went: it is not gone, it is part of this step. Pointing at the button on its own, several steps before the panel it opens, was the thing that read as disconnected.

Secondary markers are deliberately drawn without the dimming spread the main ring carries — a second element with a full-screen shadow would simply re-cover the first one's hole. They are outlines over the dim instead, which reads as "and here, and here" rather than as a competing subject. A marker whose element is missing or collapsed is skipped rather than drawn at zero size; unlike a callout, a marker is allowed to fail quiet.

### Verification

33 suites, 2,287 checks measured, all green except the two pre-existing `usage-analytics.test.js` failures open since S66. Reconnect smoke 8 of 8.

---

## 0.45.3 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/walkthrough.test.js` and `supporting/tests/p8-first-run.test.js`

*Jayson's third review pass. Four notes, all taken. The biggest of them turns the walkthrough from a fixed six screens into a run that only asks for what this machine has not already got.*

### A run only asks what it needs to

The health check is no longer a screen you read, it is the shape of the run. Connected, identified and installed each drop their own screen. A fresh device fails all three and walks the full six. **A replay on a set-up, installed machine gets welcome, the tour and the last screen, and nothing it can already answer for itself.**

The list is computed once when a run starts and held on the run, never recomputed per screen — connecting on screen 2 would otherwise delete screen 2 from under itself and renumber everything after it. Nothing in the flow names the next screen directly any more; each button asks the run what comes next, which is what lets a screen be dropped without every other screen needing to know.

### The install screen installs

It used to describe the action and hand it off, which made a screen out of a sentence. The button is on the screen now and it is always there, whether or not the browser offers a one-click prompt — `tryInstall()` already picks between the native prompt and the written steps, so there is still one install path and no second copy of the decision.

**Choose Not now and the banner goes away for the rest of the run.** It was sitting over the tour repeating an offer that had just been turned down. This is not a dismissal: nothing is stored, and the next launch offers again exactly as before.

### Section tools, laid out wide

The callout was tall enough to dominate the screen, so the ringed buttons it was describing got lost behind it. That step now draws its four tools as columns in a short, wide panel placed under the heading, leaving the highlight above it in plain sight.

### Comments opens the panel

Rather than describing a panel, the step opens it, rings it, and explains it: what it is for, that a comment can be anchored to the whole page or one heading, and that comments are questions and corrections rather than edits. It opens through the button's own action, so the tour cannot drift from what the button does, and it always closes again — a panel the tour opened is never left behind on the app.

That needed a general mechanism, and it caught the same silent bug a third time: a step that opens its own target measures zero when the tour is deciding which callouts to run, so it was quietly dropped. Steps that open their own target are now trusted through that filter.

### Verification

33 suites, 2,279 checks measured, all green except the two pre-existing `usage-analytics.test.js` failures open since S66. Reconnect smoke 8 of 8. The suites now assert the three skip rules and their exact resulting sequences, that the run's screen list is fixed at the start rather than recomputed, that the install action is offered with or without a native prompt, that declining hides the banner without dismissing it and that it returns when the run ends, and that a self-opening step survives the callout filter.

---

## 0.45.2 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/walkthrough.test.js`

*Jayson's second review pass on the walkthrough. Four notes, all taken, plus one correction of mine.*

### The help page is the backdrop again

He asked for it twice, and he is right: an arbitrary file out of a live vault is not what a brand-new reader should be shown first. 0.45.1 had moved off help for a real reason — opening help clears the active page, and the app hides Copy link, Save, Comments and More whenever that is true, so the backdrop was hiding the very tools the tour teaches.

That is now solved directly rather than by changing the backdrop. **`body.fr-touring` holds those four open for the length of the tour** and comes off the moment it ends. This is honest rather than a mock-up: the tour overlay swallows every click, so nothing in the app is operable while it is up. The tour is a diagram of the interface, and a diagram has to show the parts. A vault page survives only as a rescue, used when help genuinely will not render — which is what happened on his machine.

### Section tools, one step, drawn

Hovering any heading reveals four buttons on the heading itself, and the tour never mentioned them. They get one step with a legend: the real icon beside what each one does, lifted out of the buttons themselves at render so the picture cannot drift from the interface.

Two of the four — **comment on this section** and **highlight** — are built as visibly disabled buttons rather than left out, so the tour says **Not built yet** on those two rather than implying they work or pretending they do not exist. The comment row points at the way to do it today instead.

Those tools are hover-only by design, and there is nothing to hover during a tour that eats clicks, so they are held open the same way the page tools are.

### The other two places you can save from

The Save step now says there are three: the page button itself, the save button on any heading, and the one on every row of the Outline. The Outline step names its own.

### You and Settings are one stop

They were two callouts on the same button. Now one, with two paragraphs.

### Verification

33 suites, 2,270 checks measured, all green except the two pre-existing `usage-analytics.test.js` failures open since S66. Reconnect smoke 8 of 8. `walkthrough.test.js` gained the section-tools legend checks, including that exactly two rows are marked not built and that those two are the same two the app itself ships disabled — so the tour cannot quietly start promising a feature that has not landed. It also pins the backdrop ordering (help first, vault page as rescue) and the two forcing rules, and it now measures visibility in the state the tour actually runs in rather than a boot state no real run ever sees.

---

## 0.45.1 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/walkthrough.test.js`

*Jayson's review pass on 0.45.0, same day. Four notes, all taken. The one that mattered explains two of the others.*

### The tour was pointing at the wrong backdrop, and it cost four callouts

Jayson reported Help, Comments, Copy link and Save missing from the tour, and the Outline missing too, and separately that the help page said it could not be found. Those are one problem, not three.

Copy link, Save and Comments are hidden whenever no real page is open — the reader header has nothing to copy, save or comment on, so it hides them. **The help page is exactly that state:** opening it clears the active page. So opening help behind the tour hid three of the very buttons the tour exists to teach, and the zero-size filter dropped them without saying a word. When help failed to load on top of that, the Outline had no headings either, the right column auto-collapsed, and that callout went the same way. **The tour reported itself as running normally throughout.**

**The backdrop is now a real vault page**, chosen from what boot has already listed (no extra directory reads), preferring one whose headings give the Outline something to show. `help.md` is kept only as the last resort. The Help *callout* still points at the help button in the header, and the last screen still offers the full guide, so nothing Jayson asked for on the first pass is lost.

### Four callouts added

The tour is twelve now: Home, Search, the vault tree, Back and forward, **Copy link**, **Save**, **Comments**, Outline, light and dark, **Help**, you, and Settings.

### The install screen points at the real banner

It described a banner the opaque welcome overlay was covering. On that screen the overlay now turns see-through, the real banner is ringed exactly the way the tour rings a control, and the card gets a ground of its own so the dimmed app does not read through it. An already-installed app has no banner, and the ring clears itself rather than highlighting nothing.

### Screen 1 trimmed

The line counting the screens is gone.

### Verification

33 suites, 2,252 checks measured, all green except the two pre-existing `usage-analytics.test.js` failures open since S66. Reconnect smoke 8 of 8. `walkthrough.test.js` gained the four new callouts, a check that the buttons behind the backdrop decision really are hidden with no page open (so the rule cannot rot), a check that the tour opens a real page with help only as a fallback, and six checks on the install spotlight including that it declines to ring an absent banner.

---

## 0.45.0 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/p8-first-run.test.js` (rewritten for the six-screen flow) and added `supporting/tests/walkthrough.test.js`

*The first run, rebuilt. Three reported bugs fixed first, then the flow itself grew from three screens to six with a guided tour, and gained a way to run it again from Settings. New shell only; the frozen old shell keeps its own connect message in the file tree, untouched.*

### Three bugs in the old flow, all fixed

**The top bar painted over the welcome screen.** `#header` sits at `z-index: 100` and the welcome overlay was at `55`, and both are direct children of `<body>`, so the whole header stayed visible and clickable on top of a screen that was meant to be the only thing on it. Clicking Home or search there drove the app *behind* an overlay that never moved, which reads as the app being broken and refusing to connect. The overlay is now at `300`, above the header and above the header-anchored dropdowns.

**The returning-device answer was computed and dropped.** The flow worked out whether this device already had a remembered folder, handed the answer to screen 1, and screen 1's own button called screen 2 with no argument at all. So a device with a folder already remembered was sent through the full operating-system folder chooser on every launch instead of the one-click re-grant that was already built and never rendered. The flow's context now lives on the flow (`firstRunCtx`) rather than being passed screen to screen, which also keeps values out of the inline handler strings.

**There was no returning path at all.** The flow only skipped itself when the browser still held the folder permission, and off an installed app a browser drops that permission every launch, so essentially every launch fell through to "1 of 3 · Welcome". A known device with a lapsed permission now goes straight to a single Reconnect screen: no welcome, no step counter, and no repeat of install or identity afterwards.

### The walkthrough, six screens

1. **Welcome** — what Folio is and what it is for, in plain terms.
2. **Connect** — points at the team lead for which folder to choose and how to get it syncing, and says one folder is all it needs for now. Names no folder and no company: the Pages repo is public and everything before the folder gate is world-readable.
3. **Who you are** — name and email drawn into the card rather than the account-setup modal popping over it, so all six screens read as one thing. The save is that modal's own function, lifted out and shared rather than copied, and the account menu still opens the modal for editing later.
4. **Install** — with Later, and a note that the banner keeps offering. Aware of an already-installed app.
5. **The tour** — its own overlay over the real interface, with the help page opened behind it so the reading column, the Outline and the back/forward arrows actually exist to point at. Eight callouts: Home, Search, the vault tree, Back and forward, Outline, light and dark, you, and Settings. One at a time, with Back, Next and Skip tour.
6. **All set** — with a way into the full guide instead of Home.

Every callout anchors to a real control rather than a drawing of one, so the tour cannot fall out of date the next time the layout moves. Anything measuring zero is dropped from the run rather than pointed at. A callout on a whole column puts its bubble beside that column instead of on top of it.

### Run it again, from Settings

**Settings → New look → Walkthrough → Run again.** It checks setup health first, reading the same three checks the account menu already shows, so there is one definition of "is this machine set up" in the app rather than two. Installed is reported but never counts as a failure: a browser tab is a supported state.

A healthy machine replays straight away with nothing to answer, and each screen is aware of what is already true — a replay says "Already connected" rather than asking for the folder again. A failing check stops and reports what is wrong, then offers a replay or a full reset. **Folio never takes the reset on its own judgement:** it drops the folder connection, and doing that on a guess costs more than the problem it would fix. A reset forgets the remembered folder and the name and email on this computer only, and touches nothing in the vault.

### Verification

33 suites, 2,239 checks measured, plus the reconnect smoke at 8 of 8, all green except the two pre-existing `usage-analytics.test.js` failures open since S66 (confirmed unrelated again). `p8-first-run.test.js` was rewritten to assert the new intent rather than the old strings. The new `walkthrough.test.js` carries a revert test for each of the three bugs — putting any one of them back turns it red — plus a check that no callout points at something the new shell hides, which is the trap the first version of the tour fell into.

---

## 0.44.2 — 2026-09-05

**Changed:** `index.html`; updated `supporting/tests/whats-new.test.js` (a coincidental string match, no behavior change) and `supporting/tests/review-dashboard.test.js` (now asserts the reversed Fill properties behavior below)

*Bug-fix pass, items 2 to 4 of 4 (B1b). New shell only. Item 1 shipped as 0.44.1. The one open layout question the pass surfaced, a real show/hide control for the right column, is carried into the dedicated B2 layout session rather than built here.*

### Outline column auto-hides when it has nothing to show

The right column is hardwired to Outline in the new shell and nothing ever closed it, so it sat open at full width on What's New, on Home, and on any page with no headings. There is also no manual toggle for this column anywhere in the new shell today (the resize handle and rail that would do it are both hidden by the shell's own CSS), so this is an automatic fix rather than a control: the column now collapses on its own the moment Outline has nothing to render, and the reading column takes the freed space. It reopens the moment a page with headings is active. What's New also gets its own message ("No outline for What's New") instead of the generic "Open a file" text.

### Saved slide-over stopped going stale while open

The refresh checks that repaint an already-open Saved list only ever looked at `state.docks`, and the Saved slide-over never touches `state.docks`, it moves the pane into its own overlay instead. So a save or removal made anywhere else in the app never showed up in an already-open Saved list, only at the moment it was reopened. That read as "I can add but not remove," which was the wrong diagnosis: the S18 session 3 call to remove only from where you saved stands unchanged, this was a refresh bug sitting on top of it.

### Properties flyout gained must-read and onboarding; Fill properties stopped guessing false

The flyout was missing the two newest optional properties entirely, editable nowhere except by hand-editing frontmatter or running Fill properties. Both are now checkboxes in the panel, wired the same way Reviewed already is.

Fill properties also stopped writing `must-read: false` / `onboarding: false` on every file it touches. These two are an editorial call an admin makes deliberately on the handful of pages that need them, not a value every page in the vault is expected to hold an opinion on, and absence already reads as false everywhere the app checks them. Stamping `false` on write only made "never considered" and "deliberately not a must-read" look identical. Since a fill can no longer close that gap, the Review dashboard's Missing properties check no longer counts these two against a file, it now gates only on status, reviewed, created, author, tags, aliases and due. They are still listed as gaps on any file already flagged for another reason.

## 0.44.1 — 2026-09-05

**Changed:** `index.html`, one new test suite (`supporting/tests/home-isolation.test.js`)

*Bug-fix pass, item 1 of 4: on Home, only Home shows. New shell only. Items 2 to 4 of the pass (the Outline column's own visibility, the Saved slide-over refresh, and the Properties/Review audit) are defined and queued, not built.*

### The two side columns stayed on Home

Pressing Home left the Vault Files column and the Outline column standing on either side of the landing page. The rule that collapses them has been there since Section 18 session 1 and was correct; it was being overridden. `setPanelOpen()` writes `width` and `min-width` INLINE every time a panel opens, since that is where a saved width is restored, and an inline value beats a plain stylesheet rule no matter how specific it is. So opening either panel once, anywhere in a session, left it on Home from then on. Fixed with `!important`, which the `#reader-content` rule two declarations below has carried since day one for the identical reason.

### The review bottom stack followed you Home

A review walk in progress kept its bar pinned below the landing page — "Reviewing from the dashboard, item 3 of 17" on a screen with nothing being reviewed. All six surfaces of that stack (walk bar, diff bar, diff strip, audit bar, detail bar, detail strip) are now hidden on Home. Hidden, not exited: the walk keeps its position and comes back the moment a page is open again, so pressing Home never costs anyone their place in the queue.

### The Outline held the last page's headings

Nothing on the `openConsoleHome()` path re-rendered the Outline pane, so it kept whatever the previous page put there, heading count and all. It now repaints to its own empty state, which is what `state.activeUrl` being null already meant.

The old shell is untouched: every rule involved is scoped to `.beta-shell`, and `openConsoleHome()` still refuses to run when the new layout is off.

---

## 0.44.0 — 2026-09-05

**Changed:** `index.html`, one new test suite (`supporting/tests/p8-first-run.test.js`), one pinned (`supporting/tests/theme.test.js`, now explicitly `setBetaShell(false)` — see its own comment)

*P8, Section 18 session 4: theme cut to five, and the three-screen first-run flow. Old shell untouched and frozen throughout — both changes are new-shell-only, gated on `betaShellOn()`.*

### Theme panel cut to five, new shell only

The beta shell's Theme panel now shows exactly five controls: Mode (dark/light/system, unchanged), Preset (Things and Minimal only — the other six, Default/Ocean/Frost/Clay/Mica/Marble, were exploration that never made it into the locked project spec), Reading width, Text size, and Line spacing. Accent, body font, the full Headings editor (six colors, caps, underlines, scale), Navigation icons, Interface chrome and Share are all gone from the beta panel, frozen at today's shipped defaults — nobody's current look changes, only the ability to change those six things going forward. The old shell keeps the complete six-section panel exactly as it has always worked; `theme.test.js`'s 136 checks are pinned to `setBetaShell(false)` to keep testing that panel specifically, and a new `p8-first-run.test.js` covers the cut.

The **Show page title** toggle, previously buried in the now-gone Headings section, moves to Settings → New look (visible only when the new layout is on); still off by default. The header's light/dark toggle is brightened at rest — two people independently missed it entirely because every header icon shared one muted tone.

### Three-screen first-run flow, new shell only

Replaces three separate, disconnected first-run touches — a connect message drawn inside the file tree like a status line, an ambient install icon nobody was ever pointed at, and an identity modal that could appear with no warning — with one full-window sequence: what this is, connect, install, then identity. Connect and install and identity are not rebuilt; the flow calls the exact same `pickLocalVault()`/`reopenLocalVault()`, `tryInstall()` and `checkIdentity()` this app already shipped, it only owns the order. Pre-connect copy names no vault or company specifics on purpose — the Pages repo is public. A returning device with an already-granted folder permission skips the whole flow, same as today. A hashed setup code unlocking a more detailed version of this screen was considered and deliberately not built — obfuscation, not security, solving a problem this team size doesn't have.

### Still open

`release.sh` still cannot run on this mount, packaged by hand again. The Session 62 opens not covered here — the zero-result search log (P9's) and fold behaviour (never tied to a specific session) — are unchanged; help figures are stale against this release and are due a reshoot now that P8 has shipped, not before.

---

## 0.43.0 — 2026-09-05

**Changed:** `index.html`, one new test suite (`supporting/tests/comment-anchor.test.js`), one more (`supporting/tests/saved-list.test.js`), plus updates to `session-a-shell.test.js`, `session-b-shell.test.js`, `session-d-fixes.test.js` and `rename-and-trim.test.js` for the new shapes below

*P7, Section 18 session 3: Comments and Saved. Section-anchored comment threads with a live count, and one Saved list holding page rows and section rows, which retires the favourites/bookmarks split.*

### Comments can be anchored to a section

A comment optionally carries the heading it was posted against (`hid`, additive — a pre-P7 `.comments.md` with no `hid` anywhere still parses and re-serializes byte for byte). The composer shows exactly where the next comment will land — the heading in view, or an explicit override — with one link to change it. The Outline gets a small comment-count badge per heading, open comments only, shown only when there's at least one. The reader-head Comments badge, which used to read the vault-wide count by mistake, now reads this page's own open total.

### One Saved list, not two

Bookmarks and Favourites are gone; both were always heading-scoped, and neither had a way to save a whole page. Saved replaces them: a **Save this page** button joins Copy link and Comments in the reader head, and the Outline's bookmark toggle now saves a section into the same list. "Pinned" is not a third action — it's simply what a page with a whole-page save looks like once it's listed, so a page can never appear twice. No manual order, no groups, no rename: every row is a plain label, added or removed at its source (the page itself, or the Outline), never from the list — see `supporting/p7-saved-list-sample.html` for the four rounds of review that got here. An existing bookmark becomes a saved section; an existing favourite becomes a saved section **and** marks its page saved-as-a-whole (that's what promotes it to Pinned) — its custom name is dropped, the heading text takes over.

## 0.42.0 — 2026-09-04

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`, one new test suite (`supporting/tests/multi-vault.test.js`)

*Folio can now read more than one vault. Nothing changes until a list of vaults is added to the vault, which is what lets this ship on one day and the folders move on another.*

### More than one vault

A vault is now a named thing rather than just the folder Folio was pointed at. The list lives in the vault itself, at `zSystem/vaults.json`, so an administrator publishes it once and it reaches everybody the way the pages do. **With no such file nothing changes at all** — one vault, one tree, no group headers, exactly as before.

Once the list is there, each vault is a top-level folder inside the folder that is already connected. **Nobody reconnects anything and the browser is never asked for a new folder.** Later, after 1.0, the same names can point at links of their own instead; a vault listed with a link that does not work yet is shown as coming rather than hidden, and is never searched.

### Search covers every vault at once

Results group under the vault they came from, in vault-name order, and **the ranking inside a group is unchanged**: pages whose name matches first, then pages whose text matches, with the line they matched on. Rows now name the folder inside the vault, because the group header says which vault and two vaults can hold a page with the same name. A vault that is not connected yet says so under the results rather than quietly not being there.

### The tree, the breadcrumb and the page strap say which vault

The vault is the tree's top level and its own folder row disappears. **Anything the list does not name is still shown, under General**, so a folder nobody thought to list can never vanish. The breadcrumb's first crumb is the vault, and the strap at the top of a page names it too.

### Links that were sent before any of this still work

An address written when the vault was flat no longer matches once the pages move, so **an address that does not resolve is retried inside each vault, and then by page name**. Links already pasted into chats keep opening the right page, and nobody is told anything.

### One banner, and install is the loud one

The new look has a single banner slot under the header with three states and a strict order: **connect beats install beats update**. Install is full width, because without it your browser asks permission for the folder on every single launch, and that is what the banner says rather than "install the app". Connect is the same size in a warning tone. An available update stays the small line it was. **Not now** hides the install banner until the next launch, never for good.

### Settings lists the vaults

Read only: what Folio is reading, and where each one comes from. The list is a file in the vault, so it is edited there rather than per person.

### Wiki became Folio

The app and both help pages now say Folio or the vault rather than "the wiki". `wikilink` is unchanged — that is Obsidian's word for a `[[link]]` and the vault is shared with Obsidian.

---

## 0.41.1 — 2026-09-04

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`, one test suite updated (`supporting/tests/section18-shell.test.js`)

*Jayson's first pass over 0.41.0, six notes. Polish and cuts, plus one real bug that turned out to be older than this session, so a patch rather than a minor.*

### The landing is centred

It was anchored to the left edge, which read as a fragment of a page rather than a front door, and left the right half of a wide screen empty. It now sits in the middle of the window with more room above it.

### Install and Update sit on the right again

Both buttons had been landing on the **left** of the header, next to Home, whenever they appeared. The account cluster was being pushed to the right edge by a margin hung on the theme button, which only worked while that button was the first one in the cluster; Install and Update come before it and are hidden until they are relevant, so the moment either showed up it fell on the wrong side of the gap. A spacer now holds the cluster to the right edge, and it does not care which icons are visible. **This has been wrong since Install shipped in 0.39.0**, not since this session.

### One bar instead of three

The page header no longer draws a rule under itself or a tone of its own, so it sits on the page rather than dividing it. **Copy link and Comments are icons now**, each naming itself on hover, with the comment count still showing beside its icon because the count is the half that does the work. The panel show-and-hide button is gone: the panel flexes with the window, so there was nothing left for it to fix.

**The you-are-here section bar (0.40.0) retires in the new look.** The breadcrumb sits directly above it naming the same page, so it was a third bar saying most of what the second one already said. It stays in the old look, which has no breadcrumb of its own and still earns it.

### Copy link finally tells you it worked

The confirmation after a copy called a function that does not exist anywhere in the app and never has. The copy itself always worked, but the confirmation failed silently inside a promise, so **Copy link has produced no feedback at all since 0.36.0**. It now shows a brief confirmation that says whether a page link or a section link was copied. Found while making the button an icon, where the absence of any feedback would have been worse.

---

## 0.41.0 — 2026-09-04

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`, one new test suite (`supporting/tests/section18-shell.test.js`), two existing suites updated (`session-a-shell`, `session2-reading`)

*Session 1 of Section 18, the console shell. Folio now has a front door. New capability, hence a minor bump. The old look is untouched and still opens exactly as it did.*

### Home is a console

Pressing **Home** now lands on a landing page instead of What's New: a headline, one search box, the connected vault, two short lists — what you opened recently and what changed in the vault — and four doors: browse, saved, what's new, and how Folio works. It shows no folder rail, no side panel and no page header, so arriving deliberately does not look like reading.

Everything on it opens something that already existed. The search box is the same palette the top bar opens, with the same favourites and recent list inside it. Saved opens the favourites and bookmarks pane. What's new opens the surface built in 0.23.0. Nothing behind the landing is a second copy of anything.

Opening the app with no link now lands here rather than reopening the last page you read, because the last page is one click away in Recently opened and the vault is not. **A link still beats everything**, unchanged since 0.36.0: follow an address to a page and you get that page.

### Three columns, and no lines between them

Away from home, the app is folder rail, page, side panel. The hairlines between those three columns are gone: each column already sits at its own background tone, so the line was the same boundary drawn twice.

**Columns are fixed now, so the two drag handles retire in the new look.** Neither job is lost. The rail's show and hide moves to a button at the far left of the top bar, and the panel's to a button in the page header beside Comments. The side panel also stops being a fixed 220 pixels: it takes a share of the window, with a floor so it can never squeeze to nothing and a ceiling so it can never end up wider than the page you are reading.

### A summary line above the page strap

The byline from 0.40.0 becomes a ruled strap, and gains the date the page was last updated, read from the index the app already maintains rather than a fresh look at the disk. Above it, a page can now carry a one-line **summary**, written as `summary:` (or `description:`) in its properties. A page without one renders nothing, exactly as the byline already behaved. Neither key has been added to the declared property schema; the app reads it if it is there.

---

## 0.40.0 — 2026-08-31

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`, one new test suite (`supporting/tests/session2-reading.test.js`)

*Session 2 of the six agreed at the UX review (see the tracker's Road to 1.0). Four reading-column pieces, all reaching both shells at once: a byline under the title, a "you are here" section bar, table headers that pin while you scroll through them, and column alignment. New capability, hence a minor bump.*

### A byline under every title

The title now carries a line naming the page's **owner** (the existing `author` property) and, if a **due** date is set, a status flag — green for on schedule, amber for due soon (within 14 days), red for overdue. Reuses the vault's existing property schema and the exact `due < today` comparison the vault-wide Due list already used; nothing new to fill in unless a page wants to opt in to being tracked this way. A page with neither field renders no byline at all.

### A "you are here" bar while you scroll

A thin bar under the header tracks whichever heading you're currently reading, in both shells, so a long page never leaves you unsure where you are. Its own `IntersectionObserver`, independent of the Outline panel's — the Outline's only exists while that panel is open, and this needed to work whether or not anyone ever opens it.

### Table headers that pin, and stop clipping when they do

A table's header row now stays visible while you scroll through it and releases on its own once you pass the last row — no setting, it's just how a sticky header behaves inside its own scroll container. Fixed two things found only by looking at the rendered result, not by reading the CSS: `.md-table-wrap`'s `overflow-x: auto` was forcing the wrapper into being its own vertical scrollport (a table only gets horizontal scroll now if it's actually measured wider than its column), and `border-collapse: collapse` was painting a visible seam on the sticky header during a scroll in Chromium (switched to `border-collapse: separate`, invisible at rest since this table only ever draws bottom borders).

### Column alignment

The table separator row's `:---`, `:---:`, and `---:` syntax — always accepted, always silently discarded — is now read and applied. Same syntax Obsidian itself uses; nothing changes about how a table is written, including the padding-with-extra-dashes habit already documented as surviving unaffected.

---

## 0.39.0 — 2026-08-30

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`, one new test suite (`supporting/tests/install-setup-health.test.js`), four existing suites updated for the new default (`supporting/tests/session-a-shell.test.js`, `docks.test.js`, `reconnect-vault.test.js`, `fold-consolidation.test.js` unchanged, resolved by this entry)

*Session 1 of the six agreed at the UX review (see the tracker's Road to 1.0). Four pieces, all reached from the account menu: the install offer itself, a new-look default for anyone with nothing stored, a setup health row, and a way into Usage from the beta shell, which had none. New capability, hence a minor bump.*

### Folio can now offer to install itself

Nothing before this handled the browser's install signal at all — the manifest and service worker shipped complete and were never offered. There's now an icon in the header, next to the dark/light toggle, and a matching item in the account menu; both call the same `tryInstall()`. Where the browser offers a native prompt (Chrome, Edge), it's used directly. Where it doesn't — Firefox never fires the event, and Safari can't run Folio at all without the File System Access API — the click opens help.md's own "Installing it" section instead, which already documented the browser's own address-bar route. Both icons hide themselves the moment `isInstalled()` (`display-mode: standalone`, or `navigator.standalone` on old iOS Safari) reads true.

`isInstalled()` fails closed if `matchMedia` itself is missing or throws — not just a defensive habit, this is what let the new test suite boot the app at all, since jsdom doesn't implement it, and the same guard protects against older embedded WebViews doing the same.

### New-look default, for a device with nothing stored only

`readShellPref()` used to read a missing `wb_shell` key as off. It now reads it as on. Every other case on that function — a real off, a real on, a stale or future generation stamp, a corrupt value — is untouched; only true absence (nobody has ever touched the switch on this device) moves. This is also why several existing test suites needed a one-line update: a fresh boot with nothing stored now starts in the beta shell, and a couple of suites were leaning on the old default implicitly rather than pinning their own shell mode.

### Setup health, in the account menu

Three checks under your name — Connected, Identified, Installed — each red or green with its own fix. Computed fresh every time the menu opens rather than kept live, the same choice already made for "Reconnect to vault." Built once, reused on Start Here once that page exists (Session 3) rather than a second copy.

### Usage had no way into the beta shell

The beta shell's right dock deliberately hides Usage along with Comments, Links and Review (`BETA_HIDDEN_RIGHT`) — but where those three moved to the slide-over, Usage was never given anywhere to go. It's now in the account menu, Administrator-gated the same way the dock registry already gates it. Opens through `betaOpenTool('usage')` in the beta shell, or the same `toggleRPTab('usage')` the old shell's own rail icon already calls — no new opening mechanism either way.

While in there: help.md's "Usage" section still claimed the tool "is not built at all," left over from before it was. Corrected to say where to open it.

## 0.38.1 — 2026-08-30

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`, `supporting/tests/session-b-shell.test.js`, `supporting/tests/session-d-fixes.test.js`, `supporting/tests/props-flyout.test.js`, `supporting/tests/docks.test.js`

*Jayson tried 0.38.0 live and immediately sent back four more notes: the resize handle redesign had three real bugs, Properties still would not show from the beta Tools menu, and some UI text still used British spelling. This entry is the fix-up round on the same beta shell pass 0.38.0 shipped, not new capability — hence a patch bump rather than a new minor version.*

### The resize handle: three bugs in the redesign

Clicking the new centred grip did not collapse the panel — only dragging did. Cause: the handle's existing wide invisible hover strip sits on top of the smaller, centred grip now drawn inside it, so a click there always resolves to the handle itself, never to the grip specifically. The click-to-collapse check now asks "is this click inside the grip's own drawn shape" directly, rather than asking what element the browser says was clicked.

Reopening a collapsed panel could snap to an unreasonable width. Cause: reopening always restored whatever width had last been saved, with no check against how much room is actually available right now — a width saved from a wider window, or from fitting to a long heading, could come back oversized. Reopening now caps the restored width the same way dragging already does.

Double-clicking the handle looked like it expanded fully and then shrank back down. Cause: two things stacked — first, the same grip/hover-strip mixup above meant a double-click's two individual clicks were being read as collapse-then-reopen before the fit-to-content action ran; second, the fit-to-content action itself briefly re-enabled the panel's normal resize animation before jumping to its final width, so even a correct fit could visibly glide. Double-click now moves straight to the fitted width, once, with no flicker.

### Properties still would not show from the beta Tools menu

0.38.0 fixed the click that was closing the panel the instant it opened, but that turned out not to be the only problem. The panel lives inside a wrapper the beta shell hides entirely, for unrelated reasons — old-shell-only corner buttons that shell doesn't use. Hiding a wrapper hides everything inside it, so the panel was staying invisible regardless of its own open/closed state. It's been moved out of that wrapper; same on-screen position, now unaffected by it.

### British spelling

"Favourites" read as "Favorites" everywhere in the UI text; a few leftover spots still had the British spelling. Corrected.
---

## 0.38.0 — 2026-08-30

**Changed:** `index.html`, `README.md`, `help.md`, `help-edit.md`, `docs/project-wikibase-tracker.html`, `supporting/tests/session-b-shell.test.js`, one new test suite

*Jayson tried the Session B beta shell live and sent back eight numbered notes. This session works through them: two real bugs, one settled decision, one real gap, and a redesigned resize handle. The other three (home page, Open Last Note, a first look at the review dashboard question) are explicitly carried to the future Start Here session, not folded in here.*

### The right dock was still showing Comments and Review

Session B moved Comments, Links and Review into the slide-over and hid the right rail's own tab switcher, but the underlying dock-rendering code was untouched and unfiltered — a right dock that had those three pinned from before the beta shell existed kept rendering them anyway. Fixed at render time, not by rewriting the saved layout: a device's saved dock list is left exactly as it was, so switching the beta shell back off restores the old right-hand pane untouched.

### Properties would not stay open from the beta menu

The click-outside listener that closes the Properties flyout only recognised the old shell's own icon button. The beta shell opens Properties through its Tools menu instead, so that same opening click always read as "elsewhere" and closed the panel it had just opened. The listener now recognises both triggers.

### The Comments/Links/Review panel comparison is settled

Session B shipped a Settings toggle so Jayson could compare a scrim-and-dismiss presentation against one that stays open beside the page while reading. He picked the second, permanently. The toggle, the scrim element, and the comparison are all removed — the slide-over now only ever closes by its own Close button, its trigger, or Escape.

### Favourites and Bookmarks had no way in

The full Bookmarks pane — rename, remove, reorder, broken-link cleanup, all of it — already existed, but the beta shell hid the left rail's tab switcher that used to reach it. The only favourites a person could see were the top 5 in the search palette's empty state. That list now ends with a "See all favourites and bookmarks" row that opens the real pane in the slide-over. No new management logic; the pane just needed a door.

### The resize handle, redesigned

Simulated three options against real resizable-panel patterns from other apps before building anything, with Jayson picking between them at each step. The old flare-shaped hover mark is now a small grip (three dots) centred on the visible screen rather than tied to panel height — so it's still where you'd look for it on a tall monitor, or a second one, even with the panel fully collapsed. Collapsed, the same mark becomes a chevron pointing the way to reopen. Applied to both the sidebar and the right panel, mirrored. The drag-to-resize, click-to-collapse and double-click-to-fit gestures underneath were not touched — the new mark sits in the same functional slot the old one did, on purpose.

### Not done, on purpose

Home defaulting to a real Start Here page and surfacing "last note opened" there, and a first look at whether the Review dock item is now redundant with the review dashboard — both explicitly deferred by Jayson to a future session focused on the home page, rather than folded into this one.


## 0.37.0 — 2026-08-30

**Changed:** `index.html`, `README.md`, `docs/project-wikibase-tracker.html`, one new test suite

*The top bar control does what it says now, and the maintainer panels get a real presentation instead of the container Session A shipped.*

### The top bar control

Was a redirect to the docked Search pane since Session A shipped its container. Now it opens a real palette: empty, it lists Favourites then Recent; typed, it searches the vault with the same two rules the docked Search pane uses — filename match first, then content match with a snippet. Ctrl+K opens the same palette. Favourites reuses the exact ordered list the Bookmarks pane already reads, one row per bookmarked heading, not deduped to one row per file. Recent is new: `state.user.recent`, capped at 5, deduped by file, most-recent-first — stored in `state.user` and written to the vault the same way a favourite is, not a device-only list, because it was asked to sit in "the same retainer."

### The slide-over

Comments, Links and Review now open in a right-edge panel over the reader rather than stacking into the (hidden-in-beta) right dock. The panel reuses the SAME pane node the dock model already renders into — moving `#rp-comments` and friends between the slide-over and a parked, off-screen holder is the whole mechanism, so `renderCommentsTab()` and its siblings never had to change. `paneHead()` now returns nothing for whichever tool is currently in the slide-over, since its own move/close buttons would be a second, non-working control set. Properties and Edit are untouched — the flyout and full edit mode they already had.

**A comparison toggle, not a permanent decision.** Settings → Beta gained "Comments panel stays open while reading," off by default (matches the mockup: a scrim dims the reader and a click outside closes the panel). On, there's no scrim — the reader stays live underneath and the panel closes only by its own Close button, its trigger, or Escape. Checked against two design-system sources rather than guessed: a panel meant to be read *alongside* what you're doing should be non-modal, a self-contained task should be modal — which is also why the palette itself stays modal regardless of this setting. Whether the toggle stays permanently or gets removed once a behaviour is picked is undecided; tracked in the Backlog.

### One real bug caught before shipping, one design flaw before writing any HTML

`refreshRightPanel()` only ever refreshed tools sitting in `state.docks` — with Comments/Links/Review moved into the slide-over instead, navigating to a new page while one was open would have kept showing the page you left. One line fixes it, alongside the existing dock refresh. And the palette's row rendering originally escaped every name twice — once at the call site, once inside the shared row helper — which would have double-encoded any favourite or note title containing an ampersand or quote. Caught writing the test suite, not by a user.

### Not done, on purpose

The palette's search (`betaPaletteSearchHTML()`) is a sibling of the docked Search pane's `runSearch()`, not a shared call — the two now duplicate the same ranking rules rather than being merged into one parameterised function. `runSearch()` is wired to the Search pane's own DOM ids and old-shell behaviour it was safer not to touch for a beta-only feature. Worth consolidating later if the two drift.

---

## 0.36.0 — 2026-08-30

**Changed:** `index.html`, `README.md`, four test suites, one new suite

*Every page has an address, and there is a new shell you can try.*

### The thing that was missing

Until today `index.html` contained no URL handling of any kind. No hash was
read, none was written, no history was pushed. The consequence had never been
written down but it shaped everything: **there had never been a way to send
anyone a link to a page.** Every answer to a question stayed in the chat where
it was asked, which is the largest structural reason a wiki does not get
visited.

Two forms now exist:

- `#note=01_Projects/Site A/Scope.md` — the page
- `#note=01_Projects/Site A/Scope.md&h=h-risks` — a heading on the page

The heading id is the one the renderer already puts in the page, so nothing new
is minted and nothing has to be kept in step. Folder separators stay as
separators rather than being percent-encoded, because these get pasted into
chat messages and read by people.

**A link beats "open last note" at boot, always.** Somebody followed an address
to a specific page; showing them a different one is the single outcome that
makes the link worthless.

**A heading that has been renamed breaks its own links.** That is accepted, not
solved: GitHub, Notion and Confluence all have it and none of them solved it
either. An anchor that does not resolve opens the page at the top, so it
degrades to the page link rather than erroring.

### One history instead of two

The in-page back/forward stacks are gone. Every navigation now pushes a real
browser history entry and the arrows call the browser's own Back and Forward,
so the two cannot disagree — which they previously did, because the browser
knew nothing about the in-page stack.

**Back stays disabled until Folio has pushed an entry of its own.** In the
installed app there is no browser Back button to fall back on, so an arrow that
walked out of the app would read as Folio crashing.

This also explains why Copy link and the arrows cannot be trimmed later. Folio
installs as a standalone app, which has **no address bar and no browser Back**.
In that app Copy link is the only way to get an address out, and the arrows are
the only way back.

### On every heading

Point at a heading and two controls appear: copy a link to that section, and
bookmark it. Both already existed elsewhere — the bookmark is the same
per-heading bookmark the Outline has had since 0.15 — so this is the same
feature in a second place rather than a new one. The section link also appears
on Outline rows, for grabbing a section you are not currently sitting in.

Comment and Highlight are drawn beside them and disabled. Per-section comments
change how comments are stored, and a highlight is private to one person and
has nowhere to live yet. They are shown rather than omitted because a disabled
control says "not yet" where a missing one says "never".

**The rule that decided the shape:** a control that only appears on hover is
learned by daily users and invisible to everyone else, which is the same
failure as a keyboard shortcut. So hover carries the actions, and any permanent
signal that there is something there has to sit outside the hover group. That
is why Comments in the new shell is a button with a visible count rather than a
line in a menu.

### Copy link in the old shell too

**The freeze is on chrome, not on the reading column.** Copy link, section
links, back and forward and the heading controls all live in the reading
column, which both shells share, so they are built once and appear in both. One
button had to be placed by hand in the old shell's corner, because that corner
does not exist in the new one. Copy link is available to everyone including
Users: sending somebody a page is a reading act, not an editing one.

### The new shell, behind a switch

**Settings → New look → Try the new layout.** Off by default, opt-in, and it
only changes the computer you turn it on at. Switching either way is instant
and needs no reload.

- Home, as a real labelled button and the only accent-filled control in the
  app. It opens What's New for now; Session C replaces that destination with a
  Start here page. The button does not change, only where it goes.
- One search control in the middle of the top bar, with a visible boundary
  rather than an icon on a rail plus a keyboard shortcut.
- A reader header with the folder path, back and forward, Copy link, and
  **Comments as its own button carrying its count.**
- Links, Review, Properties and Edit behind one unlabelled overflow button.
  It used to be called Tools, which is the name you reach for when a menu holds
  things that do not belong together. **Usage moved to the account menu**: it is
  about the whole vault rather than the page you are reading, and it rendered
  an empty panel for anyone who is not an administrator.
- Edit is **hidden** rather than greyed when you cannot use it.

**The switch carries a generation stamp inside its stored value.** When the new
shell becomes the default, the switch turns off for everyone and is reused for
the next round. Without the stamp, anyone who left it on in round one would be
silently enrolled in round two having never opted in. Anything unexpected in
that value — an older generation, a hand-edit, a half-written write — reads as
off. Failing closed is right here: the cost of wrongly reading "off" is one
toggle click, and the cost of wrongly reading "on" is moving somebody to a new
interface they did not ask for.

**Nothing is forked.** The new shell is one class on the body over the same
panels, the same reader, the same Outline and the same tools. That is what lets
"the old shell is frozen" mean something other than "the old shell rots": a fix
to any shared part lands in both at once.

### Verification

1,725 checks across 22 suites, plus the 8-check reopen smoke, all green —
1,733 in total, against 1,639 at 0.35.0. The new suite is 94 of them, and it is
a **measured** count, not an incremented one. **Every fix was reverted
one at a time to confirm the suite goes red**, and one of them did not:
`stopPropagation` in the section-link handler turned out to be inert, because
the heading row's own inline handler has already fired by the time a delegated
handler runs. It was removed. **One guard a test can turn red beats two where
one does nothing**, which is the same finding as the permission gate in 0.27.0
arriving in a different place.

Three existing suites needed updating rather than fixing. Two of them matched a
CSS selector by substring and were reading `body.beta-shell #reader-corner-align`
while reporting the untouched base rule broken; both now anchor the selector.
**A selector test that matches a substring will eventually match somebody
else's override.** The third asserted the nav pill's offset, which moved by one
button width because Copy link joined the opposite corner run.

Rendered and looked at in both shells, both themes, and — because it is the
combination that erases boundaries — with panel tone set to flat and borders to
none. That found the one real layout bug: with no borders the centred search
control lost its edge and stopped reading as a control at all. It now uses the
strong border tone, which is the one the "borders: none" setting already keeps
deliberately for functional UI like toggle tracks and input outlines.

---

## 0.35.0 — 2026-08-29

**Changed:** `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `help.md`, `help-edit.md`, `README.md`, `help-assets/fig-01-screen-at-a-glance.svg`, `help-assets/fig-04-header-bar.svg`, four test suites

*The app is called Folio.*

### The name

WikiBase collides with Wikimedia Deutschland's Wikibase, the software behind Wikidata. Same category, so it is a real problem if this ever leaves the building, and the old name also carried the company's name into the product. Folio is a single leaf of a book, and also the format the great collected editions were printed in: one page at a time and the whole gathered work, in the same word.

Decided at Session 51 and deliberately held until a revision of its own, so the change is one clean release rather than a rider on a bug fix.

### What did not change, on purpose

**Every `wb_*` key in `localStorage`, `IDB_NAME`, the `zSystem` convention, the `.comments.md` and `.changes.md` suffixes, the `Project-Wiki` repository and its Pages URL, and `project-wikibase-changelog.md` itself.** Renaming any of those would have made this a migration instead of a rename. The `wb_*` keys hold every user's prefs and every ticked box in the tracker; `zSystem` and the sidecar suffixes address files already written into the vault; the repository name is the installed PWA's identity and the Teams tab's URL. The changelog filename is fetched by relative path from two places in `index.html` and is never seen by a user.

The rule for the pass was: rename what a person reads, never what a machine matches on.

### Two strings that land in the vault

The audit log header and the usage log header both carry the product name and are written into `zSystem`. Existing logs keep the old header line and new appends carry the new one. Harmless, recorded so it is not a surprise later.

### The mark

Parchment `#EFE5D2`, oxblood `#7A2E1E`, fold ply `#55201A`. A sheet folded once, with the F cut out of the left leaf and the top corner of the right leaf turned like a page.

Oxblood is the rubric colour, the red initial painted into a manuscript page, and it is also the one warm colour absent from the row of Microsoft apps this sits beside all day. That second reason is the load-bearing one. The old parchment-and-ink mark won attention by being the pale tile in a dark row; this mark is mostly ink, so it had to win a different way.

`icon-512.png` is scaled to 90% about its centre. It is declared `any maskable`, and at full bleed the corners of the sheet fell outside the 80% safe circle a round mask cuts to. `icon-192.png` is `any` only and stays full size.

### Looking at the figures caught two things measuring did not

Both edited figures were rendered and inspected rather than trusted to the layout check, per the standing rule. The check compares text against text and would have passed both.

- `fig-01` still showed **Version 0.23.0** in its mock right panel, twelve releases stale. Stamped to 0.35.0. It will go stale again; dropping the number from the figure entirely is the real fix and is now in the Backlog.
- `fig-04` has a callout label overlapping the header bar. Pre-existing, unrelated to this release, left alone and recorded.

Both figures also needed their `— Team Wiki` label pulled left, because Folio is a much shorter word than WikiBase and the gap the old name filled became a hole.

## 0.34.2 — 2026-08-13

**Changed:** `index.html`, `supporting/tests/copy-callout.test.js`, `README.md`, `help.md`, `help-edit.md`

*The copy fix, from evidence instead of inference.*

### Each list level declares its own bullet type

The clipboard inspector shipped in 0.34.1 did its job on the first use. A real OneNote clipboard — the one known to paste into Forma correctly — writes an explicit `type` on every level:

```
<ul type=disc> … <ul type=circle> … <ul type=disc>
```

0.34.1 had already arrived at OneNote's sibling structure, and the inspector confirms that half was right. What was missing is the attribute. It is deprecated HTML and it is doing real work: it states what a level **looks like** rather than leaving it to be derived from nesting depth. Nesting says where an item sits; `type` says how to draw it, and only the second survives a parser that gets the first one wrong.

Now `disc` → `circle` → `square`, cycling — the browser's own progression, and one better than OneNote, whose HTML drops back to `disc` at level three even though its own text flavour shows a third glyph there. Numbered lists get `1` → `a` → `i` on the same rule.

**Not a bug in WikiBase, recorded because it looked like one:** the last top-level bullet in OneNote's own plain-text flavour comes out with no bullet and no indent. That is OneNote's text serializer losing its depth after a sibling sub-list closes, in output OneNote produced itself. The `text/html` flavour beside it is correct, and WikiBase's own plain-text flavour indents with leading spaces and does not have the fault.

## 0.34.1 — 2026-08-13

**Changed:** `index.html`, `supporting/tests/copy-callout.test.js`, `supporting/tests/rename-and-trim.test.js`, `supporting/clipboard-inspector.html` (new), `supporting/release.sh`, `README.md`, `help.md`, `help-edit.md`

*Two reports against 0.34.0, same day.*

### Copy: the nested list is now a sibling of its item, not a child

0.34.0 fixed the styling and left the structure alone. It pastes into OneNote correctly and still fails in Forma, where levels two and three arrive merged into the first bullet or stripped of their markers — while a three-level list built by hand in OneNote and copied into Forma is perfect.

Text merging **up** into the parent bullet is the signature of a parser that does not accept a list inside a list item: it drops the tags it does not expect and the orphaned text joins the item it was sitting in. Nothing written on the inner list can prevent that, because the inner list is the thing being discarded — which is also why 0.33.0's per-item indent could never have worked.

What prevents it is not putting a list inside a list item:

```
spec    <ul><li>one<ul><li>two</li></ul></li></ul>
office  <ul><li>one</li><ul><li>two</li></ul></ul>
```

The second form is what Word, OneNote and Outlook have emitted for twenty years, so every editor that handles paste at all has been made to accept it, including those that never implemented the first. Browsers render them identically. It is technically invalid and it is the more compatible of the two.

A **clipboard inspector** ships alongside, in `supporting/`. Paste into it from any app and it shows the exact bytes that app put on the clipboard. Three releases have now been spent inferring what a destination does from how it renders; one paste into this ends that.

### Bookmarks can be removed from the Bookmarks tab

A bookmark could only ever be removed from the Outline of the file it points at — which stops being possible the moment the file is renamed or deleted. **The one state that needs cleaning up was the one state with no way to clean it up.**

Every row now carries a **×**. On a heading it removes that bookmark, on a file header it removes all of that file's, on a favourite it removes the favourite and leaves the bookmark underneath. Each is tested before the row-level jump in the click handler, or every removal would open a file instead.

Bookmarks pointing at a file that is no longer in the vault show struck through and marked *file not found*, are no longer clickable, and get a **Remove all** bar above the list. The check reads the What's New index rather than the loaded file tree, because folders load lazily and a bookmark in a collapsed folder would otherwise be flagged broken on a perfectly healthy vault. Before the first scan there is no index, and nothing is flagged at all: a false "broken" badge is worse than the silence it replaces.

**Why these exist rather than a better repair:** 0.34.0's rename repair cannot help a file renamed *before* it shipped. That scan found the pairing, handed it to What's New and discarded it, and nothing is left to reconstruct where the bookmark was meant to point. Those are unrecoverable, and the honest answer is to make them visible and easy to clear.

### release.sh reports what to upload

The changed-file list is now computed by hashing every file in `deploy/` against the same file in the previous release's archive, and printed at the end of the run. It had been recited from memory, and 0.33.0 is the release where reciting it was wrong: two help files carried a stamped version line and nothing else, and only being asked directly caught it.

## 0.34.0 — 2026-08-13

**Changed:** `index.html`, `supporting/tests/copy-callout.test.js`, `supporting/tests/rename-and-trim.test.js` (new), `README.md`, `help.md`, `help-edit.md`

*Three things reported after living with 0.33.0. One is a corrected diagnosis, two are new capability.*

### Nested bullets in a copy block: 0.33.0's fix was the cause

0.33.0 read the report as "Forma drops the nested wrapper, Word is fine" and answered it by zeroing each nested list's `padding-left` and putting a 24px margin on each nested `<li>` instead. It then flattened in Word, Outlook **and** Forma, while the same three levels copied out of OneNote pasted into Forma perfectly.

When every destination fails and a different source succeeds into one of them, the bug is in what we emit. `padding-left:0` **is** an instruction to sit at the parent's indent — it is precisely the reported symptom, written into the clipboard on purpose. The margin meant to compensate sits on the `<li>`, which is the one element Word, Outlook and Forma all discard, because each rebuilds list items as its own paragraph type and reads the level from nesting depth alone.

So the markup goes back to plain nested `<ul>`/`<li>` with no indent instructions at all — what OneNote sends, and what every editor already knows how to indent. Depth is unlimited again rather than exact-for-two.

The one thing kept from 0.33.0 is the vertical-margin fix that closed the extra blank line, now written as `margin-top` and `margin-bottom` specifically. The `margin:0` shorthand was doing that job and zeroing the left margin in the same stroke, which is the second half of the same bug in any editor that indents with margin rather than padding.

The three checks that pinned 0.33.0's behaviour are replaced by six that assert the absence of any indent-suppressing style. Reverting the fix turns them red.

### A rename no longer breaks bookmarks

What's New has detected renames since 0.25.0: each scan keeps every path plus a content fingerprint, and a path that vanished beside a path that arrived carrying the same bytes is the same file under a new name. It kept that answer to itself. Bookmarks, favourites, list fold memory and the last-opened note all remember a file by its path, and all four went on breaking on every rename for nine releases, because nothing ever told them one had happened.

The detection was never the missing piece. Publishing it was. One pairing is now built once per scan and handed to every store keyed by a path, so reorganising the vault stops costing everybody their bookmarks. A store added later is repaired by being listed in one place rather than by rediscovering the same bug.

Two supporting details. The pairs are **queued** rather than applied on the spot, because the scan fires from boot alongside the identity load and usually wins the race — applying immediately would absorb the rename and drop it, leaving the bookmark broken with nothing left to show why. The queue also makes a chain (A→B this scan, B→C the next) come out right. And a second pairing pass matches on filename for whatever the fingerprint pass left over, which covers a file that was **moved and edited** in the same window; it refuses to guess when two files share a name, because sending a bookmark to the wrong page is worse than leaving it broken.

Renaming and editing a file in the same window remains unmatchable. That is the honest limit of inferring identity from content, and the suite asserts it rather than leaving a passing run to imply otherwise.

### Number prefixes are trimmed on screen

A numbered vault — `00_Home`, `01_Gates`, `05-File Name` — sorts and stays findable on disk and in Obsidian. The numbers have done their whole job before WikiBase renders anything, so they are now trimmed on screen: the tree, the reader title, search results, bookmarks, What's New and the review queue.

The rule is **exactly two digits then one underscore or hyphen**, not "one or more digits". A wider rule quietly eats real titles — `2024-Q1 Review` becomes `Q1 Review` with nothing on screen to say it was wrong. Three characters is the promise the setting makes, so three characters is what is coded.

The setting existed for folders only, matched `^\d+_`, and defaulted off. It now covers files, accepts `-` as well as `_`, and **defaults on**.

Display and resolution are kept strictly apart, which is the whole safety of the feature: the wikilink index, sidecar filenames and every file-exists check key off the untrimmed name and do not move when the setting moves. On top of that, the trimmed name is registered as an **alias**, so `[[Safety Plan]]` finds `05-Safety Plan.md` as well as `[[05-Safety Plan]]` does. Aliases live in their own map so an exact filename always wins, and they are registered whether or not the trim is on — how a link resolves must never depend on a display preference, or the same note renders live for half the team and dead for the rest. Backlinks look up both keys for the same reason.

**Not changed:** comment and change-log sidecars are still named after their note, so a rename still orphans them. Repairing that means writing and deleting files in the vault on a scan, which is a different decision from repairing device state, and is left for its own session.

## 0.33.0 — 2026-08-12

**Changed:** `index.html`, `supporting/tests/copy-callout.test.js`, `supporting/tests/fold-consolidation.test.js`, `supporting/tests/usage-analytics.test.js`, `supporting/tests/review-dashboard.test.js`, `supporting/tests/review-bugfix-0321.test.js`, `README.md`, `help.md`, `help-edit.md`

*Four things reported after living with 0.32.3. Two are fixes, two add capability, which is why this is a MINOR and not a fourth patch.*

### Nested bullets survive an editor that does not understand nesting

0.32.3 fixed the markup and this is not a regression of it. The clipboard HTML is structurally correct at every indent style and every depth, and Word pastes it correctly — that is what pins this one on the destination rather than on us. Autodesk Forma's editor parses `<ul>` and `<li>` but has no schema for a list inside a list, so it keeps every `<li>` and throws the wrapper away. Every level then lands flat.

Nothing in the markup can stop that editor discarding the wrapper. What it cannot discard is an indent written on the `<li>` itself, so that is where the indent lives now, with the nested list's own `padding-left` zeroed so the same 24px is never applied twice where the nesting **is** honoured. The result in Word is unchanged; the result in an editor that flattens is a second level instead of no second level.

Per level, not cumulative. Under real nesting that is exact at any depth; under an editor that flattens, depth three and beyond arrive looking like depth two. Two levels is what this feature is used for.

The reported extra blank line after the last nested item had two causes, both removed. A nested `<ul>` carries a default vertical margin, which paints as a gap between the end of a nested run and the next top-level item — every level now sets `margin:0`. And the legacy fallback copy path set `white-space:pre-wrap` on its hidden host, which made the newlines the serializer joins blocks with into **real** blank lines in whatever was pasted. Nothing needed it: hard breaks were already `<br>` and a fenced block is already `<pre>`.

The `text/html` flavour also goes out as a whole small document with a charset declaration rather than a bare fragment. Editors that roll their own parser tend to be the ones that mishandle a fragment.

### List fold memory is a setting

Lists were the one thing that remembered a fold between visits — headings deliberately forget, and the reasoning for that asymmetry stands (a long checklist you collapsed is usually meant to stay collapsed). It is a preference, so it is a toggle now: **Settings → Navigation → Remember collapsed lists.**

**Default is on.** Turning the default off would take a behaviour away from everyone who never asked about it, which is a much larger change than adding a switch.

Both halves are gated, not just one. Gating only the write would leave yesterday's folds replaying for as long as they sat in storage; gating only the read would keep writing a store nothing reads. Turning it off also clears what is already stored rather than parking it, because a fold set weeks ago springing back the moment someone re-enables the setting is exactly the invisible-state problem that got heading persistence deleted.

### Usage rows say who, and the Session 45 rule is reversed

Most read rows now expand to a per-person breakdown with each reader's own count.

This reverses decision 3 from Session 45, and the reasoning is worth keeping because the reversal is not a change of appetite. The rule was that names were dropped inside `usageAggregate()` so no render downstream could show one. **The rule only ever applied to this pane.** The logs themselves live at `zSystem/Analytics/YYYY-MM-<person>.md`, in the vault, in plain Markdown, named after their owner, and every member of staff has always been able to open any of them in Obsidian. Hiding the attribution in the pane bought privacy from nobody while costing the one question the pane exists to answer: who is reading, and who is not, when someone asks about something already written down.

The gate this rests on is the Administrator tier, which is unchanged and is *absent* rather than disabled below that rung. If the pane ever opens lower, this has to be re-argued.

Totals did not move. The breakdown is opt-in per row and collapsed by default, and the other two lists stay unnamed on purpose — Never opened has nobody to name, and putting names on Gone quiet would turn a prompt to check whether a page is out of date into a list of who stopped reading it.

Logs now carry the reader's display name in a `WBUSER` comment. The filename has always identified the person but by *slug* — an email with its `@` and dots mangled to hyphens — and a slug is not a name you put in a report. Self-healing by construction: a usage file is rewritten in full on every flush, so an existing log picks the line up on its owner's next sitting, and until then the slug is tidied as a fallback. No migration.

The footer no longer claims that no names are shown or stored. It says how many people have contributed, that reading is logged for everyone, where it is stored, and that the pane is Administrator only.

### Every file is checked against the property list, not just the ones the app has touched

Reported as "I'm still not seeing the Missing properties section, I know we added some and it should list all." That was exactly right, and the cause was a scope the fix in 0.32.1 stopped one step short of.

0.32.1 pulled the completeness check out of the cause chain so an optional-only gap would be reported — but left it inside the `else` branch that only files carrying a `status` key ever reach. A file with no frontmatter at all was called a New file and stopped there, never measured against the property list. **The one population most in need of the check was the one population excluded from it.**

The check now runs over every file, before the cause chain, so a brand new file appears under both New files and Missing properties. That is not a double-count: "nobody has looked at this yet" and "these keys are absent" are two different review questions with two different resolutions, one closed by looking and one closed by writing a key. One-file-one-cause still holds inside the cause chain, which is where it was protecting the audit delta; it was never a rule about a completeness check.

`Fill all` dedupes by file. The second write would have been harmless — only absent keys are ever injected — but the **count** would not: it would tell someone they were about to touch more files than exist, and that is the number they read before pressing it.

### The help files were a release behind, and one of them was lying

Caught by asking what actually differed between `deploy/` and the previous archive: `help.md` and `help-edit.md` had been version-stamped and nothing else, which is the normal case and was wrong this time.

`help.md` still told the team, about the Usage pane: *"No names, no per-person counts, no way to see who read what. The report cannot show that, because the totals it reads have already had the names dropped out of them."* **Shipping that beside a pane that names people is worse than never having had the rule** — it is a guarantee the app stopped honouring, in the file people go to when they want to know what the app does. It now describes what is recorded, that the Usage tool is Administrator only, and that the per-person log files in the vault are readable by anyone who can open the vault. That last part was always true and was never written down anywhere the team would see it.

`help-edit.md`'s copy-callout section was older still — it predated 0.32.2 and described the clipboard as plain text only, three releases after it stopped being. Rewritten to cover both flavours and the nesting behaviour, including the honest limit: two levels come through everywhere tried, three or more may flatten to two in an editor that builds its own paste handling.

Also newly documented: the **Remember collapsed lists** setting and its settings-table row, the reader breakdown on Most read, the corrected claim that the folder tree is "the one fold that is saved", and an entire **Missing properties** section in `help-edit.md`, which had covered New files since Session 42 and never covered the list beside it.

**The general lesson: a release that changes what the app promises has to check what the docs promise.** `release.sh` stamps the version line in both help files and reads it back, which is exactly enough to make them look attended to.

### Testing

1,477 → 1,526 checks across twenty suites, plus `smoke6-reopen.js` at 8/8. All green.

Every one of the four fixes was reverted in a scratch copy, thirteen reverts in all, and each was required to turn its own suite red. **Four of them did not, and each silent revert was a real hole:** the clipboard document wrapper was proven correct but nothing asserted it was *called*; the fold purge was tested by calling the helper directly rather than through the toggle; the flush was never asserted to pass a name to the serializer; and `rvFillAllBand3` could be reverted to the raw concatenation with every check on the deduping helper still green. All four now assert the call site, not just the callee. Proving a helper works says nothing about whether anything uses it.

`fold-consolidation.test.js` also crashed rather than failed on its first revert run, because the scratch copy was missing a file the suite reads — and a crashed suite reports zero failures, which read as green. That is the S35 lesson (`smoke6-reopen.js`) arriving from a new direction: a suite that cannot run does not fail, it just stops telling you anything. The revert harness copies the full tree now.

`review-dashboard.test.js` had the same shape in miniature: `state.missingProps.find(...).required` throws on an empty list, so reverting the fix under test killed the run before the summary. Every lookup goes through a null-safe helper now, the same guard `review-bugfix-0321.test.js` already recorded for the same reason.

Structural assertions on the copy serializer compare style-stripped markup, so the new inline styling could not turn nesting checks into styling checks by accident. Two claims, two sets of checks.

---

## 0.32.3 — 2026-08-10

**Changed:** `index.html`, `supporting/tests/copy-callout.test.js`, `supporting/tests/README.md`, `README.md`, `help.md`, `help-edit.md`

*Nested bullets and numbers survive a Copy. Two independent faults behind one symptom, and the second one had been in the reader since callouts shipped.*

### The copy serializer reimplemented the reader's list model and got it wrong

0.32.2 built the clipboard's list HTML with its own indent arithmetic — `floor(spaces / 2)` — and opened one list container per level of *jump*. An item that skipped a level therefore produced `<ul><ul>` with no `<li>` between them. That is invalid, and rich-text editors quietly drop or flatten it, so the nesting vanished on paste.

**Obsidian's default indent is four spaces, which the reader reads as two levels, so ordinary nesting hit this on the very first indented line.** The 0.32.2 suite only ever tested two-space indents, which is the one style that happens to work.

The reader had always been right about the same input. It parses list lines with `listIndentDepth()` and builds a tree with a depth stack, and that stack has the property the copy version lacked: a jump of more than one level nests by exactly one, because it only ever appends to the nearest shallower node. There is no arithmetic in it and nothing to get wrong.

Both halves are now extracted as `mdListItems()` and `mdListTree()`, shared by the renderer and the copy serializer. **This is the rule `cpInline` already recorded for inline markers** — it runs text through the real `renderInline` rather than a parallel stripper, because "a parallel stripper would drift from the renderer the first time either changed." The list levels were the one place that rule was not followed, and that is exactly where the two drifted. Same lesson, arrived at twice.

### A tab straight after `>` was being eaten

Second, unrelated fault, found while reproducing the first. The callout and blockquote body strip was `/^>\s?/`, and `\s` matches a tab — so a line written `>\t- nested` arrived with its indent gone, and the first level of nesting inside a callout disappeared.

**This was never a copy bug.** The reader flattened that line too, and had done since callouts shipped; the clipboard was faithfully reproducing what the reader already showed. The marker is now `/^> ?/`: a literal single optional space. Only that space is punctuation, everything after it is content, which is what carries the indent through to `listIndentDepth()`.

### Testing

`copy-callout.test.js` 81 → 95. Every indent style is checked explicitly — two spaces, four spaces, a tab, and a tab with no space after the quote marker — because the bug was invisible at the single style the previous suite used. There is also a check that no level container is ever emitted without an `<li>` to hold it, which is the actual defect rather than one of its symptoms, plus three-level nesting with a dedent, mixed ordered-inside-unordered, and a nested task.

The tab fix gets a **behavioural** check on the reader as well as on the constant, because it was a rendering bug first and fixing only the clipboard would have left the callout still eating a level.

Both fixes were reverted in a scratch copy and confirmed to turn the suite red: the shared list model takes 7 checks with it, the quote marker 4.

One note on the suite itself. The reader check reported a false pass twice while being written: a parent `<li>` contains its children's text, so finding items by `textContent` returned the same element for both lookups and compared a depth against itself. It reads the row's own `.md-li-text` now. **A test that cannot fail is worse than one that does**, and this one was reporting equal depths against correct markup.

---

## 0.32.2 — 2026-08-10

**Changed:** `index.html`, `supporting/tests/copy-callout.test.js`, `supporting/tests/review-bugfix-0321.test.js`, `supporting/tests/README.md`, `README.md`, `help.md`, `help-edit.md`

*Two follow-ups from using 0.32.1. The Copy callout now puts formatted text on the clipboard, and the review strip's resize grip moved to the edge people actually grab.*

### The Copy button carries formatting

Reported as "it's not taking the bold and returns, it wraps the text." The plain-text serializer was doing exactly what v0.19.2 built it to do, and the line breaks were in fact intact in the payload — what looked like wrapping was the destination reflowing plain text, because plain text carries no structure for Outlook, Word or a web editor to respect.

The v0.19.2 decision was right about its own case and too narrow about the general one. Pasting `**Bold**` into an email is the outcome that feature exists to avoid, but discarding the formatting is only one way to avoid it, and it is the lossy way.

**The clipboard now carries two flavours from one copy.** `text/html` for destinations that can take it — Autodesk Forma, Outlook, Word, Teams — with bold, italics, bullet lists, numbered lists, tables, headings, task glyphs and real hyperlinks. `text/plain` for everything else, byte-for-byte what it produced before. **No destination anywhere sees a Markdown marker**, which was the original point and is preserved.

What the rich flavour deliberately does not carry: the callout's box, tint or title. It is body content that inherits the destination's own font, because a block of someone else's CSS dropped into an email is the other way this feature could be annoying.

Two smaller calls inside it. **An internal wikilink becomes plain words**, not a link — there is no URL that means anything outside the app, so carrying one would produce a href nobody can follow; an external `[text](url)` keeps its real href and loses everything else. **A task checkbox becomes a ☐/☑ glyph** rather than an `<input>`, because a disabled input pastes as nothing in most editors and the tick is the content.

Three write paths, narrowest first, because each is unavailable somewhere the app runs: `ClipboardItem` (the only API that writes two flavours at once, and it needs a secure context, so absent on `file://`); a contenteditable staging element with `execCommand`, which carries formatting because it copies a *selection* rather than a string; then the original plain write. **The old textarea fallback could never have carried formatting** — a textarea has none to carry — which is why the middle path had to be added rather than reused.

Underline is still not available. That is a WikiBase limit rather than a Markdown one: the app escapes all raw HTML, so Obsidian's `<u>text</u>` shows as literal text here. Left alone this release.

### The resize grip moved to the edge you grab

The strip was resizable in 0.32.1 and tested green, and it still could not be resized in practice. The bottom stack renders reader → walk bar → detail bar → strip, so while you are walking the review queue **the visual boundary between the reader and the review area is the walk bar** — and that is the edge anyone reaches for. It had no resize behaviour, and the real grip sat one row lower on a bar that does not look like a divider.

Every bar in the stack is a grip now. The walk bar resolves whichever strip is open **at mousedown** rather than being bound to one when it is wired, because it sits above a surface that changes with the item type and cannot know which is open until the drag starts.

Each bar also draws a short centred bead at its top edge. These bars have carried `cursor: row-resize` and nothing else since S14, and **a cursor change you only discover by hovering the exact right row is not an affordance, it is a secret.**

Heights are remembered per strip, which 0.32.1 wrote and this release fixes the reading of — `restoreStripHeights()` now applies both on load.

### Testing

`copy-callout.test.js` 57 → 81 checks; the existing plain-text assertions are untouched, which is half the claim: neither flavour may move the other. `review-bugfix-0321.test.js` 68 → 77, driving a **real drag from the walk bar** against faked geometry, then switching which detail surface is open and dragging the same bar again — binding it to one strip at wiring time would pass the first check and fail the second.

Both fixes were reverted in a scratch copy and confirmed to turn their suites red: the rich payload takes 14 checks with it, the walk-bar grip 3.

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
