import { PageTitle } from '../components/site/PageTitle'
import { PostList } from '../components/site/PostList'
import { SiteLayout } from '../components/site/SiteLayout'
import { posts } from '../content/posts'

export function BlogPage() {
  return (
    <SiteLayout title="wabi.me - Blog">
      <PageTitle>記事一覧</PageTitle>
      <PostList posts={posts} />
    </SiteLayout>
  )
}
