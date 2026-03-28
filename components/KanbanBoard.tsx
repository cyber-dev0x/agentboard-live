'use client';

import { ProjectCard, Agent, CardStatus, getAgent } from '@/lib/data';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  cards: ProjectCard[];
  agents: Agent[];
  onCardClick: (card: ProjectCard) => void;
}

const COLUMNS: { id: CardStatus; label: string; color: string }[] = [
  { id: 'ideas', label: 'Ideas', color: '#a8a29e' },
  { id: 'in-progress', label: 'In Progress', color: '#0ea5e9' },
  { id: 'review', label: 'Review', color: '#a855f7' },
  { id: 'shipped', label: 'Shipped', color: '#22c55e' },
];

export function KanbanBoard({ cards, agents, onCardClick }: KanbanBoardProps) {
  return (
    <div
      className="flex gap-3"
      style={{
        padding: '16px 20px',
        height: '100%',
        overflow: 'auto',
      }}
    >
      {COLUMNS.map(col => {
        const colCards = cards.filter(c => c.status === col.id);
        const liveCount = colCards.filter(c => c.isLive).length;

        return (
          <div
            key={col.id}
            style={{
              flex: '1 1 0',
              minWidth: 220,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Column header */}
            <div
              className="flex items-center gap-2"
              style={{ marginBottom: 10, padding: '0 2px' }}
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
            </div>

            {/* Cards */}
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
          </div>
        );
      })}
    </div>
  );
}
