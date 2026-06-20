---
name: Pulse Monitor Pro
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#085ac0'
  on-secondary: '#ffffff'
  secondary-container: '#5b94fd'
  on-secondary-container: '#002c66'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  success-emerald: '#10b981'
  warning-orange: '#f97316'
  error-red: '#ba1a1a'
  surface-card: '#ffffff'
  border-subtle: '#E2E8F0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  sidebar-width: 260px
  container-max: 1440px
---

## Brand & Style
Pulse Monitor Pro is a sophisticated, data-centric dashboard designed for high-stakes infrastructure monitoring. The brand personality is **Precise, Reliable, and High-Performance**. It balances the clinical utility of developer tools with a premium corporate aesthetic.

The design style is **Corporate / Modern** with a strong emphasis on **Bento-style information density**. It utilizes clean containers, subtle depth, and purposeful micro-interactions to make complex data readable and actionable. The interface should feel fast and industrial, evoking confidence in the underlying system's stability.

## Colors
The color palette is anchored by a deep Navy Primary (#0f172a) for structural grounding and a vibrant Professional Blue Secondary (#0058be) for interactive elements and brand accents. 

Functional status colors are critical to the UX:
- **Success/Healthy:** Emerald green for "Optimal" states and positive trends.
- **Warning/High Latency:** Warm orange for "Warning" states and performance spikes.
- **Critical/Down:** Deep red for "Critical" alerts and service outages.

The background uses a very soft blue-tinted white (#f8f9ff) to reduce eye strain during long monitoring sessions, while cards utilize pure white (#ffffff) to pop against the surface.

## Typography
The system relies on **Inter** for all UI elements to ensure maximum legibility and a neutral, professional tone. **JetBrains Mono** is introduced specifically for technical data, timestamps, and API endpoints, providing the necessary character alignment for log-style reading.

- **Headlines:** Use tight letter-spacing and semi-bold weights to create a strong hierarchy.
- **Labels:** Small caps with increased letter-spacing are used for metadata headers to distinguish them from interactive body text.
- **Code:** Monospaced fonts are reserved for the "Live Stream" and versioning metadata.

## Layout & Spacing
The system employs a **Fixed Grid** approach within a fluid container that caps at 1440px. The sidebar is fixed at 260px on desktop, while the main content area utilizes a multi-column Bento grid.

- **Gutters:** A consistent 24px (lg) spacing is used between major dashboard cards.
- **Internal Padding:** Cards use 16px (md) or 24px (lg) padding depending on the complexity of the internal data.
- **Mobile:** The sidebar collapses into a hamburger menu, and the multi-column Bento grid reflows into a single-column stack.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Ambient Shadows**. 

1.  **Background Layer:** The base surface (#f8f9ff) serves as the canvas.
2.  **Container Layer:** Cards (#ffffff) are elevated with a very soft, multi-layered shadow (0px 1px 3px rgba(0,0,0,0.05) combined with 0px 10px 15px -3px rgba(0,0,0,0.05)).
3.  **Interactive Hover:** On hover, cards lift slightly (translate-y-[-2px]) and the shadow deepens to provide tactile feedback.
4.  **Status Borders:** Critical containers use a 4px left-border accent (Emerald or Red) to signify state without relying solely on color fills.

## Shapes
The shape language is structured and professional. A "Soft" roundedness is the standard.
- **Standard Cards/Sections:** Use `rounded-xl` (0.5rem) to soften the industrial feel.
- **Status Tags/Chips:** Use full pill-shaped rounding for high-contrast visibility.
- **Service Mini-Cards:** Use `rounded` (0.25rem) for internal grid elements to maximize space efficiency.
- **Primary FAB:** A perfect circle for the "Add" action to distinguish it from the rectangular grid.

## Components

### Buttons
- **Primary:** Solid blue (#0058be) with white text.
- **Ghost:** Text-only in secondary color, used for secondary actions like "REFRESH DATA."
- **FAB:** Circular, high-elevation, positioned at the bottom right.

### Cards (Bento)
- White background with a 1px #E2E8F0 border.
- Headlines are positioned at the top left, with secondary actions or tags at the top right.
- Footer sections are separated by a subtle 1px border-top.

### Status Indicators
- **Pulse Dots:** Use a 2s cubic-bezier pulse animation for "Live" or "Healthy" states to provide a sense of "system life."
- **Status Tags:** Small, bold, uppercase labels with low-opacity background fills matching the status color (e.g., Emerald-100 bg with Emerald-800 text).

### Tables
- Header rows use a soft gray background and small-caps labels.
- Rows feature a subtle hover state change to #eff4ff for tracking data across columns.
- Method tags (GET, POST) use high-contrast bold typography.

### Input Fields
- Search bars use a "Surface-low" background with an inline icon and a 1px border. No heavy shadows; focus state is indicated by a subtle blue ring.