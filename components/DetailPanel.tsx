'use client';

import { ProjectCard, Agent, AGENTS, formatTimeSince, STATUS_COLORS, CardStatus } from '@/lib/data';

interface DetailPanelProps {
  card: ProjectCard;
  agents: Agent[];
  onClose: () => void;
  onToggleChecklistItem: (cardId: string, itemId: string) => void;
  onMoveToNextStage: (cardId: string) => void;
}

const DEPLOY_STATUS_LABELS: Record<string, string> = {
  none: 'Not deployed',
  queued: 'Deploy queued',
  deploying: 'Deploying...',
  deployed: 'Live',
  failed: 'Deploy failed',
};

const DEPLOY_STATUS_COLORS: Record<string, string> = {
  none: '#a8a29e',
  queued: '#f59e0b',
  deploying: '#0ea5e9',
  deployed: '#22c55e',
  failed: '#ef4444',
};

const NEXT_STAGE_LABELS: Record<CardStatus, string | null> = {
  ideas: 'Move to In Progress',
  'in-progress': 'Move to Review',
  review: 'Ship it',
  shipped: null,
};

const THREAD_COMMENTS = [
  { agentId: 'smith', text: 'Scoped and approved. Move fast.', offset: 86400 },
  { agentId: 'brown', text: 'Spec locked. Starting implementation sprint.', offset: 43200 },
  { agentId: 'trinity', text: 'Core pipeline done. Hitting edge cases on input validation.', offset: 18000 },
  { agentId: 'oracle', text: 'Reviewed from market angle. Positioning is solid.', offset: 7200 },
  { agentId: 'neo', text: 'UI pass complete. Waiting on final copy.', offset: 3600 },
];

export function DetailPanel({ card, agents, onClose, onToggleChecklistItem, onMoveToNextStage }: DetailPanelProps) {
  const assignedAgent = agents.find(a => a.id === card.assignedAgentId);

  const completedChecks = card.checklist.filter(c => c.done).length;
  const totalChecks = card.checklist.length;
  const nextStageLabel = NEXT_STAGE_LABELS[card.status];

  return (
    <div
      className="slide-panel flex flex-col"
      style={{
        width: 340,
        minWidth: 340,
        height: '100%',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {card.name}
            </span>
            {card.isLive && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  background: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #bbf7d0',
                  borderRadius: 3,
                  padding: '1px 5px',
                  letterSpacing: '0.05em',
                }}
              >
                LIVE
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {card.description}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
            border: '1px solid var(--border)',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 14,
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px' }}>

        {/* Move to next stage */}
        {nextStageLabel && (
          <div style={{ marginBottom: 18 }}>
            <button
              onClick={() => onMoveToNextStage(card.id)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: card.status === 'review' ? '#dcfce7' : '#f0f9ff',
                border: `1px solid ${card.status === 'review' ? '#bbf7d0' : '#bae6fd'}`,
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                color: card.status === 'review' ? '#15803d' : '#0369a1',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = card.status === 'review' ? '#bbf7d0' : '#bae6fd';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = card.status === 'review' ? '#dcfce7' : '#f0f9ff';
              }}
            >
              {nextStageLabel} →
            </button>
          </div>
        )}

        {/* Assigned agent */}
        <Section title="Assigned to">
          {assignedAgent ? (
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 26,
                  height: 26,
                  background: '#e7e5e4',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                }}
              >
                {assignedAgent.avatar}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Agent {assignedAgent.name}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="rounded-full"
                    style={{
                      width: 6,
                      height: 6,
                      background: STATUS_COLORS[assignedAgent.status],
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {assignedAgent.role} · {assignedAgent.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Unassigned</span>
          )}
        </Section>

        {/* Deploy status */}
        <Section title="Deploy status">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full"
              style={{
                width: 8,
                height: 8,
                background: DEPLOY_STATUS_COLORS[card.deployStatus],
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>
              {DEPLOY_STATUS_LABELS[card.deployStatus]}
            </span>
          </div>
        </Section>

        {/* Blockers */}
        {card.blockedReason && (
          <Section title="Blocker">
            <div
              style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                borderRadius: 6,
                padding: '8px 10px',
                fontSize: 11,
                color: '#b91c1c',
                lineHeight: 1.45,
              }}
            >
              {card.blockedReason}
            </div>
          </Section>
        )}

        {/* Progress */}
        {card.progress > 0 && (
          <Section title={`Progress — ${card.progress}%`}>
            <div
              style={{
                height: 6,
                background: '#f5f5f4',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                className={card.isLive ? 'progress-shimmer' : ''}
                style={{
                  height: '100%',
                  width: `${card.progress}%`,
                  background: card.isLive ? undefined : '#0ea5e9',
                  borderRadius: 3,
                }}
              />
            </div>
          </Section>
        )}

        {/* Checklist — toggleable */}
        {card.checklist.length > 0 && (
          <Section title={`Checklist — ${completedChecks}/${totalChecks}`}>
            <div className="flex flex-col gap-1.5">
              {card.checklist.map(item => (
                <button
                  key={item.id}
                  onClick={() => onToggleChecklistItem(card.id, item.id)}
                  className="flex items-center gap-2"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 0',
                    textAlign: 'left',
                    width: '100%',
                    borderRadius: 4,
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--surface-2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      border: item.done ? 'none' : '1.5px solid #d6d3d1',
                      background: item.done ? '#0ea5e9' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 0.15s',
                    }}
                  >
                    {item.done && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: item.done ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: item.done ? 'line-through' : 'none',
                    }}
                  >
                    {item.text}
                  </span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Decision log */}
        {card.decisions.length > 0 && (
          <Section title="Decision log">
            <div className="flex flex-col gap-1.5">
              {card.decisions.map((d, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2"
                  style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}
                >
                  <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }}>—</span>
                  {d}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Discussion thread */}
        <Section title="Discussion">
          <div className="flex flex-col gap-3">
            {THREAD_COMMENTS.slice(0, 4).map((c, i) => {
              const agent = AGENTS.find(a => a.id === c.agentId);
              if (!agent) return null;
              return (
                <div key={i} className="flex gap-2">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 20,
                      height: 20,
                      background: '#e7e5e4',
                      fontSize: 9,
                      fontWeight: 700,
                      color: 'var(--text-secondary)',
                      marginTop: 1,
                    }}
                  >
                    {agent.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center gap-1.5" style={{ marginBottom: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {agent.name}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {formatTimeSince(Date.now() - c.offset * 1000)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.45,
                        background: 'var(--surface-2)',
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--border)',
                      }}
                    >
                      {c.text}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Live comment */}
            <div className="flex gap-2">
              <div
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{
                  width: 20,
                  height: 20,
                  background: '#e7e5e4',
                  fontSize: 9,
                  fontWeight: 700,
                  color: 'var(--text-secondary)',
                  marginTop: 1,
                }}
              >
                {assignedAgent?.avatar || '?'}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-1.5" style={{ marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {assignedAgent?.name || 'Agent'}
                  </span>
                  <span
                    className="blink"
                    style={{ fontSize: 10, color: '#16a34a', fontWeight: 500 }}
                  >
                    now
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    background: '#f0fdf4',
                    padding: '6px 8px',
                    borderRadius: 6,
                    border: '1px solid #bbf7d0',
                  }}
                >
                  {card.latestComment.text}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
