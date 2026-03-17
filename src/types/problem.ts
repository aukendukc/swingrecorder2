export type ProblemStatus = 'unreviewed' | 'reviewed'

export type SubjectTag = string
export type FilterSubjectTag = 'all' | SubjectTag

export interface Problem {
  id: string
  problemImageUrl: string
  answerImageUrl?: string
  answerText?: string
  subjectTag: SubjectTag
  status: ProblemStatus
  createdAt: Date
}

