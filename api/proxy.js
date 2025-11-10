export default async function handler(req, res) {
  const target = "https://script.google.com/macros/s/AKfycbyRZ8GZc5quxKndQibht6JY9EXGkOqTYuUY6JMF1D6-s61DPlZNxe5O_pcXUe_D1MEX8A/exec";

  const url = new URL(req.url, `https://${req.headers.host}`);
  const params = url.search ? url.search : "";

  const response = await fetch(target + params, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" ? undefined : req.body,
    redirect: "manual",
  });

  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  headers["Access-Control-Allow-Origin"] = "*";
  headers["X-Frame-Options"] = "ALLOWALL";
  delete headers["Content-Security-Policy"];

  const location = headers["location"];
  if (location && location.includes("script.google.com")) {
    const newLoc = location.replace(
      "https://script.google.com/macros/s/AKfycbyRZ8GZc5quxKndQibht6JY9EXGkOqTYuUY6JMF1D6-s61DPlZNxe5O_pcXUe_D1MEX8A/exec",
      `https://${req.headers.host}/api/proxy`
    );
    return res.redirect(302, newLoc);
  }

  const text = await response.text();
  res.writeHead(response.status, headers);
  res.end(text);
}
