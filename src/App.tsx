import { Route, Routes } from 'react-router-dom'
import { HomePage, AboutPage, BlogPage, BlogPostPage, WorksPage, TalksPage, NotFoundPage } from './pages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/works" element={<WorksPage />} />
      <Route path="/talks" element={<TalksPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
