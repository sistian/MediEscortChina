# MediEscortChina Vercel Backend

This is a controllable, self-hosted Vercel backend that replaces formsubmit.co for all MediEscortChina forms.

## What it does

- Receives form submissions from:
  - `contact.html` (general contact form)
  - `quote.html` (quote request form)
  - `appt-booking.html` (hospital appointment booking)
  - `escort-booking.html` (escort & translation booking)
- Validates the honeypot field (`website` / `_honey`) and basic email format.
- Limits request size to 100 KB to prevent abuse.
- Formats the submitted data into a readable HTML table and plain-text list for your email inbox.
- Builds a descriptive email subject from the form type.
- Sends the email via SendGrid v3 API to `RECIPIENT_EMAIL`.
- Redirects the visitor to `SUCCESS_URL` after a successful submission.
- Supports CORS for separate frontend/backend deployments.

## Files

- `api/submit.js` — Vercel serverless function that handles all form POSTs.
- `package.json` — Project metadata so Vercel recognizes a Node.js project.
- `vercel.json` — CORS headers for the submit endpoint.
- `.env.example` — Environment variables you need to set in Vercel.

## Deploy to Vercel

1. Sign in to [vercel.com](https://vercel.com).
2. Create a new project and import this folder (`MediEscortChina-Website SEO and Safe 8.3`).
3. In **Project Settings → Environment Variables**, add the variables from `.env.example`.
   - `SENDGRID_API_KEY` is required. Create a free SendGrid account and generate a API key.
   - `SENDGRID_FROM_EMAIL` must be a verified sender in SendGrid.
4. Deploy. The endpoint will be:

   ```
   https://<your-project>.vercel.app/api/submit
   ```

## Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `SENDGRID_API_KEY` | Yes | — | SendGrid API key for sending emails |
| `SENDGRID_FROM_EMAIL` | No | `noreply@mediescortchina.com` | Verified sender address |
| `RECIPIENT_EMAIL` | No | `sistian@foxmail.com` | Where submissions are received |
| `SUCCESS_URL` | No | `https://www.mediescortchina.com/thank-you.html` | Redirect after success |
| `REPLY_TO_FIELD` | No | `email` | Form field used as reply-to address |
| `ALLOWED_ORIGINS` | No | `*` | CORS origin(s) allowed |

## Testing

After deployment, send a test POST:

```bash
curl -X POST https://<your-project>.vercel.app/api/submit \
  -d "email=test@example.com&name=Test User&service=health-checkup&message=Hello"
```

You should receive an email at `RECIPIENT_EMAIL` and be redirected to `SUCCESS_URL`.

## Security notes

- Keep `SENDGRID_API_KEY` secret; never commit it.
- Each form includes a honeypot field (`website` or `_honey`). If it is filled, the submission is silently dropped.
- The backend ignores formsubmit-specific hidden fields (`_next`, `_template`, `_captcha`, `_replyto`, `_cc`).
- The `form-action` CSP directive must include the backend domain if it is not same-origin.
