# TEAM ID

Operations dashboard for a company that builds dedicated delivery teams (3–20 people: engineers, QA, PMs, designers) for fintech, banking, healthcare, automotive, financial-services and compliance clients.

Built with Next.js 16 (App Router), Tailwind CSS v4, shadcn-style primitives and Recharts.

## Pages

| Route | What the operations manager sees |
| --- | --- |
| `/` | Portfolio overview: KPI tiles, 12-month headcount (deployed vs bench), teams needing attention, headcount by industry, role mix, upcoming renewals, recent activity |
| `/teams` | All client teams with search, industry and health filters; card or table view |
| `/teams/[id]` | Team detail: roster with allocation, role mix, signals, open roles, timeline |
| `/people` | Everyone in the company, deployed or on bench, with filters |
| `/roles` | Hiring pipeline by stage with age and urgency |

`⌘K` / `Ctrl K` opens search across teams and people. Light and dark themes follow the OS and can be toggled in the sidebar.

## Design system

Semantic shadcn/ui tokens in `src/app/globals.css`, built on Pantone 13-4720 TCX Tanager Turquoise (`#91DDE8`) with its slate navy (`#22394D`), deep teal (`#0A3940`), coral (`#DB6352`) and sand (`#E8C891`) companions. Chart colours are validated for colour-vision deficiency in both themes. Status colours (green / amber / coral) are reserved for meaning and always ship with an icon or label.

Demo data lives in `src/lib/data.ts` and is generated deterministically so server and client render identically.

## Develop

```bash
pnpm install
pnpm dev
```

`pnpm lint` and `pnpm build` must both pass before shipping.
