# Assignment #2 - Mini CRM — AI Global Promo Helper

(Mimi’s Coffee Shop)

## The Story

Mimi runs Kopi Kita. After each purchase, he notes what people like—caramel, extra ice, oat milk, pastries, latte-art classes, etc. He doesn’t want random discounts. He wants smart promos that match what most of his customers seem to love right now.

Your task: build a tiny app that stores basic customer interests and uses AI to recommend global promos based on the whole customer base (not just one person).

---

# Goals

Create a small web app where Mimi can:

1. Add customers after purchase (with their interests/favorites).
2. Browse/search customers (by name or interests).
3. Get AI-generated global promo ideas that look at all customers and suggest:
   1. Which promo themes to run (e.g., “Caramel Series Week”, “Pastry Bundle Morning Promo”).
   2. Which customer segments to target (e.g., “Sweet drinks lovers”, “Oat milk fans”).
   3. Ready-to-send message text for WhatsApp/SMS/IG DM.
4. See a simple dashboard showing top interests and suggested campaigns for this week.

Include your prompts in the repo. The AI part is mandatory.

---

# What the App Should Do

## 1. Login

## 2. Customer List

Each customer stores:

- Name
- Contact (email/phone, optional)
- Favorite drink or product (free text)
- Interest tags (e.g., “sweet drinks”, “oat milk”, “pastry lover”, “workshop”)

Mimi can:

- add / edit / delete
- search by name
- filter by interests

---

## 3. Global AI Promo (the core feature)

A page called **“Promo Ideas”** that uses all customers to generate:

- Top 2–3 promo themes (what to run this week).
- For each theme:
  - Who to target (segment description).
  - Why now (1 short line using interest trends).
  - Ready message (1–2 friendly sentences + clear CTA).
  - Optional: Best time window (e.g., morning rush, weekend).

### Examples

**Theme: Caramel Week**

- Segment: people with tags “sweet drinks” or “caramel” (42 customers)
- Why now: sweet-drink interest is the largest group this month
- Message:  
  “Hi! New Caramel Cold Brew is in this week—get 10% off till Sunday. Mau coba besok pagi?”

**Theme: Pastry + Coffee Bundle**

- Segment: “pastry lovers” + morning buyers (18 customers)
- Why now: pastry interest trending up on weekdays
- Message:  
  “Coba latte + croissant bundle, hemat 10k. Berlaku 7–11 pagi. Mau saya simpanin?”

The AI can be driven by simple counts (e.g., most common tags) but must turn those insights into promo themes + segments + messages.

---

## 4. Dashboard Overview

Show:

- Total customers
- Top interests (counts)
- This week’s suggested campaigns (from the Global AI Promo page)
- Optional: quick links to copy promo message

---

## 5. AI Chatbot that is able to talk with existing data

---

## 6. Seed data to demonstrate how the application works

---

# Technical Notes

- Built as a full-stack **Next.js application**
- Emphasis on a polished UI — avoid generic “AI-generated” visual patterns.
- Any libraries are allowed. Show you are updated to trends!
- Prioritize free and open-source tooling wherever possible:
  - Vercel or Netlify for deployment
  - Nice-to-Have Neon or Supabase for the database layer
  - Google AI Studio, Groq, or OpenRouter for accessing free LLM API keys

---

# Nice to Have

- Your code demonstrates security best practice
- Your code demonstrates clean code & maintainable structure

---

# What to Submit

- Live link (Vercel/Netlify)
- GitHub repo link
