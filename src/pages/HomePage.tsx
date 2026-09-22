import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { HomeForm } from '../components/site/HomeForm'
import { AboutContent } from './AboutPage'
import { WorksContent } from './WorksPage'
import { TalksContent } from './TalksPage'
import { BlogPostContent } from './BlogPostPage'
import { PostList } from '../components/site/PostList'
import { SiteLayout } from '../components/site/SiteLayout'
import { posts } from '../content/posts'
import type { Post } from '../content/posts'
import { profile } from '../content/profile'

export function HomePage() {
  const [forms, setForms] = useState<readonly { id: string; title: string; placementIndex: number; content: ReactNode }[]>([])
  const homeRef = useRef<HTMLElement>(null)
  const triggers = useRef(new Map<string, HTMLElement>())

  function activateForm(id: string) {
    setForms((current) => {
      if (current.at(-1)?.id === id) return current
      const target = current.find((form) => form.id === id)
      return target ? [...current.filter((form) => form.id !== id), target] : current
    })
  }

  function openForm(id: string, title: string, content: ReactNode) {
    if (document.activeElement instanceof HTMLElement) triggers.current.set(id, document.activeElement)
    setForms((current) => {
      const existing = current.find((form) => form.id === id)
      let placementIndex = 0
      while (current.some((form) => form.placementIndex === placementIndex)) placementIndex += 1
      const form = existing ?? { id, title, content, placementIndex }
      return [...current.filter((candidate) => candidate.id !== id), form]
    })
  }

  function closeForm(id: string) {
    setForms((current) => current.filter((form) => form.id !== id))
    triggers.current.get(id)?.focus()
    triggers.current.delete(id)
  }

  function openPost(post: Post) {
    openForm(`article:${post.slug}`, post.title, <article className="article-content"><BlogPostContent post={post} /></article>)
  }

  function openPage(path: string) {
    switch (path) {
      case '/about': openForm(path, '自己紹介', <AboutContent />); break
      case '/works': openForm(path, '制作物一覧', <WorksContent />); break
      case '/talks': openForm(path, '登壇資料', <TalksContent />); break
      case '/blog': openForm(path, '記事一覧', <><h1 className="page-title">記事一覧</h1><PostList posts={posts} onOpenPost={openPost} /></>); break
    }
  }

  return (
    <>
    <SiteLayout title="wabi.me" onOpenPage={openPage} windowRef={homeRef}>
      <section className="profile-hero">
        <img alt="VB6風ウィンドウに表示されたwabiのプロフィール画像" className="profile-image" src="/favicon-vb6-character.png" />
        <div>
          <p className="eyebrow">WELCOME TO WABI.ME</p>
          <h1 className="hero-title">{profile.name}の個人ポータル</h1>
          <p className="lead">{profile.introduction}</p>
        </div>
      </section>
      <section className="latest-posts" aria-labelledby="latest-posts-title">
        <div className="section-heading">
          <h2 id="latest-posts-title">最新の記事</h2>
          <button type="button" className="text-button" onClick={() => openPage('/blog')}>一覧を見る →</button>
        </div>
        <PostList posts={posts.slice(0, 3)} onOpenPost={openPost} />
      </section>
      <div className="home-actions">
        <button type="button" className="legacy-button" onClick={() => openPage('/about')}>自己紹介を見る</button>
        <button type="button" className="legacy-button" onClick={() => openPage('/works')}>制作物を見る</button>
      </div>
    </SiteLayout>
    {forms.map((form, index) => (
      <HomeForm key={form.id} title={form.title} homeRef={homeRef} placementIndex={form.placementIndex} layer={index + 1} onClose={() => closeForm(form.id)} onActivate={() => activateForm(form.id)}>
        {form.content}
      </HomeForm>
    ))}
    </>
  )
}
