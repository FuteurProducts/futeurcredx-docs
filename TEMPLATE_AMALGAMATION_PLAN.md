# LUMIQ AI DASHBOARD - TEMPLATE AMALGAMATION PLAN
## Best of All Sources Combined

**Date:** 2026-02-03
**Sources Analyzed:**
1. **Core 2 Dashboard Builder** (React/Next.js) - `/tmp/figma-analysis/core-2-dashboard-builder-react`
2. **Matdash Pro** (React/Vite) - `/tmp/figma-analysis/matdash-react-tailwind-vite-pro-main`
3. **Fina Admin Dashboard** (Figma) - Light theme financial dashboard
4. **Mere POS** (Figma) - Dark theme card-based UI

---

## EXECUTIVE SUMMARY

| Aspect | Best Source | Why |
|--------|-------------|-----|
| **Design Tokens** | Core 2 | Comprehensive shade scale, semantic naming |
| **Color Themes** | Matdash | Multi-theme support (6 themes) |
| **Components** | Keep Current (shadcn) | Already compatible with Matdash patterns |
| **Charts** | Core 2 | Better tooltip styling, design token usage |
| **Cards** | Core 2 | Beautiful depth shadows, clean structure |
| **Typography** | Core 2 | Complete scale (h1-h6, body, caption) |
| **Tables** | Matdash | TanStack Table integration |
| **Forms** | Matdash | React Hook Form + shadcn-form |
| **Layout** | Current + Core 2 | Keep sidebar, add Core 2 spacing |

---

## PART 1: DESIGN TOKEN MIGRATION

### 1.1 Replace Current Tokens with Core 2 System

**Current (`index.css`):**
```css
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
/* Limited tokens */
```

**Target (from Core 2):**
```css
/* Shade Scale (grayscale) */
--shade-01: #141414;
--shade-02: #101010;
--shade-03: #191919;
--shade-04: #222222;
--shade-05: #4c4c4c;
--shade-06: #727272;
--shade-07: #7b7b7b;
--shade-08: #e2e2e2;
--shade-09: #f1f1f1;
--shade-10: #fdfdfd;

/* Primary Colors */
--primary-01: #2a85ff;  /* Main blue */
--primary-02: #00a656;  /* Success green */
--primary-03: #ff381c;  /* Error red */
--primary-04: #7f5fff;  /* Purple */
--primary-05: #ff9d34;  /* Warning orange */

/* Secondary (Pastel) */
--secondary-01: #ffbc99;
--secondary-02: #cabdff;
--secondary-03: #b1e5fc;
--secondary-04: #b5e4ca;
--secondary-05: #ffd88d;

/* Semantic Backgrounds */
--b-surface1: var(--shade-09);
--b-surface2: var(--shade-10);
--b-highlight: #f9f9f9;
--b-depth: #f9f9f9;

/* Semantic Text */
--t-primary: var(--shade-02);
--t-secondary: var(--shade-06);
--t-tertiary: var(--shade-07);

/* Semantic Strokes */
--s-border: var(--shade-10);
--s-subtle: rgba(123, 123, 123, 0.1);
--s-focus: var(--primary-01);

/* Chart Colors */
--chart-green: #00b512;
--chart-purple: var(--primary-04);
--chart-yellow: var(--primary-05);
```

### 1.2 Add Matdash Multi-Theme Support

```css
[data-color-theme="BLUE_THEME"] {
    --color-primary: #635BFF;
    --color-secondary: #16CDC7;
}

[data-color-theme="AQUA_THEME"] {
    --color-primary: #0074BA;
    --color-secondary: #47D7BC;
}

[data-color-theme="PURPLE_THEME"] {
    --color-primary: #763EBD;
    --color-secondary: #49BEFF;
}

[data-color-theme="GREEN_THEME"] {
    --color-primary: #0a7ea4;
    --color-secondary: #ccda4e;
}

[data-color-theme="CYAN_THEME"] {
    --color-primary: #01C0C8;
    --color-secondary: #FB9678;
}

[data-color-theme="ORANGE_THEME"] {
    --color-primary: #FA896B;
    --color-secondary: #0074BA;
}
```

---

## PART 2: TYPOGRAPHY MIGRATION

### From Core 2's Type Scale

| Token | Size | Line Height | Weight | Use Case |
|-------|------|-------------|--------|----------|
| `text-h1` | 6rem | 1.15 | 300 | Hero headings |
| `text-h2` | 3.75rem | 1.25 | 500 | Page titles |
| `text-h3` | 3rem | 1.25 | 500 | Section titles |
| `text-h4` | 2rem | 1.45 | 600 | Card titles |
| `text-h5` | 1.5rem | 1.45 | 500 | Subsections |
| `text-h6` | 1.25rem | 1.45 | 600 | Widget titles |
| `text-sub-title-1` | 1rem | 1.5 | 600 | Emphasized text |
| `text-sub-title-2` | 0.875rem | 1.55 | 700 | Small titles |
| `text-body-1` | 1rem | 1.5 | 400 | Body text |
| `text-body-2` | 0.875rem | 1.5 | 400 | Secondary body |
| `text-button` | 0.875rem | 1 | 600 | Button text |
| `text-caption` | 0.75rem | 1.6 | 400 | Captions |
| `text-overline` | 0.625rem | 1 | 500 | Overlines |

**Migration:** Replace all `text-[0.875rem]` etc. with semantic tokens.

---

## PART 3: SHADOW SYSTEM

### From Core 2 - Production-Grade Shadows

```css
/* Widget shadow - for cards */
--shadow-widget: 0px 5px 1.5px -4px rgba(8, 8, 8, 0.09),
    0px 6px 4px -4px rgba(8, 8, 8, 0.05);

/* Depth shadow - for elevated elements */
--shadow-depth: 0px 2.15px 0.5px -2px rgba(0, 0, 0, 0.25),
    0px 24px 24px -16px rgba(8, 8, 8, 0.04),
    0px 6px 13px 0px rgba(8, 8, 8, 0.03),
    0px 6px 4px -4px rgba(8, 8, 8, 0.05),
    0px 5px 1.5px -4px rgba(8, 8, 8, 0.09);

/* Dropdown shadow */
--shadow-dropdown: 0px 0px 10px 0px rgba(0, 0, 0, 0.05),
    0px 2.15px 0.5px -2px rgba(0, 0, 0, 0.25),
    0px 24px 24px -16px rgba(8, 8, 8, 0.04),
    0px 6px 13px 0px rgba(8, 8, 8, 0.03),
    0px 6px 4px -4px rgba(8, 8, 8, 0.05),
    0px 5px 1.5px -4px rgba(8, 8, 8, 0.09);

/* Input focus shadow */
--shadow-input-typing: 0px 4px 4px 0px rgba(157, 157, 157, 0.1) inset,
    0px 0px 0px 3px #fff inset;
```

---

## PART 4: COMPONENT MAPPING

### Cards (Core 2 Style)

**Current Lumiq:**
```tsx
<div className="bg-card rounded-xl border border-border p-5">
```

**Target (Core 2 style):**
```tsx
<div className="card">  {/* Uses .card utility class */}
  <div className="flex items-center h-12 pl-5">
    <div className="mr-auto text-h6">{title}</div>
  </div>
  <div className="pt-3">{children}</div>
</div>
```

**CSS Utility:**
```css
.card {
    @apply mb-3 p-3 rounded-4xl bg-b-surface2 shadow-widget last:mb-0
           dark:shadow-[inset_0_0_0_1.5px_rgba(229,229,229,0.04),
           0px_5px_1.5px_-4px_rgba(8,8,8,0.5),
           0px_6px_4px_-4px_rgba(8,8,8,0.05)];
}
```

### Labels/Badges (Core 2 Style)

```css
.label {
    @apply inline-flex items-center h-7 px-1.75 rounded-lg text-button;
}
.label-green {
    @apply border border-[#00A656]/15 bg-[#00A656]/5 text-[#00A656];
}
.label-red {
    @apply border border-[#FF6A55]/15 bg-[#FF6A55]/5 text-[#FF6A55];
}
.label-yellow {
    @apply border border-[#EF9D0E]/15 bg-[#EF9D0E]/5 text-[#EF9D0E];
}
```

### Chart Tooltips (Core 2 Style)

```css
.chart-tooltip {
    @apply p-2 bg-b-dark1 rounded-lg text-t-light;
}
```

---

## PART 5: PAGE-BY-PAGE MAPPING

### Overview/Dashboard Page
| Section | Source | Implementation |
|---------|--------|----------------|
| Welcome Banner | Core 2 `WelcomeBox` pattern | Keep current, update shadows |
| KPI Cards | Core 2 `Overview` tabs | Add tab switching, better metrics |
| Charts | Core 2 tooltip + colors | Update chart components |
| Activity Feed | Current | Keep, update typography |

### Underwriting Page
| Section | Source | Implementation |
|---------|--------|----------------|
| Pipeline Table | Matdash TanStack Table | Better sorting, filtering |
| Application Cards | Core 2 card style | Update shadows, spacing |
| AI Panel | Current | Keep, update colors |
| Segment Cards | Core 2 card + Current | Update to new shadow system |

### Analytics Page
| Section | Source | Implementation |
|---------|--------|----------------|
| Charts | Core 2 chart styling | New tooltips, colors |
| Metrics Grid | Core 2 `Overview` pattern | Tab-based metrics |
| Filters | Matdash `Filters` | Better filter UX |

### Settings Page
| Section | Source | Implementation |
|---------|--------|----------------|
| Tabs | Current shadcn | Keep |
| Forms | Matdash `shadcn-form` | Better validation |
| Theme Selector | Matdash color themes | Add multi-theme support |

---

## PART 6: FILES TO UPDATE/CREATE

### New Files (from Core 2)

| File | Purpose |
|------|---------|
| `src/styles/tokens.css` | Core 2 design tokens |
| `src/styles/utilities.css` | Core 2 utility classes (.card, .label-*, etc.) |
| `src/lib/chart-config.ts` | Standardized chart configuration |

### Files to Update

| File | Changes |
|------|---------|
| `src/index.css` | Replace tokens with Core 2 system |
| `tailwind.config.js` | Add Core 2 theme configuration |
| `src/components/ui/card.tsx` | Add Core 2 card variants |
| `src/components/ui/badge.tsx` | Add Core 2 label styles |
| All chart components | Update to use new tokens |

---

## PART 7: IMPLEMENTATION ORDER

### Phase 1: Design Foundation (Day 1)
1. Copy Core 2 design tokens to `src/index.css`
2. Add Core 2 utility classes
3. Update `tailwind.config.js` with new theme
4. Test dark mode compatibility

### Phase 2: Component Updates (Days 2-3)
1. Update Card component with Core 2 shadows
2. Update Badge/Label components
3. Update all chart tooltips
4. Update typography across all files

### Phase 3: Page Rebuilds (Days 4-7)
1. Overview page with new metrics pattern
2. Underwriting with improved tables
3. Analytics with new chart styling
4. Settings with theme selector

### Phase 4: Polish (Days 8-10)
1. Add Matdash color theme selector
2. Fix all remaining hardcoded colors
3. Accessibility pass
4. Final QA

---

## PART 8: QUICK REFERENCE - FILE LOCATIONS

### Core 2 Key Files
```
/tmp/figma-analysis/core-2-dashboard-builder-react/
├── app/globals.css              # Design tokens
├── components/Card/index.tsx    # Card component
├── components/Percentage/       # Percentage badge
├── templates/HomePage/Overview/ # Overview pattern
└── templates/Income/            # Financial charts
```

### Matdash Key Files
```
/tmp/figma-analysis/matdash-react-tailwind-vite-pro-main/packages/main/
├── src/css/theme/default-colors.css  # Color themes
├── src/components/shadcn-ui/         # shadcn components
├── src/components/dashboards/        # Dashboard layouts
└── src/components/charts/            # Chart components
```

---

## VERIFICATION CHECKLIST

After amalgamation:
- [ ] All design tokens using Core 2 system
- [ ] Dark mode working with new tokens
- [ ] Cards using new shadow system
- [ ] Charts using new tooltips
- [ ] Typography using Core 2 scale
- [ ] Matdash color themes available
- [ ] No hardcoded colors remaining
- [ ] Build passes without errors

---

*Templates copied to `/tmp/figma-analysis/` for reference during implementation*
