'use client';

import { ActivityEvent, formatTimeSince } from '@/lib/data';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

const TYPE_ICONS: Record<string, string> = {
  move: '→',
  comment: '◎',
  ship: '▲',
  block: '■',
  assign: '◆',
  decision: '◉',
  build: '◈',
};

const TYPE_COLORS: Record<string, string> = {
  move: '#0ea5e9',
  comment: '#a855f7',
  ship: '#22c55e',
  block: '#ef4444',
  assign: '#f59e0b',
  decision: '#78716c',
  build: '#0ea5e9',
};

export function ActivityFeed({ events }: ActivityFeedProps) {
  const sorted = [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, 30);

  return (
    <div
      style={{
        width: 240,
        minWidth: 240,
        borderLeft: '1px solid var(--border)',
        background: 'var(--surface-2)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '10px 14px 8px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          Activity
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="blink rounded-full"
            style={{ width: 5, height: 5, background: '#0ea5e9', display: 'inline-block' }}
          />
          <span style={{ fontSize: 10, color: '#0ea5e9', fontWeight: 500 }}>live</span>
        </div>
      </div>

      {/* Feed */}
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
        {sorted.map((event, i) => (
          <div
            key={event.id}
            className={i < 3 ? 'fade-in-up' : ''}
            style={{
              padding: '5px 14px',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
              opacity: i > 20 ? 0.4 : 1,
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: TYPE_COLORS[event.type] || '#78716c',
                flexShrink: 0,
                marginTop: 2,
                width: 10,
                textAlign: 'center',
              }}
            >
              {TYPE_ICONS[event.type] || '·'}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  marginBottom: 1,
                }}
              >
                {event.text}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {formatTimeSince(event.timestamp)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
