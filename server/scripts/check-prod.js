const ORIGIN = 'https://muyai.vercel.app';
const API = 'https://muyai.onrender.com';

async function main() {
  console.log('=== OPTIONS preflight (auth/sync) ===');
  const opt = await fetch(`${API}/api/auth/sync`, {
    method: 'OPTIONS',
    headers: {
      Origin: ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'authorization,content-type',
    },
  });
  console.log('status', opt.status);
  console.log('acao', opt.headers.get('access-control-allow-origin'));
  console.log('acam', opt.headers.get('access-control-allow-methods'));
  console.log('acah', opt.headers.get('access-control-allow-headers'));

  console.log('\n=== Vercel bundle API URL ===');
  const html = await fetch('https://muyai.vercel.app').then((r) => r.text());
  const m = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!m) {
    console.log('Could not find bundle');
    return;
  }
  const js = await fetch(`https://muyai.vercel.app${m[1]}`).then((r) => r.text());
  console.log('bundle', m[1]);
  console.log('has onrender.com', js.includes('onrender.com'));
  console.log('has localhost:5000', js.includes('localhost:5000'));
  const i = js.indexOf('onrender.com');
  if (i >= 0) console.log('snippet:', js.slice(i - 40, i + 50));
  const j = js.indexOf('"/api"');
  if (j >= 0) console.log('relative /api snippet:', js.slice(j - 30, j + 40));
}

main().catch(console.error);
