/**
 * Bars: an invoice statement on a clipboard. The sheet carries an address
 * block, a number box and a ruled table, and below them a bar chart of twelve
 * months standing on the page as rounded solids, to an uneven profile. The
 * pointer picks a month: its bar rises and goes bright, and the bars around it
 * rise less, falling off with distance, each on its own spring. At rest the
 * busiest month is bright. The read-out names the month, 01 to 12. The slider
 * is the reach, in months.
 *
 * The pattern: a continuous field, in one row. Springs, a falloff by distance,
 * a hit test on the sheet's plane (which never moves), and a rest that is a
 * composition.
 */
const {
  Cam, facing, fit, open, prism, proj, rings, ringAt, seg,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const BW = 110, BH = 120, BT = 3, ST = 1.2;
const N = 12, PITCH = 8, X0 = 7, FOOT = 6, BY0 = 78, BY1 = 96, LIFT = 26;
const REST = [15, 12, 21, 18, 27, 33, 45, 39, 30, 24, 36, 18];

/** The share of the lift at u radii from the pointer: 1 → .31 at 42% → .09 at the edge and beyond. */
const falloff = (u) =>
  u <= 0 ? 1 : u <= 0.417 ? 1 - (u / 0.417) * 0.6875 : u <= 1 ? 0.3125 - ((u - 0.417) / 0.583) * 0.2185 : 0.094;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = -1;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, 0, -BT], [BW, 0, -BT], [BW, BH, -BT], [0, BH, -BT], [X0 + 6 * PITCH, BY0, ST + Math.max(...REST) + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The board, then the sheet lying on it, then the clip over the sheet's top edge, bottom to top.
  const [br, bi] = rings(0, 0, BW, BH, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, -BT, 0));
  const [sr, si] = rings(4, 4, BW - 4, BH - 4, 1.5, 0.6);
  put(solid(g), prism(P, front, sr, si, 0, ST));
  // what an invoice has: an address block, a number box, and a ruled table, all lying on the sheet
  const line = (x0, y0, x1, y1, cls) => mk("path", { d: seg(P(x0, y0, ST), P(x1, y1, ST)), class: cls }, g);
  for (let k = 0; k < 3; k++) line(12, 20 + k * 5, 12 + [30, 24, 20][k], 20 + k * 5, "nf lo");
  const [nr] = rings(70, 18, 98, 30, 2, 0.6);
  mk("path", { d: open(ringAt(P, nr, ST).concat([ringAt(P, nr, ST)[0]])), class: "nf lo" }, g);
  line(12, 42, 98, 42, "nf");
  for (let k = 1; k <= 2; k++) line(12, 42 + k * 8, 98, 42 + k * 8, "nf lo");
  line(12, 66, 98, 66, "nf");
  const [cr, ci] = rings(40, -3, 70, 11, 3, 1);
  put(solid(g), prism(P, front, cr, ci, ST, 5.5));
  // the chart's baseline, behind the bars, so they cover it
  line(X0 - 1, BY0 - 1.5, X0 + (N - 1) * PITCH + FOOT + 1, BY0 - 1.5, "nf lo");

  const bars = [];
  for (let i = 0; i < N; i++) {
    const x0 = X0 + i * PITCH, [ring, inner] = rings(x0, BY0, x0 + FOOT, BY1, 1.6, 0.7), xc = x0 + FOOT / 2;
    // the hit band: the bar's rest centre on screen, from under its foot to the top it reaches at full lift. It never moves.
    bars.push({ i, h0: REST[i], ring, inner, sp: spring(REST[i], { eps: 0.04 }), el: solid(g), drawn: NaN,
      sx: P(xc, (BY0 + BY1) / 2, 0)[0], top: P(xc, BY0, ST + REST[i] + LIFT)[1] - 4, bottom: P(xc, BY1, 0)[1] + 6 });
  }
  const peak = bars.reduce((a, b) => (b.h0 > a.h0 ? b : a));
  peak.el.sil.classList.add("hi");

  function drawBar(b) {
    const h = b.sp.x;
    if (h === b.drawn) return;
    b.drawn = h;
    put(b.el, prism(P, front, b.ring, b.inner, ST, ST + h));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of bars) { if (stepS(b.sp, dt)) m = true; drawBar(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const b of bars) b.sp.t = over < 0 ? b.h0 : b.h0 + LIFT * falloff(Math.abs(b.i - over) / R);
    for (const b of bars) b.el.sil.classList.toggle("hi", over < 0 ? b === peak : b.i === over);
    read.textContent = over < 0 ? "rest" : String(over + 1).padStart(2, "0");
    B.wake();
  }
  /** The bar whose rest centre is nearest the pointer's screen x, when the pointer is within its band; -1 off the chart. */
  function hit([sx, sy]) {
    const b = bars.reduce((a, c) => (Math.abs(c.sx - sx) < Math.abs(a.sx - sx) ? c : a));
    if (Math.abs(b.sx - sx) > PITCH * 0.6 * C.S || sy < b.top || sy > b.bottom) return -1;
    return b.i;
  }
  bag.add(pointer(stage, {
    move: (p) => { const a = hit(p); if (a !== over) { over = a; retarget(); } },
    leave: () => { if (over >= 0) { over = -1; retarget(); } },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; if (over >= 0) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "bars",
  means: "An invoice statement on a clipboard: the month under the pointer rises from its chart, and the months around it follow.",
  rules: [1, 3, 5, 9],
  range: [1, 2.5, 4],
  tour: [[132,143], [200,172], [171,127], null],
  mount,
});
