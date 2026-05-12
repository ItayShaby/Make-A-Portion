---
name: Aegis Softened Modern
colors:
  surface: '#fff8f2'
  surface-dim: '#e0d9d0'
  surface-bright: '#fff8f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf2e9'
  surface-container: '#f5ede4'
  surface-container-high: '#efe7de'
  surface-container-highest: '#e9e1d8'
  on-surface: '#1e1b16'
  on-surface-variant: '#5c403b'
  inverse-surface: '#34302a'
  inverse-on-surface: '#f8efe6'
  outline: '#906f69'
  outline-variant: '#e5beb6'
  surface-tint: '#b91e02'
  primary: '#8b1200'
  on-primary: '#ffffff'
  primary-container: '#b61b00'
  on-primary-container: '#ffc9be'
  inverse-primary: '#ffb4a5'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e1'
  on-secondary-container: '#656464'
  tertiary: '#3f4828'
  on-tertiary: '#ffffff'
  tertiary-container: '#57603e'
  on-tertiary-container: '#d0daaf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad3'
  primary-fixed-dim: '#ffb4a5'
  on-primary-fixed: '#3f0400'
  on-primary-fixed-variant: '#8e1300'
  secondary-fixed: '#e4e2e1'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#dde7bc'
  tertiary-fixed-dim: '#c1cba1'
  on-tertiary-fixed: '#171e04'
  on-tertiary-fixed-variant: '#414a2a'
  background: '#fff8f2'
  on-background: '#1e1b16'
  surface-variant: '#e9e1d8'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Newsreader
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style
This design system evolves the "Aegis Modern" aesthetic by pivoting from intellectual rigor to approachable warmth. The design style is **Warm Minimalism**, stripping away unnecessary ornamentation while using soft geometry and high-legibility type to create an inviting, human-centric experience. 

The personality is dependable yet sophisticated—blending the clean, accessible structure of geometric sans-serifs with the editorial warmth of a classic serif. The emotional response should be one of "effortless security," where the UI feels safe, stable, and highly readable. By combining high-contrast primary accents with a muted, organic base, the system achieves a balanced, premium feel that avoids the coldness of traditional corporate SaaS.

## Colors
The palette is anchored by a warm, paper-like surface that reduces eye strain and establishes a natural foundation.

*   **Surface (#fff8f2):** Used for the main background and large structural containers to maintain a bright, airy feel.
*   **Primary (#b61b00):** A deep, saturated red used sparingly for key call-to-actions, critical status indicators, and brand touchpoints.
*   **Tertiary (#a3ad85):** A pastel olive green used for secondary actions, subtle highlights, and success states, providing a calming organic counterpoint to the primary red.
*   **Neutral (#6b665f):** A warm grey used for body text and icons to maintain legibility without the harshness of pure black.

## Typography
This design system utilizes a tiered typographic approach to balance modern clarity with editorial warmth. 

**Outfit** is used for headlines and functional labels. Its geometric construction and subtly rounded terminals provide the necessary cleanliness of a modern sans-serif while reinforcing the "soft" brand narrative. Headlines use a slightly tighter letter-spacing and heavier weights to create structure.

**Newsreader** is utilized for all body text. This choice introduces a humanistic, editorial quality that enhances long-form readability and provides a sophisticated contrast to the geometric headings. Body text is set with generous line heights to ensure maximum readability against the warm surface background.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a consistent 8px rhythmic unit. 

*   **Desktop:** A 12-column grid with 24px gutters. Content is centered within a maximum container width of 1280px.
*   **Tablet:** An 8-column grid with 24px gutters and 32px side margins.
*   **Mobile:** A 4-column grid with 16px gutters and 16px side margins.

Horizontal spacing should favor whitespace to emphasize the "Minimalist" brand pillar. Vertical rhythm is strictly enforced in multiples of 8px to ensure a structured, professional appearance despite the rounded visual style.

## Elevation & Depth
In alignment with the soft aesthetic, depth is communicated through **Tonal Layers** and **Ambient Shadows**.

1.  **Level 0 (Base):** The surface color (#fff8f2).
2.  **Level 1 (Cards/Containers):** Pure white (#ffffff) surfaces with extremely soft, low-opacity shadows (Blur 12px, Spread 0, Opacity 4% of #2d2d2d).
3.  **Level 2 (Overlays/Modals):** Pure white surfaces with a more pronounced, diffused shadow (Blur 24px, Spread -4px, Opacity 8% of #2d2d2d).

Avoid heavy borders. Use subtle 1px strokes in a slightly darker tint of the surface color for boundary definition when tonal separation is insufficient.

## Shapes
The design system utilizes **ROUNDED (Level 2)** as the standard for all interactive and structural elements.

*   **Standard (0.5rem):** Used for buttons, input fields, and small UI components.
*   **Large (1rem):** Used for cards, content sections, and modals.
*   **Extra Large (1.5rem):** Used for oversized containers or hero image masks.

This consistent rounding eliminates visual tension and reinforces the approachable, friendly nature of the interface.

## Components
-   **Buttons:** Primary buttons use the #b61b00 fill with white text. Secondary buttons use the olive #a3ad85 fill with a dark neutral text. All buttons feature 0.5rem (8px) corner radii and 16px horizontal padding.
-   **Input Fields:** Ghost-style inputs with a subtle 1px border (#e0d9d0) and a focus state that utilizes the primary color for the border.
-   **Cards:** White backgrounds with Level 1 shadows and 1rem corner radii. Padding within cards should default to 24px.
-   **Chips/Tags:** Use the tertiary olive color at 15% opacity for the background and 100% opacity for the text. Use a fully pill-shaped radius (rounded-full).
-   **Lists:** Divided by thin, low-contrast lines (#e0d9d0) rather than boxes to maintain a clean, editorial flow.
-   **Navigation:** Top-level navigation uses Label-MD typography with clear active states indicated by a soft olive underbar.