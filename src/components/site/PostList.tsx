import { Link } from 'react-router-dom'
import type { Post } from '../../content/posts'

type PostListProps = {
  posts: readonly Post[]
  onOpenPost?: (post: Post) => void
}

export function PostList({ posts, onOpenPost }: PostListProps) {
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article className="post-card" key={post.slug}>
          <time dateTime={post.date}>{post.date}</time>
          <h2>{onOpenPost ? <button type="button" className="text-button" onClick={() => onOpenPost(post)}>{post.title}</button> : <Link to={`/blog/${post.slug}`}>{post.title}</Link>}</h2>
          <p>{post.summary}</p>
          {onOpenPost ? <button type="button" className="text-button read-more" onClick={() => onOpenPost(post)}>続きを読む →</button> : <Link className="read-more" to={`/blog/${post.slug}`}>続きを読む →</Link>}
        </article>
      ))}
    </div>
  )
}
