/**
 * Chart: a sea chart as a rounded plate, with a harbour mouth of two moles on
 * its far edge and three buoys. A small ship steams to wherever the pointer
 * is, its position and heading each on a spring, a wake trailing behind, and
 * a medium dot on the sea marks where it is bound. At rest it stands off the
 * harbour, bow toward the mouth. The read-out names the chart cell under the
 * pointer, a column letter and a row. The slider is the wake's length.
 *
 * The pattern: a continuous field. Springs, a hit test on the sea plane
 * (which never moves), and a moving solid that keeps its paint order honest
 * by moving its group among the fixed ones.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, rrect, run, unproj,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const SX = 160, SY = 120, PT = 4, CELL = 20, COLS = "ABCDEFGH";
const LEN = 23, BEAM = 6.5, REST = [96, 72], MOUTH = [10, 65];
const FIXED = [
  { kind: "mole", x0: 0, y0: 50, x1: 24, y1: 56 }, { kind: "mole", x0: 0, y0: 74, x1: 24, y1: 80 },
  { kind: "buoy", x: 44, y: 100 }, { kind: "buoy", x: 132, y: 28 }, { kind: "buoy", x: 124, y: 94 },
];

/** A closed outline's samples with outward normals, from its points. */
function ringOf(pts) {
  const area = pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0), sg = area > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    return { u: p[0], v: p[1], nu: (sg * dy) / n, nv: (-sg * dx) / n };
  });
}
/** A ring moved to (cx, cy) and turned by th. */
const turn = (ring, cx, cy, th) => {
  const c = Math.cos(th), s = Math.sin(th);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const HULL = ringOf(fillet([[-LEN, -BEAM], [LEN - 11, -BEAM], [LEN, 0], [LEN - 11, BEAM], [-LEN, BEAM]], [3.5, 4, 2, 4, 3.5], 4));
const HULLIN = ringOf(fillet([[-LEN + 1.6, -BEAM + 1.6], [LEN - 11.5, -BEAM + 1.6], [LEN - 2.5, 0], [LEN - 11.5, BEAM - 1.6], [-LEN + 1.6, BEAM - 1.6]], [2.5, 3, 1.2, 3, 2.5], 4));
const BRIDGE = rrect(-16, -4.5, -6, 4.5, 1.4, 4), BRIDGEIN = rrect(-15.1, -3.6, -6.9, 3.6, 0.7, 4);
const FUNNEL = circ(2.2, 10), FUNNELIN = circ(1.3, 10);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wake = value, over = null, redraw = true;
  const C = Cam(45, 0.5, 1.42);
  fit(C, [[0, 0, -PT], [SX, 0, -PT], [SX, SY, -PT], [0, SY, -PT], [0, 0, 0], [SX / 2, SY / 2, 12]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, SX, SY, 10, 2);
  put(solid(g), prism(P, front, sr, si, -PT, 0));
  const bound = flatDot(g, C, 1.2, "dot m");
  place(bound, P(REST[0], REST[1], 0));

  // The fixed things, far to near; each keeps its depth key, x + y at its centre, so the ship can be slotted among them.
  const fixed = [];
  for (const f of FIXED.slice().sort((a, b) => (a.kind === "mole" ? a.x1 + a.y1 : a.x + a.y) - (b.kind === "mole" ? b.x1 + b.y1 : b.x + b.y))) {
    const grp = mk("g", {}, g);
    if (f.kind === "mole") {
      const [r, i] = rings(f.x0, f.y0, f.x1, f.y1, 2, 0.8);
      put(solid(grp), prism(P, front, r, i, 0, 3));
      const cx = f.x1 - 2.5, cy = (f.y0 + f.y1) / 2;
      put(solid(grp), prism(P, front, turn(circ(2.2, 10), cx, cy, 0), turn(circ(1.3, 10), cx, cy, 0), 3, 7));
      fixed.push({ key: f.x1 + f.y1, g: grp });
    } else {
      put(solid(grp), prism(P, front, turn(circ(2, 10), f.x, f.y, 0), turn(circ(1.1, 10), f.x, f.y, 0), 0, 3.5));
      fixed.push({ key: f.x + f.y, g: grp });
    }
  }

  // The ship: a wake, the hull, and the funnel and bridge, whichever is farther first.
  const ship = mk("g", {}, g), wk = mk("path", { class: "nf lo" }, ship), hullEl = solid(ship), funnelEl = solid(ship), bridgeEl = solid(ship);
  hullEl.sil.classList.add("hi");
  const px = spring(REST[0]), py = spring(REST[1]), ph = spring(Math.atan2(MOUTH[1] - REST[1], MOUTH[0] - REST[0]));
  let slot = -1;

  function drawShip() {
    const x = px.x, y = py.x, th = ph.x, c = Math.cos(th), s = Math.sin(th);
    const W = (u, v, z) => P(x + u * c - v * s, y + u * s + v * c, z);
    // the wake: two arms astern, each cut where it would leave the sea
    const arm = (side) => {
      const sx = x - (LEN - 1) * c, sy = y - (LEN - 1) * s, ex = sx - wake * c - side * wake * 0.32 * -s, ey = sy - wake * s - side * wake * 0.32 * c;
      let t = 1;
      for (const [a, e, lo, hi] of [[sx, ex, 1, SX - 1], [sy, ey, 1, SY - 1]]) if (e < lo || e > hi) t = Math.min(t, ((e < lo ? lo : hi) - a) / (e - a));
      return [P(sx + (ex - sx) * t, sy + (ey - sy) * t, 0), P(sx, sy, 0)];
    };
    const l = arm(1), r = arm(-1);
    wk.setAttribute("d", open([l[0], l[1], r[0]]));
    put(hullEl, { sil: poly(hull(ringAt0(turn(HULL, x, y, th)).concat(ringAt3(turn(HULL, x, y, th))))), crease: open(ringAt3(run(turn(HULLIN, x, y, th), front))) });
    put(funnelEl, prism(P, front, turn(FUNNEL, x - 19.5 * c, y - 19.5 * s, 0), turn(FUNNELIN, x - 19.5 * c, y - 19.5 * s, 0), 3, 13));
    put(bridgeEl, prism(P, front, turn(BRIDGE, x, y, th), turn(BRIDGEIN, x, y, th), 3, 11));
    // the funnel sits astern of the bridge; whichever is nearer the viewer is painted last
    const funnelNear = c + s < 0;
    if (funnelNear !== (bridgeEl.g.nextSibling === funnelEl.g)) (funnelNear ? bridgeEl : funnelEl).g.after((funnelNear ? funnelEl : bridgeEl).g);
    // and the ship takes its place among the fixed things by depth
    let k = -1;
    for (let i = 0; i < fixed.length; i++) if (fixed[i].key <= x + y) k = i;
    if (k !== slot) { slot = k; (k < 0 ? bound : fixed[k].g).after(ship); }
  }
  const ringAt0 = (ring) => ring.map((q) => P(q.u, q.v, 0)), ringAt3 = (ring) => ring.map((q) => P(q.u, q.v, 3));

  const B = register(stage, (dt) => {
    // the bow points where the ship is going; home and arrived, it swings to face the harbour mouth
    const to = over || REST, dx = to[0] - px.x, dy = to[1] - py.x, under = Math.hypot(dx, dy) > 1.5;
    if (under || !over) { const want = under ? Math.atan2(dy, dx) : Math.atan2(MOUTH[1] - REST[1], MOUTH[0] - REST[0]); ph.t += Math.atan2(Math.sin(want - ph.t), Math.cos(want - ph.t)); }
    let m = false;
    if (stepS(px, dt)) m = true;
    if (stepS(py, dt)) m = true;
    if (stepS(ph, dt)) m = true;
    if (m || redraw) { drawShip(); redraw = false; }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const to = over || REST;
    px.t = to[0]; py.t = to[1];
    place(bound, P(to[0], to[1], 0));
    read.textContent = over ? `${COLS[clamp(Math.floor(over[0] / CELL), 0, COLS.length - 1)]}·${clamp(Math.floor(over[1] / CELL), 0, 5) + 1}` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const w = unproj(C, p[0], p[1], 0); over = [clamp(w[0], LEN + 3, SX - LEN - 3), clamp(w[1], LEN + 3, SY - LEN - 3)]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { wake = v; redraw = true; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "chart",
  means: "A ship on a chart steams to wherever the pointer is, turning as it goes, and stands off the harbour at rest.",
  rules: [1, 3, 5, 6],
  range: [10, 24, 40],
  tour: [[264, 170], [150, 179], [149, 143], null],
  mount,
});
