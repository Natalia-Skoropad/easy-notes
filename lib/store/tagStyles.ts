import type { CSSProperties } from 'react';
import type { NoteTag } from '@/types/note';

//===========================================================================

const TAG_COLORS: Record<
  NoteTag,
  { bg: string; border: string; text: string }
> = {
  Work: {
    bg: 'rgba(89, 195, 106, 0.18)',
    border: 'rgba(89, 195, 106, 0.55)',
    text: '#4ade80',
  },
  Personal: {
    bg: 'rgba(108, 99, 255, 0.2)',
    border: 'rgba(108, 99, 255, 0.55)',
    text: '#a5b4fc',
  },
  Meeting: {
    bg: 'rgba(56, 189, 248, 0.2)',
    border: 'rgba(56, 189, 248, 0.55)',
    text: '#7dd3fc',
  },
  Shopping: {
    bg: 'rgba(203, 175, 135, 0.22)',
    border: 'rgba(203, 175, 135, 0.6)',
    text: '#facc6b',
  },
  Ideas: {
    bg: 'rgba(168, 85, 247, 0.22)',
    border: 'rgba(168, 85, 247, 0.6)',
    text: '#e9d5ff',
  },
  Travel: {
    bg: 'rgba(45, 212, 191, 0.22)',
    border: 'rgba(45, 212, 191, 0.6)',
    text: '#a5f3fc',
  },
  Finance: {
    bg: 'rgba(34, 197, 94, 0.22)',
    border: 'rgba(34, 197, 94, 0.6)',
    text: '#bbf7d0',
  },
  Health: {
    bg: 'rgba(74, 222, 128, 0.22)',
    border: 'rgba(74, 222, 128, 0.6)',
    text: '#bbf7d0',
  },
  Important: {
    bg: 'rgba(248, 113, 113, 0.24)',
    border: 'rgba(248, 113, 113, 0.7)',
    text: '#fecaca',
  },
  Todo: {
    bg: 'rgba(148, 163, 184, 0.22)',
    border: 'rgba(148, 163, 184, 0.7)',
    text: '#e5e7eb',
  },
};

//===========================================================================

export function getTagStyle(tag: NoteTag): CSSProperties {
  const c = TAG_COLORS[tag];
  if (!c) return {};
  return {
    backgroundColor: c.bg,
    borderColor: c.border,
    color: c.text,
  };
}
