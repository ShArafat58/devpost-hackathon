---
doc: scope
status: approved
---

# Ghostlisted

Before you apply, find out if anyone's really hiring.

## The Unique Kernel
Ghostlisted targets fresh graduates by combining scam detection, ghost job analysis, and fresher-mismatch detection into a single evidence-based report. Unlike traditional job-board scanners, it analyzes pasted text and social screenshots (Facebook, WhatsApp) and backs every signal with exact quotes from the post—never making unprovable claims of post fakeness.

## Who It's For
Fresh graduates and entry-level job seekers (0–2 years experience) navigating job boards, social media groups, and messaging app forwards. Today, they waste weeks applying to dead-end listings; Ghostlisted helps them spot warning signals before investing time.

## The Core Loop
1. User pastes job post text or uploads a screenshot.
2. User answers 3 quick context questions (source, post age, repost frequency).
3. User clicks "Check this post".
4. User receives a 3-lane report (Scam, Ghost, Fresher Mismatch) highlighting exact quoted text, signal strengths (Low / Medium / High), a recommended next move (Apply / Verify first / Skip), and 2-3 concrete verification steps.

## Inspiration & Identity
Focused, trustworthy, clean, and empowering. English UI with original-language text quotes (English/Bengali). Fictional sample posts for instant testing.

## Why This Matters to the Learner
The learner graduated 3-4 months ago and is still job hunting. They applied to a large company's fresher trainee post (5 seats, clear deadline), heard nothing for over a month, and later learned the company had hired one senior engineer instead. They want a tool that surfaces the warning signs they could not read at the time.

## What "Working" Looks Like
A responsive single-page web app where a user can select built-in sample posts (or input custom text/screenshots), submit 3 context questions, and view, within seconds, an evidence-based report with highlighted quotes, 3 signal lanes, and actionable verification steps powered by a free-tier AI API.

## The POC Boundary
- Single-page web app with loading, empty, and error states.
- Support for text input and screenshot image upload.
- For screenshots, the text extracted from the image is shown on screen, and quoted evidence is highlighted in that extracted text.
- 3 context questions (source platform, age, repost status).
- 3 signal lanes: Scam, Ghost, Fresher Mismatch (Low/Medium/High strength + exact quoted lines).
- Recommended next move (Apply / Verify first / Skip) + 2-3 verification steps.
- 2–3 pre-loaded fictional sample posts for instant demonstration.
- Mobile responsive UI.

## Later
- Community signal reporting & crowd-sourced feedback.
- Browser extension for inline job board checking.
- Saved user history & search log dashboard.
- Direct URL scraping.

## Explicitly Cut
- User accounts and authentication (unnecessary setup friction for a proof of concept).
- Live company database or external company scrapers (avoids complexity and rate limits).
- Job search engine or resume optimization tools (dilutes focus from signal verification).
- Scraping external URLs directly (unreliable due to CORS/bot protection/paywalls).
