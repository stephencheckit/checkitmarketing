import { NOTE_LIBRARY } from './daily-note-copy';

export interface DailyNoteDraft {
  title: string;
  excerpt: string;
  metaDescription: string;
  keywords: string[];
  content: string;
}

function dayIndex(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

export function slugForNote(title: string, date: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
  return `${base || 'note'}-${date}`;
}

export function buildDailyNote(date: string): DailyNoteDraft {
  const index = dayIndex(date);
  const angleIndex = index % NOTE_LIBRARY.length;
  const variant = Math.floor(index / NOTE_LIBRARY.length) % 4;
  const copy = NOTE_LIBRARY[angleIndex];
  if (!copy || copy.openings.length !== 4) {
    throw new Error(`Daily note library is missing a complete entry for ${date}.`);
  }
  const content = `${copy.openings[variant]}\n\n${copy.body}`;
  const metaDescription = copy.excerpt.length > 160 ? `${copy.excerpt.slice(0, 157)}...` : copy.excerpt;
  return {
    title: copy.title,
    excerpt: copy.excerpt,
    metaDescription,
    keywords: [],
    content,
  };
}

