'use client'

import Link from 'next/link'
import { ProblemCard } from '../../components/ProblemCard'
import { useProblems } from '../../hooks/useProblems'

export default function ArchivePage() {
  const { problems, loading, error } = useProblems('reviewed', 'all')

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">アーカイブ</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            復習済みの問題
          </p>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/home"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
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
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            アーカイブ
          </Link>
        </nav>
      </div>

      <div className="mt-8">
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
              まだ復習済みの問題がありません。
            </p>
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

