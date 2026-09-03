# FWW × SFB widget design (FC-1012)

Design artboards for the FWW widgets in the Smart Fund Benchmarking fund detail panel:
Allokationsdaten, Renditeentwicklung (incl. trigger states), Crash Drawdowns, Dokumente tab,
the shared widget pattern (enlarge / download / Datenstand) and empty states.

- `build.mjs` — generates every `*.dc.html` artboard and `canvas.json` (chart geometry is computed here).
- `*.dc.html` — one artboard each; `canvas.json` lays them out.
- The published design canvas is assembled from these files; the assembled `fww-sfb-widgets.html` is generated and not committed.

Regenerate after editing `build.mjs`: `node design/fww-sfb-widgets/build.mjs`
