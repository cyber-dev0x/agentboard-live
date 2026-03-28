'use client';

import { Agent, STATUS_COLORS, STATUS_LABELS, AgentStatus } from '@/lib/data';

interface SidebarProps {
  agents: Agent[];
  activeView: string;
  onViewChange: (v: string) => void;
}

const NAV_ITEMS = [
  { id: 'board', label: 'Board', icon: '⬛' },
  { id: 'agents', label: 'Agents', icon: '◉' },
  { id: 'activity', label: 'Activity', icon: '≋' },
];

function StatusDot({ status, idleFor }: { status: AgentStatus; idleFor?: number }) {
  const color = STATUS_COLORS[status];
  const isPulsing = status === 'building' || status === 'shipping';

  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: 8, height: 8 }}>
      {isPulsing && (
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            opacity: 0.3,
            animation: 'pulse-ring 1.8s ease-out infinite',
          }}
        />
      )}
      <span
        className="rounded-full block"
        style={{
          width: status === 'idle' ? 6 : 8,
          height: status === 'idle' ? 6 : 8,
          background: color,
          opacity: status === 'idle' ? 0.5 : 1,
        }}
      />
    </span>
  );
}

export function Sidebar({ agents, activeView, onViewChange }: SidebarProps) {
  return (
    <aside
      className="flex flex-col"
      style={{
        width: 200,
        minWidth: 200,
        background: 'var(--surface-2)',
        borderRight: '1px solid var(--border)',
        height: '100%',
      }}
    >
      {/* Workspace header */}
      <div
        style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 24,
              height: 24,
              background: '#1c1917',
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#f5f5f4', fontSize: 11, fontWeight: 700 }}>AO</span>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              AgentOps
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.2 }}>Ops OS v0.4</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 8px 0' }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full text-left flex items-center gap-2 rounded-md transition-all duration-150 ${
              activeView === item.id ? 'sidebar-item-active' : 'hover:bg-white/60'
            }`}
            style={{
              padding: '6px 10px',
              marginBottom: 1,
              fontSize: 12,
              fontWeight: activeView === item.id ? 500 : 400,
              color: activeView === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 10, opacity: 0.6 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />

      {/* Agent roster */}
      <div style={{ padding: '0 8px', flex: 1, overflow: 'auto' }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            padding: '0 10px 6px',
          }}
        >
          Agents online
        </div>
        {agents.map(agent => (
          <div
            key={agent.id}
            className="flex items-center gap-2 rounded-md"
            style={{ padding: '5px 10px', marginBottom: 1 }}
          >
            <div
              className="flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: 22,
                height: 22,
                background: '#e7e5e4',
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {agent.avatar}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="flex items-center justify-between gap-1">
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>
                  {agent.name}
                </span>
                <StatusDot status={agent.status} idleFor={agent.idleFor} />
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                {agent.status === 'idle'
                  ? `idle ${agent.idleFor}s`
                  : STATUS_LABELS[agent.status]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System indicators */}
      <div
        style={{
          padding: '10px 16px 14px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-1.5" style={{ marginBottom: 4 }}>
          <span className="blink rounded-full" style={{ width: 6, height: 6, background: '#22c55e', display: 'inline-block' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>System operational</span>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
          uptime 14d 6h 22m
        </div>
      </div>
    </aside>
  );
}
