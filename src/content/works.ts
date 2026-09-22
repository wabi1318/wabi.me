export type Work = {
  title: string
  description: string
  tags: readonly string[]
  url?: string
}

export const works: readonly Work[] = [
  {
    title: 'このサイト',
    description: 'ReactとTypeScriptでつくる、VB6風の個人ポータルです。',
    tags: ['React', 'TypeScript', 'Vite'],
  },
  {
    title: '次の制作物',
    description: 'ここに公開したいプロジェクトの説明を追加できます。',
    tags: ['Coming soon'],
  },
]
