// POST /api/mistral — Requires env: MISTRAL_API_KEY

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'POST only' }));
  }

  const key = process.env.MISTRAL_API_KEY || '';
  if (!key) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'MISTRAL_API_KEY is not set on this Vercel deployment' }));
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  }
  body = body || {};

  const hasImage = !!body.hasImage;
  const model = body.model || (hasImage ? 'pixtral-12b-2409' : 'mistral-small-latest');
  const payload = {
    model,
    messages: body.messages || [],
    temperature: body.temperature != null ? body.temperature : 0.3,
    max_tokens: body.max_tokens || 650
  };

  try {
    const upstream = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify(payload)
    });
    const data = await upstream.json();
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: e.message || 'Upstream failed' }));
  }
};
