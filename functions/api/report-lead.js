// Cloudflare Pages Function: POST /api/report-lead
// Captures a forensic-report download lead into Streak as a box.
//
// Required environment variables (set as Cloudflare Pages secrets):
//   STREAK_API_KEY      - your Streak API key
//   STREAK_PIPELINE_KEY - the pipeline the inbound lead should land in
// Optional:
//   STREAK_STAGE_KEY    - the stage key for new inbound leads
//
// Until the secrets are set, the function soft-fails (returns ok:false,
// fallback:true) so the front-end still serves the download. No lead is
// captured until the key is configured.

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json().catch(() => ({}));

    // Honeypot: silently accept and drop bot submissions.
    if (data.hp) return json({ ok: true });

    const name = String(data.name || "").slice(0, 200).trim();
    const email = String(data.email || "").slice(0, 200).trim();
    const company = String(data.company || "").slice(0, 200).trim();
    const source = String(data.source || "website").slice(0, 120).trim();

    if (!email || !/.+@.+\..+/.test(email)) {
      return json({ ok: false, error: "invalid_email" }, 400);
    }

    const key = env.STREAK_API_KEY;
    const pipeline = env.STREAK_PIPELINE_KEY;
    if (!key || !pipeline) {
      // Not configured yet: let the client proceed with the download.
      return json({ ok: false, fallback: true, error: "not_configured" });
    }

    const auth = "Basic " + btoa(key + ":");
    const boxName = `${name || email} - sample report`;

    const createRes = await fetch(
      `https://www.streak.com/api/v1/pipelines/${pipeline}/boxes?name=${encodeURIComponent(boxName)}`,
      { method: "POST", headers: { Authorization: auth } }
    );
    if (!createRes.ok) {
      return json({ ok: false, fallback: true, error: "streak_create_failed" });
    }

    const box = await createRes.json();
    const boxKey = box.boxKey || box.key;

    // Best-effort: attach details and set the stage.
    const notes =
      `Lead from ${source}\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Company: ${company || "n/a"}\n` +
      `Asset: MOSS forensic report sample`;
    const update = { notes };
    if (env.STREAK_STAGE_KEY) update.stageKey = env.STREAK_STAGE_KEY;

    if (boxKey) {
      await fetch(`https://www.streak.com/api/v1/boxes/${boxKey}`, {
        method: "POST",
        headers: { Authorization: auth, "Content-Type": "application/json" },
        body: JSON.stringify(update),
      }).catch(() => {});
    }

    return json({ ok: true });
  } catch (e) {
    // Never trap the user on a server error.
    return json({ ok: false, fallback: true, error: "exception" });
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
