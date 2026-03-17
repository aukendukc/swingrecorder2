'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { problemService } from '../../lib/problemService'
import type { Problem } from '../../types/problem'

function ProblemDetailInner() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!id) {
      setError('問題IDが指定されていません。')
      setLoading(false)
      return
    }
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await problemService.getById(id)
        if (!cancelled) setProblem(data)
        if (!data && !cancelled) setError('問題が見つかりませんでした。')
      } catch (e) {
        console.error(e)
        if (!cancelled) setError('読み込みに失敗しました')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id])

  const markReviewed = async () => {
    if (!id) return
    setUpdating(true)
    try {
      await problemService.updateStatus(id, 'reviewed')
      window.location.href = '/home'
    } catch (e) {
      console.error(e)
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">読み込み中...</p>
      </div>
    )
  }

  if (error || !problem) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <Link href="/home" className="mt-4 inline-flex text-sm underline">
          戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">復習</h1>
        <Link href="/home" className="text-sm text-zinc-600 underline dark:text-zinc-400">
          戻る
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={problem.problemImageUrl}
            alt="問題画像"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
              {problem.subjectTag}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {problem.createdAt.toLocaleDateString('ja-JP')}
            </span>
          </div>

          <div className="mt-6">
            {!showAnswer ? (
              <button
                type="button"
                onClick={() => setShowAnswer(true)}
                className="inline-flex w-full items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-950"
              >
                解答を見る
              </button>
            ) : (
              <div className="rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-800">
                {problem.answerImageUrl && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
                    <Image
                      src={problem.answerImageUrl}
                      alt="解答画像"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                {problem.answerText && (
                  <p className="mt-4 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                    {problem.answerText}
                  </p>
                )}
                {!problem.answerImageUrl && !problem.answerText && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    解答は登録されていません。
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={markReviewed}
              disabled={updating}
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {updating ? '更新中...' : '復習済みにする'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProblemDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl px-6 py-10">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">読み込み中...</p>
        </div>
      }
    >
      <ProblemDetailInner />
    </Suspense>
  )
}

