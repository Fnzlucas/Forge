export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { cjToken, keyword, page = 1, limit = 20 } = req.query;
  if (!cjToken || !keyword) return res.status(400).json({ error: 'Missing params' });
  try {
    const r = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=${page}&pageSize=${limit}&productNameEn=${encodeURIComponent(keyword)}`, {
      headers: { 'CJ-Access-Token': cjToken }
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
