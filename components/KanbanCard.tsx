'use client';

import { ProjectCard, Agent, formatTimeSince, STATUS_COLORS } from '@/lib/data';

interface KanbanCardProps {
  card: ProjectCard;
  agent: Agent | undefined;
  onClick: () => void;
}

const TAG_COLORS: Record<string, string> = {
  'dev-tool': '#dbeafe',
  api: '#e0f2fe',
  sales: '#dcfce7',
  crm: '#d1fae5',
  data: '#fef3c7',
  research: '#fef9c3',
  productivity: '#f3e8ff',
  async: '#ede9fe',
  meetings: '#fce7f3',
  ai: '#e0e7ff',
  analytics: '#ecfccb',
};

const TAG_TEXT: Record<string, string> = {
  'dev-tool': '#1d4ed8',
  api: '#0369a1',
  sales: '#15803d',
  crm: '#065f46',
  data: '#b45309',
  research: '#854d0e',
  productivity: '#6d28d9',
  async: '#4c1d95',
  meetings: '#9d174d',
  ai: '#3730a3',
  analytics: '#3f6212',
};

export function KanbanCard({ card, agent, onClick }: KanbanCardProps) {
  const isActive = card.isLive;
  const isBlocked = !!card.blockedReason;
  const agentColor = agent ? STATUS_COLORS[agent.status] : '#a8a29e';
  const secondsSince = Math.floor((Date.now() - card.updatedAt) / 1000);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg ${isActive ? 'live-card' : ''} card-hover`}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isBlocked ? '#fca5a5' : 'var(--border)'}`,
        padding: '10px 12px',
        marginBottom: 8,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Live / Blocked pill */}
      {isActive && !isBlocked && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          <span
            className="blink rounded-full"
            style={{ width: 5, height: 5, background: '#16a34a', display: 'inline-block' }}
          />
          <span style={{ fontSize: 9, fontWeight: 600, color: '#15803d', letterSpacing: '0.05em' }}>
            LIVE
          </span>
        </div>
      )}
      {isBlocked && (
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: 4,
            padding: '2px 6px',
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 600, color: '#dc2626', letterSpacing: '0.05em' }}>
            BLOCKED
          </span>
        </div>
      )}

      {/* Project name */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 3,
          paddingRight: isActive || isBlocked ? 56 : 0,
          lineHeight: 1.3,
        }}
      >
        {card.name}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: 11,
          color: 'var(--text-secondary)',
          lineHeight: 1.45,
          marginBottom: 8,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {card.description}
      </div>

      {/* Progress bar */}
      {card.progress > 0 && card.status !== 'shipped' && (
        <div
          style={{
            height: 3,
            background: '#f5f5f4',
            borderRadius: 2,
            marginBottom: 8,
            overflow: 'hidden',
          }}
        >
          <div
            className={isActive ? 'progress-shimmer' : ''}
            style={{
              height: '100%',
              width: `${card.progress}%`,
              background: isActive ? undefined : '#0ea5e9',
              borderRadius: 2,
              transition: 'width 1s ease',
            }}
          />
        </div>
      )}
      {card.status === 'shipped' && (
        <div
          style={{ height: 3, background: '#22c55e', borderRadius: 2, marginBottom: 8 }}
        />
      )}

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1" style={{ marginBottom: 8 }}>
          {card.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                fontWeight: 500,
                background: TAG_COLORS[tag] || '#f5f5f4',
                color: TAG_TEXT[tag] || '#78716c',
                padding: '1px 6px',
                borderRadius: 3,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Agent + latest comment */}
      <div
        style={{
          paddingTop: 8,
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-1.5" style={{ marginBottom: 4 }}>
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{
              width: 16,
              height: 16,
              background: '#e7e5e4',
              fontSize: 9,
              fontWeight: 700,
              color: 'var(--text-secondary)',
            }}
          >
            {agent?.avatar || '?'}
          </div>
          <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {agent?.name || 'Unassigned'}
          </span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {secondsSince < 60
              ? `${secondsSince}s ago`
              : secondsSince < 3600
              ? `${Math.floor(secondsSince / 60)}m ago`
              : `${Math.floor(secondsSince / 3600)}h ago`}
          </span>
        </div>
        <div
          style={{
            fontSize: 10,
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          &ldquo;{card.latestComment.text}&rdquo;
        </div>
      </div>
    </div>
  );
}
