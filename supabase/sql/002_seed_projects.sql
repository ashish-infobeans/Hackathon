-- Seed approved and pending projects for local development.

insert into public.projects (title, short_description, status)
values
  (
    'AI Pair Programming Assistant',
    'Build a lightweight copilot that suggests refactors during hackathons.',
    'approved'
  ),
  (
    'Realtime Retro Board',
    'Simple sprint retrospective tool with sticky notes and voting.',
    'approved'
  ),
  (
    'Green Commute Tracker',
    'Track low-carbon commute choices and show team impact stats.',
    'approved'
  ),
  (
    'Open Source Onboarding',
    'Guide newcomers through first contributions with curated tasks.',
    'approved'
  ),
  (
    'Hackathon Meal Planner',
    'Coordinate team food orders and dietary preferences in one place.',
    'approved'
  ),
  (
    'Bug Bash Dashboard',
    'Aggregate QA findings with severity tags and assignee chips.',
    'approved'
  ),
  (
    'Doc Search with Embeddings',
    'Semantic search over team wikis and README files for quick answers.',
    'pending'
  ),
  (
    'Standup Timer Bot',
    'Keep daily standups on track with rotating prompts and timeboxing.',
    'pending'
  );
