import { PageTitle } from '../components/site/PageTitle'
import { SiteLayout } from '../components/site/SiteLayout'
import { talks } from '../content/talks'

export function TalksPage() {
  return <SiteLayout title="wabi.me - Talks"><TalksContent /></SiteLayout>
}

export function TalksContent() {
  return (
    <>
      <PageTitle>登壇資料</PageTitle>
      <div className="talk-list">
        {talks.map((talk) => (
          <article className="talk-card" key={talk.title}>
            <p>{talk.date} / {talk.event}</p>
            <h2>{talk.title}</h2>
            <p>{talk.description}</p>
            {talk.url && <a href={talk.url}>資料を見る</a>}
          </article>
        ))}
      </div>
    </>
  )
}
