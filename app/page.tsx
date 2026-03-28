'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Agent,
  ProjectCard,
  ActivityEvent,
  AgentStatus,
  CardStatus,
  AGENTS,
  INITIAL_CARDS,
  INITIAL_EVENTS,
  AUTO_EVENTS,
} from '@/lib/data';
import { Sidebar } from '@/components/Sidebar';
import { StatusBar } from '@/components/StatusBar';
import { Header } from '@/components/Header';
import { KanbanBoard } from '@/components/KanbanBoard';
import { DetailPanel } from '@/components/DetailPanel';
import { ActivityFeed } from '@/components/ActivityFeed';
import { AgentsView } from '@/components/AgentsView';
import { ActivityView } from '@/components/ActivityView';

const CARD_TRANSITIONS: Record<CardStatus, CardStatus | null> = {
  ideas: 'in-progress',
  'in-progress': 'review',
  review: 'shipped',
  shipped: null,
};

let eventCounter = 100;
function nextId() {
  return `evt_${++eventCounter}_${Date.now()}`;
}

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [cards, setCards] = useState<ProjectCard[]>(INITIAL_CARDS);
  const [events, setEvents] = useState<ActivityEvent[]>(INITIAL_EVENTS);
  const [selectedCard, setSelectedCard] = useState<ProjectCard | null>(null);
  const [activeView, setActiveView] = useState<string>('board');
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const tickRef = useRef(0);

  const pushEvent = useCallback((text: string, type: ActivityEvent['type']) => {
    setEvents(prev => [
      { id: nextId(), text, timestamp: Date.now(), type },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // Add a new card to ideas
  const handleNewCard = useCallback((card: ProjectCard) => {
    setCards(prev => [card, ...prev]);
    const agent = AGENTS.find(a => a.id === card.assignedAgentId);
    pushEvent(`${agent?.name || 'Agent'} queued ${card.name} for scoping`, 'assign');
  }, [pushEvent]);

  // Run Agent: pick a random idle/thinking agent, set to building, push event
  const handleRunAgent = useCallback(() => {
    setAgents(prev => {
      const candidates = prev.filter(a => a.status === 'idle' || a.status === 'thinking');
      if (candidates.length === 0) {
        // bump a random one to building anyway
        const idx = Math.floor(Math.random() * prev.length);
        const a = prev[idx];
        pushEvent(`${a.name} activated — now building`, 'build');
        return prev.map((ag, i) => i === idx ? { ...ag, status: 'building', idleFor: undefined } : ag);
      }
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      pushEvent(`${target.name} activated — now building`, 'build');
      return prev.map(ag => ag.id === target.id ? { ...ag, status: 'building', idleFor: undefined } : ag);
    });
  }, [pushEvent]);

  // Toggle checklist item
  const handleToggleChecklistItem = useCallback((cardId: string, itemId: string) => {
    setCards(prev =>
      prev.map(c =>
        c.id === cardId
          ? {
              ...c,
              checklist: c.checklist.map(item =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
              updatedAt: Date.now(),
            }
          : c
      )
    );
    // keep selected card in sync
    setSelectedCard(prev => {
      if (!prev || prev.id !== cardId) return prev;
      return null; // will re-select via the cards lookup in render
    });
  }, []);

  // Move card to next stage
  const handleMoveToNextStage = useCallback((cardId: string) => {
    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card) return prev;
      const next = CARD_TRANSITIONS[card.status];
      if (!next) return prev;
      const agent = AGENTS.find(a => a.id === card.assignedAgentId);
      const label = next === 'in-progress' ? 'In Progress' : next.charAt(0).toUpperCase() + next.slice(1);
      pushEvent(`${agent?.name || 'Agent'} moved ${card.name} to ${label}`, 'move');
      return prev.map(c =>
        c.id === cardId
          ? {
              ...c,
              status: next,
              isLive: next === 'in-progress',
              updatedAt: Date.now(),
              deployStatus:
                next === 'shipped' ? 'deployed' : next === 'review' ? 'queued' : c.deployStatus,
            }
          : c
      );
    });
  }, [pushEvent]);

  // Agent filter from AgentsView — switch to board
  const handleAgentFilter = useCallback((agentId: string) => {
    setAgentFilter(agentId);
    setActiveView('board');
    setSelectedCard(null);
  }, []);

  const clearAgentFilter = useCallback(() => setAgentFilter(null), []);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      const tick = tickRef.current;

      // Rotate agent status every ~8s
      if (tick % 8 === 0) {
        setAgents(prev => {
          const idx = Math.floor(Math.random() * prev.length);
          const weighted: AgentStatus[] = ['building', 'building', 'building', 'thinking', 'thinking', 'reviewing', 'shipping', 'idle'];
          const newStatus = weighted[Math.floor(Math.random() * weighted.length)];
          if (newStatus === prev[idx].status) return prev;
          return prev.map((a, i) =>
            i === idx
              ? { ...a, status: newStatus, idleFor: newStatus === 'idle' ? Math.floor(Math.random() * 60) + 5 : undefined }
              : a
          );
        });
      }

      // Increment idle counter every 6s
      if (tick % 6 === 0) {
        setAgents(prev =>
          prev.map(a =>
            a.status === 'idle' && a.idleFor !== undefined
              ? { ...a, idleFor: a.idleFor + 6 }
              : a
          )
        );
      }

      // Bump progress on in-progress cards every ~12s
      if (tick % 12 === 0) {
        setCards(prev => {
          const active = prev.filter(c => c.status === 'in-progress' && c.progress < 95);
          if (active.length === 0) return prev;
          const card = active[Math.floor(Math.random() * active.length)];
          const bump = Math.floor(Math.random() * 8) + 2;
          return prev.map(c =>
            c.id === card.id
              ? { ...c, progress: Math.min(c.progress + bump, 100), updatedAt: Date.now() }
              : c
          );
        });
      }

      // Push random event every ~20s
      if (tick % 20 === 0) {
        const tpl = AUTO_EVENTS[Math.floor(Math.random() * AUTO_EVENTS.length)];
        pushEvent(tpl.text, tpl.type);
      }

      // Move a card forward every ~35s
      if (tick % 35 === 0) {
        setCards(prev => {
          const moveable = prev.filter(c => CARD_TRANSITIONS[c.status] !== null && c.progress >= 50);
          if (moveable.length === 0) return prev;
          const card = moveable[Math.floor(Math.random() * moveable.length)];
          const next = CARD_TRANSITIONS[card.status]!;
          const agent = AGENTS.find(a => a.id === card.assignedAgentId);
          const label = next === 'in-progress' ? 'In Progress' : next.charAt(0).toUpperCase() + next.slice(1);
          pushEvent(`${agent?.name || 'Agent'} moved ${card.name} to ${label}`, 'move');
          return prev.map(c =>
            c.id === card.id
              ? {
                  ...c,
                  status: next,
                  isLive: next === 'in-progress',
                  updatedAt: Date.now(),
                  deployStatus:
                    next === 'shipped' ? 'deployed' : next === 'review' ? 'queued' : c.deployStatus,
                }
              : c
          );
        });
      }

      // Refresh a card comment every ~15s (was 50s)
      if (tick % 15 === 0) {
        const comments = [
          'Running final checks.',
          'Deploy queued. Waiting on infra slot.',
          'Fixed edge case. Rebasing now.',
          'Review complete. Approved.',
          'Pricing test running.',
          'Copy updated. Ready.',
          'Blocked — waiting on domain config.',
          'Customer signal detected. Adjusting.',
          'Build clean. Proceeding.',
          'Merge conflict resolved.',
          'Tests passing. Submitting for review.',
          'Refactoring data layer. ETA 5m.',
        ];
        setCards(prev => {
          if (prev.length === 0) return prev;
          const idx = Math.floor(Math.random() * prev.length);
          const text = comments[Math.floor(Math.random() * comments.length)];
          return prev.map((c, i) =>
            i === idx
              ? {
                  ...c,
                  latestComment: { id: nextId(), agentId: c.assignedAgentId, text, timestamp: Date.now() },
                  updatedAt: Date.now(),
                }
              : c
          );
        });
      }

      // Log a decision every ~65s
      if (tick % 65 === 0) {
        pushEvent('Smith logged a strategic decision', 'decision');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pushEvent]);

  const activeBuilds = cards.filter(c => c.status === 'in-progress').length;
  const launchInProgress = cards.some(c => c.deployStatus === 'queued' || c.deployStatus === 'deploying');
  const decisionsToday = events.filter(e => e.type === 'decision').length + 12;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      <StatusBar
        agents={agents}
        events={events}
        activeBuilds={activeBuilds}
        launchInProgress={launchInProgress}
        decisionsToday={decisionsToday}
      />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          agents={agents}
          activeView={activeView}
          onViewChange={view => {
            setActiveView(view);
            setSelectedCard(null);
          }}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Header
            agents={agents}
            activeBuilds={activeBuilds}
            agentFilter={agentFilter}
            onClearFilter={clearAgentFilter}
          />

          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {activeView === 'board' && (
                <KanbanBoard
                  cards={cards}
                  agents={agents}
                  onCardClick={card => setSelectedCard(card)}
                  onNewCard={handleNewCard}
                  onRunAgent={handleRunAgent}
                  agentFilter={agentFilter}
                  systemLogEvents={events}
                />
              )}
              {activeView === 'agents' && (
                <AgentsView
                  agents={agents}
                  cards={cards}
                  onAgentFilter={handleAgentFilter}
                />
              )}
              {activeView === 'activity' && (
                <ActivityView events={events} />
              )}
            </div>

            {selectedCard && activeView === 'board' && (
              <DetailPanel
                key={selectedCard.id}
                card={cards.find(c => c.id === selectedCard.id) || selectedCard}
                agents={agents}
                onClose={() => setSelectedCard(null)}
                onToggleChecklistItem={handleToggleChecklistItem}
                onMoveToNextStage={handleMoveToNextStage}
              />
            )}

            {activeView === 'board' && !selectedCard && (
              <ActivityFeed events={events} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
