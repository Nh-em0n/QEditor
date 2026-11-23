/* Canvas minimap drawn from Ace's token stream, one class per pane. */
import { $, clamp, rafOnce } from "./util.js";
import { S } from "./state.js";

/** Canvas overview of a pane's document with click/drag scrolling. */
export class Minimap {
  /** Wire the canvas to a pane and listen for repaint / resize events. */
  constructor(pane) {
    this.pane = pane; this.el = $('.minimap', pane.el); this.cv = $('canvas', this.el); this.slider = $('.mm-slider', this.el);
    this.ctx = this.cv.getContext('2d'); this.cache = new Map(); this.off = 0;
    this.schedule = rafOnce(() => this.draw());
    const ed = pane.editor;
    ed.renderer.on('afterRender', this.schedule);
    ed.renderer.on('themeLoaded', () => { this.cache.clear(); this.schedule(); });
    new ResizeObserver(() => this.schedule()).observe(this.el);
    // click / drag to scroll
    this.el.addEventListener('pointerdown', e => {
      this.el.setPointerCapture(e.pointerId); this.seek(e);
      const mv = ev => this.seek(ev);
      const up = () => { this.el.removeEventListener('pointermove', mv); this.el.removeEventListener('pointerup', up); };
      this.el.addEventListener('pointermove', mv); this.el.addEventListener('pointerup', up);
    });
  }
  /** Drop cached theme colors and repaint after a scheme change. */
  themeChanged() { this.cache.clear(); this.schedule(); }
  /** Scroll the editor to the document row under the pointer. */
  seek(e) {
    const ed = this.pane.editor, rect = this.el.getBoundingClientRect();
    const row = clamp(Math.floor((e.clientY - rect.top + this.off) / 3), 0, ed.session.getLength() - 1);
    ed.scrollToLine(row, true, false);
  }
  /** Resolve a token type to the current theme's color via a hidden probe element. */
  color(type) {
    let c = this.cache.get(type);
    if (c) return c;
    const probe = document.createElement('span');
    probe.className = String(type).split('.').map(t => 'ace_' + t).join(' ');
    probe.style.display = 'none';
    this.pane.editor.renderer.content.appendChild(probe);
    c = getComputedStyle(probe).color; probe.remove();
    this.cache.set(type, c); return c;
  }
  /** Paint the visible document as colored 2px bars and position the view slider. */
  draw() {
    if (!S.minimap || !this.el.offsetParent) return;
    const ed = this.pane.editor, s = ed.session, r = ed.renderer;
    const W = this.el.clientWidth, H = this.el.clientHeight;
    if (W < 10 || H < 10) return;
    const dpr = window.devicePixelRatio || 1, cv = this.cv;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = W + 'px'; cv.style.height = H + 'px';
    }
    const ctx = this.ctx; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    const LH = 3, n = s.getLength();
    const first = s.screenToDocumentRow(Math.max(0, r.getFirstVisibleRow()), 0);
    const last = Math.max(first, s.screenToDocumentRow(Math.max(0, r.getLastVisibleRow()), 0));
    const vis = last - first + 1;
    // like Sublime: when the doc is taller than the minimap, scroll the map proportionally
    const maxOff = Math.max(0, n * LH - H);
    const frac = n > vis ? Math.min(1, first / (n - vis)) : 0;
    const off = this.off = maxOff * frac;
    const r0 = Math.floor(off / LH), r1 = Math.min(n - 1, Math.ceil((off + H) / LH));
    const tab = s.getTabSize();
    ctx.globalAlpha = 0.75;
    for (let row = r0; row <= r1; row++) {
      const y = row * LH - off; let x = 0;
      const toks = s.getTokens(row);
      for (const t of toks) {
        const v = t.value, color = this.color(t.type);
        let run = -1;
        for (let i = 0; i < v.length && x < W; i++) {
          const ch = v[i];
          if (ch === ' ' || ch === '\t') {
            if (run >= 0) { ctx.fillStyle = color; ctx.fillRect(run, y, x - run, 2); run = -1; }
            x += ch === '\t' ? tab : 1;
          } else { if (run < 0) run = x; x++; }
        }
        if (run >= 0) { ctx.fillStyle = color; ctx.fillRect(run, y, Math.min(x, W) - run, 2); }
        if (x >= W) break;
      }
    }
    ctx.globalAlpha = 1;
    this.slider.style.transform = `translateY(${first * LH - off}px)`;
    this.slider.style.height = Math.max(10, vis * LH) + 'px';
  }
}
