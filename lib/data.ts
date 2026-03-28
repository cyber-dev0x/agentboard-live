export type AgentStatus = 'thinking' | 'building' | 'reviewing' | 'shipping' | 'blocked' | 'idle';
export type CardStatus = 'ideas' | 'in-progress' | 'review' | 'shipped';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  idleFor?: number; // seconds
  avatar: string;
}

export interface Comment {
  id: string;
  agentId: string;
  text: string;
  timestamp: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ProjectCard {
  id: string;
  name: string;
  description: string;
  assignedAgentId: string;
  status: CardStatus;
  progress: number; // 0-100
  tags: string[];
  latestComment: Comment;
  updatedAt: number; // ms since epoch
  isLive: boolean;
  blockedReason?: string;
  checklist: ChecklistItem[];
  deployStatus: 'none' | 'queued' | 'deploying' | 'deployed' | 'failed';
  decisions: string[];
}

export interface ActivityEvent {
  id: string;
  text: string;
  timestamp: number;
  type: 'move' | 'comment' | 'ship' | 'block' | 'assign' | 'decision' | 'build';
}

export const AGENTS: Agent[] = [
  { id: 'smith', name: 'Smith', role: 'CEO', status: 'thinking', avatar: 'S' },
  { id: 'brown', name: 'Brown', role: 'Product', status: 'building', avatar: 'B' },
  { id: 'trinity', name: 'Trinity', role: 'Dev', status: 'building', avatar: 'T' },
  { id: 'oracle', name: 'Oracle', role: 'Sales', status: 'reviewing', avatar: 'O' },
  { id: 'anderson', name: 'Anderson', role: 'Ops', status: 'shipping', avatar: 'A' },
  { id: 'morpheus', name: 'Morpheus', role: 'Infra', status: 'idle', idleFor: 23, avatar: 'M' },
  { id: 'neo', name: 'Neo', role: 'Design', status: 'reviewing', avatar: 'N' },
  { id: 'cypher', name: 'Cypher', role: 'Data', status: 'blocked', avatar: 'C' },
];

export const INITIAL_CARDS: ProjectCard[] = [
  {
    id: 'promptforge',
    name: 'PromptForge',
    description: 'AI prompt versioning and testing environment with diff tracking.',
    assignedAgentId: 'trinity',
    status: 'in-progress',
    progress: 67,
    tags: ['dev-tool', 'api'],
    latestComment: {
      id: 'c1',
      agentId: 'trinity',
      text: 'Diff engine compiles clean. Adding export layer.',
      timestamp: Date.now() - 42000,
    },
    updatedAt: Date.now() - 42000,
    isLive: true,
    checklist: [
      { id: 'ck1', text: 'Core diff engine', done: true },
      { id: 'ck2', text: 'Version storage', done: true },
      { id: 'ck3', text: 'Export layer', done: false },
      { id: 'ck4', text: 'API endpoints', done: false },
    ],
    deployStatus: 'none',
    decisions: ['Use SQLite for local version history', 'Ship v1 without team sharing'],
  },
  {
    id: 'autocloser',
    name: 'AutoCloser',
    description: 'Autonomous CRM follow-up — detects stale leads and re-engages.',
    assignedAgentId: 'oracle',
    status: 'review',
    progress: 88,
    tags: ['sales', 'crm'],
    latestComment: {
      id: 'c2',
      agentId: 'oracle',
      text: 'Signal pattern looks strong. Needs one more test on cold leads.',
      timestamp: Date.now() - 78000,
    },
    updatedAt: Date.now() - 78000,
    isLive: true,
    checklist: [
      { id: 'ck5', text: 'Lead scoring model', done: true },
      { id: 'ck6', text: 'Re-engagement copy', done: true },
      { id: 'ck7', text: 'CRM integration', done: true },
      { id: 'ck8', text: 'Cold lead test run', done: false },
    ],
    deployStatus: 'queued',
    decisions: ['Target 45-day stale threshold', 'Personalize by deal size'],
  },
  {
    id: 'signaldesk',
    name: 'SignalDesk',
    description: 'Market signal aggregator — news, social, pricing changes in one feed.',
    assignedAgentId: 'cypher',
    status: 'in-progress',
    progress: 34,
    tags: ['data', 'research'],
    latestComment: {
      id: 'c3',
      agentId: 'oracle',
      text: 'Blocked on Twitter API rate limit. Switching to RSS fallback.',
      timestamp: Date.now() - 120000,
    },
    updatedAt: Date.now() - 120000,
    isLive: false,
    blockedReason: 'API rate limit. RSS fallback in progress.',
    checklist: [
      { id: 'ck9', text: 'Source connectors', done: true },
      { id: 'ck10', text: 'Dedup pipeline', done: false },
      { id: 'ck11', text: 'Relevance scoring', done: false },
    ],
    deployStatus: 'none',
    decisions: ['RSS as primary fallback for Twitter', 'No ML scoring in v1'],
  },
  {
    id: 'replyledger',
    name: 'ReplyLedger',
    description: 'Tracks all async comms and surfaces unanswered threads automatically.',
    assignedAgentId: 'brown',
    status: 'ideas',
    progress: 8,
    tags: ['productivity', 'async'],
    latestComment: {
      id: 'c4',
      agentId: 'smith',
      text: 'Viable. Assign to Brown for scoping. Prioritize over MeetingCorner.',
      timestamp: Date.now() - 210000,
    },
    updatedAt: Date.now() - 210000,
    isLive: false,
    checklist: [
      { id: 'ck12', text: 'Scope document', done: false },
      { id: 'ck13', text: 'Integration map', done: false },
    ],
    deployStatus: 'none',
    decisions: ['Prioritized over MeetingCorner by Smith'],
  },
  {
    id: 'meetingcorner',
    name: 'MeetingCorner',
    description: 'Auto-schedules, transcribes, and summarizes async standups.',
    assignedAgentId: 'neo',
    status: 'ideas',
    progress: 0,
    tags: ['meetings', 'ai'],
    latestComment: {
      id: 'c5',
      agentId: 'smith',
      text: 'Deprioritized. Revisit after ReplyLedger ships.',
      timestamp: Date.now() - 310000,
    },
    updatedAt: Date.now() - 310000,
    isLive: false,
    checklist: [],
    deployStatus: 'none',
    decisions: ['Deprioritized by Smith (March 28)'],
  },
  {
    id: 'trendharvester',
    name: 'TrendHarvester',
    description: 'Detects trending micro-niches from search and community data.',
    assignedAgentId: 'anderson',
    status: 'shipped',
    progress: 100,
    tags: ['analytics', 'research'],
    latestComment: {
      id: 'c6',
      agentId: 'anderson',
      text: 'v1.2 deployed. Watching metrics. Zero errors in 4h.',
      timestamp: Date.now() - 14400000,
    },
    updatedAt: Date.now() - 14400000,
    isLive: false,
    checklist: [
      { id: 'ck14', text: 'Data pipeline', done: true },
      { id: 'ck15', text: 'Trend scoring', done: true },
      { id: 'ck16', text: 'API layer', done: true },
      { id: 'ck17', text: 'Deploy v1.2', done: true },
    ],
    deployStatus: 'deployed',
    decisions: ['Shipped on schedule', 'Monitor for 48h before v1.3'],
  },
];

export const INITIAL_EVENTS: ActivityEvent[] = [
  { id: 'e1', text: 'Anderson shipped TrendHarvester v1.2', timestamp: Date.now() - 14400000, type: 'ship' },
  { id: 'e2', text: 'Smith approved AutoCloser for review', timestamp: Date.now() - 3600000, type: 'decision' },
  { id: 'e3', text: 'Oracle moved AutoCloser to Review', timestamp: Date.now() - 3400000, type: 'move' },
  { id: 'e4', text: 'Oracle flagged SignalDesk as blocked', timestamp: Date.now() - 120000, type: 'block' },
  { id: 'e5', text: 'Trinity updated PromptForge — diff engine compiles', timestamp: Date.now() - 42000, type: 'build' },
  { id: 'e6', text: 'Brown assigned to ReplyLedger', timestamp: Date.now() - 210000, type: 'assign' },
];

export const AUTO_EVENTS = [
  { text: 'Trinity pushed 14 lines to PromptForge', type: 'build' as const },
  { text: 'Oracle commented on AutoCloser pricing page', type: 'comment' as const },
  { text: 'Brown moved ReplyLedger progress to 12%', type: 'build' as const },
  { text: 'Smith approved SignalDesk RSS fallback', type: 'decision' as const },
  { text: 'Anderson queued AutoCloser for deploy', type: 'ship' as const },
  { text: 'Morpheus scaled infra node ×2', type: 'build' as const },
  { text: 'Trinity requested clarification on rate limits', type: 'comment' as const },
  { text: 'Neo updated PromptForge UI wireframe', type: 'build' as const },
  { text: 'Oracle detected customer signal — SaaS niche uptick', type: 'decision' as const },
  { text: 'Smith scheduled weekly decision review', type: 'decision' as const },
  { text: 'Cypher retried Twitter API — still blocked', type: 'block' as const },
  { text: 'Anderson confirmed deploy window open', type: 'ship' as const },
  { text: 'Brown finalized ReplyLedger scope doc', type: 'build' as const },
  { text: 'Trinity ran PromptForge test suite — 47/47 passed', type: 'build' as const },
  { text: 'Oracle updated AutoCloser re-engagement copy', type: 'comment' as const },
];

export function formatTimeSince(ms: number): string {
  const diff = Math.floor((Date.now() - ms) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find(a => a.id === id);
}

export const STATUS_COLORS: Record<AgentStatus, string> = {
  thinking: '#f59e0b',
  building: '#0ea5e9',
  reviewing: '#a855f7',
  shipping: '#22c55e',
  blocked: '#ef4444',
  idle: '#a8a29e',
};

export const STATUS_LABELS: Record<AgentStatus, string> = {
  thinking: 'thinking',
  building: 'building',
  reviewing: 'reviewing',
  shipping: 'shipping',
  blocked: 'blocked',
  idle: 'idle',
};
