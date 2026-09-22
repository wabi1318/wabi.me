import { PageTitle } from '../components/site/PageTitle'
import { SiteLayout } from '../components/site/SiteLayout'
import { profile } from '../content/profile'

export function AboutPage() {
  return (
    <SiteLayout title="wabi.me - About">
      <PageTitle>自己紹介</PageTitle>
      <img alt="VB6風ウィンドウに表示されたwabiのプロフィール画像" className="profile-image about-profile-image" src="/favicon-vb6-character.png" />
      <dl className="profile-table">
        <dt>名前</dt><dd>{profile.name}</dd>
        <dt>役割</dt><dd>{profile.role}</dd>
        <dt>拠点</dt><dd>{profile.location}</dd>
        <dt>関心</dt><dd>{profile.interests.join(' / ')}</dd>
      </dl>
      <p className="lead">{profile.introduction}</p>
    </SiteLayout>
  )
}
