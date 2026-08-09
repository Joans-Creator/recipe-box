// Optional password protection, shared by every API route.
// Set RECIPE_BOX_USER and RECIPE_BOX_PASS as Environment Variables in your
// Vercel project settings to require a login. Leave them unset and the
// app has no login at all — anyone with the URL can view/edit it.

function requireAuth(req, res) {
  const user = process.env.RECIPE_BOX_USER;
  const pass = process.env.RECIPE_BOX_PASS;
  if (!user || !pass) return true; // no auth configured, allow through

  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const sep = decoded.indexOf(':');
    const u = decoded.slice(0, sep);
    const p = decoded.slice(sep + 1);
    if (u === user && p === pass) return true;
  }
  res.setHeader('WWW-Authenticate', 'Basic realm="Recipe Box"');
  res.status(401).end('Authentication required.');
  return false;
}

module.exports = { requireAuth };
