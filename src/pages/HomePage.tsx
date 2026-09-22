import { Link } from 'react-router-dom'
import { PostList } from '../components/site/PostList'
import { SiteLayout } from '../components/site/SiteLayout'
import { posts } from '../content/posts'
import { profile } from '../content/profile'

export function HomePage() {
  return (
    <SiteLayout title="wabi.me">
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
          <Link to="/blog">一覧を見る →</Link>
        </div>
        <PostList posts={posts.slice(0, 3)} />
      </section>
      <div className="home-actions">
        <Link className="legacy-button" to="/about">自己紹介を見る</Link>
        <Link className="legacy-button" to="/works">制作物を見る</Link>
      </div>
    </SiteLayout>
  )
}
