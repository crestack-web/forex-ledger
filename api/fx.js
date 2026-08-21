// GET /api/fx?from=XAU&to=USD&mode=spot|daily
// Requires env: ALPHA_VANTAGE_API

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const key = process.env.ALPHA_VANTAGE_API || process.env.ALPHA_VANTAGE_KEY || '';
  if (!key) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({
      error: 'ALPHA_VANTAGE_API is not set on this Vercel deployment. Add it under Project Settings → Environment Variables for Production, then Redeploy.'
    }));
  }

  const q = req.query || {};
  const from = String(q.from || 'USD').toUpperCase().replace(/[^A-Z]/g, '');
  const to = String(q.to || 'JPY').toUpperCase().replace(/[^A-Z]/g, '');
  const mode = q.mode === 'daily' ? 'daily' : 'spot';

  if (!from || !to) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'from and to are required' }));
  }

  const url =
    mode === 'daily'
      ? `https://www.alphavantage.co/query?function=FX_DAILY&from_currency=${from}&to_currency=${to}&apikey=${encodeURIComponent(key)}`
      : `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${encodeURIComponent(key)}`;

  try {
    const upstream = await fetch(url);
    const text = await upstream.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ error: 'Alpha Vantage returned non-JSON', raw: text.slice(0, 200) }));
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data));
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: e.message || 'Upstream fetch failed' }));
  }
};
