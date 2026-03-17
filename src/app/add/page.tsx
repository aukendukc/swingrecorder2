'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSubjectTags } from '../../hooks/useSubjectTags'
import { problemService } from '../../lib/problemService'
import type { SubjectTag } from '../../types/problem'

export default function AddPage() {
  const router = useRouter()
  const { tags, loading: tagsLoading } = useSubjectTags()
  const [problemFile, setProblemFile] = useState<File | null>(null)
  const [answerFile, setAnswerFile] = useState<File | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [subjectTag, setSubjectTag] = useState<SubjectTag>('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!subjectTag && tags.length > 0) {
      setSubjectTag(tags[0]!.name)
    }
  }, [subjectTag, tags])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!problemFile) {
      setMessage('問題画像は必須です。')
      return
    }
    if (!subjectTag) {
      setMessage('先に科目タグを作成してください。')
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      await problemService.create({
        problemFile,
        answerFile: answerFile ?? undefined,
        answerText: answerText || undefined,
        subjectTag,
      })
      router.push('/home')
      router.refresh()
    } catch (err) {
      console.error(err)
      setMessage('登録に失敗しました。Firestore ルールを確認してください。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">問題を追加</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            画像と科目を入れて登録します
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
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
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

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div>
          <label className="text-sm font-medium">問題画像 *</label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            onChange={(e) => setProblemFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">解答画像（任意）</label>
          <input
            type="file"
            accept="image/*"
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            onChange={(e) => setAnswerFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">解答テキスト（任意）</label>
          <textarea
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={5}
            placeholder="解法のポイントや注意点など"
          />
        </div>

        <div>
          <label className="text-sm font-medium">科目タグ</label>
          <select
            className="mt-2 block w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            value={subjectTag}
            disabled={tagsLoading || tags.length === 0}
            onChange={(e) => setSubjectTag(e.target.value)}
          >
            {tags.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          {tags.length === 0 && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              タグがありません。タグ管理から作成してください。
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
        >
          {submitting ? '登録中...' : '登録する'}
        </button>

        {message && (
          <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
        )}
      </form>
    </div>
  )
}

