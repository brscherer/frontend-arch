export type FieldType =
  | "text"
  | "email"
  | "password"
  | "select"
  | "checkbox"
  | "radio"
  | "phone"
  | "submit"

export interface FieldValidation {
  pattern?: string
  min?: number
  max?: number
  required?: boolean
  message?: string
}

export interface SelectOption {
  label: string
  value: string
}

export interface FieldDefinition {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  validation?: FieldValidation
}

export type ActionVariant = "primary" | "secondary" | "ghost"

export interface ActionDefinition {
  label: string
  type: "submit" | "back" | "next" | "cancel"
  variant: ActionVariant
}

export interface StepDefinition {
  id: string
  title: string
  description?: string
  fields: FieldDefinition[]
  actions: ActionDefinition[]
  condition?: { field: string; equals: string }
}

export interface WizardSchema {
  title: string
  steps: StepDefinition[]
  currentStepIndex: number
  totalSteps: number
}
