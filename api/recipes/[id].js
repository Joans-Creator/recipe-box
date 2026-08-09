const { Redis } = require('@upstash/redis');
const { requireAuth } = require('../_auth');

const redis = Redis.fromEnv();
const KEY = 'recipes';

module.exports = async (req, res) => {
  if (!requireAuth(req, res)) return;

  const { id } = req.query;
  const recipes = (await redis.get(KEY)) || [];

  if (req.method === 'PUT') {
    const idx = recipes.findIndex(r => r.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Recipe not found.' });
    const { title, ingredients, photo } = req.body || {};
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'A title is required.' });
    }
    recipes[idx] = {
      ...recipes[idx],
      title: title.trim(),
      ingredients: Array.isArray(ingredients) ? ingredients.filter(Boolean) : [],
      photo: photo === undefined ? recipes[idx].photo : photo
    };
    await redis.set(KEY, recipes);
    return res.status(200).json(recipes[idx]);
  }

  if (req.method === 'DELETE') {
    const next = recipes.filter(r => r.id !== id);
    if (next.length === recipes.length) return res.status(404).json({ error: 'Recipe not found.' });
    await redis.set(KEY, next);
    return res.status(204).end();
  }

  res.setHeader('Allow', 'PUT, DELETE');
  res.status(405).end('Method not allowed');
};
