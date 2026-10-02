export interface ProjectCreateValues {
  name: string
}

export interface ProjectCreateFormProps {
  onSubmit: (values: ProjectCreateValues) => Promise<void>
}