# Visit notifications → Telegram

When someone opens the site, a small beacon is sent to a Cloudflare Worker,
which messages you on Telegram. The bot token lives only in the Worker, never
in the website's source.

## 1. Make a Telegram bot

1. In Telegram, open **@BotFather** → `/newbot` → follow the prompts.
2. Copy the **bot token** it gives you (looks like `123456:ABC-DEF...`).
3. Open **@userinfobot** and send it any message to get your **chat id** (a number).
4. Send your new bot any message once (`/start`), so it is allowed to message you.

## 2. Deploy the Worker (free)

From this `worker/` folder:

```bash
npm install -g wrangler        # one time
wrangler login                 # opens the browser
wrangler secret put TELEGRAM_BOT_TOKEN   # paste the bot token
wrangler secret put TELEGRAM_CHAT_ID     # paste your chat id
wrangler deploy
```

`wrangler deploy` prints a URL like
`https://visit-notify.<your-subdomain>.workers.dev`. Copy it.

(Optional) In `wrangler.toml`, set `ALLOW_ORIGIN` to your site's exact origin
instead of `"*"`, then `wrangler deploy` again.

## 3. Point the site at it

Set this when building the site (e.g. in the host's env vars, or a `.env` file):

```
NEXT_PUBLIC_VISIT_PING_URL=https://visit-notify.<your-subdomain>.workers.dev
```

Rebuild/redeploy the site. That's it — open the site and you should get a
Telegram message. If the variable is unset, the site simply sends nothing.

## Test the Worker directly

```bash
curl -X POST https://visit-notify.<your-subdomain>.workers.dev \
  -H "Content-Type: text/plain" \
  --data '{"path":"/","referrer":"test"}'
```

## Notes

- The message includes: time, page, referrer, coarse location (city/region/
  country from the IP), IP, browser timezone/language/screen, and user agent.
- It fires once per browser session, so reloads and page turns don't re-notify.
- Nothing here asks the visitor for permission or uses their camera, mic or
  precise GPS. If visitors may be in the EU/UK, disclosing analytics in a short
  privacy note is usually expected.
