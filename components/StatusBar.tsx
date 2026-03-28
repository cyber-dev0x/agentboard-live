'use client';

import { Agent, ActivityEvent } from '@/lib/data';

interface StatusBarProps {
  agents: Agent[];
  events: ActivityEvent[];
  activeBuilds: number;
  launchInProgress: boolean;
  decisionsToday: number;
}

export function StatusBar({
  agents,
  events,
  activeBuilds,
  launchInProgress,
  decisionsToday,
}: StatusBarProps) {
  const onlineCount = agents.filter(a => a.status !== 'idle').length;

  const stats = [
    { label: `${onlineCount} agents active` },
    { label: `${activeBuilds} active builds` },
    { label: launchInProgress ? '1 launch in progress' : 'no launches queued' },
    { label: `${decisionsToday} decisions today` },
    { label: 'uptime 14d' },
    { label: 'zero critical errors' },
  ];

  // Duplicate for seamless loop
  const doubled = [...stats, ...stats];

  return (
    <div
      style={{
        height: 32,
        background: '#1c1917',
        borderBottom: '1px solid #292524',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        flex: '0 0 32px',
      }}
    >
      {/* Left label */}
      <div
        className="flex items-center gap-1.5 flex-shrink-0"
        style={{
          padding: '0 16px',
          borderRight: '1px solid #292524',
          height: '100%',
          background: '#141110',
        }}
      >
        <span
          className="blink rounded-full"
          style={{ width: 6, height: 6, background: '#22c55e', display: 'inline-block' }}
        />
        <span className="mono" style={{ fontSize: 10, color: '#78716c', letterSpacing: '0.05em' }}>
          LIVE
        </span>
      </div>

      {/* Ticker */}
      <div className="ticker-wrap" style={{ flex: 1 }}>
        <div className="ticker-inner">
          {doubled.map((s, i) => (
            <span
              key={i}
              className="mono"
              style={{
                fontSize: 10,
                color: '#78716c',
                padding: '0 24px',
                letterSpacing: '0.04em',
              }}
            >
              <span style={{ color: '#44403c', marginRight: 8 }}>·</span>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Right label */}
      <div
        className="flex items-center gap-2 flex-shrink-0"
        style={{
          padding: '0 14px',
          borderLeft: '1px solid #292524',
          height: '100%',
        }}
      >
        <span className="mono" style={{ fontSize: 10, color: '#57534e' }}>
          Ops OS v0.4.1
        </span>
      </div>
    </div>
  );
}
