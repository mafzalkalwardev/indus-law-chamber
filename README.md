# Indus Law Chamber

Official site for Indus Law Chamber, the practice of Advocate Mahfil Hussain Kalwar.

The public pages introduce the chamber and take inquiries. Approved accounts can read research notes the chamber writes itself, and clients can open only the matters assigned to them. Staff publish articles, notes, and the contact details.

This site does not copy or sync Pakistan Law Site.

The public pages are on GitHub Pages at https://mafzalkalwardev.github.io/indus-law-chamber/.

Sign-in, stored inquiries, and the client portal run on the Oracle VPS at https://induslaw.89.168.127.135.nip.io. GitHub Pages only serves the public pages.

## Setup

```bash
npm install
npm run db:push
npm run dev
```

Copy `.env.example` to `.env`. Set `DATABASE_URL`, `ORIGIN`, and `BETTER_AUTH_SECRET`. To create the first admin, also set `ADMIN_EMAIL` and `ADMIN_PASSWORD`, then start the app once. Change that password after signing in.

WhatsApp buttons stay hidden until a number is saved under Desk → Settings.
