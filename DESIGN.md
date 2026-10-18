# DESIGN SPECIFICATION: SHIPYON GLOBAL TRADE & SOURCING
**Brand Directive:** Swiss / Industrial Brutalism (Sections & Contents) · Tactile Neomorphism (Buttons & Interactive Controls)  
**Design Standards:** `industrial-brutalist-ui`, `ui-ux-pro-max`, `design-taste-frontend-v1`, `stitch-design-taste`  
**Color Palette Source of Truth:** Imperial Botanical Green (#183D32) • Unbleached Architectural Paper (#F3F2EB) • Surgical Terracotta (#C84630)

---

## 1. Visual Identity: The Brutalist + Neomorphic Fusion

Shipyon fuses two powerful, complementary aesthetics into a unified, high-end experience:
* **Sections & Structural Contents (Industrial Brutalism):**
  * Rigid architectural grids and compartmentalized data tables.
  * Sharp 90-degree mechanical corners (`border-radius: 0px`) across all cards, panels, containers, viewports, and table cells.
  * Solid visible structural ink borders (`2px solid var(--color-forest)` / `#183D32`).
  * Hard offset drop shadows with **zero blur** (`box-shadow: 6px 6px 0px var(--color-forest)`). On hover, cards physically displace (`transform: translate(-3px, -3px)`) and shadows expand to `8px 8px 0px`.
  * High-density technical metadata and monospace telemetry stamps (`JetBrains Mono`, e.g. `[ STATUS: ACTIVE // INMAA ]`, coordinates, phytosanitary references).
  * Raw architectural substrates: unbleached documentation paper (`#F3F2EB`), card whiteplates (`#FAF9F3`), and dark tactical console green (`#0C1A14`, `#10241C`).

* **Interactive Buttons & Controls (Tactile Neomorphism):**
  * Striking contrast against the rigid brutalist geometry: buttons are soft, sculpted, organic 3D pills (`border-radius: 9999px`).
  * Dual directional lighting shadows: top-left soft highlight and bottom-right depth shadow.
  * Primary Botanical Buttons (`.btn-corp`): Convex green gradient (`linear-gradient(145deg, #3B7555, #2F6144)`) with dual shadows (`5px 5px 14px rgba(24, 61, 50, 0.35), -4px -4px 10px #ffffff`).
  * Secondary Alabaster Buttons (`.btn-outline`): Tactile convex whiteplate (`linear-gradient(145deg, #FFFFFF, #E3EDE1)`) with soft depth shadows.
  * Click physics: Real physical depression on click (`:active { transform: translateY(1px); box-shadow: inset 3px 3px 6px ... }`).
  * Interactive category chips (`.filter-chip`): Tactile neumorphic pill toggles.
  * Range slider thumb: Tactile 3D circular neumorphic knob.

---

## 2. Color System & Structural Tokens

| Token Name | Hex Code | Role in Brutalist + Neomorphic System |
| :--- | :--- | :--- |
| `--color-forest` | `#183D32` | Primary brutalist ink, solid 2px borders, hard offset shadows, and prominent typography. |
| `--color-botanical` | `#356B4D` | Primary Neumorphic button gradient start, accent tags, and active status indicators. |
| `--color-sage` | `#A8BCA5` | Secondary visual accents, terminal gridlines, and technical spec chips. |
| `--color-mist` | `#EAE9E0` | Secondary brutalist table cell backgrounds and subtle section transitions. |
| `--color-ivory` / `--brutal-bg` | `#F3F2EB` | Main unbleached architectural paper canvas. |
| `--brutal-surface` | `#FAF9F3` | Crisp brutalist card whiteplates framed by 2px solid borders. |
| `--color-charcoal` | `#1A2E26` | High-contrast body copy and specifications (never pure `#000000`). |
| `--color-stone` | `#5F6B62` | Secondary monospace metadata, captions, and GPS telemetry identifiers. |
| `--color-beacon` | `#C84630` | Surgical Terracotta Hazard/Radar accent and live status beacons. |
| `--brutal-dark-bg` | `#0C1A14` | Tactical terminal dark canvas (ACT IV Radar & ACT VII Footer). |
| `--brutal-dark-surface` | `#10241C` | Command room viewport and telemetry HUD panels. |

---

## 3. Typographic Hierarchy: Bimodal Density
* **Headlines & Editorial Titles:** `DM Serif Display` — Track-tight (`-0.025em`), monumental scale (`clamp(2.4rem, 4.8vw, 4.8rem)`), crisp line-height `1.15`.
* **Body Copy:** `Outfit` / `Plus Jakarta Sans` — Weights 400 (regular), 600 (semi-bold). Line-height `1.68`, width `max-w-[62ch]`.
* **Telemetry & Metadata:** `JetBrains Mono` — High-density, uppercase, tracked (`1.2px - 2px`), used for technical stamps `[ ACT // 01 ]`, corridor specs, and table labels.
* **Inline Image Technique:** High-resolution origin photos embedded directly into headline typography, framed in sharp 2px solid forest borders with 3px hard shadows.

---

## 4. Component Architectural Blueprint

1. **Floating Navigation Header:**
   - Rigid brutalist bar: `background: #FAF9F3; border: 2px solid #183D32; box-shadow: 4px 4px 0px #183D32; border-radius: 0px;`
   - Monospace navigation links with sharp hover bounding boxes.
   - **CTA Button (`.nav-header-cta`):** Tactile Neumorphic pill button with dual directional shadows.

2. **Hero Section (ACT I):**
   - Asymmetric split grid on unbleached drafting grid substrate.
   - Monospace telemetry badge `[ South India Origin Gateway • Monitored Cold Chain (+4.2°C) • Priority Berthing ]`.
   - Rigid 4-cell metric table with solid borders and zero corner radius.
   - Panoramic photo wrap with thick 3px border and 10px hard offset shadow.
   - Primary and secondary Neumorphic action buttons.

3. **Bento Grid (ACT II):**
   - Compartmentalized 12-column grid with 0px corner radiuses and 6px hard offset shadows.
   - Interactive category filter tray housing **tactile Neumorphic pill buttons** (`.filter-chip`).
   - Technical monospace spec chips (`.spec-chip`) and origin tags (`.bento-tag`).

4. **The 4 Moves Pipeline (ACT III):**
   - Rigid 4-card logistics manifest with bold monospace step badges (`1`, `2`, `3`, `4`).
   - Hard 6px offset shadows and sharp 0px photo viewports.

5. **Maritime Radar Command Room (ACT IV):**
   - Dark Tactical Terminal (`#091712`, `#0C1E18`) with 2px solid `#28543F` borders and 8px hard shadows.
   - Phosphor green route vector tracks with animated dash arrays and pulsating origin beacon.
   - Corridor Selector Tray housing **tactile Neumorphic dark console pill buttons** (`.corridor-tab`).

6. **Editorial Leadership Dossier (ACT V):**
   - Split 2-column dossiers with sharp photo framing and thick quote indicator borders.

7. **Trade Desk & Simulator Terminal (ACT VI):**
   - Direct telephone communication cards and Enquiry Terminal.
   - Container Allocation & Volume Estimator with rigid brutalist data boxes, monospace tonnage readouts, and a **tactile Neumorphic slider thumb**.
   - Sharp 0px form inputs with 2px borders and monospace text.
   - Primary submit button: **Large Botanical Green Neumorphic Pill Button**.

8. **Architectural Footer (ACT VII):**
   - Dark industrial manifest grid with 3px solid top border, monospace directory headings, and full corporate provenance.

---

## 5. Authentic Business Provenance
* **India Origin HQ:** `+91 95006 90740`
* **Europe Trade Desk:** `+49 1515 6840689`
* **Official Trade Communications:** `trade@shipyon.com`
* **Registered Operations Address:** Hall No 2, 1st Floor, Vishnu Lakshmi Campus, Ellis Nagar, Pollachi Road, Dharapuram — 638 656, Tamil Nadu, India.
* **Executive Leadership:** Pranesh Kumar (Founder & CEO) and Naveen Ananthan (Global Trade Advisor).
