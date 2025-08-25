export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code') ?? ''

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DocuSign Consent</title>
  <style>
    :root { color-scheme: dark; }
    body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; background: #0b0b0b; color: #fff; display: grid; place-items: center; min-height: 100vh; }
    .card { background: #111; border: 1px solid #222; border-radius: 12px; padding: 28px; max-width: 640px; width: calc(100% - 32px); text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,.35) }
    h1 { margin: 0 0 6px; font-size: 22px; }
    p { margin: 4px 0 12px; color: #cbd5e1; }
    a.button { display: inline-block; margin-top: 12px; padding: 10px 14px; border-radius: 8px; background: #2563eb; color: #fff; text-decoration: none; font-weight: 600; }
    small { color: #94a3b8; display: block; margin-top: 10px; }
    code { color: #93c5fd; }
  </style>
  <meta http-equiv="refresh" content="3;url=/user/documents" />
</head>
<body>
  <div class="card">
    <h1>Consent received</h1>
    <p>DocuSign one-time consent was successful.</p>
    ${code ? `<small>Auth code: <code>${code.slice(0, 8)}…</code></small>` : ''}
    <a class="button" href="/user/documents">Back to Documents</a>
    <small>Redirecting in 3 seconds…</small>
  </div>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}