export interface Project {
  id: string
  name: string
  description?: string | null
  _count?: { tasks: number }
}

export interface CreateProjectPayload {
  name: string
  description?: string
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>