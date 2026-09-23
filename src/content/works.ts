export type Work = {
  title: string
  description: string
  tags: readonly string[]
  url?: string
}

export const works: readonly Work[] = [
  {
    title: 'このサイト',
    description: 'AstroとReact製のVB6風部品でつくる個人ポータルです。',
    tags: ['Astro', 'React', 'Tailwind CSS', 'TypeScript'],
  },
  {
    title: '次の制作物',
    description: 'ここに公開したいプロジェクトの説明を追加できます。',
    tags: ['Coming soon'],
  },
]
