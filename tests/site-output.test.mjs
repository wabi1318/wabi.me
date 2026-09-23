import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { JSDOM } from 'jsdom'

const output = resolve(process.env.SITE_BUILD_DIR ?? 'dist')
const readPage = route => readFileSync(resolve(output, route), 'utf8')

test('all eight routes render their content at build time', () => {
  for (const [file, title] of [
    ['index.html', 'wabiの個人ポータル'],
    ['about/index.html', '自己紹介'],
    ['works/index.html', '制作物一覧'],
    ['talks/index.html', '登壇資料'],
    ['blog/index.html', '記事一覧'],
    ['blog/first-window/index.html', '最初のウィンドウを開く'],
    ['blog/site-source/index.html', 'このサイトのソースコードを公開しました'],
    ['404.html', '404'],
  ]) {
    const { window } = new JSDOM(readPage(file))
    const document = window.document
    assert.ok(document.querySelector('h1')?.textContent.includes(title), file)
    assert.equal(document.querySelector('#root'), null)
    assert.equal(document.querySelector('vb-window'), null)
    assert.equal(document.querySelector('.vb-window-close').disabled, true)
    assert.equal(document.querySelector('link[rel="icon"]').getAttribute('href'), '/favicon-vb6-character.png')
    if (file !== 'index.html') {
      assert.equal(document.querySelector('astro-island[client]'), null, file)
      assert.equal(document.querySelector('script[type="module"]'), null, file)
    }
    window.close()
  }
  assert.ok(existsSync(resolve(output, 'favicon-vb6-character.png')))
})

test('HOME has one React island, static profile and navigable article links', () => {
  const { window } = new JSDOM(readPage('index.html'))
  const document = window.document
  const islands = document.querySelectorAll('astro-island[client]')
  assert.equal(islands.length, 1)
  assert.equal(islands[0].getAttribute('client'), 'load')
  assert.equal(islands[0].getAttribute('component-export'), 'HomeWorkspace')
  assert.ok(document.querySelector('.profile-hero h1'))
  assert.ok(document.querySelector('a[href="/blog/first-window"]'))
  assert.ok(document.querySelector('a[href="/about"]'))
  assert.match(islands[0].getAttribute('props'), /最初のウィンドウを開く/)
  assert.match(islands[0].getAttribute('props'), /<h2/)
  for (const name of ['about', 'works', 'talks']) {
    assert.ok(document.querySelector('template[data-astro-template="' + name + '"]')?.content.querySelector('h1'), name)
  }
  window.close()
})

test('site uses Astro, original React controls and Tailwind, without the abandoned native package', () => {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  for (const name of ['astro', '@astrojs/react', 'react', 'react-dom']) assert.ok(manifest.dependencies[name])
  assert.ok(manifest.devDependencies.tailwindcss)
  assert.ok(manifest.devDependencies['@tailwindcss/vite'])
  for (const name of ['@wabi1318/legacy-web-components', 'react-router-dom', 'lit']) {
    assert.equal(manifest.dependencies[name], undefined)
  }
  assert.match(readFileSync(new URL('../src/components/vb/LICENSE', import.meta.url), 'utf8'), /Copyright \(c\) 2026 murasuke/)
})
