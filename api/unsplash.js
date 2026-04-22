export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { unsplashKey, keyword } = req.query;
  if (!unsplashKey || !keyword) return res.status(400).json({ error: 'Missing params' });
  try {
    const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(keyword)}&per_page=1&orientation=landscape`, {
      headers: { Authorization: `Client-ID ${unsplashKey}` }
    });
    const data = await r.json();
    if (data.results && data.results.length > 0) {
      const photo = data.results[0];
      res.status(200).json({ url: photo.urls.regular, thumb: photo.urls.small, alt: photo.alt_description || keyword, author: photo.user.name, authorUrl: photo.user.links.html });
    } else {
      res.status(404).json({ error: 'No photo found' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
