export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { anthropicKey, title, productType, tags, mode = 'product' } = req.body;
  if (!anthropicKey || !title) return res.status(400).json({ error: 'Missing params' });
  const prompt = mode === 'blog'
    ? `Tu es un expert SEO e-commerce. Genere un article de blog SEO complet en JSON :
{"title_fr":"Titre accrocheur SEO en francais","title_en":"Catchy SEO title in English","body_fr":"<p>Article complet 400-600 mots en francais sur le sujet : ${title}. SEO puissant, structure H2/H3, naturel et engageant.</p>","body_en":"<p>Complete 400-600 word article in English about: ${title}. Powerful SEO, H2/H3 structure, natural and engaging.</p>"}
Reponds UNIQUEMENT avec le JSON.`
    : `Tu es un expert copywriting SEO e-commerce haut de gamme.
Produit : ${title}
Type : ${productType || 'Produit'}
Tags : ${tags || 'mode, qualite'}
Genere en JSON :
{"title_fr":"Titre produit SEO francais max 70 chars","title_en":"SEO product title English max 70 chars","desc_fr":"<p>Description 150-200 mots francais SEO premium mots-cles naturels benefices style. Balises <strong> sur mots cles.</p>","desc_en":"<p>150-200 word English description powerful SEO premium tone natural keywords benefits style. <strong> tags on keywords.</p>"}
Reponds UNIQUEMENT avec le JSON.`;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 1500, messages: [{ role: 'user', content: prompt }] })
    });
    const data = await r.json();
    let text = data.content[0].text.trim().replace(/```json|```/g, '').trim();
    res.status(200).json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
