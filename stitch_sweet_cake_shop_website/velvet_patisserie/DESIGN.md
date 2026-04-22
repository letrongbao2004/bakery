```markdown
# Design System Document: High-End Patisserie Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Patisserie Editorial."** 

We are not building a standard e-commerce site; we are crafting a digital degustation. The goal is to move away from the rigid, "boxed-in" feel of traditional Bootstrap layouts and toward an editorial experience reminiscent of a high-end fashion or culinary magazine. 

By leveraging **intentional asymmetry**, **overlapping elements**, and **generous whitespace**, we create a sense of luxury and bespoke craftsmanship. The design must feel as handmade as the pastries themselves—organic yet disciplined, sweet yet sophisticated.

---

## 2. Colors & Tonal Depth
Our palette transitions from the airy lightness of Rose White to the rich, grounding depth of Chocolate Brown.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or containers. 
Structure is achieved through **Tonal Transitions**. To separate content, shift the background color from `surface` (#fff8f6) to `surface-container-low` (#fff1eb). A section’s end is defined by a color change, not a line.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine parchment. Use the following hierarchy to create depth:
*   **Base Layer:** `surface` (#fff8f6)
*   **Secondary Content:** `surface-container-low` (#fff1eb)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff) to make them "pop" subtly.
*   **Callouts:** `surface-container-highest` (#ffdbcc)

### The "Glass & Gradient" Rule
To add "soul" to the digital interface:
*   **Glassmorphism:** For floating navigation or modal overlays, use the `surface` color at 80% opacity with a `backdrop-blur` of 12px.
*   **Signature Textures:** Main CTAs should not be flat. Apply a subtle radial gradient transitioning from `primary` (#ac2a5d) at the center to `primary_container` (#ff6b9d) at the edges to mimic the sheen of a glazed fruit tart.

---

## 3. Typography
We use a high-contrast typographic scale to establish an authoritative, editorial voice.

*   **Display & Headlines (Noto Serif):** Use these for storytelling. The elegance of the serif reflects the "handmade" nature of the product. Use `display-lg` (3.5rem) for Hero statements with tight letter-spacing (-0.02em) to evoke luxury.
*   **Titles & Body (Plus Jakarta Sans):** This modern sans-serif provides a clean, readable counterpoint to the ornate headlines. 
*   **Color Application:** All primary text must use `on_surface` (#2d1509). Never use pure black. The chocolate-brown undertone keeps the experience "warm" and edible.

---

## 4. Elevation & Depth
We eschew traditional material shadows in favor of **Tonal Layering** and **Ambient Light**.

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#ffffff) card atop a `surface-container-high` (#ffe2d6) background. This creates a natural "lift" without visual noise.
*   **Ambient Shadows:** If a shadow is required for a floating action button or a modal, use a highly diffused blur (20px-40px) at 6% opacity. The shadow color should be a tint of `on_surface` (#2d1509), not grey.
*   **The Ghost Border:** If a boundary is required for accessibility (e.g., input fields), use the `outline_variant` (#ddbfc5) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Pill-shaped (`rounded-full`). Gradient of `primary` to `primary_container`. Text: `on_primary` (#ffffff), `title-sm` (uppercase with 0.1em tracking).
*   **Secondary:** `surface_container_lowest` background with a `ghost border`. 
*   **Hover State:** Transition to `primary_fixed_dim` (#ffb1c5) with a subtle 2px vertical lift.

### Cards (The "Plated" Card)
*   **Style:** No borders. Use `md` (0.75rem) or `lg` (1rem) corner radius.
*   **Separation:** Instead of dividers, use 48px of vertical whitespace between internal card elements. 
*   **Interaction:** On hover, the card background should shift from `surface-container-low` to `accent` (#FFD6E7).

### Input Fields
*   **Style:** Minimalist. Background: `surface-container-low`.
*   **Focus State:** The "Ghost Border" becomes 100% opaque `primary`, and the label slides up into a `label-sm` style.

### Floating Pastry Chips
*   **Context:** For dietary tags (e.g., "Gluten-Free", "Vegan").
*   **Style:** Use `secondary_container` (#ffabcf) with `on_secondary_container` (#7c3b5a) text. Soft, rounded-full edges.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use asymmetrical padding. In a 12-column Bootstrap grid, allow an image to take 7 columns and text to take 4, leaving a 1-column "breathing" gap.
*   **Do** overlap elements. Let a high-resolution pastry PNG (with transparent background) "break the container" and sit across two different background color sections.
*   **Do** use `notoSerif` for numbers (prices) to make them feel like a curated menu.

### Don't:
*   **Don't** use standard Font Awesome circles for icons. Let icons breathe without backgrounds, or use a soft `secondary_fixed` (#ffd8e6) square with `xl` (1.5rem) rounded corners.
*   **Don't** use 100% width sections for text. Constrain body copy to 600px-800px to maintain editorial readability.
*   **Don't** use high-contrast dividers. If you must separate list items, use a 1px line of `outline_variant` at 10% opacity, or simply a 16px gap.

---

## 7. Spacing & Grid Integration
While we utilize the Bootstrap 4 grid for responsiveness, we break its "blocky" nature by using **nested containers**. 

*   **Outer Padding:** Always use a minimum of `px-5` on mobile and `px-lg-5` on desktop to ensure the content never touches the viewport edges, maintaining that premium "matted" frame look.
*   **Vertical Rhythm:** Use a 4-step spacing scale (16px, 32px, 64px, 128px). Reserve the 128px spacing for separating major "stories" or pastry collections.```