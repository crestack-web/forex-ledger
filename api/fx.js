// Vercel serverless: GET /api/fx?from=XAU&to=USD&mode=spot|daily
// Env: ALPHA_VANTAGE_API (required)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.ALPHA_VANTAGE_API || process.env.ALPHA_VANTAGE_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'ALPHA_VANTAGE_API is not set in Vercel environment variables'
    });
  }

  const from = String(req.query.from || 'USD').toUpperCase().replace(/[^A-Z]/g, '');
  const to = String(req.query.to || 'JPY').toUpperCase().replace(/[^A-Z]/g, '');
  const mode = req.query.mode === 'daily' ? 'daily' : 'spot';

  const url =
    mode === 'daily'
      ? `https://www.alphavantage.co/query?function=FX_DAILY&from_currency=${from}&to_currency=${to}&apikey=${key}`
      : `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${key}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    // Pass through AV errors as 200 so client can read Note / Error Message
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: e.message || 'Upstream fetch failed' });
  }
}
