import { mockProjects, type MockProject } from './mockProjects'
import type { ProposalValues } from '../lib/proposalValidation'

const MOCK_SUBMIT_DELAY_MS = 400

function cloneProject(project: MockProject): MockProject {
  return {
    ...project,
    participantNames: [...project.participantNames],
  }
}

export async function submitMockProposal(values: ProposalValues): Promise<MockProject> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const project: MockProject = {
        id: crypto.randomUUID(),
        title: values.title,
        shortDescription: values.shortDescription,
        signupCount: 0,
        participantNames: [],
        status: 'pending',
      }

      mockProjects.push(project)
      resolve(cloneProject(project))
    }, MOCK_SUBMIT_DELAY_MS)
  })
}
