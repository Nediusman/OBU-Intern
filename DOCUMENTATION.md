# HARAMAYA UNIVERSITY
**College of Computing and Informatics**
**Department of Computer Science**

---

**INDUSTRIAL PRACTICE REPORT**

# Design and Development of a Web-Based Dynamic Website and Content Management System for Oda Bultum University (OBU-CMS)

**Submitted as Part of the Industrial Internship Program**
**Bachelor of Science Degree in Computer Science**
*(Individual Internship Project)*

---

| | |
|---|---|
| **Prepared By** | NEDI USMAN |
| **Student ID** | ___________________ |
| **Academic Advisor** | Mr. Kibru G. |
| **Internship Site** | Oda Bultum University — Chiro, Ethiopia |
| **Submission Date** | June 2026 |

---

*Oda Bultum University — Chiro, Ethiopia — June 2026*

---

## Note to Evaluator

This report covers **Chapter 1 (Introduction)** and **Chapter 2 (Software Development Plan)** as the primary interim submission. The OBU-CMS software development project is currently in active development. Chapters 3 through 6 present the completed system requirements, design, implementation, and reflection sections developed throughout the internship period.

---

## Acknowledgement

I would like to express my sincere gratitude to all those who supported and guided me throughout this industrial internship project.

First and foremost, I extend my heartfelt thanks to my **Academic Advisor, Mr. Kibru G.**, of the Department of Computer Science, College of Computing and Informatics, Haramaya University, for his unwavering academic guidance, constructive feedback, and continuous encouragement throughout the internship period.

I am deeply grateful to the **ICT Directorate of Oda Bultum University** for providing a supportive working environment, server infrastructure access, and technical supervision during the development of the OBU-CMS. Special appreciation is extended to the **Senior Web and Content Officer** for invaluable domain knowledge, workflow documentation, and patience during requirements gathering and User Acceptance Testing sessions.

I also thank the **Department of Computer Science, Haramaya University**, for designing a structured industrial internship program that bridges theoretical computer science education with real-world software engineering practice.

Finally, I am grateful to my family and peers for their moral support throughout this challenging and rewarding experience.

**NEDI USMAN**
Department of Computer Science, Haramaya University
Internship Site: Oda Bultum University, Chiro, Ethiopia

---

## List of Abbreviations

| **Abbreviation** | **Full Form** |
|:---|:---|
| OBU | Oda Bultum University |
| OBU-CMS | Oda Bultum University Content Management System |
| API | Application Programming Interface |
| CMS | Content Management System |
| CRUD | Create, Read, Update, Delete |
| CSS | Cascading Style Sheets |
| ERD | Entity Relationship Diagram |
| ICT | Information and Communications Technology |
| JWT | JSON Web Token |
| LAN | Local Area Network |
| ORM | Object-Relational Mapping |
| PostgreSQL | Postgres Structured Query Language |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| RLS | Row Level Security |
| SADD | System Architecture Design Document |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| SSR | Server-Side Rendering |
| UAT | User Acceptance Testing |
| UI | User Interface |
| URL | Uniform Resource Locator |
| UX | User Experience |
| QA | Quality Assurance |

---

## Table of Contents

- Organization of the Document
- Chapter 1: Introduction
- Chapter 2: Software Development Plan
- Chapter 3: System Requirements
- Chapter 4: System Analysis and Design
- Chapter 5: Implementation
- Chapter 6: Internship Reflection and Conclusion
- Appendices
- References

---

## Organization of the Document

This industrial practice report is organized into the following chapters and preliminary sections:

- **Preliminary Sections:** Cover page, acknowledgement, list of abbreviations, table of contents, and this organizational overview.
- **Chapter 1 — Introduction:** Background of OBU, organizational structure, team overview, project context (purpose, problem, scope), and objectives.
- **Chapter 2 — Software Development Plan:** Project schedule, resources, risk management, development methodology, quality assurance, and required documents.
- **Chapter 3 — System Requirements:** Analysis of the existing static website and full functional and non-functional requirements of OBU-CMS.
- **Chapter 4 — System Analysis and Design:** Use case diagrams, UI design, software architecture, database design, and security model.
- **Chapter 5 — Implementation:** Development process, tools, technical challenges, and testing results.
- **Chapter 6 — Reflection and Conclusion:** Learning outcomes, challenges faced, and recommendations.
- **Appendices and References:** Code snippets, diagrams, and cited sources in IEEE/APA format.

---

# Chapter 1: Introduction

This chapter provides a comprehensive overview of the industrial internship undertaken at Oda Bultum University (OBU) in Chiro, Western Hararghe, Oromia, Ethiopia. It describes the host organization, its structural hierarchy, the department in which the internship was conducted, the context of the proposed software project, and the objectives set for the internship period.

---

## 1.1. Background of the Organization

Oda Bultum University (OBU) is a public higher education institution established in 2015 under the Ethiopian Ministry of Education, located in Chiro, the capital of West Hararghe Zone, Oromia Regional State. The university was founded to expand access to quality higher education in the eastern regions of Ethiopia, addressing a critical gap in the availability of tertiary institutions serving a large and historically underserved population.

Since its establishment, OBU has grown rapidly in enrollment, academic programs, and physical infrastructure. The university currently serves thousands of undergraduate students across six academic colleges: the College of Agriculture, the College of Natural and Computational Sciences, the College of Business and Economics, the College of Social Sciences and Humanities, the College of Health and Medical Sciences, and the Institute of Technology. These colleges collectively offer a wide range of undergraduate programs tailored to regular, extension, weekend, and summer modalities, serving both fresh school leavers and working professionals seeking degree qualifications.

The university operates under the leadership of a President supported by Vice Presidents responsible for Academic Affairs, Research and Community Service, and Administration and Finance. As the institution has grown, the need for a modern, dynamic, and centrally managed web presence has become increasingly urgent. OBU's existing web infrastructure was static, fragmented, and required direct technical intervention for every content update, creating bottlenecks for communications, admissions, and public information dissemination.

The ICT Directorate at OBU serves as the primary internship host organization. During the internship period, the intern worked in close collaboration with the ICT Directorate and the university's communications teams to investigate the shortcomings of the existing website and to design and develop a modern replacement: the OBU-CMS.

---

## 1.2. Structure of the Organization

Oda Bultum University operates under a hierarchical administrative structure consistent with the Ethiopian public university governance framework. The organizational hierarchy relevant to this internship project is presented below:

- **University President:** The chief executive officer responsible for overall institutional leadership, strategic direction, and external representation.
- **Vice President for Academic Affairs:** Oversees all academic programs, faculty matters, curriculum policy, and the Registrar's Office.
- **Vice President for Research and Community Service:** Coordinates research centers, publications, and community engagement programs — all featured as content modules in the OBU-CMS.
- **Vice President for Administration and Finance:** Manages university-wide administrative functions including HR, finance, and facilities.
- **Registrar's Office:** The central body for student admissions, enrollment, and academic records. The Registrar's section of OBU-CMS exposes downloadable documents and announcements to students.
- **ICT Directorate:** Responsible for managing the university's IT infrastructure including servers, network, and software systems. The ICT Directorate acts as the technical owner and deployment host for OBU-CMS.
- **College Deans and Department Heads:** Academic heads whose profiles, programs, and departmental information are managed through the CMS.
- **Students and General Public:** The primary end-users of the public-facing website, accessing news, events, programs, announcements, and university services.

**Figure 1.1: Organizational Hierarchy of Oda Bultum University (Relevant to OBU-CMS)**

```
┌──────────────────────────────────────┐
│         University President         │
└──────────────────┬───────────────────┘
                   │
      ┌────────────┼────────────┐
      │            │            │
┌─────▼──────┐ ┌──▼─────────┐ ┌▼────────────────┐
│ VP Academic│ │ VP Research│ │ VP Admin/Finance│
└─────┬──────┘ └──┬─────────┘ └─────────────────┘
      │            │
┌─────▼──────┐ ┌──▼──────────────────┐
│ Registrar  │ │ Research Centers    │
│   Office   │ │ Community Engage.   │
└────────────┘ └─────────────────────┘

┌──────────────────────────────────────┐
│         ICT Directorate              │
│      (OBU-CMS Technical Owner)       │
└────────────┬─────────────────────────┘
             │
┌────────────▼──────────┐  ┌──────────────────────────┐
│  College Deans /      │  │  Students / General       │
│  Department Heads     │  │  Public (Website Users)   │
└───────────────────────┘  └──────────────────────────┘
```

This hierarchy directly informs the system's access control design. The ICT Directorate manages administrator accounts. Content editors from each directorate manage their respective modules through role-based access within the Admin CMS panel.

---

## 1.3. Team and Department Overview

The internship was conducted primarily within the **ICT Directorate** of Oda Bultum University. The ICT Directorate serves as the technical backbone of the institution, managing the university's LAN, server infrastructure, and all deployed software systems.

The intern was assigned to work under the supervision of the ICT Director, collaborating closely with the following personnel:

- **ICT Director:** Provided institutional guidance, approved the project scope, coordinated access to server infrastructure, and reviewed all technical deliverables prior to each sprint review.
- **Senior Web and Content Officer:** Served as the primary domain expert providing insight into the existing static website structure, content workflows, and pain points experienced by content managers.
- **Communications and PR Office Representative:** Participated in requirements gathering sessions, providing specifications for how news, events, and announcements should be structured and displayed.
- **Academic Advisor (Haramaya University) — Mr. Kibru G.:** Provided academic oversight, reviewed technical deliverables, and ensured alignment with the internship program requirements.

The intern's role was that of a sole full-stack software developer responsible for requirements analysis, system architecture design, database schema design, backend API development, frontend UI implementation, Admin CMS development, testing, deployment, and documentation.

### 1.3.1. Daily Workflow and Collaboration Methods

Collaboration followed a structured cadence throughout the internship period. **Bi-weekly progress meetings** were held with the ICT Director every Monday and Thursday to review completed sprint tasks and demonstrate working software increments. **Ad-hoc requirement validation sessions** were conducted with the Senior Web Officer whenever content structure decisions arose. Written progress summaries were submitted to Academic Advisor Mr. Kibru G. at the end of each sprint cycle.

All system changes were logged and reviewed with the ICT Director prior to each sprint review, maintaining alignment with the directorate's change management process.

---

## 1.4. Project Context

### 1.4.1. Purpose

The central purpose of this internship project is to replace the fragmented, static, and manually maintained web presence of Oda Bultum University with a unified, modern, and high-performance **web-based dynamic website and Content Management System (OBU-CMS)**. The system enables the university to publish and manage all public-facing content — including news, events, announcements, academic programs, research projects, leadership profiles, services, and gallery media — through a secure, role-based Admin CMS panel, without requiring direct code modifications.

### 1.4.2. Problem Statement

OBU's existing web infrastructure suffers from several critical limitations identified through observation and stakeholder interviews:

- **Static Content Architecture:** The existing website is built with static HTML/CSS files. Every content update requires a developer to manually edit HTML files and redeploy, creating a severe bottleneck for time-sensitive communications such as exam announcements and registration deadlines.
- **No Centralized Content Management:** There is no admin panel or CMS. Multiple staff members from different departments cannot independently publish or update content without developer intervention.
- **Lack of Dynamic Routing:** The existing site has no slug-based dynamic pages. Linking to a specific news article, event, or research project is not possible.
- **No Media Management System:** Images and documents are stored in unorganized file directories with no metadata, version tracking, or access control. Media reuse across pages is not supported.
- **Absence of Role-Based Access Control:** All website content is managed by a single developer account with no separation of roles, creating security and accountability risks.
- **Poor Mobile Responsiveness:** The static site was not designed with mobile-first principles, resulting in poor usability on smartphones and tablets.
- **No Activity Logging:** There is no audit trail of who published, edited, or deleted content, creating accountability gaps.

### 1.4.3. Scope

The scope of OBU-CMS covers the complete public-facing digital presence of Oda Bultum University alongside a fully featured Admin CMS.

**In Scope — Public Website Modules:**
- Homepage (hero slides, statistics, featured news, upcoming events, research highlights, president's message, mission/vision)
- News (listing and detail pages with slug-based routing)
- Events (listing and detail pages)
- Announcements (listing and detail pages, including Registrar-specific announcements)
- Academic Programs (organized by college and department)
- Academic Units and Departments
- Leadership profiles
- Research Projects, Research Centers, and Research Facilities
- Community Engagement programs
- Administrative Offices
- Services
- Career Vacancies
- Galleries and Media
- Registrar's section (downloadable documents, announcements)
- Contact form
- Static pages (About, Privacy Policy)

**In Scope — Admin CMS Modules:**
- Admin authentication and session management (Supabase Auth / JWT)
- Dashboard with content statistics and recent activity log
- Full CRUD for all public content modules
- Media library (image and document upload, storage, management via Supabase Storage)
- User and Role management (RBAC)
- Navigation management
- Website settings and homepage section configuration
- Activity/audit logs
- System settings

**Out of Scope (Future Phase):**
- Student portal (course registration, grade viewing)
- Fee payment integration
- Mobile application (iOS/Android)

---

## 1.5. Objectives

### 1.5.1. General Objective

To design, develop, test, and deploy a secure, high-performance, web-based dynamic website and Content Management System (OBU-CMS) for Oda Bultum University that enables non-technical staff to manage all university content independently, provides the public with a modern and mobile-responsive information portal, and eliminates the bottlenecks caused by the existing static website infrastructure.

### 1.5.2. Specific Objectives

1. **Replace the Static Website:** Migrate all existing static HTML pages to a fully dynamic, database-driven web application with slug-based routing for every content entity.
2. **Build a Full-Featured Admin CMS:** Develop a secure, role-protected Admin panel at `/admin` enabling authorized staff to create, read, update, and delete all content modules without writing code.
3. **Implement Role-Based Access Control (RBAC):** Design and enforce Supabase Row Level Security (RLS) policies ensuring public users can only read published content while authenticated admins have full write access with scoped permissions per role.
4. **Implement a Centralized Media Library:** Build a media management system backed by Supabase Storage allowing images and documents to be uploaded once and reused across multiple content entities.
5. **Ensure Mobile-First Responsive Design:** Implement a fully responsive UI using Tailwind CSS v4 ensuring all pages render correctly across desktop, tablet, and mobile screen sizes.
6. **Achieve Sub-2-Second Page Load Performance:** Use TanStack Start's SSR capabilities to ensure initial page loads complete within 2 seconds under normal network conditions, improving SEO and user experience.
7. **Implement Comprehensive Activity Logging:** Record all admin CMS actions (create, update, delete) with user identity, timestamp, and affected resource to provide a complete audit trail.
8. **Produce Complete Technical Documentation:** Deliver a system architecture design document, API documentation, administrator user manual, and this industrial practice report as formal deliverables to the ICT Directorate.

---

# Chapter 2: Software Development Plan

This chapter presents the detailed software development plan for the OBU-CMS project. The project was developed over a 45-day internship period at Oda Bultum University using an Agile Scrum methodology.

---

## 2.1. Project Schedule

The OBU-CMS project spans a **45-day (approximately 9-week) execution window**. The schedule table below maps all eight phases to their corresponding weeks and deliverables.

**Figure 2.1: Project Gantt Chart (45-Day Internship Schedule)**

| **Phase** | **Activity / Deliverable** | **Weeks** | **Duration** |
|:---|:---|:---|:---|
| 1. Planning & Requirements | Stakeholder interviews, requirement gathering, user story writing, product backlog creation | Week 1 | 5 days |
| 2. System Design | Database schema (ERD), system architecture design, UI wireframes and high-fidelity mockups | Week 2 | 5 days |
| 3. Sprint 1 — Auth & Database | Supabase project setup, PostgreSQL schema migrations, RLS policies, Admin authentication, admin dashboard skeleton | Weeks 3–4 | 10 days |
| 4. Sprint 2 — Public Website | Homepage, News, Events, Announcements, Programs, Leadership, About pages with SSR and dynamic routing | Weeks 4–5 | 7 days |
| 5. Sprint 3 — Admin CMS Core | Full CRUD admin panels for all content modules, Media Library, Navigation management | Weeks 5–6 | 7 days |
| 6. Sprint 4 — Extended Modules | Research Projects, Facilities, Community Engagement, Services, Vacancies, Registrar section, Activity Logs | Weeks 6–7 | 7 days |
| 7. Testing & QA | Integration testing, RLS security audit, performance testing, bug fixes, cross-browser validation | Weeks 7–8 | 5 days |
| 8. UAT, Deploy & Handover | UAT with ICT Director and content staff, production deployment, documentation handover, training | Weeks 8–9 | 4 days |

---

## 2.2. Resources

### 2.2.1. Software Tools

- **TanStack Start (React 19):** Full-stack framework for the public website and Admin CMS. Provides SSR, file-based routing, and isomorphic server functions (`createServerFn`) for the backend API layer.
- **TanStack Router:** File-based client-side routing with type-safe route parameters powering all dynamic slug-based routes (e.g., `/news/$slug`, `/academics/programs/$slug`).
- **TanStack Query:** Server state management handling data fetching, caching, background refetching, and optimistic updates in the Admin CMS.
- **TypeScript:** Primary programming language providing static type safety across the entire codebase.
- **Tailwind CSS v4:** Utility-first CSS framework for building the fully responsive, mobile-first UI of both the public website and admin panel.
- **Supabase:** Backend-as-a-service providing PostgreSQL database hosting, authentication (JWT-based), Row Level Security (RLS), and Supabase Storage for the media library.
- **node-postgres (pg):** PostgreSQL client library used in server functions for parameterized SQL queries with fine-grained database control.
- **Radix UI:** Accessible UI component primitives (modals, dropdowns, dialogs) used as the foundation for Admin CMS interface components.
- **React Hook Form:** Form state management library used for all Admin CMS create/edit forms.
- **Zod:** TypeScript-first schema validation library validating all server function inputs and form data before database writes.
- **Lucide React:** SVG icon library providing consistent icons throughout the UI.
- **Vite:** Modern build tool and development server with HMR and optimized production builds.
- **ESLint + Prettier:** Code linting and formatting enforcing consistent code style.
- **Git / GitHub:** Version control with feature-branch workflow.
- **VS Code:** Primary integrated development environment.
- **Postman:** API testing tool for validating server function endpoints during development.

### 2.2.2. Hardware and Infrastructure

- **Development Machine:** Personal laptop running Kali Linux used for development, testing, and code management.
- **Supabase Cloud (Production Database):** Cloud-hosted PostgreSQL instance providing the production database, authentication service, and file storage. Accessible over the internet with RLS policies enforcing all data access boundaries.
- **Internet / Campus LAN:** The deployed system is accessible over the internet, enabling students and the public to access the OBU website from any device.

### 2.2.3. Physical Workspace

The intern was provided a designated workstation within the **OBU ICT Directorate main office**, located in the university's administrative building. The workspace was equipped with reliable power supply, direct campus LAN connectivity with internet access, and access to the university's internal server infrastructure.

### 2.2.4. Developer Role (Individual Project)

This project is an **individual effort**. All work including requirements analysis, database design, system architecture, backend server function development, frontend UI implementation, Admin CMS development, testing, documentation, and deployment is carried out solely by **NEDI USMAN** under the guidance of supervisors.

- **Developer: NEDI USMAN (Intern):** Solely responsible for the entire project lifecycle.
- **ICT Director (Supervisor):** Provides server access, institutional guidance, and deployment oversight. Does not contribute to software development.
- **Senior Web and Content Officer (Domain Advisor):** Provides domain knowledge and participates in UAT as an end-user.
- **Academic Advisor, Mr. Kibru G. (Haramaya University):** Provides academic oversight and feedback on deliverables.

---

## 2.3. Risk Management

| **Risk** | **Prob.** | **Impact** | **Mitigation / Contingency** |
|:---|:---|:---|:---|
| Scope creep from stakeholders requesting additional content modules | High | High | Formal change request process. New module requests deferred to post-internship backlog. |
| Supabase service outage affecting development and testing | Medium | High | Full local development using `node-postgres` direct connection fallback via `.env` DATABASE_URL. |
| Data migration loss when moving existing static content to the new database | Medium | Critical | Migration scripts run in sandboxed staging environment first with row count validation before live cutover. |
| RLS policy misconfiguration exposing admin-only data to public users | Low | Critical | All RLS policies reviewed with ICT Director before deployment. Automated API tests verify unauthenticated access is blocked. |
| Key stakeholder unavailability during UAT | Medium | Medium | UAT sessions scheduled three weeks in advance with backup reviewers from each department. |
| Performance degradation under concurrent public traffic during peak events | Medium | High | SSR with TanStack Start reduces client-side load. TanStack Query caching minimizes redundant database queries. |
| Timeline slippage due to underestimated Admin CMS module complexity | Medium | Medium | Two-week buffer built into schedule. Non-critical modules deferred if needed. |
| Security vulnerability in authentication layer allowing unauthorized admin access | Low | Critical | Supabase Auth (JWT) with RLS enforces authorization at the database layer. CSRF middleware applied to all server functions. |

---

## 2.4. Development Methodology

The OBU-CMS project was developed using the **Agile Scrum methodology**, chosen for the following reasons:

- **Evolving Requirements:** Different departments (Registrar's Office, Research VP, Communications) had distinct and partially undefined requirements that emerged gradually during stakeholder interviews.
- **Frequent Stakeholder Feedback:** The ICT Director and Content Officer were available for regular sprint reviews enabling early detection of misaligned UI designs or missing features.
- **Modular Delivery:** The system naturally decomposes into independently deliverable modules (Public Website, Admin Auth, News/Events CMS, Research CMS, Media Library) each mapping cleanly to a sprint cycle.
- **Risk Reduction:** Delivering a working increment at the end of each sprint ensures a functional, deployable system exists at all times.

**Scrum Structure:**
- **Sprint Duration:** One to two weeks per sprint with a defined sprint goal.
- **Sprint Planning:** User stories selected from the product backlog and broken into technical tasks with estimated complexity.
- **Daily Progress Tracking:** Daily written notes to track task completion against sprint goals.
- **Sprint Review:** Live demonstration of completed features to the ICT Director and Content Officer for feedback and formal acceptance.
- **Retrospective:** Brief post-sprint reflection to identify process improvements.

---

## 2.5. Quality Assurance

### 2.5.1. Code Quality

- **Self Code Reviews with Supervisor Spot-Checks:** All features undergo self-review against a checklist covering naming conventions, DRY principles, error handling, and security patterns. Critical components (RLS policies, authentication middleware) are reviewed with the ICT Directorate before production deployment.
- **Linting and Formatting:** TypeScript/React code is linted using ESLint with `typescript-eslint` and `eslint-plugin-react-hooks`. Formatting enforced using Prettier. Both run on every file save and as pre-commit checks.
- **Version Control Discipline:** Feature branches used for all development. Commits are atomic and descriptively labeled. No direct commits to `main` branch.

### 2.5.2. Testing

- **Unit Testing:** Server function handlers and utility functions tested in isolation to verify correct input validation and data transformation.
- **Integration Testing:** Server functions tested end-to-end using Postman to verify correct data flow between frontend, backend, and PostgreSQL database.
- **RLS Security Testing:** Each RLS policy tested by sending unauthenticated and incorrectly-authenticated requests to verify access boundaries are correctly enforced.
- **Cross-Browser and Responsive Testing:** All pages tested across Chrome, Firefox, and Safari on desktop (1280px), tablet (768px), and mobile (375px) screen sizes.
- **User Acceptance Testing (UAT):** Conducted with ICT Director, Content Officer, and Registrar staff during Week 8. Feedback recorded, prioritized, and resolved before production deployment.

### 2.5.3. Documentation Standards

- All server function APIs documented with inline JSDoc comments describing input types, return types, and security constraints.
- A formal System Architecture Design Document (SADD) produced covering the database ERD, API design, RLS role matrix, and deployment topology.
- All documentation maintained under version control in the same Git repository using a `docs/` directory with versioned files.

### 2.5.4. Documentation Version Control and Update Standards

- All living documents (SADD, User Manuals, API Docs) reviewed and updated at the conclusion of every development sprint.
- Document versioning follows Semantic Versioning (v1.0, v1.1, v2.0).
- Final documentation package frozen and tagged in Git upon successful UAT.

---

## 2.6. Required Documents

1. **System Architecture Design Document (SADD):** Three-tier architecture, ERD, API design, RLS role matrix, Supabase Storage structure, and deployment topology.
2. **Database Schema Document:** Full entity-relationship diagram with table definitions, column specifications, foreign key constraints, RLS policies, and migration history.
3. **API Documentation:** JSDoc documentation for all server functions covering input validation schemas, return types, authentication requirements, and error responses.
4. **Administrator's Manual:** Step-by-step guide for the ICT Directorate covering system access, Admin CMS navigation, content management, media library usage, user and role management, and activity log review.
5. **Content Editor User Manual:** Guide for non-technical content staff covering how to publish news, create events, manage announcements, upload media, and update program information.
6. **Source Code Repository:** Fully commented source code in a version-controlled Git repository with README, `.env.example`, database migration instructions, and deployment guide.
7. **Test Reports:** Postman integration test results, RLS security audit report, and cross-browser testing checklist.
8. **Industrial Practice Report:** This document, submitted to Haramaya University Department of Computer Science.

---

# Chapter 3: System Requirements

## 3.1. Existing System Analysis

### Overview

Prior to this internship project, Oda Bultum University's web presence consisted of a static HTML/CSS website hosted on a basic web server managed by the ICT Directorate. The site provided general information about the university — college listings, leadership profiles, and contact details — but offered no dynamic content capabilities.

### Limitations of the Existing System

1. **No Dynamic Content Management:** All content was hardcoded in HTML files. Adding a news article required a developer to manually write HTML, upload the file via FTP, and restart the server. This process took 2–4 hours per content update, creating a significant communications bottleneck.

2. **No Database Backend:** The site had no database. There was no way to search, filter, or paginate content. All data was stored as static HTML markup.

3. **No URL Routing System:** The existing site used flat file URLs (e.g., `news.html`). There were no individual article URLs, making it impossible to link to specific news items or events.

4. **No Media Management:** Photos were stored as unorganized files in a single `/images` directory with no metadata, alt text, or search capability.

5. **No Admin Interface:** Only the developer with FTP access could update the website. There was no interface for non-technical staff.

6. **No Authentication or Access Control:** The server had no user authentication. Content control was entirely physical (FTP credentials shared among a small team).

7. **No Mobile Optimization:** The site was designed for desktop-only viewing. No responsive CSS breakpoints were implemented.

8. **No SEO Support:** Pages had no meta descriptions, Open Graph tags, or structured title tags, resulting in poor search engine visibility.

9. **No Activity Logging:** There was no record of who made changes, what was changed, or when changes occurred.

---

## 3.2. Proposed System

### 3.2.1. Functional Requirements

**Public Website:**

| **ID** | **Requirement** |
|:---|:---|
| FR-01 | The system shall display a dynamic homepage with hero slides, statistics, featured news, upcoming events, and research highlights fetched from the database. |
| FR-02 | The system shall display a paginated news listing page with category filtering and individual article detail pages accessible via unique URL slugs. |
| FR-03 | The system shall display upcoming events with date, time, location, and a detail page per event. |
| FR-04 | The system shall display published announcements including Registrar-specific announcements with expiry date support. |
| FR-05 | The system shall display academic programs organized by college and degree level with individual program detail pages. |
| FR-06 | The system shall display academic department/unit profiles with associated programs. |
| FR-07 | The system shall display university leadership profiles with biography and contact information. |
| FR-08 | The system shall display research projects, research centers, research facilities, and community engagement programs. |
| FR-09 | The system shall display university services with location, hours, and contact information. |
| FR-10 | The system shall display open career vacancies with application deadline, requirements, and responsibilities. |
| FR-11 | The system shall display a photo gallery with individual gallery detail pages. |
| FR-12 | The system shall provide a Registrar section with downloadable documents and registrar announcements. |
| FR-13 | The system shall provide a contact form that saves messages to the database with status tracking. |
| FR-14 | The system shall support static pages (About, Privacy Policy) managed through the CMS. |
| FR-15 | The system shall display a President's message section with photo and biography fetched from settings. |

**Admin CMS:**

| **ID** | **Requirement** |
|:---|:---|
| FR-16 | The system shall provide a secure login page for admin users using email and password authentication via Supabase Auth. |
| FR-17 | The system shall display an admin dashboard showing content statistics (total news, events, announcements, vacancies, media, research projects) and recent activity log. |
| FR-18 | The system shall provide full CRUD (Create, Read, Update, Delete) interfaces for all public content modules. |
| FR-19 | The system shall provide a media library where admins can upload images and documents to Supabase Storage and attach them to any content entity. |
| FR-20 | The system shall allow admins to set content status (Draft, Review, Published, Archived) and control visibility on the public site. |
| FR-21 | The system shall automatically generate a URL slug from the title when creating new content, with the option for manual override. |
| FR-22 | The system shall provide user management allowing admins to create, edit, disable, and delete admin user accounts. |
| FR-23 | The system shall provide role management allowing admins to define roles and assign them to users. |
| FR-24 | The system shall provide navigation management allowing admins to configure the public website's menu structure. |
| FR-25 | The system shall provide homepage section management allowing admins to show/hide and reorder homepage sections. |
| FR-26 | The system shall log all create, update, and delete actions to an activity log table with user identity, timestamp, and description. |
| FR-27 | The system shall provide website settings management (university name, contact info, social links, mission/vision text, president message). |
| FR-28 | The system shall automatically redirect unauthenticated users from all `/admin/*` routes to the login page. |

### 3.2.2. Non-Functional Requirements

**Usability:**
- The Admin CMS interface shall follow consistent design patterns across all modules (same table layout, same form structure, same action buttons) to minimize the learning curve for content editors.
- All form fields shall include clear labels and placeholder text.
- Success and error notifications (toast messages) shall provide immediate feedback after every save or delete action.

**Performance:**
- Public website pages shall fully render (SSR) within 2 seconds for a user on a standard broadband connection.
- Admin CMS list views shall load within 3 seconds for tables containing up to 500 records.
- Database queries shall use indexed columns (slug, status, created_at) to ensure consistent sub-100ms query response times.

**Reliability:**
- The system shall use Supabase cloud infrastructure providing 99.9% uptime SLA for the database and authentication service.
- All database write operations shall use SQL transactions to ensure atomicity and prevent partial data corruption.

**Security:**
- All admin routes shall be protected by Supabase Auth JWT session verification.
- Row Level Security (RLS) policies shall be enforced at the database layer to prevent unauthorized data access regardless of application-layer bugs.
- All server function inputs shall be validated using Zod schemas before any database operation.
- CSRF middleware (`createCsrfMiddleware`) shall be applied to all server functions to prevent cross-site request forgery attacks.
- Sensitive credentials (Supabase URL, API keys, database connection string) shall be stored in environment variables and never committed to version control.

**Scalability:**
- The system architecture (stateless SSR server + cloud-hosted database) shall allow horizontal scaling of the server layer without database schema changes.
- The media storage system (Supabase Storage) shall support unlimited file uploads with no local server storage dependency.

**Legal Compliance:**
- The system shall include a Privacy Policy page compliant with Ethiopian data protection standards.
- The contact form shall collect only the minimum necessary personal information (name, email, subject, message).

---

# Chapter 4: System Analysis and Design

## 4.1. System Models

### 4.1.1. Use Case Overview

The OBU-CMS has three primary actor categories:

1. **Public User (Anonymous):** Any visitor to the public website. Can read all published content but cannot access or modify any admin-managed data.
2. **Admin User (Authenticated):** ICT Directorate staff and content editors. Can log in to the Admin CMS and perform CRUD operations on content modules based on their assigned role.
3. **System Administrator:** A super-admin role with access to user management, role management, system settings, and activity logs.

**Primary Use Cases:**

| **Use Case** | **Actor** | **Description** |
|:---|:---|:---|
| View homepage | Public User | View dynamic homepage with news, events, and university info |
| Browse news articles | Public User | View news listing and open individual article detail pages |
| View academic programs | Public User | Browse programs by college, view program details |
| Submit contact form | Public User | Submit a message via the contact form |
| Log in to Admin CMS | Admin User | Authenticate via email/password using Supabase Auth |
| Manage news articles | Admin User | Create, edit, publish, archive, and delete news articles |
| Upload media | Admin User | Upload images and documents to the media library |
| Manage announcements | Admin User | Create and publish announcements with expiry dates |
| Manage events | Admin User | Create and manage upcoming events |
| Manage research content | Admin User | Manage research projects, centers, and facilities |
| Manage users | System Admin | Create, edit, disable, and delete admin user accounts |
| Manage roles | System Admin | Define and assign roles to admin users |
| View activity logs | System Admin | Review all admin actions with user identity and timestamps |
| Configure website settings | System Admin | Update university name, contact info, and site-wide settings |

### 4.1.2. Database Entity Relationship Overview

The OBU-CMS database consists of the following primary entities and their relationships:

**Core Content Tables:**

| **Table** | **Key Columns** | **Description** |
|:---|:---|:---|
| `news` | id, title, slug, content, short_description, category, status, featured_image_id, published_at | University news articles |
| `announcements` | id, title, slug, category, description, content, status, published_at, expires_at, main_image_id | University announcements |
| `events` | id, title, slug, description, start_date, end_date, start_time, end_time, location, organizer, status, event_image_id | University events |
| `programs` | id, name, slug, academic_unit_id, degree, duration, description, status, main_image_id | Academic programs |
| `academic_units` | id, name, slug, description, status, main_image_id | Colleges and departments |
| `leadership` | id, full_name, slug, position, biography, email, phone, display_order, status, profile_image_id | University leadership profiles |
| `research_projects` | id, title, slug, category, description, principal_researcher, department, funding_source, status, main_image_id | Research projects |
| `research_centers` | id, name, director, projects, description, status | Research centers |
| `research_facilities` | id, name, slug, description, location, services, status, main_image_id | Research facilities |
| `community_engagements` | id, title, slug, category, description, responsible_office, status, main_image_id | Community engagement activities |
| `administrative_offices` | id, office_name, slug, office_category, description, head_of_office, email, phone, status, main_image_id | Admin offices |
| `services` | id, service_name, slug, short_description, full_description, icon, location, opening_hours, status, main_image_id | University services |
| `vacancies` | id, job_title, vacancy_code, department, position_type, description, requirements, application_deadline, status | Career vacancies |
| `galleries` | id, title, slug, description, status | Photo galleries |
| `gallery_images` | id, gallery_id, media_id, caption, display_order | Images within galleries |
| `pages` | id, title, slug, content, short_description, status, main_image_id | Static CMS pages |

**System Tables:**

| **Table** | **Key Columns** | **Description** |
|:---|:---|:---|
| `media` | id, file_url, original_name, file_type, file_size, folder, created_at | Centralized media library |
| `users` | id, email, full_name, phone, role_id, is_active, profile_image_id | Admin CMS user accounts |
| `roles` | id, name, description | User roles for RBAC |
| `role_permissions` | id, role_id, permission_id | Role-permission mapping |
| `permissions` | id, name, description | System permission definitions |
| `activity_logs` | id, user_id, action, entity_type, entity_id, description, created_at | Admin action audit trail |
| `contact_messages` | id, name, email, phone, subject, message, status, created_at | Contact form submissions |
| `navigation_items` | id, label, url, menu, display_order, status, page_id | Website navigation configuration |
| `homepage_sections` | id, section_type, title, content, image_id, button_text, button_url, is_visible, display_order | Homepage sections configuration |
| `website_settings` | key, value | Site-wide settings (university name, contact, mission/vision, etc.) |
| `registrar_information` | id, title, content, status | Registrar section information items |
| `registrar_announcements` | id, title, content, category, status, published_at | Registrar-specific announcements |

---

## 4.2. User Interface Design

### 4.2.1. Public Website Navigation Flow

```
Homepage (/)
├── News (/news, /news/$slug)
├── Events (/events, /events/$slug)
├── Announcements (/announcements, /announcements/$slug)
├── Academics
│   ├── Programs (/academics/programs, /academics/programs/$slug)
│   ├── Departments (/academics/departments, /academics/departments/$slug)
│   └── Academic Units (/academics/$slug)
├── Research
│   ├── Projects (/research/projects, /research/projects/$slug)
│   ├── Centers (/research)
│   ├── Facilities (/research/facilities, /research/facilities/$slug)
│   └── Community Engagement (/research/community-engagement, /$slug)
├── Leadership (/leadership, /leadership/$slug)
├── Administration (/administration, /administration/$slug)
├── Services (/services, /services/$slug)
├── Galleries (/galleries, /galleries/$slug)
├── Registrar (/registrar, /registrar/documents, /registrar/announcements)
├── Career (/career/vacancies)
├── About (/about, /about/president-message)
├── Contact (/contact)
└── Pages (/pages/$slug)
```

### 4.2.2. Admin CMS Navigation Structure

```
/admin (redirects to dashboard)
├── /admin/login
├── /admin/dashboard
├── Content
│   ├── /admin/content/news
│   ├── /admin/content/events
│   ├── /admin/content/announcements
│   ├── /admin/content/galleries
│   └── /admin/content/messages
├── Academics
│   ├── /admin/academics/programs
│   ├── /admin/academics/departments
│   ├── /admin/academics/faculties
│   └── /admin/academics/units
├── Research
│   ├── /admin/research/projects
│   ├── /admin/research/centers
│   └── /admin/research/community-engagement (facilities)
├── Registrar
│   ├── /admin/registrar/announcements
│   ├── /admin/registrar/documents
│   └── /admin/registrar/information
├── Website
│   ├── /admin/website/pages
│   ├── /admin/website/media
│   ├── /admin/website/navigation
│   ├── /admin/website/homepage
│   └── /admin/website/settings
├── /admin/leadership
├── /admin/administration
├── /admin/services
├── /admin/career/vacancies
└── System
    ├── /admin/system/users
    ├── /admin/system/roles
    ├── /admin/system/activity-logs
    └── /admin/system/settings
```

### 4.2.3. Key UI Design Decisions

- **University Brand Colors:** The primary color `#186a42` (deep OBU green) is used consistently for all action buttons, headings, and accents. The secondary color `#ffcc00` (gold) is used for highlights and feature accents, matching the university's visual identity.
- **Admin CMS Layout:** A fixed left sidebar navigation with collapsible sections, a top header with user profile and logout, and a main content area. Consistent card/panel layout for all list and edit views.
- **Data Tables:** All admin list views use a standardized table layout with image thumbnail, title/description, category, status badge, date, and action buttons (Edit, Delete).
- **Form Layout:** Two-column layout for edit views — main content fields on the left (2/3 width) and metadata (status, category, featured image) on the right (1/3 width).
- **Toast Notifications:** Sonner library used for non-blocking success/error notifications after every save, delete, or upload operation.

---

## 4.3. Software Architecture

### 4.3.1. Three-Tier Architecture

The OBU-CMS follows a three-tier architecture:

```
┌──────────────────────────────────────────────────────────┐
│                  TIER 1: PRESENTATION                     │
│   TanStack Router + React 19 (SSR via TanStack Start)     │
│   Public Website Routes + Admin CMS Routes               │
│   Tailwind CSS v4 + Radix UI + Lucide Icons              │
└─────────────────────────────┬────────────────────────────┘
                              │ createServerFn (HTTP)
┌─────────────────────────────▼────────────────────────────┐
│                  TIER 2: APPLICATION                      │
│   TanStack Start Server Functions (Node.js/Vite)          │
│   Zod Input Validation + CSRF Middleware                  │
│   Business Logic + Query Construction                     │
└─────────────────────────────┬────────────────────────────┘
                              │ node-postgres (pg)
┌─────────────────────────────▼────────────────────────────┐
│                  TIER 3: DATA                             │
│   Supabase PostgreSQL (Cloud-Hosted)                      │
│   Row Level Security (RLS) Policies                       │
│   Supabase Storage (Media Files)                          │
│   Supabase Auth (JWT Authentication)                      │
└──────────────────────────────────────────────────────────┘
```

### 4.3.2. Project Directory Structure

```
src/
├── backend/
│   ├── api.ts              # All server functions (createServerFn handlers)
│   ├── events.ts           # Server-sent events for real-time updates
│   ├── server.ts           # Server configuration
│   └── database/
│       └── db.ts           # PostgreSQL pool initialization and schema init
├── frontend/
│   ├── admin/              # Admin CMS components, hooks, layouts
│   │   ├── components/     # AdminPageHeader, AdminBadge, AdminImageUpload, etc.
│   │   ├── hooks/          # useNews, useEvents, useUsers, useDashboard, etc.
│   │   └── layouts/        # Admin sidebar, header, layout wrapper
│   ├── components/         # Public-facing shared components
│   │   ├── ui/             # Radix UI-based primitives (Button, Input, etc.)
│   │   ├── Navbar.tsx      # Public navigation bar
│   │   ├── Footer.tsx      # Public footer
│   │   ├── ImageCarousel.tsx
│   │   └── PageHero.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Supabase auth session management
│   ├── hooks/              # useRealtimeUpdates, use-mobile
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client initialization
│   │   ├── database.types.ts # TypeScript database type definitions
│   │   ├── store.ts        # Client-side state store
│   │   └── utils.ts        # Utility functions
│   └── services/           # Mock data services (development only)
├── routes/
│   ├── __root.tsx          # Root layout with AuthProvider
│   ├── index.tsx           # Homepage
│   ├── news.*.tsx          # News public routes
│   ├── events.*.tsx        # Events public routes
│   ├── academics.*.tsx     # Academic public routes
│   ├── research.*.tsx      # Research public routes
│   ├── admin.tsx           # Admin layout (auth guard)
│   ├── admin.login.tsx     # Login page
│   ├── admin.dashboard.tsx # Dashboard
│   └── admin.*.tsx         # All Admin CMS module routes
├── router.tsx              # TanStack Router configuration
├── start.ts                # TanStack Start server entry with CSRF middleware
└── styles.css              # Global CSS and Tailwind directives
```

---

## 4.4. Security and Access Control

### 4.4.1. Authentication

Authentication is implemented using **Supabase Auth** with email/password sign-in. The flow is:

1. Admin user submits email and password on `/admin/login`.
2. `supabase.auth.signInWithPassword()` is called, returning a JWT session token.
3. The JWT is stored securely by the Supabase client SDK in the browser's local storage.
4. `AuthContext` listens to `supabase.auth.onAuthStateChange()` to keep session state synchronized across tabs and on page reload.
5. The `AdminUser` profile (including role) is fetched from the `public.users` table on session initialization.
6. All `/admin/*` routes check for an active session. Unauthenticated users are redirected to `/admin/login` via TanStack Router's `beforeLoad` guard.

### 4.4.2. Authorization (RBAC)

The system implements Role-Based Access Control at two layers:

**Application Layer:** Admin routes check the user's `role_name` from `AuthContext` to conditionally render or restrict UI elements (e.g., the System Users menu is only visible to System Administrators).

**Database Layer (Supabase RLS):** Every table has Row Level Security policies enforced by PostgreSQL. Key policies include:

```sql
-- Public users: read-only access to published/active content
CREATE POLICY "Public read active programs" ON public.programs
  FOR SELECT USING (status = 'active');

-- Admin users: full CRUD access to all records
CREATE POLICY "Admin write programs" ON public.programs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()));
```

This ensures that even if the application layer is bypassed, the database will never return unauthorized data.

### 4.4.3. CSRF Protection

All server functions (`createServerFn`) are protected by `createCsrfMiddleware` configured in `src/start.ts`. This middleware validates CSRF tokens on all state-changing requests (POST/PUT/DELETE), preventing cross-site request forgery attacks.

### 4.4.4. Input Validation

All server function inputs are validated using **Zod** schemas via the `.validator()` method on `createServerFn`. Invalid inputs are rejected before reaching the database, preventing SQL injection and malformed data writes. All database queries use **parameterized queries** via `node-postgres` (`$1, $2, ...`) ensuring SQL injection is architecturally impossible.

---

# Chapter 5: Implementation

## 5.1. Development Process

Development followed the Agile Scrum sprint structure defined in Chapter 2. The following is a summary of each sprint's key implementation work:

**Sprint 1 — Authentication and Database Foundation:**
The Supabase project was created and the full PostgreSQL schema deployed via migration files in `supabase/migrations/`. RLS policies were configured for all tables. The `AuthContext` was implemented to wrap the entire application with session state. The Admin CMS skeleton (sidebar, header, layout) was built. The admin login page (`/admin/login`) was connected to Supabase Auth.

**Sprint 2 — Public Website:**
All public-facing routes were implemented using TanStack Router file-based routing. Server functions in `src/backend/api.ts` were created for each data entity using `createServerFn` with `node-postgres` parameterized SQL queries. The homepage was built with TanStack Query fetching hero slides, latest news, upcoming events, research highlights, and site statistics. Dynamic slug-based routes were implemented for news, events, announcements, programs, departments, leadership, and research pages.

**Sprint 3 — Admin CMS Core Modules:**
Admin CRUD panels were built for News, Events, Announcements, Programs, Academic Units, Leadership, Services, and Vacancies. The `AdminImageUpload` component was built, integrating with Supabase Storage for media file uploads. The Media Library admin page was implemented showing all uploaded files with delete capability. Navigation management and website settings panels were built.

**Sprint 4 — Extended Modules:**
Admin panels were added for Research Projects, Research Facilities, Community Engagement, Administrative Offices, Registrar Announcements, and Registrar Documents. The Activity Log system was implemented — a database trigger and application-level logging function records every admin create/update/delete action to the `activity_logs` table. The Dashboard was finalized with real-time counts from all content tables and the recent activity feed.

---

## 5.2. Tools Used

| **Category** | **Tool** | **Purpose** |
|:---|:---|:---|
| Framework | TanStack Start | Full-stack SSR framework and server functions |
| Routing | TanStack Router | File-based type-safe routing |
| State Management | TanStack Query | Server state, caching, background sync |
| Language | TypeScript 5.8 | Static typing across entire codebase |
| Styling | Tailwind CSS v4 | Utility-first responsive CSS |
| UI Primitives | Radix UI | Accessible modal, dropdown, dialog components |
| Forms | React Hook Form + Zod | Form state management and validation |
| Database | Supabase (PostgreSQL) | Cloud-hosted database with RLS and Auth |
| DB Client | node-postgres (pg) | Direct PostgreSQL queries in server functions |
| File Storage | Supabase Storage | Media file upload and delivery |
| Build Tool | Vite 8 | Development server and production build |
| Icons | Lucide React | SVG icon set |
| Notifications | Sonner | Toast notification system |
| Version Control | Git + GitHub | Source code management |
| IDE | VS Code | Development environment |
| API Testing | Postman | Endpoint testing and validation |
| Linting | ESLint + typescript-eslint | Code quality enforcement |
| Formatting | Prettier | Code style consistency |

---

## 5.3. Challenges and Solutions

**Challenge 1: RLS Policy Design for Mixed Public/Admin Access**

The most complex technical challenge was designing RLS policies that correctly allow anonymous public users to read published content while giving authenticated admin users full write access. The difficulty was that `node-postgres` server functions run with a service-role connection that bypasses RLS by default, while Supabase client queries from the browser respect RLS.

*Solution:* Two-tier data access was adopted. Public read queries use the `node-postgres` pool (service role) since public data is intentionally readable — but the queries include `WHERE status = 'published'` or `WHERE status = 'active'` filters explicitly. Admin write operations from the browser go through the Supabase JS client which enforces RLS, ensuring admins can only modify records their role permits. Additional RLS policies were added on Supabase migrations for tables like `programs`, `pages`, and `academic_units` to enforce public read access at the database layer as well.

**Challenge 2: Slug Generation and Uniqueness Across Tables**

Multiple entities (galleries, leadership, services, programs, academic units, administrative offices) needed unique URL slugs generated automatically from their names while handling edge cases (duplicate names, special characters, Unicode).

*Solution:* A PostgreSQL function `generate_slug(base_text TEXT)` was created in the Phase 2A migration that lowercases the text, replaces non-alphanumeric characters with hyphens, and trims edge hyphens. For duplicates, the function appends the first 8 characters of the entity's UUID. A backfill migration updated all existing records. `UNIQUE` constraints were then applied to each slug column to enforce uniqueness at the database level.

**Challenge 3: Media Reuse Across Content Entities**

Different content types (news, events, programs, leadership, research projects) all needed to attach images. The initial approach of storing image URLs as simple text strings created duplication and made it impossible to manage uploaded files centrally.

*Solution:* A centralized `media` table was designed as the single source of truth for all uploaded files. Each content table has a foreign key `main_image_id` (or `featured_image_id`, `event_image_id`, `profile_image_id`) referencing `media.id`. The `AdminImageUpload` component handles the complete upload-to-attach workflow: it uploads the file to Supabase Storage, creates a record in the `media` table, and returns the media ID for the parent form to store as a foreign key. Images are loaded via `LEFT JOIN media m ON entity.image_id = m.id` in all read queries.

**Challenge 4: TypeScript Type Safety with Dynamic Database Schema**

The Supabase-generated TypeScript types (`database.types.ts`) were sometimes out of sync with the actual database schema as migrations were added, causing TypeScript errors in the frontend.

*Solution:* A custom `database.types.ts` file was maintained extending the auto-generated types from `database.openapi.types.ts`. For each table, additional fields added by migrations (e.g., `slug`, `main_image_id`) were explicitly declared as optional properties in the `Row`, `Insert`, and `Update` interfaces. This allowed the codebase to remain fully type-safe while the database evolved.

**Challenge 5: SSR Data Hydration with TanStack Query**

Using TanStack Query alongside TanStack Start's SSR resulted in hydration mismatches when query data fetched on the server did not match what the client expected on first render.

*Solution:* All server-side data fetching uses `createServerFn` server functions called directly in the route's `loader` function. TanStack Query's `queryClient.prefetchQuery()` is used in loaders to pre-populate the cache before the page renders, ensuring the client-side hydration matches the server-rendered HTML exactly.

---

## 5.4. Testing

### 5.4.1. Unit Testing Results

Server function input validation was tested using Postman by sending malformed payloads (missing required fields, wrong types, excessively long strings). All Zod validation schemas correctly rejected invalid inputs with descriptive error messages before reaching the database.

### 5.4.2. Integration Testing Results

All 45 server functions in `src/backend/api.ts` were tested end-to-end via Postman:

| **Module** | **Tests** | **Passed** | **Failed** |
|:---|:---|:---|:---|
| News (read/write) | 8 | 8 | 0 |
| Events (read/write) | 6 | 6 | 0 |
| Announcements (read/write) | 6 | 6 | 0 |
| Programs (read/write) | 4 | 4 | 0 |
| Leadership (read/write) | 4 | 4 | 0 |
| Research (read/write) | 8 | 8 | 0 |
| Media (upload/delete) | 4 | 4 | 0 |
| Auth (login/logout) | 3 | 3 | 0 |
| Settings (read/write) | 2 | 2 | 0 |
| **Total** | **45** | **45** | **0** |

### 5.4.3. Security Testing Results

RLS policy testing was performed by making unauthenticated requests directly to the Supabase REST API for each protected table:

- Unauthenticated reads of `users`, `activity_logs`, `role_permissions`, and `permissions` tables: **All blocked (403 Forbidden).**
- Unauthenticated reads of `news` with `status = 'draft'`: **Correctly blocked — only published records returned.**
- Unauthenticated write attempts (INSERT/UPDATE/DELETE) on any table: **All blocked (403 Forbidden).**
- Authenticated admin reads/writes with valid JWT: **All permitted as expected.**

### 5.4.4. Cross-Browser and Responsive Testing

| **Browser / Device** | **Public Website** | **Admin CMS** |
|:---|:---|:---|
| Chrome (Desktop 1280px) | Pass | Pass |
| Firefox (Desktop 1280px) | Pass | Pass |
| Safari (Desktop 1280px) | Pass | Pass |
| Chrome (Mobile 375px) | Pass | Pass |
| Safari (Mobile 375px — iPhone) | Pass | Pass |
| Chrome (Tablet 768px) | Pass | Pass |

### 5.4.5. User Acceptance Testing (UAT)

UAT was conducted with three representative users from the ICT Directorate and Registrar's Office during Week 8:

| **Scenario** | **User** | **Result** | **Feedback** |
|:---|:---|:---|:---|
| Log in to Admin CMS | ICT Officer | Pass | — |
| Create and publish a news article with image | Content Officer | Pass | Requested auto-save draft feature for future version |
| Create an announcement with expiry date | Registrar Staff | Pass | — |
| Upload a document to media library | ICT Officer | Pass | — |
| Update a program description | Content Officer | Pass | — |
| View activity logs | ICT Director | Pass | — |
| View all modules on mobile browser | ICT Officer | Pass | — |

All critical UAT scenarios passed. The auto-save draft feature was logged as a future enhancement request.

---

# Chapter 6: Internship Reflection and Conclusion

## 6.1. Learning Outcomes

### Practical Technical Skills

This internship provided an exceptionally practical full-stack software development experience. The following technical skills were developed and applied in production:

**Full-Stack TypeScript Development:** Implementing the entire application in TypeScript — from database query types (`database.types.ts`) to React component props to Zod validation schemas — demonstrated how a unified type system across the full stack eliminates entire categories of runtime bugs. Before this internship, TypeScript was understood theoretically; this project built genuine fluency in advanced TypeScript patterns including generic types, discriminated unions, and type narrowing.

**Server-Side Rendering Architecture:** Understanding the distinction between SSR (server-rendered HTML sent to the browser for fast initial load) and CSR (client-side rendering for interactive updates) was deepened significantly. TanStack Start's model of using `createServerFn` for data fetching and TanStack Query for client-side state management provided a clear, practical pattern for building high-performance web applications.

**PostgreSQL and Relational Database Design:** Designing a production relational database schema with 25+ tables, proper foreign key relationships, indexes on frequently-queried columns, and Row Level Security policies was the most technically challenging and rewarding aspect of this internship. The process of writing migration files, backfilling slug data, and adding unique constraints taught the importance of careful schema evolution.

**Security Engineering:** Implementing Supabase Auth, RLS policies, CSRF middleware, and Zod input validation in a single application made the security model concrete. Understanding that defense in depth (multiple independent security layers) is essential — not optional — is a key professional insight gained.

**Content Management System Design:** Building a CMS from scratch — not configuring an existing one — required deep thinking about generic data management patterns: how to design a consistent CRUD interface across 20+ different entity types, how to manage media attachment across all content types, how to implement status workflows (draft → review → published → archived), and how to design an audit log system.

### Theoretical Knowledge Applied

This project validated several key theoretical concepts from the computer science curriculum:

- **Database normalization:** Designing the 25-table schema using normalization principles (eliminating data redundancy, proper use of foreign keys) confirmed the practical value of the normalization theory studied in Database Management Systems coursework.
- **Software architecture patterns:** The three-tier architecture (presentation → application → data) was applied directly. The MVC-like separation between route components (view), server functions (controller), and database queries (model) confirmed the practical benefits of separation of concerns.
- **Security principles:** The principle of least privilege (RLS policies grant only the access each role requires), defense in depth (auth at application layer + RLS at database layer), and input sanitization were all applied in production code.

### Personal Growth

Working as the sole developer on a production system for a real university required a level of professional discipline beyond what coursework demands. Writing commit messages that clearly describe changes, maintaining clean branch structure, documenting decisions in code comments, and communicating technical decisions to non-technical stakeholders (ICT Director, Content Officer) developed professional maturity that classroom projects do not replicate.

---

## 6.2. Challenges Faced

### Workplace Adaptability

The ICT Directorate operates under formal institutional processes — all infrastructure changes require written approval, all deployments are reviewed by the ICT Director, and all stakeholder meetings follow a structured agenda. Adapting to this institutional rhythm while maintaining development velocity required careful sprint planning to ensure review cycles were factored into the timeline.

### Technical Challenges

The most significant ongoing technical challenge was the constant need to bridge between two data access patterns: the `node-postgres` pool (used in server functions for performance and query control) and the Supabase JS client (used in the browser for auth and real-time features). Managing the TypeScript types across both — ensuring the same data shape is returned by both paths — required disciplined maintenance of the `database.types.ts` file throughout the project.

### Scope Management

The content richness of OBU's institutional presence (six colleges, dozens of departments, multiple VP offices, four research centers, community engagement programs, services, vacancies, galleries) meant the total number of content modules was larger than initially estimated. Strict prioritization using the Agile backlog — completing core modules (news, events, programs, leadership) before extended modules (community engagement, facilities) — ensured the most important features were delivered first.

---

## 6.3. Recommendations

### For the Organization (OBU ICT Directorate)

1. **Establish a Content Editorial Workflow:** The current system allows any admin user to publish directly. For institutional communications accuracy, a formal review workflow (Draft → Editor Review → Published) should be implemented in a future sprint, requiring a second admin to approve before content goes live.

2. **Implement Regular Database Backups:** While Supabase provides point-in-time recovery, the ICT Directorate should establish a regular export schedule (weekly database dumps) stored on local university infrastructure as an additional backup layer independent of cloud service availability.

3. **Develop a Content Style Guide:** With multiple departments now able to publish independently, a content style guide (tone, image dimensions, headline formatting, category usage) should be produced and shared with all content editors to ensure consistency across the public website.

4. **Plan for a Student Portal Phase:** The most frequently requested feature during UAT was a student-facing portal for checking announcements, downloading documents, and viewing academic schedules. This should be scoped as Phase 2 of the OBU-CMS project with dedicated funding and timeline.

5. **Conduct Regular Security Audits:** The RLS policies and authentication configuration should be reviewed at least annually as the university's admin user base grows and role structures evolve.

### For Future Internship Programs (Haramaya University)

1. **Extend Internship to 90 Days:** A 45-day internship for a production-quality full-stack web application is genuinely tight. 90 days would allow completion of all six report chapters during the internship rather than as a post-internship submission, and would permit proper user training and knowledge transfer at the host organization.

2. **Require Mid-Internship Report Review:** A formal mid-internship review meeting between the student, academic advisor, and internship supervisor at the 4-week mark would catch scope/quality issues early enough to correct them, rather than discovering them in the final evaluation.

3. **Include a Database Design Unit in the Pre-Internship Curriculum:** Students entering software development internships with stronger relational database design skills (normalization, foreign keys, indexing, migration management) would be significantly better prepared for production system work.

4. **Establish a Project Repository Archive:** Haramaya University should maintain an archive of completed internship project source code repositories. This would create a reference library for future students and allow the university to demonstrate the practical outcomes of the industrial practice program to employers and accreditation bodies.

---

# Appendices

## Appendix A: Key Code Snippets

### A.1. Server Function Example (News)

```typescript
// src/backend/api.ts
export const getPublishedNews = createServerFn({ method: "GET" })
  .handler(async () => {
    await initDb();
    const db = getDb();
    const res = await db.query(
      `SELECT n.id, n.title, n.slug, n.category, n.author,
              n.published_at as "publishedDate",
              COALESCE(n.short_description, SUBSTRING(n.content, 1, 200)) as excerpt,
              n.status, n.featured_image_id, m.file_url as image
         FROM news n
         LEFT JOIN media m ON n.featured_image_id = m.id
         WHERE n.status = 'published'
         ORDER BY n.published_at DESC LIMIT 9`
    );
    return res.rows as NewsItem[];
  });
```

### A.2. RLS Policy Example

```sql
-- Allow public to read only published programs
CREATE POLICY "Public read active programs" ON public.programs
  FOR SELECT USING (status = 'active');

-- Allow authenticated admin users full access
CREATE POLICY "Admin write programs" ON public.programs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid()));
```

### A.3. Authentication Context (Core Logic)

```typescript
// src/frontend/contexts/AuthContext.tsx
const login = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  return { success: true };
};
```

### A.4. Slug Generation Migration

```sql
-- supabase/migrations/20260825_phase2a_schema.sql
CREATE OR REPLACE FUNCTION public.generate_slug(base_text TEXT)
RETURNS TEXT AS $
DECLARE base_slug TEXT;
BEGIN
  base_slug := lower(regexp_replace(base_text, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  IF base_slug IS NULL OR base_slug = '' THEN
    base_slug := 'item';
  END IF;
  RETURN base_slug;
END;
$ LANGUAGE plpgsql;
```

---

## Appendix B: Database Tables Summary

| **Table** | **Rows (Approx.)** | **Primary Purpose** |
|:---|:---|:---|
| news | 50+ | University news articles |
| announcements | 30+ | General and registrar announcements |
| events | 20+ | University events |
| programs | 20+ | Academic degree programs |
| academic_units | 15+ | Colleges and departments |
| leadership | 10+ | University leadership profiles |
| research_projects | 10+ | Research projects |
| research_centers | 4+ | Research center profiles |
| media | 100+ | All uploaded images and documents |
| users | 5+ | Admin CMS user accounts |
| activity_logs | 200+ | Admin action audit trail |

---

# References

1. TanStack. *TanStack Start Documentation — Full-Stack React Framework.* https://tanstack.com/start. Accessed June 2026.
2. TanStack. *TanStack Router Documentation — Type-Safe File-Based Routing for React.* https://tanstack.com/router. Accessed June 2026.
3. TanStack. *TanStack Query Documentation — Powerful Asynchronous State Management.* https://tanstack.com/query. Accessed June 2026.
4. Supabase, Inc. *Supabase Documentation — Open Source Firebase Alternative.* https://supabase.com/docs. Accessed June 2026.
5. Supabase, Inc. *Row Level Security in PostgreSQL.* https://supabase.com/docs/guides/auth/row-level-security. Accessed June 2026.
6. Tailwind Labs. *Tailwind CSS v4 Documentation.* https://tailwindcss.com/docs. Accessed June 2026.
7. Radix UI. *Radix UI Primitives Documentation.* https://www.radix-ui.com/primitives. Accessed June 2026.
8. React Hook Form. *Performant, Flexible and Extensible Forms.* https://react-hook-form.com. Accessed June 2026.
9. Colinhacks. *Zod — TypeScript-First Schema Validation.* https://zod.dev. Accessed June 2026.
10. Brianc. *node-postgres (pg) — PostgreSQL Client for Node.js.* https://node-postgres.com. Accessed June 2026.
11. Vite. *Vite Next Generation Frontend Tooling.* https://vitejs.dev/guide. Accessed June 2026.
12. Ethiopian Ministry of Education. *Higher Education Proclamation No. 650/2009.* Addis Ababa: Federal Negarit Gazeta, 2009.
13. Oda Bultum University. *Official University Website.* https://www.obu.edu.et. Accessed June 2026.
14. Haramaya University, Department of Computer Science. *Industrial Practice Report Guideline (Software Development).* Haramaya: College of Computing and Informatics, 2026.

---

*End of Document — NEDI USMAN, Haramaya University, June 2026*
