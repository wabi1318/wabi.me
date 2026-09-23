import { getCollection } from 'astro:content'

export async function getPosts() {
  return (await getCollection('blog')).sort((left, right) => (
    right.data.date.getTime() - left.data.date.getTime() || left.id.localeCompare(right.id)
  ))
}
