import { useEffect, useState } from 'react'
import type { FilterSubjectTag, Problem, ProblemStatus } from '../types/problem'
import { problemService } from '../lib/problemService'

export const useProblems = (status: ProblemStatus, subjectTag: FilterSubjectTag = 'all') => {
  const [problems, setProblems] = useState<Problem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const items = await problemService.listByStatus(status, subjectTag)
        if (!cancelled) setProblems(items)
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
  }, [status, subjectTag])

  return { problems, loading, error }
}

