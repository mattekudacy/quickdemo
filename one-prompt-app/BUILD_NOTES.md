# Build notes — Sambit

**Product prompt (exact):** "Build me a budget tracker that lets me log expenses by voice."

**Build time:** 139 seconds (`date +%s` start: 1792742767, end: 1792742906; not rounded).

## Decisions the prompt left open
- **Name:** "Sambit" (Tagalog for "to utter"). No logo, just a gradient dot. I couldn't check trademark databases offline, so a quick search before using it publicly is wise.
- **Stack:** plain HTML/CSS/JS (~215 lines), no build step, no backend; data in localStorage. Runs with `python3 -m http.server`.
- **Budget:** default ₱30,000/month, editable via the "Budget" link.
- **Seed data:** 15 fake transactions across Food, Transport, Bills, Fun, Savings, dated relative to today and clamped to the current month. Seeded only when localStorage is empty.
- **Savings** counts toward the monthly total and category chart (it's money set aside from the budget).
- **Voice:** Web Speech API, `en-PH`, one utterance per tap, goes through the same parser as typed text and is added immediately. Unsupported browsers (e.g. Firefox) get a message pointing to the text box. Voice was not tested with a real microphone.
- **Parser:** first number = amount (accepts ₱, php, pesos, commas); dates: today, yesterday, "N days ago", weekday names; the rest becomes the description. Category via keyword lists, default "Fun" when nothing matches. Spelled-out numbers ("two fifty") aren't parsed; speech engines usually return digits.
- **Live preview:** typing shows parsed amount/category/date chips before you press Add.
- **Chart:** simple horizontal bars, not a donut, so it stays readable at 390px.
- **Recent list:** latest 5 transactions; no delete/edit.
- **Screenshots:** Playwright + Chromium, reduced motion, scrollbars hidden. Desktop 1600x1000@2x is viewport-only; mobile is full page at 390 wide @3x (3399px tall) since it scrolls. Dates in the images reflect the day they were taken (23 Oct 2026).
- **Network:** the only external request is the DM Sans Google Fonts stylesheet; system sans fallback offline.
