import type { Work } from '../../content/works'

type WorkListProps = {
  works: readonly Work[]
}

export function WorkList({ works }: WorkListProps) {
  return (
    <div className="work-list">
      {works.map((work) => (
        <article className="work-card" key={work.title}>
          <h2>{work.title}</h2>
          <p>{work.description}</p>
          <ul aria-label={`${work.title}の技術`} className="tag-list">
            {work.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          {work.url && <a href={work.url}>開く</a>}
        </article>
      ))}
    </div>
  )
}
