export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { store, token } = req.query;
  if (!store || !token) return res.status(400).json({ error: 'Missing params' });
  try {
    if (req.method === 'GET') {
      const r = await fetch(`https://${store}/admin/api/2026-04/blogs.json`, { headers: { 'X-Shopify-Access-Token': token } });
      const data = await r.json();
      res.status(200).json(data);
    } else {
      const { blogId, article } = req.body;
      const r = await fetch(`https://${store}/admin/api/2026-04/blogs/${blogId}/articles.json`, {
        method: 'POST',
        headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ article })
      });
      const data = await r.json();
      res.status(r.status).json(data);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
