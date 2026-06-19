export type MockProjectStatus = 'approved' | 'pending'

export type MockProject = {
  id: string
  title: string
  shortDescription: string
  signupCount: number
  participantNames: string[]
  status: MockProjectStatus
  isSignedUp?: boolean
}

export const MOCK_PAGE_SIZE = 3

export const mockProjects: MockProject[] = [
  {
    id: '1',
    title: 'AI Pair Programming Assistant',
    shortDescription: 'Build a lightweight copilot that suggests refactors during hackathons.',
    signupCount: 4,
    participantNames: ['Alex', 'Jordan', 'Sam', 'Taylor'],
    status: 'approved',
    isSignedUp: true,
  },
  {
    id: '2',
    title: 'Realtime Retro Board',
    shortDescription: 'Simple sprint retrospective tool with sticky notes and voting.',
    signupCount: 2,
    participantNames: ['Morgan', 'Casey'],
    status: 'approved',
  },
  {
    id: '3',
    title: 'Green Commute Tracker',
    shortDescription: 'Track low-carbon commute choices and show team impact stats.',
    signupCount: 6,
    participantNames: ['Riley', 'Avery', 'Quinn', 'Jamie', 'Drew', 'Skyler'],
    status: 'approved',
  },
  {
    id: '4',
    title: 'Open Source Onboarding',
    shortDescription: 'Guide newcomers through first contributions with curated tasks.',
    signupCount: 1,
    participantNames: ['Blake'],
    status: 'approved',
  },
  {
    id: '5',
    title: 'Hackathon Meal Planner',
    shortDescription: 'Coordinate team food orders and dietary preferences in one place.',
    signupCount: 3,
    participantNames: ['Cameron', 'Parker', 'Reese'],
    status: 'approved',
  },
  {
    id: '6',
    title: 'Bug Bash Dashboard',
    shortDescription: 'Aggregate QA findings with severity tags and assignee chips.',
    signupCount: 0,
    participantNames: [],
    status: 'approved',
  },
  {
    id: '7',
    title: 'Doc Search with Embeddings',
    shortDescription: 'Semantic search over team wikis and README files for quick answers.',
    signupCount: 5,
    participantNames: ['Elliot', 'Harper', 'Logan', 'Noah', 'Sage'],
    status: 'approved',
  },
  {
    id: '8',
    title: 'Standup Timer Bot',
    shortDescription: 'Keep daily standups on track with rotating prompts and timeboxing.',
    signupCount: 2,
    participantNames: ['Finley', 'Rowan'],
    status: 'approved',
  },
  {
    id: '9',
    title: 'Accessibility Audit Helper',
    shortDescription: 'Scan pages for common a11y issues and export a fix-it checklist.',
    signupCount: 3,
    participantNames: ['Devon', 'Kai', 'Remy'],
    status: 'approved',
  },
]

export type MockProjectPage = {
  projects: MockProject[]
  hasMore: boolean
}

const MOCK_FETCH_DELAY_MS = 400
const MOCK_DETAILS_DELAY_MS = 350

function cloneProject(project: MockProject): MockProject {
  return {
    ...project,
    participantNames: [...project.participantNames],
  }
}

export function getApprovedProjects(): MockProject[] {
  return mockProjects.filter((project) => project.status === 'approved')
}

export function fetchMockProjectPage(page: number): Promise<MockProjectPage> {
  const approvedProjects = getApprovedProjects()
  const offset = page * MOCK_PAGE_SIZE
  const projects = approvedProjects.slice(offset, offset + MOCK_PAGE_SIZE).map(cloneProject)
  const hasMore = offset + MOCK_PAGE_SIZE < approvedProjects.length

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({ projects, hasMore })
    }, MOCK_FETCH_DELAY_MS)
  })
}

export function getMockProject(id: string): MockProject | undefined {
  const project = mockProjects.find((item) => item.id === id && item.status === 'approved')
  return project ? cloneProject(project) : undefined
}

export function fetchMockProjectById(id: string): Promise<MockProject | null> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      const project = mockProjects.find((item) => item.id === id && item.status === 'approved')
      resolve(project ? cloneProject(project) : null)
    }, MOCK_DETAILS_DELAY_MS)
  })
}
