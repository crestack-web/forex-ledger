// Vercel serverless: /api/fx?from=USD&to=JPY&mode=spot|daily
// Env: ALPHA_VANTAGE_API (preferred) or ALPHA_VANTAGE_KEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.ALPHA_VANTAGE_API || process.env.ALPHA_VANTAGE_KEY;
  if (!key) {
    return res.status(500).json({
      error: 'Set ALPHA_VANTAGE_API (or ALPHA_VANTAGE_KEY) in Vercel environment variables'
    });
  }

  const from = String(req.query.from || 'USD').toUpperCase();
  const to = String(req.query.to || 'JPY').toUpperCase();
  const mode = req.query.mode || 'spot';

  let url;
  if (mode === 'daily') {
    url = `https://www.alphavantage.co/query?function=FX_DAILY&from_currency=${from}&to_currency=${to}&apikey=${key}`;
  } else {
    url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${key}`;
  }

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
}
