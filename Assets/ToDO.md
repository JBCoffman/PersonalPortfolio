# Personal Portfolio — Site Status & Tasks

---

## PRODUCTION — What users actually see

| Page | File | Status |
|------|------|--------|
| Home | `index.html` | ✅ Live |
| Selected Work | `selected-work.html` | ✅ Live |
| Let's Talk | `contact.html` | ✅ Live |

**What's in the live nav:** Home · Selected Work · Let's Talk

---

## IN CODE — Exists but not linked in nav

These pages are built (some partially) but commented out of the nav on live pages. A direct URL will load them.

| Page | File | State |
|------|------|-------|
| Work With Me | `work-with-me.html` | 🟡 Built, needs copy + design updates |
| Executive Profile | `executive-profile.html` | 🔴 Has real content but multiple placeholders (dates, prior experience, wins) |
| About | `about.html` | 🟡 Built, appears complete |
| Ventures | `ventures.html` | 🔴 All placeholder content — 3 empty venture cards |
| Fun | `fun.html` | 🟡 Built, status unknown |

**Nav inconsistency:** `contact.html` and `work-with-me.html` still have all pages uncommented in their navs — they reflect an older nav state and need to be updated to match the live nav.

---

## HIDDEN WITHIN LIVE PAGES

Things in production code that users don't see but are sitting there:

- **`index.html` line 53** — Hero portrait `display:none`. Not ready to show yet.
- **`index.html` line 297** — "View Ventures" button links to `ventures.html` (placeholder page). This is a live link on the homepage.
- **`selected-work.html` line 54** — Body copy links to `executive-profile.html` ("the executive profile page has one"). That page is not in the nav.
- **`contact.html` line 121** — Email in footer has wrong format: `[ hello@jakecoffman.me ]` with brackets.
- **`contact.html` line 172** — Availability status is a placeholder: `[ Placeholder — update with real availability... ]`

---

## ASSETS

| File | Purpose |
|------|---------|
| `Assets/JakeBCoffmanResume.pdf` | Resume — desktop, linked in all page footers |
| `Assets/jake_coffman_mobile_resume.html` | Resume — mobile, auto-routed on phones via JS |
| `Assets/jake-coffman-style-guide.html` | Brand system reference |
| `Assets/Blueprint.md` | Site architecture and copy strategy |
| `Assets/ToDO.md` | This file |

**Resume routing:** `js/main.js` automatically swaps the PDF link to the mobile resume on screens ≤ 767px wide.

---

## OUTSTANDING TASKS

### Homepage
1. Combine Selected Work, About, Executive Profile
2. Clean up track record metrics
3. Add stylized headshot to footer near links
4. Remove or fix the "View Ventures" button (links to placeholder page)

### Contact
1. Wire up form to n8n
2. Fix email in footer — remove brackets from `[ hello@jakecoffman.me ]`
3. Update availability placeholder with real status
4. Add a red sharpie drawing that turns me into a vicious cartoon shark overtop of headshot OR have "bite" chomp on hover/click

### Work With Me
1. Update hero to use Excalifont
2. Update hero subtext to be more accurate
3. Figure out what to call "positioning" and what actually matters there
4. Make engagement types more pricing-and-packaging friendly — good/better/best step-up
5. Problems I solve — turn into a functional magic 8-ball experience
6. Ideal client profile — less wordy, easier to parse (maybe same table from index)
7. What working together looks like — copy updates
8. Tweak FAQ questions, remove verticals/replace with something industry-agnostic
9. Footer CTA needs Excalifont

### Executive Profile
1. Fill in placeholder dates on jobs
2. Add prior experience section
3. Add 3 missing win bullets
4. Fix nav to match live nav (currently shows all pages)

### Ventures
1. Add real venture content (name, description, industry, role, stage, link)
2. Fix nav to match live nav

### Contact nav
1. Update nav to match live nav (currently shows all pages)
