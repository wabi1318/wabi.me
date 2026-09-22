import firstWindowSource from './blog/first-window.md?raw'
import siteSource from './blog/site-source.md?raw'

export type Post = {
  slug: string
  title: string
  date: string
  summary: string
  body: string
}

type PostMetadata = Omit<Post, 'slug' | 'body'>

function parsePostMetadata(source: string): PostMetadata {
  const frontMatter = source.match(/^---\n([\s\S]+?)\n---\n/)

  if (!frontMatter) {
    throw new Error('記事のメタデータが見つかりません。')
  }

  const values = Object.fromEntries(
    frontMatter[1]
      .split('\n')
      .map((line) => line.split(/:\s(.+)/, 2))
      .filter((entry): entry is [string, string] => entry.length === 2),
  )

  const title = values.title
  const date = values.date
  const summary = values.summary

  if (!title || !date || !summary) {
    throw new Error('記事のtitle、date、summaryは必須です。')
  }

  return { title, date, summary }
}

function createPost(slug: string, source: string): Post {
  const metadata = parsePostMetadata(source)
  const body = source.replace(/^---\n[\s\S]+?\n---\n/, '').trim()

  return { slug, ...metadata, body }
}

export const posts: readonly Post[] = [
  createPost('first-window', firstWindowSource),
  createPost('site-source', siteSource),
]
