import { Link, useParams } from 'react-router-dom'
import { SiteLayout } from '../components/site/SiteLayout'
import { posts } from '../content/posts'
import type { Post } from '../content/posts'

function renderBlock(block: string, index: number) {
  if (block.startsWith('## ')) {
    return <h2 key={index}>{block.slice(3)}</h2>
  }
  return <p key={index}>{block}</p>
}

export function BlogPostPage() {
  const { slug } = useParams()
  const post = posts.find((candidate) => candidate.slug === slug)
  if (!post) {
    return (
      <SiteLayout title="wabi.me - Article not found">
        <h1 className="hero-title">記事が見つかりません</h1>
        <Link className="legacy-button" to="/blog">記事一覧へ戻る</Link>
      </SiteLayout>
    )
  }
  return (
    <SiteLayout title={`wabi.me - ${post.title}`}>
      <article className="article-content">
        <Link className="back-link" to="/blog">← 記事一覧</Link>
        <BlogPostContent post={post} />
      </article>
    </SiteLayout>
  )
}

export function BlogPostContent({ post }: { post: Post }) {
  return (
    <>
      <time dateTime={post.date}>{post.date}</time>
      <h1 className="page-title">{post.title}</h1>
      {post.body.split('\n\n').map(renderBlock)}
    </>
  )
}
