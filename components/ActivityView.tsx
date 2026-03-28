'use client';

import { ActivityEvent, formatTimeSince } from '@/lib/data';

interface ActivityViewProps {
  events: ActivityEvent[];
}

const TYPE_LABELS: Record<string, string> = {
  move: 'moved',
  comment: 'comment',
  ship: 'shipped',
  block: 'blocked',
  assign: 'assigned',
  decision: 'decision',
  build: 'build',
};

const TYPE_BADGE_BG: Record<string, string> = {
  move: '#e0f2fe',
  comment: '#f3e8ff',
  ship: '#dcfce7',
  block: '#fee2e2',
  assign: '#fef3c7',
  decision: '#f5f5f4',
  build: '#e0f2fe',
};

const TYPE_BADGE_TEXT: Record<string, string> = {
  move: '#0369a1',
  comment: '#7e22ce',
  ship: '#15803d',
  block: '#dc2626',
  assign: '#b45309',
  decision: '#57534e',
  build: '#0369a1',
};

export function ActivityView({ events }: ActivityViewProps) {
  const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div style={{ padding: '20px 24px', overflow: 'auto', height: '100%', maxWidth: 700 }}>
      <div style={{ marginBottom: 16 }}>
        <div className="flex items-center gap-2">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 0 }}>
            Activity Log
          </h2>
          <div className="flex items-center gap-1.5">
            <span
              className="blink rounded-full"
              style={{ width: 6, height: 6, background: '#0ea5e9', display: 'inline-block' }}
            />
            <span style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 500 }}>live</span>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
          {sorted.length} events · updating automatically
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: 1 }}>
        {sorted.map((event, i) => (
          <div
            key={event.id}
            className={i < 2 ? 'fade-in-up' : ''}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 14px',
              background: i < 2 ? '#f0f9ff' : 'var(--surface)',
              borderRadius: 8,
              border: `1px solid ${i < 2 ? '#bae6fd' : 'var(--border)'}`,
              marginBottom: 4,
            }}
          >
            {/* Timeline dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i < 2 ? '#0ea5e9' : 'var(--border)',
                flexShrink: 0,
                marginTop: 4,
              }}
            />

            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 2 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    background: TYPE_BADGE_BG[event.type] || '#f5f5f4',
                    color: TYPE_BADGE_TEXT[event.type] || '#78716c',
                    padding: '1px 6px',
                    borderRadius: 3,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {TYPE_LABELS[event.type] || event.type}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{event.text}</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {formatTimeSince(event.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
