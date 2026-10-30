import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true },
  resolve: { alias: { '#lib': path.join(root, 'src/lib') } },
  plugins: [svelte({
    configFile: false,
    extensions: ['.svelte', '.svx'],
    preprocess: mdsvex({
      extensions: ['.svx'],
      layout: { runbook: path.join(root, 'src/lib/layouts/runbook.svelte') },
    }),
    compilerOptions: { css: 'injected' },
    emitCss: false,
  })],
});

try {
  const { render } = await server.ssrLoadModule('svelte/server');
  const { default: Page, metadata } = await server.ssrLoadModule('/src/routes/kb/incidents/4471-findings/+page.svx');
  const { deskRef } = await server.ssrLoadModule('/src/lib/kb/desk-ref.ts');
  const { head, body } = render(Page);
  const signature = metadata.signature;
  assert.equal(typeof signature, 'string', 'The page must declare its signature in frontmatter.');
  assert.ok(body.includes(deskRef(signature)), 'The rendered signature stamp must be visible.');
  assert.match(body, /379/);
  assert.match(body, /33/);
  assert.doesNotMatch(body, /no desk ref/);
  assert.match(head, /<style/);
  const html = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${head}</head><body>${body}</body></html>\n`;
  const output = path.join(root, 'rendered/4471-findings.html');
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html);
  console.log(`Rendered and checked ${output}`);
} finally {
  await server.close();
}