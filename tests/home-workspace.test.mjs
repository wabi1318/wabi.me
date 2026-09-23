import test from 'node:test'
import assert from 'node:assert/strict'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { JSDOM } from 'jsdom'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import hydrateReact from '@astrojs/react/client.js'
import { HomeWorkspace } from '../src/components/site/HomeWorkspace.tsx'
import { getHomeFormPosition, keepHomeFormInViewport } from '../src/components/site/get-home-form-position.ts'

async function mountWorkspace(context) {
  const { window } = new JSDOM('<div id="test-root"></div>', { url: 'https://example.test/', pretendToBeVisual: true })
  for (const name of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent']) {
    Object.defineProperty(globalThis, name, { configurable: true, value: name === 'window' ? window : window[name] })
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  globalThis.ResizeObserver = class { observe() {} disconnect() {} }
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1400 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
  const captures = new WeakMap()
  window.HTMLElement.prototype.setPointerCapture = function (id) { captures.set(this, id) }
  window.HTMLElement.prototype.hasPointerCapture = function (id) { return captures.get(this) === id }
  window.HTMLElement.prototype.releasePointerCapture = function () { captures.delete(this) }
  window.HTMLElement.prototype.getBoundingClientRect = function () {
    const child = this.matches('.home-form')
    const left = child ? Number.parseFloat(this.style.left) || 0 : 200
    const top = child ? Number.parseFloat(this.style.top) || 0 : 80
    const width = child ? 640 : 900
    const height = child ? 400 : 660
    return { x: left, y: top, left, top, width, height, right: left + width, bottom: top + height }
  }
  const root = createRoot(document.getElementById('test-root'))
  await act(async () => root.render(createElement(HomeWorkspace, {
    posts: [{ slug: 'example', title: '記事の本文', date: '2026-09-22', summary: '要約', html: '<h2>本文の見出し</h2><p>本文です。</p>' }],
    profile: createElement('h1', null, 'wabiの個人ポータル'),
    about: createElement('h1', null, '自己紹介'),
    works: createElement('h1', null, '制作物一覧'),
    talks: createElement('h1', null, '登壇資料'),
  })))
  context.after(async () => {
    await act(async () => root.unmount())
    window.close()
  })
}

async function click(element) {
  assert.ok(element)
  await act(async () => { element.focus(); element.click() })
}

async function pointer(element, type, coordinates = {}) {
  const event = new window.MouseEvent(type, { bubbles: true, cancelable: true, button: 0, ...coordinates })
  Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: true } })
  await act(async () => element.dispatchEvent(event))
}

test('HOME remains open while child pages and articles open, reuse, activate and close', async (context) => {
  await mountWorkspace(context)
  const home = document.querySelector('.vb-window')
  assert.equal(home.querySelector('.vb-window-close').disabled, true)
  const aboutTrigger = home.querySelector('a[href="/about"]')
  await click(aboutTrigger)
  const about = document.querySelector('.home-form')
  assert.match(about.textContent, /自己紹介/)
  await click(aboutTrigger)
  assert.equal(document.querySelectorAll('.home-form').length, 1)
  assert.equal(document.querySelector('.home-form'), about)
  for (const path of ['/works', '/talks', '/blog']) await click(home.querySelector('a[href="' + path + '"]'))
  assert.equal(document.querySelectorAll('.home-form').length, 4)
  const positions = [...document.querySelectorAll('.home-form')].map(form => form.style.left + '/' + form.style.top)
  assert.equal(new Set(positions).size, 4)
  await click(aboutTrigger)
  assert.equal(about.style.zIndex, '4')
  const articleTrigger = document.querySelector('.home-form[aria-label="記事一覧"] a[href="/blog/example"]')
  await click(articleTrigger)
  const article = document.querySelector('.home-form[aria-label="記事の本文"]')
  assert.equal(article.querySelector('h2').textContent, '本文の見出し')
  await click(articleTrigger)
  assert.equal(document.querySelectorAll('.home-form').length, 5)
  await click(article.querySelector('.vb-window-close'))
  assert.equal(document.activeElement, articleTrigger)
  for (const close of [...document.querySelectorAll('.home-form .vb-window-close')]) await click(close)
  assert.equal(document.querySelectorAll('.home-form').length, 0)
  assert.ok(home.isConnected)
})

test('titlebar dragging preserves position across activation and scroll, then clamps on resize', async (context) => {
  await mountWorkspace(context)
  const home = document.querySelector('.vb-window')
  await click(home.querySelector('a[href="/about"]'))
  const about = document.querySelector('.home-form')
  await click(home.querySelector('a[href="/works"]'))
  const titlebar = about.querySelector('.vb-titlebar')
  const origin = about.getBoundingClientRect()
  await pointer(titlebar, 'pointerdown', { clientX: origin.left + 10, clientY: origin.top + 10 })
  assert.equal(about.style.zIndex, '2')
  assert.equal(titlebar.hasPointerCapture(1), true)
  await pointer(titlebar, 'pointermove', { clientX: 310, clientY: 210 })
  assert.equal(about.style.left, '300px')
  assert.equal(about.style.top, '200px')
  await pointer(titlebar, 'pointerup')
  assert.equal(titlebar.hasPointerCapture(1), false)
  await pointer(titlebar, 'pointermove', { clientX: 900, clientY: 800 })
  await click(home.querySelector('a[href="/about"]'))
  await act(async () => window.dispatchEvent(new window.Event('scroll')))
  assert.equal(about.style.left, '300px')
  assert.equal(about.style.top, '200px')
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 800 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 })
  await act(async () => window.dispatchEvent(new window.Event('resize')))
  assert.equal(about.style.left, '148px')
  assert.equal(about.style.top, '188px')
  const close = about.querySelector('.vb-window-close')
  await pointer(close, 'pointerdown')
  assert.equal(titlebar.hasPointerCapture(1), false)
  await click(close)
  assert.equal(about.isConnected, false)
})

test('cancelled or lost pointer capture stops a drag', async (context) => {
  await mountWorkspace(context)
  await click(document.querySelector('a[href="/about"]'))
  const form = document.querySelector('.home-form')
  const titlebar = form.querySelector('.vb-titlebar')
  for (const ending of ['pointercancel', 'lostpointercapture']) {
    const origin = form.getBoundingClientRect()
    await pointer(titlebar, 'pointerdown', { clientX: origin.left + 10, clientY: origin.top + 10 })
    await pointer(titlebar, ending)
    await pointer(titlebar, 'pointermove', { clientX: 50, clientY: 50 })
    assert.equal(Number.parseFloat(form.style.left), origin.left)
    assert.equal(titlebar.hasPointerCapture(1), false)
  }
})

test('ordinary links open forms but modifier clicks keep normal navigation', async (context) => {
  await mountWorkspace(context)
  const link = document.querySelector('a[href="/about"]')
  for (const modifier of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey']) {
    const event = new window.MouseEvent('click', { bubbles: true, cancelable: true, [modifier]: true })
    let preventedByComponent
    document.addEventListener('click', (dispatched) => {
      preventedByComponent = dispatched.defaultPrevented
      dispatched.preventDefault()
    }, { once: true })
    await act(async () => {
      link.dispatchEvent(event)
    })
    assert.equal(preventedByComponent, false)
  }
  assert.equal(document.querySelector('.home-form'), null)
})

test('the generated HOME hydrates with Astro slots and opens the actual static page content', async (context) => {
  await mountWorkspace(context)
  const html = readFileSync(resolve(process.env.SITE_BUILD_DIR ?? 'dist', 'index.html'), 'utf8')
  const parsed = new JSDOM(html)
  const island = document.importNode(parsed.window.document.querySelector('astro-island'), true)
  parsed.window.close()
  document.body.append(island)
  const serializedPosts = JSON.parse(island.getAttribute('props')).posts[1]
  const posts = serializedPosts.map(([, post]) => Object.fromEntries(
    Object.entries(post).map(([key, [, value]]) => [key, value]),
  ))
  const slots = {}
  for (const template of island.querySelectorAll('template[data-astro-template]')) {
    slots[template.getAttribute('data-astro-template')] = template.innerHTML
    template.remove()
  }
  for (const slot of island.querySelectorAll('astro-slot, astro-static-slot')) {
    slots[slot.getAttribute('name') ?? 'default'] = slot.innerHTML
  }
  const errors = context.mock.method(console, 'error', () => {})
  await act(async () => hydrateReact(island)(HomeWorkspace, { posts }, slots, { client: 'load' }))
  assert.equal(errors.mock.callCount(), 0, 'hydration should not report markup mismatches')
  await click(island.querySelector('a[href="/about"]'))
  assert.ok(island.querySelector('.home-form .profile-table'))
  assert.equal(island.querySelector('.home-form .profile-image').getAttribute('src'), '/favicon-vb6-character.png')
  await click(island.querySelector('a[href="/works"]'))
  assert.match(island.querySelector('.home-form[aria-label="制作物一覧"]').textContent, /Tailwind CSS/)
  await click(island.querySelector('a[href="/blog/first-window"]'))
  assert.ok(island.querySelector('.home-form .article-content h2'))
  await act(async () => island.dispatchEvent(new window.Event('astro:unmount')))
  island.remove()
  assert.equal(errors.mock.callCount(), 0)
})

test('placement calculations keep all four corners within small and large viewports', () => {
  for (const width of [320, 768, 1400]) {
    for (const height of [360, 700, 1000]) {
      const viewport = { width, height }
      const form = { width: Math.min(640, width - 24), height: Math.min(400, height - 24) }
      for (let index = 0; index < 12; index += 1) {
        const position = getHomeFormPosition({ left: 200, top: 80, right: 1100, bottom: 740 }, form, viewport, index)
        assert.ok(position.left >= 12 && position.left + form.width <= width - 12)
        assert.ok(position.top >= 12 && position.top + form.height <= height - 12)
        assert.deepEqual(keepHomeFormInViewport(position, form, viewport), position)
      }
    }
  }
})
