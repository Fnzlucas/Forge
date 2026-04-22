export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { store, token, page_info, limit = 250 } = req.query;
  if (!store || !token) return res.status(400).json({ error: 'Missing store or token' });
  let url = `https://${store}/admin/api/2026-04/products.json?limit=${limit}`;
  if (page_info) url += `&page_info=${page_info}`;
  try {
    const r = await fetch(url, { headers: { 'X-Shopify-Access-Token': token } });
    const linkHeader = r.headers.get('Link') || '';
    const data = await r.json();
    let nextPageInfo = null;
    if (linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/page_info=([^&>]+)[^>]*>;\s*rel="next"/);
      if (match) nextPageInfo = match[1];
    }
    res.status(r.status).json({ ...data, nextPageInfo });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
