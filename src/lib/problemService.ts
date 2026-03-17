import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { FilterSubjectTag, Problem, ProblemStatus, SubjectTag } from '../types/problem'
import { db } from './firebase'

const problemsCol = collection(db, 'problems')

const toProblem = (snapshot: QueryDocumentSnapshot<DocumentData>): Problem => {
  const data = snapshot.data()
  return {
    id: snapshot.id,
    problemImageUrl: data.problemImageUrl,
    answerImageUrl: data.answerImageUrl,
    answerText: data.answerText,
    subjectTag: data.subjectTag,
    status: data.status,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  }
}

export interface CreateProblemPayload {
  problemFile: File
  answerFile?: File
  answerText?: string
  subjectTag: SubjectTag
}

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const withTimeout = async <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let id: number | null = null
  const timeout = new Promise<never>((_, reject) => {
    id = window.setTimeout(() => {
      reject(new Error(`${label} がタイムアウトしました（${ms}ms）`))
    }, ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (id != null) window.clearTimeout(id)
  }
}

export const problemService = {
  async listByStatus(status: ProblemStatus, subjectTag?: FilterSubjectTag): Promise<Problem[]> {
    // Avoid composite index requirement:
    // fetch by status only, then filter/sort on client side.
    const q = query(problemsCol, where('status', '==', status))
    const snap = await withTimeout(getDocs(q), 8000, 'Firestore一覧取得')
    const items = snap.docs.map((d) => toProblem(d))
    return items
      .filter((item) =>
        subjectTag && subjectTag !== 'all' ? item.subjectTag === subjectTag : true,
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  async getById(id: string): Promise<Problem | null> {
    const snapshot = await withTimeout(
      getDoc(doc(problemsCol, id)),
      8000,
      'Firestore詳細取得',
    )
    if (!snapshot.exists()) return null
    return toProblem(snapshot as QueryDocumentSnapshot<DocumentData>)
  },

  async create(payload: CreateProblemPayload): Promise<void> {
    const problemImageUrl = await fileToDataUrl(payload.problemFile)
    let answerImageUrl: string | undefined
    if (payload.answerFile) {
      answerImageUrl = await fileToDataUrl(payload.answerFile)
    }
    const data: Record<string, unknown> = {
      problemImageUrl,
      answerText: payload.answerText ?? '',
      subjectTag: payload.subjectTag,
      status: 'unreviewed',
      createdAt: new Date(),
    }
    if (answerImageUrl) data.answerImageUrl = answerImageUrl

    await withTimeout(addDoc(problemsCol, data), 8000, 'Firestore登録')
  },

  async updateStatus(id: string, status: ProblemStatus): Promise<void> {
    await withTimeout(
      updateDoc(doc(problemsCol, id), { status }),
      8000,
      'Firestore更新',
    )
  },
}

