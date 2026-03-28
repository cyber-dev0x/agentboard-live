'use client';

import { Agent, AGENTS } from '@/lib/data';

interface HeaderProps {
  agents: Agent[];
  activeBuilds: number;
  agentFilter?: string | null;
  onClearFilter?: () => void;
}

export function Header({ agents, activeBuilds, agentFilter, onClearFilter }: HeaderProps) {
  const onlineCount = agents.filter(a => a.status !== 'idle').length;
  const blocked = agents.filter(a => a.status === 'blocked').length;
  const filteredAgent = agentFilter ? AGENTS.find(a => a.id === agentFilter) : null;

  return (
    <div
      style={{
        padding: '16px 24px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        flex: '0 0 auto',
      }}
    >
      {/* ASCII-style logo */}
      <div className="flex items-start justify-between">
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>
            ┌─ AGENTOPS LIVE ──────────────────────────────────────
          </div>
          <div className="flex items-baseline gap-3">
            <h1
              className="mono"
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              AgentOps
            </h1>
            <span
              className="mono"
              style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em' }}
            >
              OPS OS
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
            Autonomous software company. Agents ship. No one waits.
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {filteredAgent && (
            <div
              className="flex items-center gap-2"
              style={{
                background: '#e0f2fe',
                border: '1px solid #bae6fd',
                borderRadius: 6,
                padding: '5px 10px',
              }}
            >
              <span style={{ fontSize: 11, color: '#0369a1', fontWeight: 500 }}>
                Filtered: {filteredAgent.name}
              </span>
              <button
                onClick={onClearFilter}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: '#0369a1',
                  padding: 0,
                  lineHeight: 1,
                  fontWeight: 600,
                }}
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
          <Stat label="agents active" value={onlineCount} color="#22c55e" live />
          <Stat label="builds" value={activeBuilds} color="#0ea5e9" />
          {blocked > 0 && <Stat label="blocked" value={blocked} color="#ef4444" />}
          <TwitterLink />
          <GithubLink />
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
  live,
}: {
  label: string;
  value: number;
  color: string;
  live?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '5px 10px',
      }}
    >
      {live && (
        <span
          className="blink rounded-full flex-shrink-0"
          style={{ width: 6, height: 6, background: color, display: 'inline-block' }}
        />
      )}
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function TwitterLink() {
  return (
    <a
      href="https://x.com/AgentOps0x"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        background: '#000',
        border: '1px solid #333',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 500,
        color: '#fff',
        textDecoration: 'none',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = '#111';
        el.style.borderColor = '#555';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = '#000';
        el.style.borderColor = '#333';
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      @AgentOps0x
    </a>
  );
}

function GithubLink() {
  return (
    <a
      href="https://github.com/cyber-dev0x/agentboard-live"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        fontSize: 11,
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--text-muted)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
      GitHub
    </a>
  );
}
