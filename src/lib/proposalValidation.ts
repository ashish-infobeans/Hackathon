const MAX_TITLE_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 500
const SCRIPT_PATTERN = /<script\b/i

export type ProposalValidationErrors = {
  title?: string
  shortDescription?: string
}

export type ProposalValues = {
  title: string
  shortDescription: string
}

export function validateProposal(
  title: string,
  shortDescription: string,
): ProposalValidationErrors {
  const errors: ProposalValidationErrors = {}
  const trimmedTitle = title.trim()
  const trimmedDescription = shortDescription.trim()

  if (!trimmedTitle) {
    errors.title = 'Title is required.'
  } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`
  } else if (SCRIPT_PATTERN.test(trimmedTitle)) {
    errors.title = 'Title cannot contain script tags.'
  }

  if (!trimmedDescription) {
    errors.shortDescription = 'Short description is required.'
  } else if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
    errors.shortDescription = `Short description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`
  } else if (SCRIPT_PATTERN.test(trimmedDescription)) {
    errors.shortDescription = 'Short description cannot contain script tags.'
  }

  return errors
}

export function normalizeProposal(title: string, shortDescription: string): ProposalValues | null {
  const errors = validateProposal(title, shortDescription)

  if (Object.keys(errors).length > 0) {
    return null
  }

  return {
    title: title.trim(),
    shortDescription: shortDescription.trim(),
  }
}

export const PROPOSAL_LIMITS = {
  maxTitleLength: MAX_TITLE_LENGTH,
  maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
} as const
