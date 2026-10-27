# Build notes — Sambit

**Product prompt (exact):** "Build me a budget tracker that lets me log expenses by voice."

## Build time
- **v1 (from the prompt alone):** 139 seconds (1792742767 → 1792742906).
- **v2 (restyle to a mobile-first layout inspired by a reference app's screenshots):** 119 seconds (1793101444 → 1793101563). Not rounded; includes the time spent reading the reference screenshots. v1 remains in git history.

## Decisions the prompt left open
- **Name:** "Sambit" (Tagalog for "to utter"). Fictional; I could not check trademarks offline, so search before public use.
- **Stack:** plain HTML/CSS/JS, no build step, no backend; data in localStorage. Voice via Web Speech API (`en-PH`), same parser as the typed fallback. Voice was not tested with a real microphone.
- **Budget:** default ₱30,000/month, editable (tap the Budget pill). Category budgets are fixed shares of it (Food 25%, Transport 10%, Bills 40%, Fun 10%, Savings 15%).
- **Parser:** first number = amount; dates: today, yesterday, "N days ago", weekdays; income words ("received", "salary"…) make an income entry; categories by keyword, default Fun.
- **Seed data:** 17 expenses + 2 income entries, 5 fake accounts and 5 fake bills, all dated relative to today within the current month.

## v2: what was borrowed and what wasn't
The reference screenshots were supplied by the presenter. I took only generic structure: a greeting with a mascot tip bubble, a quick-actions row, a donut + "this week" pair, payments due, a Home/Wallet/Plan/History tab bar with a floating add button, and an accounts screen with net worth and account cards.
Everything visible is original: the name, the mascot (Pip, a round bird drawn in SVG), the palette (indigo/lavender, not green), the copy, the icons, and fictional account/bill names with no real bank, wallet or brand logos. It is a structural homage, not a 1:1 copy, and should not be presented as the reference app.
- Demo-only: Goals, Debt, Planned and Installments quick actions show a "not in this demo" toast.
- Desktop shows the mobile app inside a phone frame; mobile screenshots are viewport captures (not full-page).
- Screenshots: Playwright + Chromium, reduced motion, scrollbars hidden. Dates in the images are the day they were taken (27 Oct 2026). Extra: `screenshots/mobile-wallet.png`.
- **Network:** only the DM Sans stylesheet; system sans fallback offline.
