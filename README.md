# QuotePilot MVP v0.1

This is the first working version of the quotation SaaS.

## What it does
- Create a quotation
- Add customer details
- Add multiple line items
- Automatically calculate subtotal, VAT, and total
- Live professional quotation preview
- Print or save as PDF using the browser

## What is intentionally NOT included yet
- Login/signup
- Database
- Saved quotations
- AI-generated descriptions
- Email sending
- Admin ON/OFF control
- Customer accounts

Those come in the next versions after the core quote builder works.

## Run on your Mac

1. Install Node.js LTS from https://nodejs.org
2. Open Terminal
3. Go into this project folder
4. Run:

```bash
npm install
npm run dev
```

5. Open http://localhost:3000

## Next build step (v0.2)
We will add Supabase so quotes can be saved, edited, listed, and deleted.
