import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { VBButton, VBWindow } from '../vb'
import { HomeForm } from './HomeForm'
import { openWindowFromLink, SiteNavigation } from './SiteNavigation'
import type { SitePath } from './SiteNavigation'

export type HomePost = {
  slug: string
  title: string
  date: string
  summary: string
  html: string
}

type OpenForm = { id: string; title: string; placementIndex: number; content: ReactNode }
const LATEST_POST_LIMIT = 3

function PostList({ posts, onOpenPost }: { posts: readonly HomePost[]; onOpenPost: (post: HomePost) => void }) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-card" key={post.slug}>
          <time dateTime={post.date}>{post.date}</time>
          <h2><a href={`/blog/${post.slug}`} onClick={(event) => openWindowFromLink(event, () => onOpenPost(post))}>{post.title}</a></h2>
          <p>{post.summary}</p>
          <a className="read-more" href={`/blog/${post.slug}`} onClick={(event) => openWindowFromLink(event, () => onOpenPost(post))}>続きを読む →</a>
        </article>
      ))}
    </div>
  )
}

export function HomeWorkspace({ posts, profile, about, works, talks }: {
  posts: readonly HomePost[]
  profile?: ReactNode
  about?: ReactNode
  works?: ReactNode
  talks?: ReactNode
}) {
  const [forms, setForms] = useState<readonly OpenForm[]>([])
  // 選択中の要素を移動させないため、重なり順はフォームの並びと分けて持つ。
  const [formStack, setFormStack] = useState<readonly string[]>([])
  const homeRef = useRef<HTMLElement>(null)
  const triggers = useRef(new Map<string, HTMLElement>())

  function activateForm(id: string) {
    setFormStack((current) => {
      if (current.at(-1) === id || !current.includes(id)) return current
      return [...current.filter((candidate) => candidate !== id), id]
    })
  }

  function openForm(id: string, title: string, content: ReactNode) {
    if (document.activeElement instanceof HTMLElement) triggers.current.set(id, document.activeElement)
    setForms((current) => {
      if (current.some((form) => form.id === id)) return current
      let placementIndex = 0
      while (current.some((form) => form.placementIndex === placementIndex)) placementIndex += 1
      return [...current, { id, title, content, placementIndex }]
    })
    setFormStack((current) => [...current.filter((candidate) => candidate !== id), id])
  }

  function closeForm(id: string) {
    setForms((current) => current.filter((form) => form.id !== id))
    setFormStack((current) => current.filter((candidate) => candidate !== id))
    triggers.current.get(id)?.focus()
    triggers.current.delete(id)
  }

  function openPost(post: HomePost) {
    // HTMLは公開リポジトリ内のMarkdownをAstroで変換した本文だけを受け取る。
    openForm(`article:${post.slug}`, post.title, (
      <article className="article-content">
        <time dateTime={post.date}>{post.date}</time>
        <h1 className="page-title">{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    ))
  }

  function openPage(path: SitePath) {
    switch (path) {
      case '/': homeRef.current?.scrollIntoView({ block: 'start' }); break
      case '/about': openForm(path, '自己紹介', about); break
      case '/works': openForm(path, '制作物一覧', works); break
      case '/talks': openForm(path, '登壇資料', talks); break
      case '/blog': openForm(path, '記事一覧', <><h1 className="page-title">記事一覧</h1><PostList posts={posts} onOpenPost={openPost} /></>); break
    }
  }

  return (
    <>
      <VBWindow title="wabi.me" status="wabi.me — Personal site" windowRef={homeRef} embedded>
        <SiteNavigation currentPath="/" onOpenPage={openPage} />
        <div className="page-content">
          {profile}
          <section className="latest-posts" aria-labelledby="latest-posts-title">
            <div className="section-heading">
              <h2 id="latest-posts-title">最新の記事</h2>
              <a href="/blog" onClick={(event) => openWindowFromLink(event, () => openPage('/blog'))}>一覧を見る →</a>
            </div>
            <PostList posts={posts.slice(0, LATEST_POST_LIMIT)} onOpenPost={openPost} />
          </section>
          <div className="home-actions">
            <VBButton type="button" onClick={() => openPage('/about')}>自己紹介を見る</VBButton>
            <VBButton type="button" onClick={() => openPage('/works')}>制作物を見る</VBButton>
          </div>
        </div>
      </VBWindow>
      {forms.map((form) => (
        <HomeForm key={form.id} title={form.title} homeRef={homeRef} placementIndex={form.placementIndex}
          layer={formStack.indexOf(form.id) + 1} onClose={() => closeForm(form.id)} onActivate={() => activateForm(form.id)}>
          {form.content}
        </HomeForm>
      ))}
    </>
  )
}
