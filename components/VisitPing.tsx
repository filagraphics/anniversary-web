"use client";

import { useEffect } from "react";

/**
 * The notify endpoint (your Cloudflare Worker URL). This URL is not a secret —
 * the bot token lives in the Worker — so it is safe to bake in as the default.
 * An env var can still override it (e.g. for a staging endpoint).
 */
const ENDPOINT = process.env.NEXT_PUBLIC_VISIT_PING_URL || "https://notify.philipos.dev";

/**
 * Pings a small notify endpoint once per browser session when the site opens,
 * so you get a Telegram alert that someone has opened it. Collects only
 * ordinary analytics (page, referrer, timezone, language, screen); the server
 * adds coarse location from the visitor's IP. Does nothing without an endpoint,
 * and never blocks or affects the page.
 */
export default function VisitPing() {
  useEffect(() => {
    if (!ENDPOINT) return;

    // Once per browser session, so a reload or turning pages doesn't re-ping.
    try {
      if (sessionStorage.getItem("visit-pinged")) return;
      sessionStorage.setItem("visit-pinged", "1");
    } catch {
      // Private mode etc.: fall through and ping anyway.
    }

    const payload = JSON.stringify({
      path: location.pathname + location.search,
      referrer: document.referrer || "direct",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
    });

    // text/plain keeps it a "simple" request (no CORS preflight), which
    // sendBeacon needs; fetch(keepalive) is the fallback.
    try {
      const blob = new Blob([payload], { type: "text/plain;charset=UTF-8" });
      if (!navigator.sendBeacon(ENDPOINT, blob)) {
        void fetch(ENDPOINT, {
          method: "POST",
          body: payload,
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          keepalive: true,
        });
      }
    } catch {
      // Never let a notification problem affect the page.
    }
  }, []);

  return null;
}
