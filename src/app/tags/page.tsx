'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSubjectTags } from '../../hooks/useSubjectTags'
import { subjectTagService } from '../../lib/subjectTagService'

export default function TagsPage() {
  const { tags, loading, error, reload } = useSubjectTags()
  const [newTag, setNewTag] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const addTag = async () => {
    const name = newTag.trim()
    if (!name) return
    try {
      await subjectTagService.add(name)
      setNewTag('')
      await reload()
      setMessage('タグを追加しました。')
    } catch (e) {
      console.error(e)
      setMessage('タグ追加に失敗しました。')
    }
  }

  const saveEdit = async () => {
    if (!editingId) return
    const name = editingName.trim()
    if (!name) return
    try {
      await subjectTagService.update(editingId, name)
      setEditingId(null)
      setEditingName('')
      await reload()
      setMessage('タグを更新しました。')
    } catch (e) {
      console.error(e)
      setMessage('タグ更新に失敗しました。')
    }
  }

  const deleteTag = async (id: string) => {
    if (!window.confirm('このタグを削除しますか？')) return
    try {
      await subjectTagService.remove(id)
      await reload()
      setMessage('タグを削除しました。')
    } catch (e) {
      console.error(e)
      setMessage('タグ削除に失敗しました。')
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">タグ管理</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            科目タグを追加・編集・削除できます
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
        </nav>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex gap-2">
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="新しいタグ名"
            className="block flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
          />
          <button
            type="button"
            onClick={addTag}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white"
          >
            追加
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {loading && <p className="text-sm text-zinc-600 dark:text-zinc-400">読み込み中...</p>}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {!loading &&
            !error &&
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800"
              >
                {editingId === tag.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="block flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setEditingName('')
                      }}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs dark:border-zinc-800"
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm">{tag.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(tag.id)
                        setEditingName(tag.name)
                      }}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs dark:border-zinc-800"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTag(tag.id)}
                      className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 dark:border-red-700 dark:text-red-400"
                    >
                      削除
                    </button>
                  </>
                )}
              </div>
            ))}
        </div>

        {message && <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
      </div>
    </div>
  )
}

