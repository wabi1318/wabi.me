import { PageTitle } from '../components/site/PageTitle'
import { SiteLayout } from '../components/site/SiteLayout'
import { WorkList } from '../components/site/WorkList'
import { works } from '../content/works'

export function WorksPage() {
  return <SiteLayout title="wabi.me - Works"><WorksContent /></SiteLayout>
}

export function WorksContent() {
  return (
    <>
      <PageTitle>制作物一覧</PageTitle>
      <WorkList works={works} />
    </>
  )
}
