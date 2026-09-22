export type Talk = {
  title: string
  event: string
  date: string
  description: string
  url?: string
}

export const talks: readonly Talk[] = [
  {
    title: 'これから追加する登壇資料',
    event: '準備中',
    date: '----/--/--',
    description: '公開したい発表資料や動画へのリンクをここへ追加できます。',
  },
]
