export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const isDev = url.searchParams.has('dev') || url.pathname.endsWith('/dev');
  const branch = isDev ? 'dev' : 'main';
  const relayUrl = isDev
    ? 'wss://runmote-relay.onrender.com/daemon'
    : 'wss://runmote-relay-u2zi.onrender.com/daemon';
  const token = isDev
    ? (process.env.ACP_DAEMON_TOKEN_DEV || '')
    : (process.env.ACP_DAEMON_TOKEN_MAIN || '');

  const gh = `https://raw.githubusercontent.com/Raza-learner/Runmote/${branch}/scripts/install.ps1`;
  const headers = { 'User-Agent': 'runmote-vercel' };
  if (process.env.GITHUB_TOKEN) headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  const resp = await fetch(gh, { headers });
  if (!resp.ok) {
    const t = await resp.text();
    return res.status(resp.status).send(`Failed to fetch install.ps1: ${resp.status}\n${t}`);
  }
  let text = await resp.text();
  text = text.replaceAll('__ACP_RELAY_URL__', relayUrl);
  text = text.replaceAll('__ACP_DAEMON_TOKEN__', token);

  res.setHeader('content-type', 'text/powershell; charset=utf-8');
  res.setHeader('cache-control', 'public, max-age=60');
  return res.status(200).send(text);
}
