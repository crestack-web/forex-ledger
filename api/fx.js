// Vercel serverless: /api/fx?from=USD&to=JPY
// Set env ALPHA_VANTAGE_KEY in Vercel project settings (never commit the key).

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) {
    return res.status(500).json({ error: 'ALPHA_VANTAGE_KEY not set on server' });
  }

  const from = (req.query.from || 'USD').toUpperCase();
  const to = (req.query.to || 'JPY').toUpperCase();
  const mode = req.query.mode || 'spot'; // spot | daily

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
