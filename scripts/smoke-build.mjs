import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const outputDirectory = join(process.cwd(), 'dist', 'cloudflare');
const indexPath = join(outputDirectory, 'index.html');

if (!existsSync(indexPath)) {
  throw new Error('Production index not found. Run `yarn build` before the smoke test.');
}

const indexHtml = readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('<app-root')) {
  throw new Error('Production index does not contain the Angular root element.');
}

const assetReferences = [
  ...indexHtml.matchAll(/(?:src|href)="([^"?#]+\.(?:js|css))"/g),
].map((match) => match[1].replace(/^\//, ''));

if (assetReferences.length === 0) {
  throw new Error('Production index does not reference JavaScript or CSS assets.');
}

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
]);

const server = createServer((request, response) => {
  const requestedPath = request.url === '/' ? 'index.html' : request.url?.replace(/^\//, '');
  const normalizedPath = normalize(requestedPath ?? 'index.html');
  const filePath = join(outputDirectory, normalizedPath);

  if (!filePath.startsWith(outputDirectory) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404).end();
    return;
  }

  response.setHeader('Content-Type', contentTypes.get(extname(filePath)) ?? 'application/octet-stream');
  response.writeHead(200);
  createReadStream(filePath).pipe(response);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

try {
  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Smoke server did not expose a TCP port.');
  }

  const baseUrl = `http://127.0.0.1:${address.port}`;
  const paths = ['/', ...new Set(assetReferences)];

  for (const path of paths) {
    const response = await fetch(new URL(path, `${baseUrl}/`));
    if (!response.ok) {
      throw new Error(`Smoke request failed for ${path}: HTTP ${response.status}`);
    }
    await response.arrayBuffer();
  }

  console.log(`Smoke test passed for index and ${assetReferences.length} assets.`);
} finally {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
}
