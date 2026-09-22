import { Link } from 'react-router-dom'
import type { Post } from '../../content/posts'

type PostListProps = {
  posts: readonly Post[]
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-card" key={post.slug}>
          <time dateTime={post.date}>{post.date}</time>
          <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
          <p>{post.summary}</p>
          <Link className="read-more" to={`/blog/${post.slug}`}>続きを読む →</Link>
        </article>
      ))}
    </div>
  )
}
