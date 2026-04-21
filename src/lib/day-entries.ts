export interface DayEntry {
  time: string;
  body: string;
  meta: string;
}

export const dayEntries: DayEntry[] = [
  {
    time: '09:30',
    body: 'Deep work on the ingestion pipeline. VS Code open, three terminal tabs, Claude Code running. Refactored the timestamp parser in scene_claims.py. Decided to keep the Whisper+Gemini path reversible instead of committing to one.',
    meta: 'VS Code · Claude Code · 2.1h focus block'
  },
  {
    time: '11:45',
    body: 'Standup with Paul. Committed to shipping MCP auth by Friday. Alex asked about the API docs, said they\u2019d be done by Thursday. Mentioned the race condition in PR #38 needs a fix before merge.',
    meta: 'Google Meet · 12 min · 3 commitments tracked'
  },
  {
    time: '14:00',
    body: 'Context switch to the landing page redesign. Figma open alongside the codebase. Reviewed three layout options, picked the editorial direction. Sent a Slack message to the team with the decision and reasoning.',
    meta: 'Figma · Slack · 1 decision logged'
  },
  {
    time: '16:30',
    body: 'Back to code. PR review on the MCP server changes. Found a bug in the auth flow, left a comment. Switched to Cursor for the race condition fix. Got halfway through before getting pulled into an investor email.',
    meta: 'GitHub · Cursor · Gmail · 3 context switches'
  },
  {
    time: '23:00',
    body: 'Late-night session. Finally fixed the race condition. Pushed the commit, closed the PR. Opened Claude Code to draft the API docs but got sidetracked reading a thread about MCP auth patterns.',
    meta: 'VS Code · GitHub · Claude Code · 1.8h focus block'
  }
];

export const daySummary =
  'You committed to API docs by Thursday and MCP auth by Friday. The docs haven\u2019t been started. The race condition is fixed but you never went back to the auth work. Tomorrow\u2019s standup is in 10 hours.';

export const dayIntro =
  'Wednesday. Deep coding in the morning, a standup, context switching between three projects, a design review, and a late-night fix. Captured in the background, queryable from any agent.';
