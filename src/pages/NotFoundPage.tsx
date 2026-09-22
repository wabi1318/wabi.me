import { Link } from 'react-router-dom'
import { SiteLayout } from '../components/site/SiteLayout'

export function NotFoundPage() {
  return (
    <SiteLayout title="wabi.me - Not found">
      <h1 className="hero-title">404</h1>
      <p className="lead">指定されたページは見つかりませんでした。</p>
      <Link className="legacy-button" to="/">トップへ戻る</Link>
    </SiteLayout>
  )
}
