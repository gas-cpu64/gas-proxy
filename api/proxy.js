export default async function handler(req, res) {
  const target = 'https://script.google.com/macros/s/AKfycbyRZ8GZc5quxKndQibht6JY9EXGkOqTYuUY6JMF1D6-s61DPlZNxe5O_pcXUe_D1MEX8A/exec';

  try {
    const response = await fetch(target + req.url, {
      method: req.method,
      headers: { 'Content-Type': req.headers['content-type'] || 'application/json' },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const data = await response.text();

    res.status(response.status).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
}
