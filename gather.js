/**
 * Gather: one commission sheet, with its total box, in the centre, and six
 * invoice sheets in a ring round it, each tied to the centre by a string. As
 * the pointer nears the centre the sheets lift and slide in along their
 * strings, the ones on the pointer's side first, each on its own spring,
 * until one pile remains; leaving lets them back out. The commission sheet is
 * bright: it is what the eye follows. The read-out counts the sheets drawn in.
 * The slider is the ring's radius.
 *
 * The pattern: scrub. Springs on a continuous input read off the ground plane
 * (which never moves), and sheets that change depth by moving their groups,
 * sorted by depth each frame, never by being redrawn in place.
 */
const {
  Cam, clamp, facing, fit, lerp, open, prism, proj, rad, rrect, seg, unproj,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, SW = 30, SH = 38, CW = 44, CH = 44, ST = 1.2, ARC = 9;
const TILT = [-9, 6, -4, 8, -6, 3], ANG = [-150, -90, -30, 30, 90, 150];

/** A ring moved to (cx, cy) and turned by th, in radians. */
const turn = (ring, cx, cy, th) => {
  const c = Math.cos(th), s = Math.sin(th);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, over = null;
  const C = Cam(45, 0.5, 1.82);
  // fitted to the ring at its widest, a sheet's reach past each position, with the pile's height
  fit(C, ANG.map((a) => [Math.cos(rad(a)) * 70 + Math.sign(Math.cos(rad(a))) * 20, Math.sin(rad(a)) * 70 + Math.sign(Math.sin(rad(a))) * 22, 0]).concat([[0, 0, ST * 8 + ARC]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A sheet: its plate and the marks a sheet has, as paths in one group. */
  function sheet(parent, w, h, total) {
    const grp = mk("g", {}, parent), el = solid(grp);
    const ring = rrect(-w / 2, -h / 2, w / 2, h / 2, 1.5, 4), inner = rrect(-w / 2 + 0.6, -h / 2 + 0.6, w / 2 - 0.6, h / 2 - 0.6, 0.9, 4);
    const marks = [mk("path", { class: "nf lo" }, grp), mk("path", { class: "nf" }, grp)];
    if (total) marks.push(mk("path", { class: "nf" }, grp));
    const box = total ? rrect(w / 2 - 18, h / 2 - 13, w / 2 - 5, h / 2 - 6, 1.5, 4) : null;
    return { grp, el, ring, inner, marks, box, w, h };
  }
  function draw(s, cx, cy, z, th) {
    const c = Math.cos(th), sn = Math.sin(th), W = (u, v) => P(cx + u * c - v * sn, cy + u * sn + v * c, z + ST);
    put(s.el, prism(P, front, turn(s.ring, cx, cy, th), turn(s.inner, cx, cy, th), z, z + ST));
    const l = -s.w / 2 + 4.5, r = s.w / 2 - 4.5, t = -s.h / 2 + 5.5;
    s.marks[0].setAttribute("d", seg(W(l, t), W(l + s.w * 0.45, t)) + seg(W(l, t + 3.6), W(l + s.w * 0.3, t + 3.6)));
    s.marks[1].setAttribute("d", seg(W(l, t + 10), W(r, t + 10)));
    if (s.box) { const pts = s.box.map((q) => W(q.u, q.v)); s.marks[2].setAttribute("d", open(pts.concat([pts[0]]))); }
  }

  // The strings lie under everything; then the commission sheet; then the six, each with its own group.
  const strings = mk("path", { class: "nf lo" }, g);
  const com = sheet(g, CW, CH, true);
  com.el.sil.classList.add("hi");
  draw(com, 0, 0, 0, 0);
  com.key = 0;
  const fan = [];
  for (let i = 0; i < N; i++) fan.push({ ...sheet(g, SW, SH, false), i, sp: spring(0, { eps: 0.002 }), drawn: NaN, key: 0, at: [0, 0, 0] });

  /** Where sheet i sits at t: from its place on the ring, facing the centre, to its place in the pile, lifting on an arc between. */
  function pose(i, t, k) {
    const a = rad(ANG[i]), rx = Math.cos(a) * R, ry = Math.sin(a) * R;
    return [lerp(rx, Math.cos(a) * 1.5, t), lerp(ry, Math.sin(a) * 1.5, t), t * ST * (k + 1) + Math.sin(Math.PI * t) * ARC, lerp(a + rad(TILT[i]), rad(TILT[i] * 0.3), t)];
  }
  let rank = fan.map((s) => N - 1 - s.i);
  /** Paint order by depth: x + y, and the height on top, so the pile stacks and a sheet in flight passes over what it crosses. */
  function order() {
    const all = [com, ...fan].sort((a, b) => a.key - b.key);
    let prev = strings;
    for (const s of all) { if (prev.nextSibling !== s.grp) prev.after(s.grp); prev = s.grp; }
  }

  const B = register(stage, (dt) => {
    let m = false, d = "";
    for (const s of fan) {
      if (stepS(s.sp, dt)) m = true;
      if (s.sp.x !== s.drawn) {
        s.drawn = s.sp.x;
        const [x, y, z, th] = pose(s.i, s.sp.x, N - 1 - rank[s.i]);
        draw(s, x, y, z, th); s.key = x + y + z * 1.5; s.at = [x, y, z];
      }
      d += seg(P(s.at[0], s.at[1], s.at[2]), P(0, 0, ST));
    }
    strings.setAttribute("d", d);
    order();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let n = 0;
    if (over) {
      const dist = Math.hypot(over[0], over[1]), a = Math.atan2(over[1], over[0]);
      n = N * clamp((R + 24 - dist) / (R + 10), 0, 1);
      // the sheets on the pointer's side go first: rank them by how far round they are from it
      const by = fan.map((s) => [Math.abs(Math.atan2(Math.sin(rad(ANG[s.i]) - a), Math.cos(rad(ANG[s.i]) - a))), s.i]).sort((p, q) => p[0] - q[0]);
      rank = []; by.forEach(([, i], r) => { rank[i] = r; });
    }
    for (const s of fan) { s.sp.t = clamp(n - rank[s.i], 0, 1); s.drawn = NaN; }
    read.textContent = over ? `${Math.round(n)} in` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = unproj(C, p[0], p[1], 0); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { R = v; for (const s of fan) s.drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "gather",
  means: "Six invoices tied round one commission sheet slide in along their strings as the pointer nears the centre.",
  rules: [1, 2, 5, 6],
  range: [46, 58, 70],
  tour: [[267,199], [200,166], [105,175], null],
  mount,
});
