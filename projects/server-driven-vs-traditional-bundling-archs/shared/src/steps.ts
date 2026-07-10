import { WizardSchema } from "./schema.js"

const defaultSchema: WizardSchema = {
  title: "Create Your Account",
  currentStepIndex: 0,
  totalSteps: 6,
  steps: [
    {
      id: "email",
      title: "Sign Up",
      description: "Choose how to sign up",
      fields: [
        {
          name: "signup_method",
          label: "Sign up with",
          type: "radio",
          required: true,
          options: [
            { label: "Email", value: "email" },
            { label: "Google", value: "google" },
            { label: "GitHub", value: "github" },
          ],
        },
        {
          name: "email",
          label: "Email address",
          type: "email",
          required: true,
          placeholder: "you@example.com",
          validation: {
            pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
            message: "Enter a valid email address",
          },
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
          placeholder: "At least 8 characters",
          validation: { min: 8, message: "Password must be at least 8 characters" },
        },
      ],
      actions: [
        { label: "Next", type: "next", variant: "primary" },
      ],
    },
    
    {
      id: "preferences",
      title: "Preferences",
      description: "Customize your experience",
      fields: [
        {
          name: "theme",
          label: "Theme",
          type: "select",
          required: true,
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "System", value: "system" },
          ],
        },
        {
          name: "notifications",
          label: "Email notifications",
          type: "checkbox",
          options: [
            { label: "Product updates", value: "updates" },
            { label: "Weekly newsletter", value: "newsletter" },
            { label: "Account activity", value: "activity" },
          ],
        },
      ],
      actions: [
        { label: "Back", type: "back", variant: "ghost" },
        { label: "Next", type: "next", variant: "primary" },
      ],
    },

    {
      id: "profile",
      title: "Profile",
      description: "Tell us about yourself",
      fields: [
        {
          name: "display_name",
          label: "Display name",
          type: "text",
          required: true,
          placeholder: "Jane Doe",
          validation: { min: 2, message: "Name must be at least 2 characters" },
        },
        {
          name: "phone",
          label: "Phone number",
          type: "phone",
          placeholder: "+1 (555) 123-4567",
        },
      ],
      actions: [
        { label: "Back", type: "back", variant: "ghost" },
        { label: "Next", type: "next", variant: "primary" },
      ],
    },
    {
      id: "plan",
      title: "Choose a Plan",
      description: "Select the plan that fits you",
      fields: [
        {
          name: "plan",
          label: "Plan",
          type: "radio",
          required: true,
          options: [
            { label: "Free — $0/mo", value: "free" },
            { label: "Pro — $12/mo", value: "pro" },
            { label: "Enterprise — custom", value: "enterprise" },
          ],
        },
      ],
      actions: [
        { label: "Back", type: "back", variant: "ghost" },
        { label: "Next", type: "next", variant: "primary" },
      ],
    },
    {
      id: "billing",
      title: "Billing",
      description: "Enter payment details",
      condition: { field: "plan", equals: "pro" },
      fields: [
        {
          name: "card_number",
          label: "Card number",
          type: "text",
          required: true,
          placeholder: "4242 4242 4242 4242",
          validation: { pattern: "^[\\d ]{16,19}$", message: "Enter a valid card number" },
        },
        {
          name: "card_expiry",
          label: "Expiry date",
          type: "text",
          required: true,
          placeholder: "MM/YY",
        },
        {
          name: "card_cvc",
          label: "CVC",
          type: "password",
          required: true,
          placeholder: "123",
          validation: { pattern: "^\\d{3,4}$", message: "Enter a valid CVC" },
        },
      ],
      actions: [
        { label: "Back", type: "back", variant: "ghost" },
        { label: "Next", type: "next", variant: "primary" },
      ],
    },
    {
      id: "review",
      title: "Review & Submit",
      description: "Double-check everything before submitting",
      fields: [
        {
          name: "agree_terms",
          label: "I agree to the Terms of Service and Privacy Policy",
          type: "checkbox",
          required: true,
          options: [{ label: "Yes, I agree", value: "agreed" }],
        },
      ],
      actions: [
        { label: "Back", type: "back", variant: "ghost" },
        { label: "Create Account", type: "submit", variant: "primary" },
      ],
    },
  ],
}

export function getSchema(plan?: string): WizardSchema {
  const schema = structuredClone(defaultSchema)
  schema.steps = schema.steps.filter((step) => {
    if (step.condition) {
      return plan === step.condition.equals
    }
    return true
  })
  schema.totalSteps = schema.steps.length
  return schema
}
