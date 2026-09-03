/**
 * Mock data layer for the OBU Administration Portal.
 *
 * Every collection below mirrors the shape of a future database table, so the
 * UI can be switched to real API/database calls by replacing the functions in
 * `src/lib/store.ts` without touching any component.
 */

export type ContentStatus =
  "draft" | "pending" | "scheduled" | "published" | "archived" | "expired" | "active" | "inactive";

export type Row = Record<string, unknown> & { id: string };

export const ROLES = [
  "Super Admin",
  "Website Administrator",
  "Academic Editor",
  "Research Editor",
  "Registrar",
  "Content Editor",
] as const;
export type RoleName = (typeof ROLES)[number];

export const PERMISSION_MODULES = [
  "Dashboard",
  "Homepage",
  "Pages",
  "News",
  "Announcements",
  "Events",
  "Academics",
  "Administration",
  "Registrar",
  "Research",
  "Services",
  "Media",
  "Documents",
  "Users",
  "Settings",
] as const;

export const PERMISSION_LEVELS = ["view", "create", "edit", "delete", "publish"] as const;
export type PermissionLevel = (typeof PERMISSION_LEVELS)[number];

export type RolePermissions = Record<string, Record<PermissionLevel, boolean>>;

const all = (v: boolean): Record<PermissionLevel, boolean> => ({
  view: v,
  create: v,
  edit: v,
  delete: v,
  publish: v,
});

const perms = (full: readonly string[], readOnly: readonly string[] = []): RolePermissions =>
  Object.fromEntries(
    PERMISSION_MODULES.map((m) => [
      m,
      full.includes(m)
        ? all(true)
        : readOnly.includes(m)
          ? { view: true, create: false, edit: false, delete: false, publish: false }
          : all(false),
    ]),
  );

export const rolePermissions: Record<RoleName, RolePermissions> = {
  "Super Admin": perms(PERMISSION_MODULES),
  "Website Administrator": perms(
    PERMISSION_MODULES.filter((m) => m !== "Users" && m !== "Settings"),
    ["Users", "Settings"],
  ),
  "Academic Editor": perms(["Academics", "Pages"], ["Dashboard", "Media", "Documents", "News"]),
  "Research Editor": perms(["Research"], ["Dashboard", "Media", "Documents"]),
  Registrar: perms(["Registrar", "Documents"], ["Dashboard", "Academics", "Media"]),
  "Content Editor": perms(["News", "Announcements", "Events", "Media"], ["Dashboard", "Pages"]),
};

export const roleSummaries = ROLES.map((name, i) => ({
  id: `role-${i + 1}`,
  name,
  description: {
    "Super Admin": "Unrestricted access to every module, including users and system settings.",
    "Website Administrator": "Manages all public website content and publishing workflow.",
    "Academic Editor": "Maintains faculties, institutes, departments and academic programs.",
    "Research Editor": "Maintains research centers, projects, publications and researchers.",
    Registrar: "Manages admissions, registration information, important dates and documents.",
    "Content Editor": "Creates and edits news, announcements, events and media.",
  }[name],
  users: [2, 3, 4, 2, 3, 6][i]!,
}));

/* ------------------------------------------------------------------ users */

export const users: Row[] = [
  ["Dr. Getachew Bekele", "president@obu.edu.et", "Super Admin", "active", "Today, 08:12"],
  ["Hawi Tolera", "hawi.tolera@obu.edu.et", "Website Administrator", "active", "Today, 07:40"],
  ["Abdi Mohammed", "abdi.mohammed@obu.edu.et", "Academic Editor", "active", "Yesterday, 16:05"],
  ["Dr. Meaza Fikru", "meaza.fikru@obu.edu.et", "Research Editor", "active", "2 days ago"],
  ["Tigist Alemu", "registrar@obu.edu.et", "Registrar", "active", "Today, 09:21"],
  ["Kedir Yusuf", "kedir.yusuf@obu.edu.et", "Content Editor", "active", "Today, 10:02"],
  ["Bontu Waqjira", "bontu.waqjira@obu.edu.et", "Content Editor", "inactive", "3 weeks ago"],
  [
    "Samuel Girma",
    "samuel.girma@obu.edu.et",
    "Website Administrator",
    "active",
    "Yesterday, 11:33",
  ],
].map(([name, email, role, status, lastLogin], i) => ({
  id: `usr-${i + 1}`,
  name,
  email,
  role,
  status,
  lastLogin,
  created: [
    "12 Jan 2024",
    "03 Mar 2024",
    "22 Apr 2024",
    "18 Jun 2024",
    "05 Sep 2024",
    "14 Nov 2024",
    "02 Feb 2025",
    "27 Mar 2025",
  ][i],
}));

/* ------------------------------------------------------------------- news */

const newsTitles = [
  [
    "Oda Bultum University Graduates 1,842 Students in 12th Commencement",
    "Academic",
    "published",
    4210,
  ],
  [
    "OBU and Haramaya University Sign Research Collaboration Agreement",
    "Partnership",
    "published",
    1980,
  ],
  ["Call for Applications: 2026 Postgraduate Programs Now Open", "Admissions", "published", 6120],
  ["University Launches New Institute of Climate-Smart Agriculture", "Research", "published", 2440],
  ["Chiro Campus Library Extension Officially Inaugurated", "Campus", "published", 1130],
  ["OBU Community Service Team Reaches 14 Woredas in West Hararghe", "Community", "published", 870],
  ["Senate Approves Revised Undergraduate Academic Regulations", "Governance", "draft", 0],
  ["National Science Week to be Hosted by Oda Bultum University", "Events", "scheduled", 0],
  ["Faculty of Health Sciences Opens Simulation Skills Laboratory", "Academic", "published", 1560],
  ["Alumni Association Endowment Fund Reaches 8 Million Birr", "Alumni", "archived", 640],
  ["Digital Library Access Extended to All Registered Students", "ICT", "published", 2210],
  ["OBU Researchers Publish Study on Sorghum Drought Tolerance", "Research", "pending", 0],
];

export const news: Row[] = newsTitles.map(([title, category, status, views], i) => ({
  id: `news-${i + 1}`,
  title,
  slug: String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60),
  category,
  author: ["Kedir Yusuf", "Hawi Tolera", "Tigist Alemu", "Dr. Meaza Fikru", "Samuel Girma"][i % 5],
  publishedDate: `${String((i % 28) + 1).padStart(2, "0")} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i % 6]} 2026`,
  views,
  status,
  excerpt:
    "Oda Bultum University continues to expand its academic, research and community engagement footprint across West Hararghe and the wider Oromia region.",
  seoTitle: title,
  seoDescription: "Official news release from Oda Bultum University.",
  tags: "obu, university, oromia",
}));

/* ---------------------------------------------------------- announcements */

export const announcements: Row[] = [
  ["2026 Graduation Ceremony Announcement", "Academic", "published", "20 Jul 2026"],
  ["Undergraduate Registration Deadline Extension", "Registrar", "published", "12 Mar 2026"],
  ["Invitation to Bid: Campus Water Supply Project", "Procurement", "published", "28 Feb 2026"],
  ["Vacancy Announcement — Lecturer Positions (14 Posts)", "Vacancy", "published", "15 Apr 2026"],
  ["Scholarship Opportunity for Postgraduate Students", "Scholarship", "scheduled", "01 Sep 2026"],
  ["Mid-Semester Examination Schedule Released", "Academic", "expired", "10 Jan 2026"],
  ["Staff Annual Performance Evaluation Guidelines", "Administration", "draft", "—"],
].map(([title, category, status, expiry], i) => ({
  id: `ann-${i + 1}`,
  title,
  category,
  status,
  publishDate: `${String((i % 27) + 1).padStart(2, "0")} Feb 2026`,
  expiryDate: expiry,
  description:
    "All members of the university community are kindly requested to take note of this official announcement.",
}));

/* ----------------------------------------------------------------- events */

export const events: Row[] = [
  [
    "12th Annual Graduation Ceremony",
    "2026-07-18",
    "09:00",
    "15:00",
    "Main Campus Stadium, Chiro",
    "Office of the President",
  ],
  [
    "National Research Symposium on Dryland Agriculture",
    "2026-05-06",
    "08:30",
    "17:00",
    "OBU Convention Hall",
    "Research & Community Service V/P",
  ],
  [
    "Freshman Orientation Week",
    "2026-09-14",
    "08:00",
    "12:00",
    "Faculty Auditoriums",
    "Office of the Registrar",
  ],
  [
    "Career and Job Fair 2026",
    "2026-04-22",
    "09:00",
    "16:00",
    "Student Center Plaza",
    "Student Services Directorate",
  ],
  [
    "Public Lecture: Climate Resilience in East Hararghe",
    "2026-03-11",
    "14:00",
    "16:30",
    "Institute of Agriculture Hall",
    "Institute of Climate-Smart Agriculture",
  ],
  [
    "University Senate Regular Meeting",
    "2026-03-27",
    "10:00",
    "13:00",
    "Senate Chamber",
    "Office of the Academic V/P",
  ],
  [
    "Community Health Outreach — Mieso Woreda",
    "2026-06-02",
    "07:30",
    "18:00",
    "Mieso Woreda",
    "Faculty of Health Sciences",
  ],
  [
    "ICT Skills Bootcamp for Staff",
    "2026-02-24",
    "13:00",
    "17:00",
    "ICT Training Lab 2",
    "ICT Directorate",
  ],
].map(([title, date, start, end, location, organizer], i) => ({
  id: `evt-${i + 1}`,
  title,
  date,
  startTime: start,
  endTime: end,
  location,
  organizer,
  registrationUrl: "https://obu.edu.et/events/register",
  status: i % 5 === 4 ? "draft" : "published",
  description:
    "An official Oda Bultum University event open to the university community and invited guests.",
}));

/* ------------------------------------------------------------------ pages */

export const pages: Row[] = [
  ["About Us", "/about", "published"],
  ["President's Message", "/about/presidents-message", "published"],
  ["Mission & Vision", "/about/mission-vision", "published"],
  ["University Senate & Board", "/administration/senate-board", "published"],
  ["Administration", "/administration", "published"],
  ["Research", "/research", "published"],
  ["Services", "/services", "published"],
  ["Contact", "/contact", "published"],
  ["Campus Life", "/campus-life", "draft"],
  ["Alumni", "/alumni", "pending"],
].map(([title, url, status], i) => ({
  id: `page-${i + 1}`,
  title,
  url,
  author: ["Hawi Tolera", "Samuel Girma", "Kedir Yusuf"][i % 3],
  lastUpdated: `${String((i % 27) + 1).padStart(2, "0")} Feb 2026`,
  status,
  content:
    "Oda Bultum University is a public higher education institution located in Chiro, West Hararghe Zone, Oromia Region, Ethiopia.",
}));

export const navigationItems: Row[] = [
  ["Home", "/", "Main Menu", 1],
  ["About", "/about", "Main Menu", 2],
  ["Administration", "/administration", "Main Menu", 3],
  ["Registrar", "/registrar", "Main Menu", 4],
  ["Research", "/research", "Main Menu", 5],
  ["Services", "/services", "Main Menu", 6],
  ["News & Events", "/news", "Main Menu", 7],
  ["Contact", "/contact", "Main Menu", 8],
  ["Student Portal", "https://portal.obu.edu.et", "Quick Links", 1],
  ["E-Library", "https://library.obu.edu.et", "Quick Links", 2],
].map(([label, url, menu, order], i) => ({
  id: `nav-${i + 1}`,
  label,
  url,
  menu,
  order,
  status: "active",
}));

/* ------------------------------------------------------------ hero slides */

export const heroSlides: Row[] = [
  {
    id: "hero-1",
    title: "Excellence in Teaching, Research and Community Service",
    subtitle: "Oda Bultum University",
    description: "A public university serving West Hararghe and beyond since 2015.",
    buttonText: "Discover OBU",
    buttonUrl: "/about",
    order: 1,
    status: "published",
    image: "campus-aerial.jpg",
  },
  {
    id: "hero-2",
    title: "2026 Postgraduate Admissions Now Open",
    subtitle: "Admissions",
    description: "Applications for 18 masters programs close on 30 June 2026.",
    buttonText: "Apply Now",
    buttonUrl: "/registrar",
    order: 2,
    status: "published",
    image: "students-library.jpg",
  },
  {
    id: "hero-3",
    title: "Research That Transforms Dryland Communities",
    subtitle: "Research & Innovation",
    description: "Climate-smart agriculture, health and indigenous knowledge research.",
    buttonText: "Explore Research",
    buttonUrl: "/research",
    order: 3,
    status: "published",
    image: "research-field.jpg",
  },
  {
    id: "hero-4",
    title: "Celebrating the Class of 2026",
    subtitle: "Graduation",
    description: "1,842 graduates joined the OBU alumni community this year.",
    buttonText: "View Gallery",
    buttonUrl: "/gallery",
    order: 4,
    status: "draft",
    image: "graduation.jpg",
  },
];

export const homepageSections = [
  [
    "About University",
    "Introductory section with university overview and key figures.",
    "published",
  ],
  ["Mission & Vision", "Mission, vision and core institutional values.", "published"],
  ["President's Message", "Welcome message from the President of the university.", "published"],
  ["Statistics", "Students, staff, programs and research output counters.", "published"],
  ["Featured News", "Six most recent published news items.", "published"],
  ["Upcoming Events", "Next four events from the events calendar.", "published"],
  ["Research Highlights", "Selected research centers and recent publications.", "published"],
  ["Services", "Student, library, ICT and health service shortcuts.", "published"],
  ["Gallery", "Campus photo gallery carousel.", "draft"],
].map(([name, description, status], i) => ({
  id: `sec-${i + 1}`,
  name,
  description,
  status,
  lastUpdated: `${String((i % 27) + 1).padStart(2, "0")} Feb 2026`,
}));

/* -------------------------------------------------------------- academics */

export const faculties: Row[] = [
  ["Faculty of Agriculture", "Dr. Tesfaye Lemma", 9],
  ["Faculty of Health Sciences", "Dr. Aster Nigussie", 7],
  ["Faculty of Business and Economics", "Mr. Dereje Shiferaw", 5],
  ["Faculty of Social Sciences and Humanities", "Dr. Chaltu Regassa", 6],
  ["Faculty of Natural and Computational Sciences", "Dr. Yonas Habte", 6],
  ["Faculty of Engineering and Technology", "Mr. Ibrahim Ahmed", 4],
].map(([name, dean, departments], i) => ({
  id: `fac-${i + 1}`,
  name,
  dean,
  departments,
  status: "active",
  description:
    "An academic faculty of Oda Bultum University offering undergraduate and postgraduate programs.",
}));

export const institutes: Row[] = [
  ["Institute of Climate-Smart Agriculture", "Dr. Firaol Bekele"],
  ["Institute of Indigenous Knowledge and Oromo Studies", "Dr. Gadisa Wayessa"],
  ["Institute of Pastoral and Agro-Pastoral Studies", "Dr. Halima Nur"],
  ["Institute of Educational Development", "Mr. Solomon Tadesse"],
].map(([name, director], i) => ({
  id: `ins-${i + 1}`,
  name,
  director,
  status: "active",
  description: "A specialized research and training institute of Oda Bultum University.",
}));

export const departments: Row[] = [
  ["Plant Science", "Faculty of Agriculture", "Mr. Bekele Gemechu"],
  ["Animal Science", "Faculty of Agriculture", "Dr. Nuredin Kemal"],
  ["Agricultural Economics", "Faculty of Agriculture", "Ms. Lelise Duguma"],
  ["Public Health", "Faculty of Health Sciences", "Dr. Sara Ahmed"],
  ["Nursing", "Faculty of Health Sciences", "Ms. Meron Assefa"],
  ["Medical Laboratory Sciences", "Faculty of Health Sciences", "Mr. Tamiru Wolde"],
  ["Accounting and Finance", "Faculty of Business and Economics", "Mr. Girma Tolosa"],
  ["Management", "Faculty of Business and Economics", "Ms. Ayantu Bekele"],
  ["Economics", "Faculty of Business and Economics", "Mr. Dawit Alemayehu"],
  ["Computer Science", "Faculty of Natural and Computational Sciences", "Mr. Abdulaziz Hussein"],
  ["Statistics", "Faculty of Natural and Computational Sciences", "Ms. Rahel Getu"],
  ["Civil Engineering", "Faculty of Engineering and Technology", "Mr. Fikadu Negash"],
  ["Sociology", "Faculty of Social Sciences and Humanities", "Dr. Beshadu Kefyalew"],
  ["Afaan Oromo and Literature", "Faculty of Social Sciences and Humanities", "Mr. Guta Diriba"],
].map(([name, faculty, head], i) => ({
  id: `dep-${i + 1}`,
  name,
  faculty,
  head,
  status: "active",
  description: "Academic department offering degree programs and conducting applied research.",
}));

export const programs: Row[] = [
  ["BSc in Plant Science", "Bachelor", "Plant Science", "4 years"],
  ["BSc in Animal Science", "Bachelor", "Animal Science", "4 years"],
  ["BSc in Agricultural Economics", "Bachelor", "Agricultural Economics", "4 years"],
  ["BSc in Public Health Officer", "Bachelor", "Public Health", "4 years"],
  ["BSc in Nursing", "Bachelor", "Nursing", "4 years"],
  ["BSc in Medical Laboratory Sciences", "Bachelor", "Medical Laboratory Sciences", "4 years"],
  ["BA in Accounting and Finance", "Bachelor", "Accounting and Finance", "3 years"],
  ["BA in Management", "Bachelor", "Management", "3 years"],
  ["BSc in Computer Science", "Bachelor", "Computer Science", "3 years"],
  ["BSc in Civil Engineering", "Bachelor", "Civil Engineering", "5 years"],
  ["MSc in Agronomy", "Masters", "Plant Science", "2 years"],
  ["MSc in Public Health", "Masters", "Public Health", "2 years"],
  ["MBA in Business Administration", "Masters", "Management", "2 years"],
  ["MSc in Computer Science", "Masters", "Computer Science", "2 years"],
].map(([name, degree, department, duration], i) => ({
  id: `prg-${i + 1}`,
  name,
  degree,
  department,
  duration,
  status: i === 13 ? "draft" : "active",
  requirements: "Ethiopian University Entrance Examination results as per MoE placement criteria.",
  description: "Accredited program delivered on the Chiro main campus.",
}));

export const academicCalendar: Row[] = [
  ["2026/2027 Academic Year", "Semester I", "Registration", "2026-09-07", "2026-09-12"],
  ["2026/2027 Academic Year", "Semester I", "Classes Begin", "2026-09-14", "2026-09-14"],
  ["2026/2027 Academic Year", "Semester I", "Mid-Semester Exams", "2026-11-02", "2026-11-07"],
  ["2026/2027 Academic Year", "Semester I", "Final Examinations", "2027-01-11", "2027-01-23"],
  ["2026/2027 Academic Year", "Semester II", "Registration", "2027-02-01", "2027-02-05"],
  ["2025/2026 Academic Year", "Semester II", "Graduation Ceremony", "2026-07-18", "2026-07-18"],
].map(([year, semester, title, start, end], i) => ({
  id: `cal-${i + 1}`,
  year,
  semester,
  title,
  startDate: start,
  endDate: end,
  status: "published",
  document: "academic-calendar-2026.pdf",
}));

/* --------------------------------------------------------- administration */

export const leadership: Row[] = [
  ["Dr. Getachew Bekele", "President", "president@obu.edu.et", "+251 25 551 0001", 1],
  ["Dr. Kumsa Tolera", "Academic Vice President", "avp@obu.edu.et", "+251 25 551 0002", 2],
  [
    "Dr. Meaza Fikru",
    "Research & Community Service V/President",
    "rvp@obu.edu.et",
    "+251 25 551 0003",
    3,
  ],
  [
    "Mr. Yohannes Desta",
    "Administration & Development V/President",
    "adm@obu.edu.et",
    "+251 25 551 0004",
    4,
  ],
  [
    "Ms. Tigist Alemu",
    "Director, Registrar and Alumni",
    "registrar@obu.edu.et",
    "+251 25 551 0010",
    5,
  ],
  ["Mr. Abdulaziz Hussein", "Director, ICT", "ict@obu.edu.et", "+251 25 551 0011", 6],
].map(([name, position, email, phone, order], i) => ({
  id: `ldr-${i + 1}`,
  name,
  position,
  email,
  phone,
  order,
  status: "active",
  biography: "A senior member of the Oda Bultum University leadership team.",
}));

export const senateBoard: Row[] = [
  ["Dr. Getachew Bekele", "Chairperson", "Senate"],
  ["Dr. Kumsa Tolera", "Secretary", "Senate"],
  ["Dr. Tesfaye Lemma", "Member — Dean, Agriculture", "Senate"],
  ["Dr. Aster Nigussie", "Member — Dean, Health Sciences", "Senate"],
  ["H.E. Ato Mohammed Sani", "Chairperson", "Board of Governors"],
  ["W/ro Almaz Tefera", "Member", "Board of Governors"],
  ["Ato Girma Wakjira", "Member", "Board of Governors"],
].map(([name, position, body], i) => ({
  id: `snt-${i + 1}`,
  name,
  position,
  body,
  status: "active",
  order: i + 1,
}));

export const offices: Row[] = [
  ["Office of the President", "Dr. Getachew Bekele", "president@obu.edu.et"],
  ["Office of the Registrar", "Ms. Tigist Alemu", "registrar@obu.edu.et"],
  ["Finance and Procurement Directorate", "Mr. Yohannes Desta", "finance@obu.edu.et"],
  ["Human Resource Management", "Ms. Bontu Waqjira", "hrm@obu.edu.et"],
  ["Quality Assurance Directorate", "Dr. Chaltu Regassa", "qa@obu.edu.et"],
  ["Public and International Relations", "Mr. Kedir Yusuf", "pr@obu.edu.et"],
].map(([name, head, email], i) => ({
  id: `off-${i + 1}`,
  name,
  head,
  email,
  phone: `+251 25 551 00${20 + i}`,
  status: "active",
  description: "An administrative office of Oda Bultum University.",
}));

/* -------------------------------------------------------------- registrar */

export const admissions: Row[] = [
  ["Undergraduate Regular Admission 2026/27", "Undergraduate", "2026-08-30", "published"],
  ["Postgraduate Admission 2026/27", "Postgraduate", "2026-06-30", "published"],
  ["Summer In-Service Program Admission", "Continuing Education", "2026-05-20", "published"],
  ["Extension (Evening) Program Admission", "Continuing Education", "2026-09-10", "draft"],
].map(([title, category, deadline, status], i) => ({
  id: `adm-${i + 1}`,
  title,
  category,
  deadline,
  status,
  description: "Admission requirements, application procedure and required documents.",
}));

export const registrarInfo: Row[] = [
  ["Registration Procedure", "Registration", "published"],
  ["Add and Drop Guidelines", "Registration", "published"],
  ["Withdrawal and Readmission", "Registration", "published"],
  ["Graduation Requirements", "Graduation", "published"],
  ["Transcript and Certificate Requests", "Documents", "published"],
  ["Student ID Replacement", "Documents", "draft"],
].map(([title, category, status], i) => ({
  id: `reg-${i + 1}`,
  title,
  category,
  status,
  lastUpdated: `${String((i % 27) + 1).padStart(2, "0")} Jan 2026`,
  description: "Official registrar information published on the public website.",
}));

export const importantDates: Row[] = [
  ["Undergraduate Registration Opens", "2026-09-07", "Registration", "published"],
  ["Late Registration Deadline", "2026-09-19", "Registration", "published"],
  ["Add / Drop Deadline", "2026-09-26", "Registration", "published"],
  ["Mid-Semester Examinations", "2026-11-02", "Examination", "published"],
  ["Semester I Final Examinations", "2027-01-11", "Examination", "published"],
  ["Graduation Clearance Deadline", "2026-07-04", "Graduation", "published"],
].map(([title, date, category, status], i) => ({
  id: `dat-${i + 1}`,
  title,
  date,
  category,
  status,
}));

/* --------------------------------------------------------------- research */

export const researchCenters: Row[] = [
  ["Center for Dryland Agriculture Research", "Dr. Firaol Bekele", 12],
  ["Center for Public Health Research", "Dr. Sara Ahmed", 9],
  ["Center for Socio-Economic Studies", "Dr. Beshadu Kefyalew", 7],
  ["Center for Water and Environmental Research", "Mr. Fikadu Negash", 6],
].map(([name, director, projects], i) => ({
  id: `rc-${i + 1}`,
  name,
  director,
  projects,
  status: "active",
  description: "A thematic research center coordinating multi-disciplinary research at OBU.",
}));

export const researchProjects: Row[] = [
  [
    "Drought-Tolerant Sorghum Varieties for West Hararghe",
    "Dr. Firaol Bekele",
    "Ongoing",
    "2025-2027",
  ],
  [
    "Maternal Health Service Utilization in Rural Woredas",
    "Dr. Sara Ahmed",
    "Ongoing",
    "2026-2027",
  ],
  ["Khat Value Chain and Household Livelihoods", "Dr. Beshadu Kefyalew", "Completed", "2023-2025"],
  ["Small-Scale Irrigation Efficiency Assessment", "Mr. Fikadu Negash", "Ongoing", "2026-2028"],
  ["Indigenous Gadaa Conflict Resolution Practices", "Dr. Gadisa Wayessa", "Proposal", "2027-2029"],
].map(([title, lead, phase, period], i) => ({
  id: `rp-${i + 1}`,
  title,
  lead,
  phase,
  period,
  budget: `${(i + 3) * 450},000 ETB`,
  status: i === 4 ? "draft" : "published",
}));

export const publications: Row[] = [
  [
    "Yield Stability of Sorghum Landraces Under Moisture Stress",
    "Bekele F., Lemma T.",
    "Journal of Dryland Agriculture",
    "2026-01-15",
  ],
  [
    "Determinants of Antenatal Care Uptake in Chiro District",
    "Ahmed S., Nigussie A.",
    "Ethiopian Journal of Health Sciences",
    "2025-11-02",
  ],
  [
    "Khat Commercialization and Food Security Trade-offs",
    "Kefyalew B., Duguma L.",
    "Eastern Africa Social Science Review",
    "2025-08-19",
  ],
  [
    "Machine Learning for Crop Disease Detection in Hararghe",
    "Hussein A., Getu R.",
    "IEEE Access",
    "2026-02-08",
  ],
  [
    "Water Quality Assessment of the Erer River Basin",
    "Negash F.",
    "Water Resources Management",
    "2025-06-30",
  ],
].map(([title, authors, journal, date], i) => ({
  id: `pub-${i + 1}`,
  title,
  authors,
  journal,
  publicationDate: date,
  doi: `10.1080/obu.2026.${1000 + i}`,
  category: ["Agriculture", "Health", "Social Science", "Technology", "Environment"][i],
  status: "published",
  abstract: "Peer-reviewed research output authored by Oda Bultum University academic staff.",
}));

export const researchers: Row[] = [
  ["Dr. Firaol Bekele", "Associate Professor", "Plant Science", 24],
  ["Dr. Sara Ahmed", "Assistant Professor", "Public Health", 18],
  ["Dr. Beshadu Kefyalew", "Associate Professor", "Sociology", 21],
  ["Mr. Abdulaziz Hussein", "Lecturer", "Computer Science", 9],
  ["Ms. Rahel Getu", "Lecturer", "Statistics", 7],
].map(([name, rank, department, publications], i) => ({
  id: `rsr-${i + 1}`,
  name,
  rank,
  department,
  publications,
  status: "active",
  email: `researcher${i + 1}@obu.edu.et`,
}));

/* --------------------------------------------------------------- services */

const serviceRows = [
  ["Student Services", "Users", "Dormitory, cafeteria, counselling and student affairs support."],
  [
    "Library Services",
    "BookOpen",
    "Print and digital collections, study spaces and research support.",
  ],
  ["ICT Services", "Server", "Campus network, student portal, email accounts and e-learning."],
  ["Health Services", "HeartPulse", "Student clinic, emergency care and referral services."],
  [
    "Cafeteria Services",
    "UtensilsCrossed",
    "Student and staff dining across three campus cafeterias.",
  ],
  ["Sports and Recreation", "Trophy", "Athletics, football, volleyball and recreation facilities."],
];

export const services: Row[] = serviceRows.map(([title, icon, description], i) => ({
  id: `svc-${i + 1}`,
  title,
  icon,
  description,
  contact: `services${i + 1}@obu.edu.et`,
  url: `/services/${String(title).toLowerCase().replace(/\s+/g, "-")}`,
  status: "active",
}));

/* ------------------------------------------------------------------ media */

const mediaNames = [
  ["campus-aerial-view.jpg", "image", "2.4 MB"],
  ["graduation-2026-01.jpg", "image", "3.1 MB"],
  ["library-interior.jpg", "image", "1.8 MB"],
  ["research-field-trial.jpg", "image", "2.9 MB"],
  ["president-portrait.jpg", "image", "1.2 MB"],
  ["health-sciences-lab.jpg", "image", "2.2 MB"],
  ["obu-promo-video.mp4", "video", "84.6 MB"],
  ["graduation-highlights.mp4", "video", "126.3 MB"],
  ["admission-requirements.pdf", "document", "640 KB"],
  ["academic-calendar-2026.pdf", "document", "410 KB"],
  ["senate-minutes-jan-2026.docx", "document", "220 KB"],
  ["student-enrollment-2026.xlsx", "document", "180 KB"],
];

export const media: Row[] = mediaNames.map(([filename, type, size], i) => ({
  id: `med-${i + 1}`,
  filename,
  type,
  size,
  uploadDate: `${String((i % 27) + 1).padStart(2, "0")} Feb 2026`,
  uploadedBy: ["Hawi Tolera", "Kedir Yusuf", "Tigist Alemu"][i % 3],
  url: `https://cdn.obu.edu.et/media/${filename}`,
  status: "active",
}));

export const documents: Row[] = [
  ["Senate Legislation (Revised 2026)", "Academic Regulations", "PDF", "2.1 MB"],
  ["Undergraduate Academic Policy", "Policies", "PDF", "1.4 MB"],
  ["Annual Performance Report 2025", "Reports", "PDF", "5.8 MB"],
  ["Admission Requirements 2026/27", "Admission Documents", "PDF", "640 KB"],
  ["Student Withdrawal Form", "Forms", "DOCX", "96 KB"],
  ["Research Grant Application Form", "Forms", "DOCX", "128 KB"],
  ["Research Ethics Guideline", "Research Documents", "PDF", "870 KB"],
  ["Presidential Directive 04/2026", "University Directives", "PDF", "320 KB"],
  ["Staff Recruitment Procedure", "Policies", "PDF", "540 KB"],
  ["Budget Utilization Summary 2025", "Reports", "XLSX", "210 KB"],
].map(([title, category, type, size], i) => ({
  id: `doc-${i + 1}`,
  title,
  category,
  type,
  size,
  uploadedBy: ["Tigist Alemu", "Yohannes Desta", "Hawi Tolera"][i % 3],
  uploadDate: `${String((i % 27) + 1).padStart(2, "0")} Jan 2026`,
  status: i % 7 === 6 ? "draft" : "published",
}));

/* ------------------------------------------------------- messages / logs */

export const contactMessages: Row[] = [
  ["Abebe Kassa", "abebe.k@gmail.com", "Transcript request procedure", "unread", "10 min ago"],
  [
    "Fatuma Seid",
    "fatuma.seid@yahoo.com",
    "Postgraduate admission inquiry",
    "unread",
    "48 min ago",
  ],
  [
    "Daniel Mekonnen",
    "dmekonnen@outlook.com",
    "Partnership proposal — vocational training",
    "read",
    "3 hours ago",
  ],
  [
    "Zeynab Ali",
    "zeynab.ali@gmail.com",
    "Question about extension program fees",
    "replied",
    "Yesterday",
  ],
  [
    "Robert Hayes",
    "r.hayes@devorg.org",
    "Research collaboration on dryland farming",
    "read",
    "2 days ago",
  ],
  ["Sifan Tola", "sifan.tola@gmail.com", "Lost student ID replacement", "archived", "5 days ago"],
].map(([name, email, subject, status, date], i) => ({
  id: `msg-${i + 1}`,
  name,
  email,
  subject,
  status,
  date,
  message:
    "Dear Oda Bultum University, I would like to kindly request further information regarding the subject above. Thank you for your time and assistance.",
}));

export const activityLog: Row[] = [
  [
    "Dr. Getachew Bekele",
    "Updated",
    "Homepage Hero Section",
    "update",
    "Today, 10:42",
    "10.14.2.31",
  ],
  [
    "Tigist Alemu",
    "Uploaded",
    "Admission Requirements.pdf",
    "upload",
    "Today, 09:21",
    "10.14.2.44",
  ],
  [
    "Abdi Mohammed",
    "Created",
    "MSc in Computer Science program",
    "create",
    "Today, 08:55",
    "10.14.3.02",
  ],
  [
    "Kedir Yusuf",
    "Published",
    "2026 Graduation Announcement",
    "publish",
    "Yesterday, 17:10",
    "10.14.2.18",
  ],
  [
    "Hawi Tolera",
    "Deleted",
    "Outdated vacancy announcement",
    "delete",
    "Yesterday, 15:02",
    "10.14.2.09",
  ],
  [
    "Dr. Meaza Fikru",
    "Updated",
    "Center for Public Health Research",
    "update",
    "Yesterday, 11:37",
    "10.14.4.21",
  ],
  ["Samuel Girma", "Created", "Campus Life page (draft)", "create", "2 days ago", "10.14.2.66"],
  [
    "Tigist Alemu",
    "Published",
    "Important Dates — Semester I",
    "publish",
    "2 days ago",
    "10.14.2.44",
  ],
  [
    "Kedir Yusuf",
    "Updated",
    "Career and Job Fair 2026 event",
    "update",
    "3 days ago",
    "10.14.2.18",
  ],
  ["Bontu Waqjira", "Login", "Signed in to admin portal", "login", "3 weeks ago", "196.188.44.7"],
].map(([user, action, target, type, time, ip], i) => ({
  id: `log-${i + 1}`,
  user,
  action,
  target,
  type,
  time,
  ip,
  device: i % 3 === 0 ? "Chrome / Windows" : i % 3 === 1 ? "Safari / macOS" : "Chrome / Android",
}));

export const notifications = [
  {
    id: "n1",
    title: "Content awaiting approval",
    body: '"Sorghum Drought Tolerance" news submitted by Dr. Meaza Fikru',
    time: "10 min ago",
    unread: true,
    type: "approval",
  },
  {
    id: "n2",
    title: "New contact message",
    body: "Abebe Kassa — Transcript request procedure",
    time: "12 min ago",
    unread: true,
    type: "message",
  },
  {
    id: "n3",
    title: "Document uploaded",
    body: "Tigist Alemu uploaded Admission Requirements.pdf",
    time: "1 hour ago",
    unread: true,
    type: "upload",
  },
  {
    id: "n4",
    title: "Upcoming event",
    body: "Public Lecture: Climate Resilience — starts in 3 days",
    time: "2 hours ago",
    unread: false,
    type: "event",
  },
  {
    id: "n5",
    title: "Content published",
    body: 'Kedir Yusuf published "2026 Graduation Announcement"',
    time: "Yesterday",
    unread: false,
    type: "publish",
  },
  {
    id: "n6",
    title: "User account created",
    body: "Samuel Girma was added as Website Administrator",
    time: "3 days ago",
    unread: false,
    type: "user",
  },
];

export const pendingReview = [
  {
    id: "p1",
    content: "Admission Announcement 2026/27",
    type: "Announcement",
    author: "Registrar",
    submitted: "10 min ago",
  },
  {
    id: "p2",
    content: "OBU Researchers Publish Study on Sorghum Drought Tolerance",
    type: "News",
    author: "Research Editor",
    submitted: "1 hour ago",
  },
  { id: "p3", content: "Alumni", type: "Page", author: "Samuel Girma", submitted: "4 hours ago" },
  {
    id: "p4",
    content: "National Science Week",
    type: "Event",
    author: "Content Editor",
    submitted: "Yesterday",
  },
  {
    id: "p5",
    content: "MSc in Computer Science",
    type: "Program",
    author: "Academic Editor",
    submitted: "Yesterday",
  },
];

export const analyticsSeries: Record<
  string,
  { label: string; visitors: number; pageViews: number; newsViews: number; eventViews: number }[]
> = {
  today: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map((label, i) => ({
    label,
    visitors: [120, 90, 480, 620, 540, 310][i]!,
    pageViews: [340, 210, 1180, 1520, 1340, 760][i]!,
    newsViews: [80, 40, 320, 410, 360, 190][i]!,
    eventViews: [30, 18, 140, 190, 160, 90][i]!,
  })),
  "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({
    label,
    visitors: [1840, 2120, 1980, 2410, 2260, 1420, 1180][i]!,
    pageViews: [5210, 6180, 5740, 7020, 6510, 3980, 3210][i]!,
    newsViews: [1420, 1680, 1520, 1910, 1770, 1020, 860][i]!,
    eventViews: [420, 510, 470, 620, 580, 320, 260][i]!,
  })),
  "30d": Array.from({ length: 10 }, (_, i) => ({
    label: `${i * 3 + 1}`,
    visitors: 1600 + Math.round(Math.sin(i) * 400) + i * 60,
    pageViews: 4800 + Math.round(Math.cos(i) * 900) + i * 140,
    newsViews: 1300 + Math.round(Math.sin(i + 1) * 300) + i * 40,
    eventViews: 380 + Math.round(Math.cos(i + 2) * 90) + i * 12,
  })),
  "3m": ["Dec", "Jan", "Feb"].flatMap((m) =>
    ["W1", "W2", "W3", "W4"].map((w, i) => ({
      label: `${m} ${w}`,
      visitors: 9800 + i * 620 + m.length * 210,
      pageViews: 27400 + i * 1800 + m.length * 640,
      newsViews: 7200 + i * 480,
      eventViews: 2100 + i * 160,
    })),
  ),
  "1y": ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
    (label, i) => ({
      label,
      visitors: 32000 + Math.round(Math.sin(i / 2) * 7000) + i * 900,
      pageViews: 96000 + Math.round(Math.cos(i / 2) * 18000) + i * 2400,
      newsViews: 24000 + Math.round(Math.sin(i / 3) * 5000) + i * 700,
      eventViews: 7000 + Math.round(Math.cos(i / 3) * 1400) + i * 210,
    }),
  ),
};

export const settings = {
  university: {
    name: "Oda Bultum University",
    address: "Chiro, West Hararghe Zone, Oromia Region, Ethiopia",
    phone: "+251 25 551 0000",
    email: "info@obu.edu.et",
    website: "https://www.obu.edu.et",
    poBox: "P.O. Box 226, Chiro",
  },
  social: {
    facebook: "https://facebook.com/OdaBultumUniversity",
    twitter: "https://x.com/OdaBultumUni",
    youtube: "https://youtube.com/@OdaBultumUniversity",
    instagram: "https://instagram.com/odabultumuniversity",
    linkedin: "https://linkedin.com/school/oda-bultum-university",
  },
  seo: {
    siteTitle: "Oda Bultum University — Excellence in Teaching, Research and Community Service",
    metaDescription:
      "Oda Bultum University is a public higher education institution in Chiro, West Hararghe, Oromia, Ethiopia.",
    keywords: "Oda Bultum University, OBU, Chiro, Ethiopia, higher education, admissions, research",
  },
  system: {
    timezone: "Africa/Addis_Ababa (EAT, UTC+3)",
    language: "English",
  },
};
