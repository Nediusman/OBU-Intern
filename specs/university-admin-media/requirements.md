# Requirements Document

## Introduction

This feature adds three major capabilities to the Oda Bultum University website:

1. **Logo integration** — Replace the current text-only logo in the navbar and throughout the site with the university's actual PNG logo (transparent background), sourced from the `images/` folder and the root-level `obu_transparen_logos.png`.
2. **Image slideshows / carousels** — Auto-playing animated image carousels on the homepage and relevant pages, drawing from images already present in the `images/` folder and `src/assets/`.
3. **Admin panel** — A protected `/admin` area (localStorage-based auth, no backend) providing: an analytics dashboard, media/image management, user/role management (content creators and sub-admins), and news/events content management.

---

## Glossary

- **Admin**: An authenticated user with full access to the admin panel.
- **Sub_Admin**: A user with a "sub-admin" role who can manage content but cannot manage other users.
- **Content_Creator**: A user with a "content creator" role who can add and edit news/events posts but cannot delete posts or manage users.
- **Auth_Context**: The React context that holds the current authenticated user's session, stored in and hydrated from localStorage.
- **Media_Library**: The collection of images managed by the admin panel, persisted in localStorage as base64 data URLs or references.
- **News_Post**: A structured object representing a news or events item with fields: id, title, excerpt, body, date, category, imageUrl, authorId.
- **Carousel**: An auto-playing, animated image slideshow component using `embla-carousel-react` (already installed).
- **Admin_Route**: Any TanStack Router route under the `/admin` path prefix.
- **Protected_Route**: A route that redirects unauthenticated users to `/admin/login`.
- **Navbar**: The `src/components/Navbar.tsx` component rendered at the top of every page.
- **Logo**: The university's PNG image with a transparent background located at `images/logo.png` and `obu_transparen_logos.png`.

---

## Requirements

### Requirement 1: University Logo in Navbar and Footer

**User Story:** As a site visitor, I want to see the university logo in the navbar and footer instead of plain text, so that the site looks professional and brand-consistent.

#### Acceptance Criteria

1. THE Navbar SHALL display the university Logo image (`images/logo.png` or `obu_transparen_logos.png`) with a transparent background, replacing the current text-only logo markup.
2. WHEN the Logo image fails to load, THE Navbar SHALL fall back to displaying the text "Oda Bultum University" to preserve readability.
3. THE Logo image in the Navbar SHALL have a constrained height (between 40px and 56px) and preserve its aspect ratio.
4. THE Footer SHALL display the Logo image at an appropriate smaller size alongside the university name text.
5. WHERE the viewport is a mobile breakpoint (below `lg`), THE Navbar SHALL display the Logo image at a height of 40px.
6. WHERE the viewport is a desktop breakpoint (`lg` and above), THE Navbar SHALL display the Logo image at a height of 48px.
7. THE Logo image element SHALL include a descriptive `alt` attribute of "Oda Bultum University logo" for accessibility.

---

### Requirement 2: Auto-Playing Image Carousel on Homepage

**User Story:** As a site visitor, I want to see an animated image carousel on the homepage hero section, so that I get an engaging visual overview of campus life.

#### Acceptance Criteria

1. THE Carousel SHALL replace the static single-image hero on the homepage with a multi-image slideshow.
2. THE Carousel SHALL include images sourced from `src/assets/` (campus-hero.jpg, graduation.jpg, research-lab.jpg, students-library.jpg) and relevant images from the `images/` folder.
3. THE Carousel SHALL auto-play, advancing to the next slide every 5 seconds without user interaction.
4. WHEN the Carousel reaches the last slide, THE Carousel SHALL loop back to the first slide seamlessly.
5. THE Carousel SHALL display navigation dots or indicators showing the current slide index and total slide count.
6. THE Carousel SHALL support manual navigation via previous/next arrow buttons.
7. WHEN a user manually navigates, THE Carousel SHALL pause auto-play for 8 seconds before resuming.
8. THE Carousel SHALL use CSS transitions for smooth slide animations with a duration of 600ms or less.
9. THE Carousel SHALL display a text overlay (title, subtitle, and CTA buttons) on each slide matching the current hero content.
10. WHEN the Carousel component is rendered, THE Carousel SHALL be accessible with `aria-label="Campus image slideshow"` and each slide image SHALL have a descriptive `alt` attribute.

---

### Requirement 3: Image Carousels on Other Pages

**User Story:** As a site visitor, I want to see image galleries on the About, Research, and News pages, so that the site feels richer and more visually engaging.

#### Acceptance Criteria

1. THE About page SHALL include a Carousel component displaying campus and event images from the `images/` folder.
2. THE Research page SHALL include a Carousel component displaying research and lab images from `src/assets/` and `images/`.
3. WHEN the page Carousel is rendered on a non-homepage page, THE Carousel SHALL auto-play with a 6-second interval.
4. THE page-level Carousel SHALL support manual navigation arrows and loop infinitely.
5. THE Carousel component used across all pages SHALL be a single reusable `ImageCarousel` component accepting an `images` prop of type `{ src: string; alt: string }[]`.

---

### Requirement 4: Admin Authentication

**User Story:** As a university administrator, I want to log in to a protected admin area, so that only authorized personnel can manage site content.

#### Acceptance Criteria

1. THE Auth_Context SHALL expose `currentUser`, `login(username, password)`, and `logout()` to all Admin_Routes.
2. WHEN a user visits any Admin_Route while unauthenticated, THE Auth_Context SHALL redirect the user to `/admin/login`.
3. WHEN a user submits valid credentials on `/admin/login`, THE Auth_Context SHALL store the session in localStorage and redirect to `/admin`.
4. WHEN a user submits invalid credentials on `/admin/login`, THE Auth_Context SHALL display an error message "Invalid username or password" without clearing the username field.
5. WHEN a user logs out, THE Auth_Context SHALL clear the session from localStorage and redirect to `/admin/login`.
6. THE system SHALL seed a default admin account (username: `admin`, password: `obu2025admin`) in localStorage on first load if no admin account exists.
7. THE `/admin/login` page SHALL include accessible form labels, a username input, a password input, and a submit button.
8. WHILE a user is authenticated as Admin or Sub_Admin, THE Navbar SHALL display a subtle "Admin" link visible only to that session (optional enhancement; core requirement is the admin area is protected).

---

### Requirement 5: Admin Dashboard and Analytics

**User Story:** As an admin, I want to see a summary dashboard with site analytics and content statistics, so that I can understand how the site is being used.

#### Acceptance Criteria

1. THE Admin dashboard at `/admin` SHALL display total page view count, unique visitor count, total news posts count, and total media items count.
2. THE Admin dashboard SHALL render a line or bar chart showing page views over the last 7 days using the existing `recharts` library.
3. WHEN the dashboard loads, THE Admin dashboard SHALL read analytics data from localStorage, defaulting to seeded sample data if none exists.
4. THE Admin dashboard SHALL display the most recently published 3 news posts as a quick-glance list.
5. THE Admin dashboard SHALL display total number of registered admin users (admins, sub-admins, content creators).

---

### Requirement 6: Media / Image Management

**User Story:** As an admin, I want to upload, view, and delete images in a media library, so that I can manage all visual assets used on the site.

#### Acceptance Criteria

1. THE Media_Library page at `/admin/media` SHALL display all stored images in a responsive grid layout.
2. WHEN an admin uploads an image file (JPEG, PNG, WebP, or GIF), THE Media_Library SHALL convert it to a base64 data URL and persist it in localStorage under a media library key.
3. WHEN an image is uploaded, THE Media_Library SHALL display the image in the grid immediately without a page reload.
4. WHEN an admin clicks the delete button on an image, THE Media_Library SHALL display a confirmation prompt before removing the image from localStorage.
5. IF the total size of media stored in localStorage exceeds 4MB, THEN THE Media_Library SHALL warn the admin with a message "Storage is nearly full. Consider removing unused images."
6. THE Media_Library SHALL support uploading multiple images in a single file picker interaction.
7. WHEN an image is uploaded, THE Media_Library SHALL store metadata including: id, filename, uploadedAt timestamp, and uploader userId.
8. THE Media_Library SHALL display the filename and upload date beneath each image thumbnail.

---

### Requirement 7: News and Events Content Management

**User Story:** As an admin or content creator, I want to add, edit, and delete news and events posts, so that I can keep the site's content up to date.

#### Acceptance Criteria

1. THE News_Post management page at `/admin/news` SHALL list all News_Posts with their title, date, and category.
2. WHEN an admin or Content_Creator clicks "Add Post", THE system SHALL display a form with fields: title, excerpt, body (rich text or textarea), date, category (dropdown: News / Event / Announcement), and optional image selection from the Media_Library.
3. WHEN a News_Post form is submitted with valid data, THE system SHALL persist the new News_Post to localStorage and display it in the list immediately.
4. WHEN a News_Post form is submitted with an empty title or empty body, THE system SHALL display a validation error and prevent submission.
5. WHEN an admin or Content_Creator clicks "Edit" on a News_Post, THE system SHALL populate the form with the existing post data.
6. WHEN an admin clicks "Delete" on a News_Post, THE system SHALL display a confirmation prompt before removing the post from localStorage.
7. IF the authenticated user's role is Content_Creator, THEN THE system SHALL hide the "Delete" button for all posts.
8. THE public `/news` page SHALL read and display News_Posts from localStorage, falling back to the static sample posts if localStorage contains no posts.

---

### Requirement 8: User and Role Management

**User Story:** As an admin, I want to invite and manage sub-admins and content creators, so that I can delegate content responsibilities safely.

#### Acceptance Criteria

1. THE User management page at `/admin/users` SHALL list all registered admin users with their username, role, and created date.
2. WHEN an admin clicks "Invite User", THE system SHALL display a form with fields: username, temporary password, and role selector (Sub_Admin / Content_Creator).
3. WHEN the invite form is submitted with a unique username and valid password (minimum 8 characters), THE system SHALL persist the new user to localStorage and display them in the list.
4. WHEN the invite form is submitted with a duplicate username, THE system SHALL display the error "Username already exists" and prevent submission.
5. WHEN an admin clicks "Remove" on a non-admin user, THE system SHALL display a confirmation prompt before deleting the user from localStorage.
6. IF the authenticated user's role is Sub_Admin or Content_Creator, THEN THE system SHALL not render the `/admin/users` page and SHALL redirect to `/admin`.
7. THE User management page SHALL not allow removal of the last remaining Admin account.

---

### Requirement 9: Admin Navigation and Layout

**User Story:** As an admin, I want a consistent admin layout with sidebar navigation, so that I can move between admin sections efficiently.

#### Acceptance Criteria

1. THE Admin_Route layout SHALL render a persistent sidebar with links to: Dashboard (`/admin`), Media (`/admin/media`), News (`/admin/news`), and Users (`/admin/users`).
2. WHEN the authenticated user's role is Content_Creator or Sub_Admin, THE sidebar SHALL hide the Users link.
3. THE Admin_Route layout SHALL display the authenticated username and a Logout button in the sidebar header.
4. THE Admin_Route layout SHALL NOT render the public-facing Navbar or Footer components.
5. WHEN the viewport is mobile, THE Admin_Route layout SHALL collapse the sidebar into a hamburger-triggered drawer.
6. THE active sidebar link SHALL be visually distinguished using an accent color or active state class.
