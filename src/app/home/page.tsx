'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ProblemCard } from '../../components/ProblemCard'
import { useProblems } from '../../hooks/useProblems'
import { useSubjectTags } from '../../hooks/useSubjectTags'
import type { FilterSubjectTag } from '../../types/problem'

export default function HomePage() {
  const [subject, setSubject] = useState<FilterSubjectTag>('all')
  const { tags } = useSubjectTags()
  const { problems, loading, error } = useProblems('unreviewed', subject)
  const count = useMemo(() => problems.length, [problems.length])
  const subjectOptions = useMemo(
    () => [{ label: 'All', value: 'all' as const }, ...tags.map((t) => ({ label: t.name, value: t.name }))],
    [tags],
  )

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">未復習</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {count} 件
          </p>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/home"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            未復習
          </Link>
          <Link
            href="/add"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
          >
            追加
          </Link>
          <Link
            href="/archive"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
          >
            アーカイブ
          </Link>
          <Link
            href="/tags"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
          >
            タグ管理
          </Link>
        </nav>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {subjectOptions.map((s) => {
          const active = s.value === subject
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setSubject(s.value)}
              className={[
                'rounded-full px-3 py-1 text-sm',
                active
                  ? 'bg-blue-600 text-white'
                  : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900',
              ].join(' ')}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        {loading && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            読み込み中...
          </p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {!loading && !error && problems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              まだ未復習の問題がありません。
            </p>
            <Link
              href="/add"
              className="mt-4 inline-flex rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white"
            >
              問題を登録する
            </Link>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <Link key={p.id} href={`/problem?id=${encodeURIComponent(p.id)}`} className="block">
              <ProblemCard problem={p} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

