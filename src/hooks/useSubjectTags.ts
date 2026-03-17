import { useCallback, useEffect, useState } from 'react'
import { subjectTagService, type SubjectTagItem } from '../lib/subjectTagService'

export const useSubjectTags = () => {
  const [tags, setTags] = useState<SubjectTagItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const items = await subjectTagService.list()
      setTags(items)
    } catch (e) {
      console.error(e)
      setError('タグの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return { tags, loading, error, reload }
}

