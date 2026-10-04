# Administering

> [!NOTE] About this guide
> This guide is for Administrators only. It covers running Folio for your team: who can do what, must reads and onboarding, the health of the vault, what people read, and the staff update. Everything a Contributor does is in [Contributing](help-contrib.md). Everything a reader does is in [Using Folio](help.md). Written for **Version 0.86.1**.

You open almost all of this from **Admin** on Home. **New here? Do Find your way around Admin, then Set the passwords.** Until the passwords are set, anyone can make themselves an Administrator.

## Find your way around Admin
%% card: One door for each job, and what the numbers mean | icon: shield | updated: 0.83 | key: admin %%

Admin is a row of doors on Home. Each one opens a screen of its own. A number on a door is work waiting. The numbers match the picture.

![[ad-tabs.png|760]]
*Admin: one door per job. A number is work waiting.*

1. **Review**: pages waiting for someone to look at them.
2. **All comments**: every open comment in the vault.
3. **Vault check**: problems with the vault itself.
4. **Users**: people, access, must reads and onboarding.
5. **Usage**: what people read and search for.
6. **Templates**: the shape of each kind of page.
7. **Staff update**: the email about what changed.

> [!tip]
> Review, All comments and Templates are shared with Contributors, and [Contributing](help-contrib.md) covers them. The other four are yours alone.

> [!note]+ More detail
> **Approve all as they are.** At the top of Review, only Administrators see this button. It signs off every page waiting for review in one go, so use it once to accept the vault as it stands. After that, every new page and every change comes back for review.
>
> **Hidden is not secret.** A door your access does not include is not shown at all. That keeps people out of controls they do not need. It does not lock the vault. See Set the passwords.

## See who owes what, and set access
%% card: Everyone who uses Folio, what they owe, and their access level | icon: users | updated: 0.83 | key: users %%

Users is a report of your people. On Home, open **Admin**, then **Users**. Red is overdue, yellow is owed and not yet due, green is caught up. The numbers match the picture.

![[ad-users.png|594]]
*Users: who owes what. Red is overdue, yellow is owed, green is caught up.*

1. **People**, **Must reads**, **Onboarding** and **Settings** are the four views.
2. **New must read** assigns a page. See Assign a must read.
3. Each person shows what they owe and how far through onboarding they are. Click a row to open their list.
4. The drop-down on the right is their access level: User, Contributor or Administrator.

> [!tip]
> A change of access reaches the person the next time they open Folio, on whichever computer they use.

> [!note]+ More detail
> **People appear by using Folio.** Nobody is added here. A person shows up the first time they open Folio and type their name. Removing someone is a job for the vault folder, not for Folio.
>
> **Your own access.** You cannot change your own here. Use **Settings**, then the **Advanced** tab, then **Access**. It writes the same record.
>
> **A person's row opens.** It lists everything assigned to them and where each stands. **Ask again** puts a page they have read back on their list. The **×** takes one off. It also holds their onboarding track and start date, **Extend cushion a week**, **End cushion now**, and the look they read with.
>
> **Levels.** User reads, searches, saves and comments. Contributor adds Review, All comments, Templates and New page. Administrator adds editing, Properties, task boxes and the rest of Admin.

## Set the passwords
%% card: Turn on the gate for Contributor and Administrator | icon: sliders | updated: 0.83 | key: passwords %%

A new vault has no passwords, and until it does, every level is open to anyone who picks it. Settings says so plainly while that is true. Set both once.

1. Click your initials, top right, then **Settings**, then the **Advanced** tab.
2. Under **Access**, choose **Administrator**. While there are no passwords, it asks for nothing.
3. Under **Passwords**, choose **Administrator** and click **Change…**. Type a password.
4. Choose **Contributor** and click **Change…**. It has to be a different password.
5. From now on, moving up a level asks for that level's password. Moving down never asks.

> [!tip]
> This keeps people out of controls they do not need. It is not security. The check runs in the browser, and anyone who can open the vault in Obsidian can edit any page whatever their level in Folio.

> [!note]+ More detail
> **Where it is kept.** Both passwords are stored scrambled in the vault, in `zSystem/auth.json`, never in the app. An app update never wipes them.
>
> **Locked out.** There is no reset button, on purpose. The way back is the vault itself. Open the vault in Obsidian or in SharePoint, delete the file `zSystem/auth.json`, and go back to Folio. Moving up stops asking for a password. Choose Administrator, then set both passwords again. You do not need to reload Folio.
>
> **Nobody is locked out for good.** Whoever could lose a password already has the vault access needed to undo it. If that is not what you want, change who can write to the vault.
>
> **Also in Users.** The Administrator password has a button at the foot of the People view.

## Assign a must read
%% card: Ask everyone, or named people, to read a page by a date | icon: bell | updated: 0.83 | key: must-reads %%

A must read is a page, or one section of a page, that someone has to read by a date. On Home, open **Admin**, then **Users**, then **New must read**. The numbers match the picture.

1. Pick the **page**, and whether it is the whole page or one part of it.
2. **Assign to** everyone, or **Choose people**.
3. Set the **priority**. It sets the due date.
4. Click **Assign**.

![[ad-assign.png|518]]
*New must read: a page or one section, to everyone or named people, with a priority.*

![[cl-assign.webm]]
*Assigning a must read to everyone.*

> [!tip]
> Standard gives two weeks. Critical gives two working days, and Casual a month. You can change what each step means in Users, under **Settings**.

> [!note]+ More detail
> **What they see.** The next time they open Folio, a banner stays at the top of the page, a line shows on Home, and it goes in the weekly email. A new person who is still in their cushion gets it when the cushion ends, unless it is Critical.
>
> **Mark as read is not instant.** It unlocks once they reach the end of the page, and after half the page's reading time, never under 20 seconds and never over 3 minutes. Change the rule under **Settings**.
>
> **Watch the time.** The **Must reads** view shows how long each person spent on the page before marking it. Under a minute shows in red, so a read can be told from a click.
>
> **A read stands after the page changes.** Folio notes it for you: "Changed on a date, after 2 people read it. Their reads stand." If it matters, open the person's row and press **Ask again**.
>
> **Taking one off.** **Remove** in the Must reads view takes it off everyone. The **×** on a person's row takes it off just that person.
>
> **Colours.** Yellow is owed. Red is overdue.

## Plan onboarding for new staff
%% card: A six month plan, and a gentle first two weeks | icon: clock | updated: 0.83 | key: onboarding %%

Onboarding is a plan of pages, each with a day, so a new person never gets everything at once. It is separate from must reads.

![[ad-onboarding-plan.png|760]]
*The onboarding plan for new staff, and the cushion at its start.*

1. On Home, open **Admin**, then **Users**, then **Onboarding**.
2. Choose a track: **New staff** or **Existing staff**.
3. Click **Add page**. Pick the page, the day it appears, and a priority.
4. In **People**, open a person's row and set their track and **Start** date.
5. Change the milestones, if you want to, under **Settings**.

> [!tip]
> Nobody sees a page before its day. The day counts working days from their start date.

> [!note]+ More detail
> **The cushion.** The first milestone is the new staff cushion, ten working days by default. A new person gets onboarding pages one day at a time, and only Critical must reads. Everything else waits until the cushion ends. You can **Extend cushion a week** or **End cushion now** from their row.
>
> **A missed date.** It reads **Catch up** to the person, in yellow, and shows red to you.
>
> **Two tracks.** New staff is the full six months. Existing staff is for people who already work here, such as a lesson on a new feature.
>
> **Starting people by themselves.** Under **Settings** you can tick **Start anyone who opens Folio for the first time on the New staff track**.
>
> **Milestones.** About 22 working days make a month, and 130 make six. The first starts on day 1. Each one runs until the next begins.
>
> **Older pages.** If a page still carries the old must-read or onboarding properties, Users offers once to turn them into must reads or onboarding pages, so nothing set the old way is lost.

## Check the vault's health
%% card: Broken links, repeated numbers, and pages that break their template | icon: search | updated: 0.83 | key: vault-check %%

Vault check reads every page and lists what is wrong with the vault itself. On Home, open **Admin**, then **Vault check**. It runs as soon as you open it, and it saves nothing but your dismissals. The numbers match the picture.

![[ad-vault-check.png|564]]
*Vault check: problems with the vault itself, grouped by kind.*

1. **Run again** after you have changed things in Obsidian.
2. Findings are grouped by weight: hard failures, warnings, then information.
3. Each finding names the pages and offers a fix, or **Dismiss**.

Below that, **Format health** checks every page against its template. It never judges what a page says, only its shape.

![[ad-format-health.png|564]]
*Format health: every page against its template. Content is never judged.*

1. How many format findings there are, and how serious.
2. One row for each rule.
3. **Show pages** lists the pages that break it. **Edit rule** opens the rule.

> [!tip]
> Do not chase the list to zero the first time. Pages written before templates existed have no type, so most of them start under Information.

> [!note]+ More detail
> **Hard failures.** A broken link. A page with two blocks of properties. A number used by two pages in the same top folder.
>
> **Warnings and information.** Two pages about the same subject. A page that no other page links to. A page with no number, or a number that does not match its name. A page sitting outside any folder. Comments whose page cannot be found.
>
> **Fixes that need no thought.** **Write numbers** adds the number property to pages that lack it. **Match the name** makes the property agree with the file name. **Move to drafts** moves a loose page into the Drafts folder. **Park old files** tidies old comment files into `zSystem/_old/`. For a repeated number or a missing one, rename the page in Obsidian.
>
> **Dismiss.** It asks for a note, and records who and when. If the save fails, nothing is dismissed and Folio says so.
>
> **Small fixes in Format health.** Leftover guide boxes, grey notes on a reviewed page, missing properties, and properties out of order. **Preview fix** shows exactly what will change. **Apply** writes it. It never shows in What's New, and a signed-off page stays signed off.
>
> **Everything else is fixed by hand.** **Copy Fix a page prompt** copies the page with its template and rules for your AI. **Open in Obsidian** opens the page.
>
> **Pages with no template** are checked against the Format rules only, one level lighter. The **No type** row names them.

## See what people read
%% card: Which pages earn their place, and what people search for | icon: chart | updated: 0.83 | key: usage %%

Usage shows what the team actually reads. On Home, open **Admin**, then **Usage**. The numbers match the picture.

![[ad-usage.png|594]]
*Usage: which pages earn their place.*

1. **Pages**, **Searches** or **People**.
2. How many pages were read, and how many were never opened.
3. The most read pages, with how many people read each and how many times it was opened.

> [!tip]
> A read is 15 seconds of real attention, so a wrong click does not count. A page that is opened often but read rarely is the one to look at.

> [!note]+ More detail
> **Pages.** Most read, **Never opened**, and **Gone quiet**, which is a page that used to be read and stopped for a month or more. Click the readers badge on a row to see who read it and how many times. Never opened has nobody to name, and Gone quiet is left anonymous on purpose.
>
> **Searches.** What people looked for and found nothing for, what they clicked that was the wrong page, and what they had to reword. It never names anyone.
>
> **People.** Each person's reads, pages and when they were last seen. It is never cut short, because the people who read nothing are the ones to see.
>
> **A dash, not a nought.** A page opened before reads were counted shows a dash. A nought would claim nobody read it when nobody was counting.
>
> **What is recorded.** Folio notes which page you are on once it has loaded, and how long you stayed, and writes it when you leave. It goes in a small file in the vault under `zSystem/Analytics`, one per person per month. You can delete those files at any time and they start again. Everyone is recorded. Only Administrators see the report. The files are ordinary Markdown, so anyone who can open the vault in Obsidian can read them.
>
> **How fresh.** Your own reading appears quickly. Other people's can lag by up to one sitting, plus however long OneDrive takes to sync.

## Send the staff update
%% card: An email about what changed, ready to copy | icon: mail | updated: 0.83 | key: staff-update %%

Staff update turns what changed in the vault into an email. It collects, you choose, and it copies. It never sends anything itself. On Home, open **Admin**, then **Staff update**. The numbers match the picture.

![[ad-staff.png|594]]
*Staff update: the email, written from what changed.*

1. **Copy for email**, or **Open in Outlook**.
2. The opening lines are yours to edit. They are saved in the vault, so they are the same on every PC.
3. Each item has a tick box, **Delay** and **Skip**.

> [!tip]
> To send: untick what you do not want, click **Copy for email**, paste it into a new message, send it, then click **Mark sent**.

> [!note]+ More detail
> **It is a list, not a schedule.** New pages, changed pages, must reads and app updates land on the list as they happen. They stay until you deal with each one. Send when there is something worth sending.
>
> **The three choices.** **Mark sent** takes everything ticked off the list. **Skip** drops an item that is too small to mention. **Delay** keeps it on the list, at the bottom, and leaves it out of the copy. **Undo** reverses your last marking.
>
> **It comes back.** An item you marked returns if the page changes again.
>
> **Open in Outlook** starts a new message to the people in **Send to**, with the body empty. A link can only carry plain text, so paste after you copy.
>
> **Reset to default** brings back the standard opening.
>
> **What it says about must reads.** Opening a required page is what clears it, so the email says that, and calls them newly assigned or still assigned.

## Edit a page inside Folio
%% card: Change a page without leaving Folio | icon: pencil | updated: 0.83 | key: edit-in-folio %%

Most pages are written in Obsidian. For a quick fix, Administrators can edit in Folio.

1. Open the page and click **More**, then **Edit**.
2. Change the text. You see the Markdown itself, not the finished page.
3. Click **Save**, or **Cancel** to leave it as it was.

> [!tip]
> Typing `[[` offers page names, and `[[page#` offers that page's headings.

> [!note]+ More detail
> **When you save.** Folio first checks nobody else saved the page while you had it open. If they did, it stops and tells you. Then the page is marked To be reviewed, and a record of exactly what changed is kept so a Contributor can accept or reject it.
>
> **Properties.** **More**, then **Properties** edits a page's properties. This applies quietly: no review is triggered and the page does not show as updated.
>
> **Task boxes.** Ticking a `- [ ]` box on a page is saved straight away and quietly.
>
> **Two apps, one set of files.** The vault is the same folder Obsidian opens. Change a page in one and it is changed in the other.
>
> **Writing it.** [Editing in Obsidian](help-edit.md) covers the syntax.

## Choose where new pages wait
%% card: The Drafts folder, and the page Folio opens first | icon: folder | updated: 0.86 | key: drafts-folder %%

New pages, and any page found loose outside a folder, go to one folder until they are filed. It starts as Working Drafts.

1. Click your initials, top right, then **Settings**, then the **Advanced** tab.
2. Under **Vault setup**, click **Change** beside **Drafts folder**.
3. Pick the folder and confirm.

> [!tip]
> Pages in the Drafts folder show **Draft** at the top, so readers know they are work in progress.

> [!note]+ More detail
> **Default page.** Vault setup also has a Default page, the page the **Browse** door opens first.
>
> **Demo.** Vault setup also has **Demo**. See Show Folio to someone.
>
> **Renaming and moving** are done in Obsidian, so every link follows. Folio never renames a page. A page that is renamed, renumbered or moved keeps its saved pages, comments, review history and usage.
>
> **One case Folio cannot follow.** If a page's name, number and text all change before Folio has looked, it cannot tell which page is which, and its comments show under **Comments with no page** in Vault check. Rename a page, or edit it, but not both at once.

## Show Folio to someone
%% card: A sample vault to demonstrate every feature, then reset | icon: sparkle | updated: 0.86 | key: demo %%

Demo opens a sample vault in this window, so you can show Folio without touching your own vault or anyone's reading record. It suits a meeting or an introduction for leaders.

1. Click your initials, top right, then **Settings**, then the **Advanced** tab.
2. Under **Vault setup**, click **Start** beside **Demo**. A purple bar appears along the top.
3. Click **Guide** on the bar to open the walkthrough. Print it to follow beside the demo: for each person it says what to click, what to say, and what they will see.
4. Use **Viewing as** to switch between the seven people in the sample vault, grouped as Users, Contributors and Administrators.
5. Click **Exit demo** when you are done. Your own vault comes back.

> [!tip]
> Start as Ellen Ward, a new hire. Her must reads, onboarding plan and What's New show the reader's side first. Then switch to a Contributor and an Administrator.

> [!note]+ More detail
> **What it starts with.** Every built feature has something waiting: changed pages in What's New and Review, open comments, must reads and onboarding owed, a month of usage, templates and a company section of process, travel, IT and contact pages with links to example company systems.
>
> **The clock.** The demo always opens on a Monday morning and runs on from there, so due dates and What's New read the same every time. The must read timer is shortened to 15 seconds so the demo keeps moving.
>
> **Nothing is kept.** Anything done in the demo, comments, approvals and reads included, is thrown away at Exit or when the window closes. **Reset** starts it over without leaving.
>
> **Your own settings.** Folio puts them aside while the demo runs and gives them back when it ends, even if the window was closed. Switch in your initials menu opens the Viewing as list during a demo, not the real sign-in.
>
> **Obsidian is not part of it.** Writing in Obsidian is shown separately.

## Something is wrong
%% card: Fixes by what you see | icon: alert | updated: 0.83 | key: trouble %%

Find what you see below and open it. Each one says why it happens, then what to do.

### Someone says they cannot see Review or Admin
Cause: their access level is User. Admin shows only what a level includes.

Fix: open **Users**, find their row, and change the drop-down. It reaches them the next time they open Folio.

### I can no longer get in as an Administrator
Cause: the passwords are set and the Administrator one is forgotten, or the last Administrator was removed.

Fix: delete `zSystem/auth.json` in the vault, go back to Folio, choose Administrator, and set both passwords again. See Set the passwords.

### Vault check says a page is outside a folder
Cause: a page was saved at the top of the vault, with no folder.

Fix: use **Move to drafts** on that row, then file it properly in Obsidian.

### A person does not show in Users
Cause: people appear by opening Folio and typing their name. They may not have yet.

Fix: ask them to open Folio once. Check they did the first-five-minutes steps in [Using Folio](help.md).

### The staff update list is empty
Cause: nothing has changed since you last marked everything, or what changed was marked Skip.

Fix: nothing to do. A page that changes again comes back on the list.

### Usage shows a dash instead of a number
Cause: the page was opened before reads were counted, so there is no honest number to show.

Fix: none needed. New reads count from now on.
