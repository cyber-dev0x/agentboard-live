'use client';

import { Agent, STATUS_COLORS, STATUS_LABELS, ProjectCard } from '@/lib/data';

interface AgentsViewProps {
  agents: Agent[];
  cards: ProjectCard[];
  onAgentFilter: (agentId: string) => void;
}

const AGENT_BIOS: Record<string, string> = {
  smith: 'Strategic direction. Approves scope and priorities. Does not debate.',
  brown: 'Owns product spec and roadmap execution. Moves tasks without ceremony.',
  trinity: 'Primary implementation agent. Writes production code. Leaves precise notes.',
  oracle: 'Market signal reader. Closes loops on sales decisions. Trusts intuition.',
  anderson: 'Ops and shipping. Deploys aggressively. Monitors post-launch.',
  morpheus: 'Infrastructure layer. Scales systems. Keeps the foundation clean.',
  neo: 'UI/UX pass. Makes interfaces feel deliberate. Low noise, high precision.',
  cypher: 'Data pipelines and signal processing. Efficient. Occasionally goes dark.',
};

export function AgentsView({ agents, cards, onAgentFilter }: AgentsViewProps) {
  return (
    <div style={{ padding: '20px 24px', overflow: 'auto', height: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
          Agent Roster
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {agents.filter(a => a.status !== 'idle').length} active · {agents.filter(a => a.status === 'blocked').length} blocked
          <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>· click an agent to filter board</span>
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12,
        }}
      >
        {agents.map(agent => {
          const agentCards = cards.filter(c => c.assignedAgentId === agent.id);
          const activeCard = agentCards.find(c => c.status === 'in-progress' || c.status === 'review');

          return (
            <button
              key={agent.id}
              onClick={() => onAgentFilter(agent.id)}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '14px 16px',
                transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = '0 0 0 1px #0ea5e9, 0 4px 16px rgba(14,165,233,0.1)';
                el.style.borderColor = '#0ea5e9';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.boxShadow = 'none';
                el.style.borderColor = 'var(--border)';
              }}
            >
              {/* Agent header */}
              <div className="flex items-start justify-between" style={{ marginBottom: 10 }}>
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      background: '#1c1917',
                      fontSize: 14,
                      fontWeight: 700,
                      color: '#f5f5f4',
                    }}
                  >
                    {agent.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                      Agent {agent.name}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{agent.role}</div>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1.5"
                  style={{
                    padding: '3px 8px',
                    borderRadius: 5,
                    background: '#f5f5f4',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    className={`rounded-full ${agent.status === 'building' || agent.status === 'shipping' ? 'blink' : ''}`}
                    style={{
                      width: 6,
                      height: 6,
                      background: STATUS_COLORS[agent.status],
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {agent.status === 'idle' ? `idle ${agent.idleFor}s` : STATUS_LABELS[agent.status]}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: 12,
                  paddingBottom: 10,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                {AGENT_BIOS[agent.id] || 'No description.'}
              </div>

              {/* Current task */}
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 5,
                  }}
                >
                  Current task
                </div>
                {activeCard ? (
                  <div className="flex items-center gap-2">
                    {activeCard.isLive && (
                      <span
                        className="blink rounded-full flex-shrink-0"
                        style={{ width: 6, height: 6, background: '#0ea5e9', display: 'inline-block' }}
                      />
                    )}
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                      {activeCard.name}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {activeCard.progress}%
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {agentCards.length > 0 ? `${agentCards.length} task(s) assigned` : 'No active task'}
                  </span>
                )}
              </div>

              {/* Filter hint */}
              <div style={{ marginTop: 10, fontSize: 10, color: '#0ea5e9', fontWeight: 500 }}>
                Click to filter board →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
