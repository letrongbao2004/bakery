# Sweet Trio Bakery - Design Requirements

## Brand Identity
*   **Name:** Sweet Trio Bakery
*   **Colors:**
    *   Primary: #FFB6C1 (Light Pink)
    *   Accent/CTA: #E75480 (Deep Pink)
    *   Secondary: #FFF0F5 (Lavender Blush)
    *   Text: #4A4A4A (Body), #2C2C2C (Headings)
    *   Surface: #FFFFFF (White)
    *   Borders: #F9D0D8 (Soft Pink)
*   **Typography:**
    *   Headings: Playfair Display (Serif)
    *   Body: Lato or Nunito (Sans-serif)
    *   Prices: Bold, Accent color, larger font.

## Global Layout Rules
*   Bootstrap 5 Grid System.
*   Sticky footer pattern.
*   Fixed top navbar (60px).
*   Consistent container spacing (my-5).
*   3-column footer with deep mauve background (#3D1A24).

## Shared Components
### Navbar
*   Logo: "Sweet Trio Bakery" (Left, Accent color).
*   Links: Trang chủ, Giới thiệu, Sản phẩm, Tin tức, Liên hệ.
*   Icons: Bootstrap Icons for each link.
*   Interactive: Cart icon with badge, mini-cart dropdown, user profile dropdown.
*   Mobile: Hamburger toggle.

### Footer
*   Dark background (#3D1A24), white text.
*   Columns: Brand tagline, Quick links, Social icons.
*   Bottom bar: Copyright with pink divider.

## Pages to Design
1.  **index.html:** Hero carousel, Search bar, Featured products grid, Video section.
2.  **about.html:** Brand story with image, Team section with circular avatars.
3.  **products.html:** Category filter pills, 4-column product grid.
4.  **sanpham1-7.html:** Breadcrumbs, product zoom, rating, quantity, reviews form.
5.  **cart.html:** Product table, sticky summary card, empty state.
6.  **checkout.html:** 3-step indicator, delivery form, cart summary sidebar.
7.  **login/register.html:** Centered cards, validation, loading states.
8.  **profile.html:** Avatar upload, editable user details.
9.  **news.html:** Blog card grid.
10. **contact.html:** Form + store info + Google Maps.
11. **sitemap.html:** Single column list of all pages.

## Technical Notes
*   Single `style.css` and `main.js`.
*   LocalStorage for cart/auth/reviews.
*   Pure front-end (HTML/CSS/JS).