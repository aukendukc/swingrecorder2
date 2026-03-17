import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'

const DEFAULT_TAGS = ['math', 'algorithms', 'english', 'physics', 'toeic']
const tagsCol = collection(db, 'subjectTags')

export interface SubjectTagItem {
  id: string
  name: string
}

const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
  let id: number | null = null
  const timeout = new Promise<never>((_, reject) => {
    id = window.setTimeout(() => reject(new Error('タグ取得がタイムアウトしました')), ms)
  })
  try {
    return await Promise.race([promise, timeout])
  } finally {
    if (id != null) window.clearTimeout(id)
  }
}

export const subjectTagService = {
  async list(): Promise<SubjectTagItem[]> {
    const snap = await withTimeout(
      getDocs(query(tagsCol, orderBy('createdAt', 'asc'))),
      8000,
    )
    const items = snap.docs
      .map((d) => ({ id: d.id, name: String(d.data().name ?? '').trim() }))
      .filter((t) => t.name.length > 0)

    if (items.length > 0) return items

    // 初回は既定タグを作成して返す
    const refs = await Promise.all(
      DEFAULT_TAGS.map((name) =>
        addDoc(tagsCol, {
          name,
          createdAt: serverTimestamp(),
        }),
      ),
    )
    return refs.map((ref, idx) => ({ id: ref.id, name: DEFAULT_TAGS[idx]! }))
  },

  async add(name: string): Promise<void> {
    await addDoc(tagsCol, {
      name: name.trim(),
      createdAt: serverTimestamp(),
    })
  },

  async update(id: string, name: string): Promise<void> {
    await updateDoc(doc(tagsCol, id), { name: name.trim() })
  },

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(tagsCol, id))
  },
}

