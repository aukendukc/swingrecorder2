import Image from 'next/image'
import type { Problem } from '../types/problem'

export function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <div className="group rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
          {/* data URL 対応のため unoptimized */}
          <Image
            src={problem.problemImageUrl}
            alt="問題画像"
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            unoptimized
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
              {problem.subjectTag}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {problem.createdAt.toLocaleDateString('ja-JP')}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-700 dark:text-zinc-300">
            {problem.answerText ? problem.answerText : '（解答テキストなし）'}
          </p>
        </div>
      </div>
    </div>
  )
}

