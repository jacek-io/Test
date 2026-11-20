/**
 * Ship: a container ship on the water, seen from the quay. A long hull with a
 * pointed bow, a bridge block and funnel at the stern, and seven bays of
 * containers stacked to an uneven skyline. The pointer picks a bay: its top
 * container lifts off as the crane takes it, and the bays either side lift
 * theirs a little, staggered outward, on the 700ms lift curve. The bay's number,
 * counted from the bow, goes to the read-out. The slider is the lift, in units.
 *
 * The pattern: discrete items. Tweens, a stagger by distance, and a hit test
 * on a static band along the resting deck, so a box lifting out from under the
 * pointer cannot flip the choice.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, ringAt, rings, run,
  tdone, tset, tval, tween, disposer, mk, pointer, put, reflect, register, solid,
} = HL;

const L = 200, W = 40, DECK = 11, BOW = 36;
const N = 7, CL = 14, PITCH = 18, X0 = 40, BY0 = 6, BY1 = 34, CH = 8;
const TALL = [3, 2, 4, 3, 2, 3, 1];
const STEP = 45, SPREAD = [1, 0.35, 0.12];

/** The hull's outline, inset `ex` at the ends and `ey` at the sides, as a ring with outward normals. */
function hullRing(ex, ey) {
  const pts = fillet(
    [[ex, ey], [L - BOW, ey], [L - ex * 1.8, W / 2], [L - BOW, W - ey], [ex, W - ey]],
    [5, 7, 3.5, 7, 5], 5,
  );
  const area = pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const sign = area > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length];
    const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    return { u: p[0], v: p[1], nu: (sign * dy) / n, nv: (-sign * dx) / n };
  });
}

/** A ring moved to (cx, cy). */
const at = (ring, cx, cy) => ring.map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  // The camera is fitted with the tallest stack's box at full lift, so nothing leaves the frame in any pose.
  const C = Cam(45, 0.5, 1.5);
  const peakZ = DECK + Math.max(...TALL) * CH + 30;
  fit(C, [[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0], [0, 0, -14], [X0 + 2 * PITCH, BY0, peakZ], [8, 16, DECK + 40]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // Hull: the foot is inset for the bilge, so the sides flare out to the deck; the boot-top line sits just above the water.
  const foot = hullRing(3, 3), top = hullRing(0, 0), inner = hullRing(1.6, 1.6), mid = hullRing(2.2, 2.2);
  reflect(svg, g, P, front, foot, 0, 12);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, DECK)))), crease: open(ringAt(P, run(inner, front), DECK)) });
  mk("path", { d: open(ringAt(P, run(mid, front), 3)), class: "nf lo" }, g);

  // The stern: the funnel, standing above the bridge, then the tower, then the wheelhouse across the beam, far to near.
  put(solid(g), prism(P, front, at(circ(4, 12), 8, 20), at(circ(2.8, 12), 8, 20), DECK, DECK + 40));
  const [tw, ti] = rings(15, 7, 33, 33, 2, 1.2);
  put(solid(g), prism(P, front, tw, ti, DECK, DECK + 28));
  const [hw, hi] = rings(17, 1, 33, 39, 1.5, 1);
  put(solid(g), prism(P, front, hw, hi, DECK + 28, DECK + 34));

  // Bays, stern to bow: each a stack of boxes, bottom to top, so the upper covers the lower.
  const bays = [];
  for (let i = 0; i < N; i++) {
    const x0 = X0 + i * PITCH, [ring, cr] = rings(x0, BY0, x0 + CL, BY1, 1.2, 0.8), boxes = [];
    for (let k = 0; k < TALL[i]; k++) boxes.push(solid(g));
    boxes.forEach((b, k) => put(b, prism(P, front, ring, cr, DECK + k * CH, DECK + (k + 1) * CH)));
    bays.push({ ring, cr, boxes, top: boxes[TALL[i] - 1], z0: DECK + (TALL[i] - 1) * CH, z: tween(0), drawn: 0 });
  }
  const peak = bays.reduce((a, b) => (TALL[bays.indexOf(b)] > TALL[bays.indexOf(a)] ? b : a));
  peak.top.sil.classList.add("hi");

  // The hit band: along the RESTING deck line, one bay pitch per step, from the water to above the tallest stack. It never moves.
  const c0 = P(X0 + CL / 2, W / 2, DECK), c1 = P(X0 + PITCH + CL / 2, W / 2, DECK), d = [c1[0] - c0[0], c1[1] - c0[1]];
  const UP = (Math.max(...TALL) * CH + 40) * C.S * 0.5 + 40, DOWN = 24 * C.S;
  function hit([x, y]) {
    const s = (x - c0[0]) / d[0], r = y - c0[1] - s * d[1];
    if (s < -0.5 || s >= N - 0.5 || r < -UP || r > DOWN) return -1;
    return clamp(Math.round(s), 0, N - 1);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bays) {
      const z = tval(b.z, now);
      if (z !== b.drawn) { b.drawn = z; put(b.top, prism(P, front, b.ring, b.cr, b.z0 + z, b.z0 + CH + z)); }
      if (!tdone(b.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  let act = -1;
  /** Lifts bay a's top box (-1 sets them all down). The stagger spreads out from the bay chosen, or the one let go. */
  function setActive(a) {
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bays.forEach((b, i) => {
      const dist = Math.abs(i - from);
      tset(b.z, a < 0 ? 0 : lift * (SPREAD[Math.abs(i - a)] ?? 0), now, dist * STEP);
      b.top.sil.classList.toggle("hi", a < 0 ? b === peak : i === a);
    });
    read.textContent = a < 0 ? "rest" : `bay ${N - a}`;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => { const a = hit(p); if (a !== act) setActive(a); }, leave: () => { if (act >= 0) setActive(-1); } }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; if (act >= 0) setActive(act); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "ship",
  means: "A container ship at the quay: the crane lifts the top box of the bay under the pointer, and its neighbours stir.",
  rules: [1, 2, 5, 9],
  range: [10, 18, 30],
  tour: [[239, 168], [182, 129], [144, 121], null],
  mount,
});
