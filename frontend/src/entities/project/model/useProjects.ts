import { useEffect, useState } from 'react'
import { projectsApi } from '../api/projects.api'
import type { CreateProjectPayload, Project } from './types'

interface UseProjectsOptions {
  onProjectCountChange?: (count: number) => void
}

export function useProjects({ onProjectCountChange }: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeProjectId, setActiveProjectId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingProjectIds, setUpdatingProjectIds] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    let isCurrent = true

    projectsApi.getProjects()
      .then((loadedProjects) => {
        if (!isCurrent) return
        setProjects(loadedProjects)
        setActiveProjectId((currentId) =>
          currentId && loadedProjects.some((project) => project.id === currentId)
            ? currentId
            : loadedProjects[0]?.id ?? '',
        )
        onProjectCountChange?.(loadedProjects.length)
      })
      .catch(() => {
        if (isCurrent) setError('Не удалось загрузить проекты')
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [onProjectCountChange])

  async function createProject(payload: CreateProjectPayload): Promise<Project> {
    setError('')
    const project = await projectsApi.createProject(payload)
    setProjects((currentProjects) => [...currentProjects, project])
    setActiveProjectId(project.id)
    onProjectCountChange?.(projects.length + 1)
    return project
  }

  async function updateProjectName(projectId: string, name: string): Promise<boolean> {
    const previousProject = projects.find((project) => project.id === projectId)
    if (!previousProject || updatingProjectIds.has(projectId)) return false

    setError('')
    setUpdatingProjectIds((current) => new Set(current).add(projectId))
    setProjects((currentProjects) =>
      currentProjects.map((project) => project.id === projectId ? { ...project, name } : project),
    )

    try {
      const updatedProject = await projectsApi.updateProject(projectId, { name })
      setProjects((currentProjects) =>
        currentProjects.map((project) => project.id === projectId
          ? { ...updatedProject, _count: project._count }
          : project),
      )
      return true
    } catch {
      setProjects((currentProjects) =>
        currentProjects.map((project) => project.id === projectId ? previousProject : project),
      )
      setError('Не удалось изменить название проекта. Изменение отменено.')
      return false
    } finally {
      setUpdatingProjectIds((current) => {
        const next = new Set(current)
        next.delete(projectId)
        return next
      })
    }
  }

  async function deleteProject(projectId: string): Promise<boolean> {
    if (isDeleting) return false

    setIsDeleting(true)
    setError('')
    try {
      await projectsApi.deleteProject(projectId)
      const remainingProjects = projects.filter((project) => project.id !== projectId)
      setProjects(remainingProjects)
      setActiveProjectId((currentId) =>
        currentId === projectId ? remainingProjects[0]?.id ?? '' : currentId,
      )
      onProjectCountChange?.(remainingProjects.length)
      return true
    } catch {
      setError('Не удалось удалить проект. Попробуйте ещё раз.')
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return {
    projects,
    activeProjectId,
    setActiveProjectId,
    isLoading,
    error,
    clearError: () => setError(''),
    isDeleting,
    updatingProjectIds,
    createProject,
    updateProjectName,
    deleteProject,
  }
}
