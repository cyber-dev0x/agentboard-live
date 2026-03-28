'use client';

import { useState } from 'react';
import { ProjectCard, Agent, CardStatus, ActivityEvent } from '@/lib/data';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  cards: ProjectCard[];
  agents: Agent[];
  onCardClick: (card: ProjectCard) => void;
  onNewCard: (card: ProjectCard) => void;
  onRunAgent: () => void;
  agentFilter: string | null;
  systemLogEvents: ActivityEvent[];
}

const COLUMNS: { id: CardStatus; label: string; color: string }[] = [
  { id: 'ideas', label: 'Ideas', color: '#a8a29e' },
  { id: 'in-progress', label: 'In Progress', color: '#0ea5e9' },
  { id: 'review', label: 'Review', color: '#a855f7' },
  { id: 'shipped', label: 'Shipped', color: '#22c55e' },
];

const NEW_TASK_NAMES = [
  'PriceSpy', 'AutoDraft', 'LeadRadar', 'CopyEngine', 'NicheMap',
  'FlowCast', 'PulseBoard', 'SignalCore', 'ChurnShield', 'DeckForge',
];
const NEW_TASK_DESCS = [
  'Monitors competitor pricing in real time and alerts on changes.',
  'Generates first-draft sales emails from deal context.',
  'Scores inbound leads automatically from enriched data.',
  'Produces landing page copy variants for A/B testing.',
  'Maps emerging micro-niches from search trend signals.',
  'Forecasts pipeline flow using historical deal velocity.',
  'Live metrics board for ops, sales, and product.',
  'Centralizes market signals into a single feed.',
  'Detects churn risk early and triggers retention plays.',
  'Builds investor decks from live company metrics.',
];
const TAG_POOL = [['ai', 'analytics'], ['sales', 'api'], ['data', 'research'], ['productivity', 'async'], ['dev-tool']];

let _cardCounter = 200;

export function KanbanBoard({
  cards,
  agents,
  onCardClick,
  onNewCard,
  onRunAgent,
  agentFilter,
  systemLogEvents,
}: KanbanBoardProps) {
  const [activeColumns, setActiveColumns] = useState<Set<CardStatus>>(new Set(COLUMNS.map(c => c.id)));
  const [logOpen, setLogOpen] = useState(false);

  function toggleColumn(colId: CardStatus) {
    setActiveColumns(prev => {
      const next = new Set(prev);
      if (next.has(colId) && next.size > 1) {
        next.delete(colId);
      } else {
        next.add(colId);
      }
      return next;
    });
  }

  function handleNewCard() {
    const idx = Math.floor(Math.random() * NEW_TASK_NAMES.length);
    const agentIdx = Math.floor(Math.random() * agents.length);
    const tags = TAG_POOL[Math.floor(Math.random() * TAG_POOL.length)];
    const id = `new_task_${++_cardCounter}`;
    const agent = agents[agentIdx];
    const newCard: ProjectCard = {
      id,
      name: NEW_TASK_NAMES[idx],
      description: NEW_TASK_DESCS[idx],
      assignedAgentId: agent.id,
      status: 'ideas',
      progress: 0,
      tags,
      latestComment: {
        id: `c_${id}`,
        agentId: agent.id,
        text: 'New task queued. Scoping in progress.',
        timestamp: Date.now(),
      },
      updatedAt: Date.now(),
      isLive: false,
      checklist: [
        { id: `ck_${id}_1`, text: 'Scope document', done: false },
        { id: `ck_${id}_2`, text: 'First implementation pass', done: false },
      ],
      deployStatus: 'none',
      decisions: [],
    };
    onNewCard(newCard);
  }

  const displayCols = COLUMNS.filter(c => activeColumns.has(c.id));

  const logLines = [...systemLogEvents]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const filteredCards = agentFilter
    ? cards.filter(c => c.assignedAgentId === agentFilter)
    : cards;

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Board toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px 6px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {agentFilter && (
          <span
            style={{
              fontSize: 11,
              color: '#0369a1',
              background: '#e0f2fe',
              padding: '2px 8px',
              borderRadius: 4,
              fontWeight: 500,
            }}
          >
            Filtered: {agents.find(a => a.id === agentFilter)?.name}
          </span>
        )}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', flex: 1 }}>
          {filteredCards.length} tasks
        </span>
        <button
          onClick={onRunAgent}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#15803d',
            background: '#dcfce7',
            border: '1px solid #bbf7d0',
            borderRadius: 5,
            padding: '4px 10px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#bbf7d0')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#dcfce7')}
        >
          ▶ Run Agent
        </button>
        <button
          onClick={handleNewCard}
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: 'white',
            background: '#0ea5e9',
            border: '1px solid #0284c7',
            borderRadius: 5,
            padding: '4px 10px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#0284c7')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#0ea5e9')}
        >
          + New Task
        </button>
      </div>

      {/* Columns */}
      <div
        className="flex gap-3"
        style={{
          padding: '12px 20px 16px',
          flex: 1,
          overflow: 'auto',
        }}
      >
        {COLUMNS.map(col => {
          const isActive = activeColumns.has(col.id);
          const colCards = filteredCards.filter(c => c.status === col.id);
          const liveCount = colCards.filter(c => c.isLive).length;

          return (
            <div
              key={col.id}
              style={{
                flex: isActive ? '1 1 0' : '0 0 auto',
                minWidth: isActive ? 220 : undefined,
                display: 'flex',
                flexDirection: 'column',
                opacity: isActive ? 1 : 0.45,
                transition: 'flex 0.2s ease, opacity 0.2s ease',
              }}
            >
              {/* Column header — clickable to filter */}
              <button
                onClick={() => toggleColumn(col.id)}
                className="flex items-center gap-2"
                style={{
                  marginBottom: 10,
                  padding: '4px 6px',
                  borderRadius: 6,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--border)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                title={isActive ? 'Click to hide column' : 'Click to show column'}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: col.color,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    flex: 1,
                  }}
                >
                  {col.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--text-muted)',
                    background: 'var(--border)',
                    borderRadius: 10,
                    padding: '1px 7px',
                    fontWeight: 500,
                  }}
                >
                  {colCards.length}
                </span>
                {liveCount > 0 && (
                  <span className="flex items-center gap-1">
                    <span
                      className="blink rounded-full"
                      style={{
                        width: 5,
                        height: 5,
                        background: col.color,
                        display: 'inline-block',
                      }}
                    />
                    <span style={{ fontSize: 10, color: col.color, fontWeight: 500 }}>
                      {liveCount}
                    </span>
                  </span>
                )}
              </button>

              {/* Cards */}
              {isActive && (
                <div style={{ flex: 1, overflow: 'auto' }}>
                  {colCards.length === 0 ? (
                    <div
                      style={{
                        padding: '20px 12px',
                        textAlign: 'center',
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        border: '1px dashed var(--border)',
                        borderRadius: 8,
                      }}
                    >
                      No items
                    </div>
                  ) : (
                    colCards.map(card => (
                      <div key={card.id} className="fade-in-up">
                        <KanbanCard
                          card={card}
                          agent={agents.find(a => a.id === card.assignedAgentId)}
                          onClick={() => onCardClick(card)}
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating System Log */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          zIndex: 50,
          width: 320,
        }}
      >
        {logOpen && (
          <div
            className="fade-in-up"
            style={{
              background: '#141110',
              border: '1px solid #292524',
              borderRadius: 8,
              marginBottom: 6,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '6px 10px',
                borderBottom: '1px solid #292524',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span className="mono" style={{ fontSize: 10, color: '#78716c', letterSpacing: '0.06em' }}>
                SYSTEM LOG
              </span>
              <span className="mono blink" style={{ fontSize: 9, color: '#22c55e' }}>●</span>
            </div>
            <div style={{ padding: '8px 10px', maxHeight: 150, overflow: 'auto' }}>
              {logLines.length === 0 ? (
                <span className="mono" style={{ fontSize: 10, color: '#57534e' }}>No events yet.</span>
              ) : (
                logLines.map((ev, i) => {
                  const ageS = Math.floor((Date.now() - ev.timestamp) / 1000);
                  const ageStr = ageS < 60 ? `${ageS}s` : `${Math.floor(ageS / 60)}m`;
                  return (
                    <div
                      key={ev.id}
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: i === 0 ? '#a8a29e' : '#57534e',
                        lineHeight: 1.6,
                        display: 'flex',
                        gap: 8,
                      }}
                    >
                      <span style={{ color: '#44403c', flexShrink: 0 }}>{ageStr}</span>
                      <span>{ev.text}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        <button
          onClick={() => setLogOpen(o => !o)}
          className="mono"
          style={{
            width: '100%',
            padding: '5px 10px',
            background: '#1c1917',
            border: '1px solid #292524',
            borderRadius: 6,
            color: '#78716c',
            fontSize: 10,
            cursor: 'pointer',
            textAlign: 'left',
            letterSpacing: '0.06em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#292524')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#1c1917')}
        >
          <span style={{ color: '#22c55e' }}>$</span>
          <span>system log</span>
          <span style={{ marginLeft: 'auto', color: '#44403c' }}>{logOpen ? '▼' : '▲'}</span>
        </button>
      </div>
    </div>
  );
}
