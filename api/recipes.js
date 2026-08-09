const { Redis } = require('@upstash/redis');
const { requireAuth } = require('./_auth');

const redis = Redis.fromEnv();
const KEY = 'recipes';

function uid() {
  return 'r_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

module.exports = async (req, res) => {
  if (!requireAuth(req, res)) return;

  if (req.method === 'GET') {
    const recipes = (await redis.get(KEY)) || [];
    return res.status(200).json(recipes);
  }

  if (req.method === 'POST') {
    const { title, ingredients, photo } = req.body || {};
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'A title is required.' });
    }
    const recipes = (await redis.get(KEY)) || [];
    const recipe = {
      id: uid(),
      title: title.trim(),
      ingredients: Array.isArray(ingredients) ? ingredients.filter(Boolean) : [],
      photo: typeof photo === 'string' ? photo : null,
      createdAt: Date.now()
    };
    recipes.push(recipe);
    await redis.set(KEY, recipes);
    return res.status(201).json(recipe);
  }

  res.setHeader('Allow', 'GET, POST');
  res.status(405).end('Method not allowed');
};
