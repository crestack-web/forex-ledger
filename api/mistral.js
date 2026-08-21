// Vercel: POST /api/mistral  body: { messages, model? }
// Env: MISTRAL_API_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const key = process.env.MISTRAL_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'MISTRAL_API_KEY not set on Vercel' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); }
  }

  const model = body.model || (body.hasImage ? 'pixtral-12b-2409' : 'mistral-small-latest');
  const payload = {
    model,
    messages: body.messages || [],
    temperature: body.temperature != null ? body.temperature : 0.3,
    max_tokens: body.max_tokens || 600
  };

  try {
    const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    res.status(r.status).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
