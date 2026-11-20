/**
 * Gather: six invoice sheets fanned across a desk, and one larger commission
 * sheet, with its total box, at the near end. The pointer's x draws the fan
 * in: the sheets lift and slide onto the commission sheet one after another,
 * nearest first, each on its own spring, until one pile remains; leaving fans
 * them back out. The commission sheet is bright: it is what the eye follows.
 * The read-out counts the sheets drawn in. The slider is the fan's spread.
 *
 * The pattern: scrub. Springs on a continuous input read off the desk's
 * plane (which never moves), and sheets that change depth by moving their
 * groups, never by being redrawn in place.
 */
const {
  Cam, clamp, facing, fit, lerp, open, prism, proj, rad, ringAt, rrect, seg, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const DW = 190, DH = 90, DT = 3, ST = 1.2;
const N = 6, SW = 34, SH = 44, CX = 159, CY = 45, CW = 50, CH = 50;
const P0 = 18, P1 = 150, ARC = 9;
const TILT = [-7, 4, -3, 6, -5, 2], SWAY = [-3, 2, 3, -2, 1, -3];

/** A ring moved to (cx, cy) and turned by th, in radians. */
const turn = (ring, cx, cy, th) => {
  const c = Math.cos(th), s = Math.sin(th);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value, over = null;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, 0, -DT], [DW, 0, -DT], [DW, DH, -DT], [0, DH, -DT], [CX, CY, ST * 8 + ARC]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A sheet: its plate and the marks a sheet has, as paths in one group. */
  function sheet(parent, w, h, total) {
    const grp = mk("g", {}, parent), el = solid(grp);
    const ring = rrect(-w / 2, -h / 2, w / 2, h / 2, 1.5, 4), inner = rrect(-w / 2 + 0.6, -h / 2 + 0.6, w / 2 - 0.6, h / 2 - 0.6, 0.9, 4);
    const marks = [mk("path", { class: "nf lo" }, grp), mk("path", { class: "nf" }, grp)];
    if (total) marks.push(mk("path", { class: "nf" }, grp));
    const box = total ? rrect(w / 2 - 20, h / 2 - 14, w / 2 - 5, h / 2 - 6, 1.5, 4) : null;
    return { grp, el, ring, inner, marks, box, w, h };
  }
  function draw(s, cx, cy, z, th) {
    const c = Math.cos(th), sn = Math.sin(th), W = (u, v) => P(cx + u * c - v * sn, cy + u * sn + v * c, z + ST);
    put(s.el, prism(P, front, turn(s.ring, cx, cy, th), turn(s.inner, cx, cy, th), z, z + ST));
    const l = -s.w / 2 + 5, r = s.w / 2 - 5, t = -s.h / 2 + 6;
    s.marks[0].setAttribute("d", seg(W(l, t), W(l + s.w * 0.45, t)) + seg(W(l, t + 4), W(l + s.w * 0.3, t + 4)));
    s.marks[1].setAttribute("d", seg(W(l, t + 11), W(r, t + 11)));
    if (s.box) { const pts = turn(s.box, 0, 0, 0).map((q) => W(q.u, q.v)); s.marks[2].setAttribute("d", open(pts.concat([pts[0]]))); }
  }

  const [dr, di] = [rrect(0, 0, DW, DH, 7, 6), rrect(1.8, 1.8, DW - 1.8, DH - 1.8, 5.2, 6)];
  put(solid(g), prism(P, front, dr, di, -DT, 0));
  const fan = [];
  for (let i = 0; i < N; i++) fan.push({ ...sheet(g, SW, SH, false), i, sp: spring(0, { eps: 0.002 }), drawn: NaN });
  const com = sheet(g, CW, CH, true);
  com.el.sil.classList.add("hi");
  draw(com, CX, CY, 0, 0);

  const restX = (i) => P0 + SW / 2 - 6 + i * gap;
  /** Where sheet i sits at g: from its place in the fan to its place in the pile, lifting on an arc between. */
  function pose(i, t) {
    const k = N - 1 - i; // its depth in the pile: the nearest sheet goes in first and lies at the bottom
    return [lerp(restX(i), CX + SWAY[i] * 0.6, t), lerp(CY + SWAY[i], CY + 1 + SWAY[(i + 1) % N] * 0.5, t), t * ST * (k + 1) + Math.sin(Math.PI * t) * ARC, rad(lerp(TILT[i], TILT[i] * 0.25, t))];
  }
  /** The paint order: at rest the fan runs far to near, then the commission sheet; a sheet that has left the fan goes over it, deepest first. */
  function order() {
    const out = fan.filter((s) => s.sp.x <= 0), on = fan.filter((s) => s.sp.x > 0).sort((a, b) => b.i - a.i);
    let prev = g.firstChild;
    for (const s of [...out, com, ...on]) { if (prev.nextSibling !== s.grp) prev.after(s.grp); prev = s.grp; }
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of fan) {
      if (stepS(s.sp, dt)) m = true;
      if (s.sp.x !== s.drawn) { s.drawn = s.sp.x; draw(s, ...pose(s.i, s.sp.x)); }
    }
    order();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const n = over === null ? 0 : clamp((over - P0) / (P1 - P0), 0, 1) * N;
    for (const s of fan) s.sp.t = clamp(n - (N - 1 - s.i), 0, 1);
    read.textContent = over === null ? "rest" : `${Math.round(n)} in`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0)[0]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { gap = v; for (const s of fan) s.drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "gather",
  means: "Six invoices fanned on a desk slide onto one commission sheet as the pointer moves across, nearest first.",
  rules: [1, 2, 5, 6],
  range: [12, 17, 22],
  tour: [[163,144], [211,167], [258,191], null],
  mount,
});
