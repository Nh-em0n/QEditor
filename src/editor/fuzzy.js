/* Fuzzy matching and highlight markup shared by the command palette. */
import { esc } from "./util.js";

/** Score a fuzzy match of `query` inside `text`; returns null when no match exists. */
export function fuzzy(query, text) {
  const q = query.toLowerCase().replace(/\s+/g, '');
  if (!q) return { score: 0, idx: [] };
  const t = text.toLowerCase();
  let best = null;
  const boundary = i => i === 0 || /[\s:_\-./(]/.test(text[i - 1]) || (text[i - 1] === text[i - 1].toLowerCase() && text[i] !== text[i].toLowerCase());
  const p = t.indexOf(q);                                  // contiguous substring beats scattered matches
  if (p >= 0) best = { score: 40 + q.length * 6 + (boundary(p) ? 10 : 0) - p * 0.2, idx: [...Array(q.length).keys()].map(i => p + i) };
  let tries = 0;
  for (let start = t.indexOf(q[0]); start !== -1 && tries < 12; start = t.indexOf(q[0], start + 1), tries++) {
    let ti = start, qi = 0, score = 0, last = -2; const idx = [];
    while (qi < q.length && ti < t.length) {
      if (t[ti] === q[qi]) { score += 1 + (ti === last + 1 ? 5 : 0) + (boundary(ti) ? 4 : 0); idx.push(ti); last = ti; qi++; }
      ti++;
    }
    if (qi === q.length) { score -= start * 0.1 + t.length * 0.02; if (!best || score > best.score) best = { score, idx }; }
  }
  return best;
}

/** Escape `text` and wrap the matched character indexes in `<mark>` tags. */
export function hlHtml(text, idx) {
  if (!idx || !idx.length) return esc(text);
  const set = new Set(idx); let out = '', open = false;
  for (let i = 0; i < text.length; i++) {
    const m = set.has(i);
    if (m && !open) { out += '<mark>'; open = true; } else if (!m && open) { out += '</mark>'; open = false; }
    out += esc(text[i]);
  }
  return out + (open ? '</mark>' : '');
}
