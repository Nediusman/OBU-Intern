/**
 * PostgreSQL database layer for OBU.
 * Uses pg (node-postgres).
 */
import { Pool } from "pg";
import "dotenv/config";
let _pool: Pool | null = null;
let _initialized = false;

export function getDb(): Pool {
  if (_pool) return _pool;

  const connectionString = process.env["DATABASE_URL"];

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }

  _pool = new Pool({
    connectionString,
  });

  return _pool;
}

export async function initDb() {
  if (_initialized) return;
  const pool = getDb();
  await initSchema(pool);
  _initialized = true;
}

async function initSchema(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS news (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      slug        TEXT,
      category    TEXT,
      author      TEXT,
      published_date TEXT,
      views       INTEGER DEFAULT 0,
      status      TEXT DEFAULT 'draft',
      image       TEXT,
      excerpt     TEXT,
      seo_title   TEXT,
      seo_desc    TEXT,
      tags        TEXT,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      category     TEXT,
      publish_date TEXT,
      expiry_date  TEXT,
      status       TEXT DEFAULT 'draft',
      description  TEXT,
      image        TEXT,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id           TEXT PRIMARY KEY,
      title        TEXT NOT NULL,
      date         TEXT,
      start_time   TEXT,
      end_time     TEXT,
      location     TEXT,
      organizer    TEXT,
      registration_url TEXT,
      status       TEXT DEFAULT 'draft',
      description  TEXT,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS programs (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      degree       TEXT,
      department   TEXT,
      duration     TEXT,
      status       TEXT DEFAULT 'active',
      requirements TEXT,
      description  TEXT
    );

    CREATE TABLE IF NOT EXISTS faculties (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      dean        TEXT,
      departments INTEGER DEFAULT 0,
      status      TEXT DEFAULT 'active',
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS leadership (
      id        TEXT PRIMARY KEY,
      name      TEXT NOT NULL,
      position  TEXT,
      email     TEXT,
      phone     TEXT,
      sort_order INTEGER DEFAULT 0,
      status    TEXT DEFAULT 'active',
      biography TEXT,
      photo     TEXT
    );

    CREATE TABLE IF NOT EXISTS research_centers (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      director    TEXT,
      projects    INTEGER DEFAULT 0,
      status      TEXT DEFAULT 'active',
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS publications (
      id               TEXT PRIMARY KEY,
      title            TEXT NOT NULL,
      authors          TEXT,
      journal          TEXT,
      publication_date TEXT,
      doi              TEXT,
      category         TEXT,
      status           TEXT DEFAULT 'published',
      abstract         TEXT
    );

    CREATE TABLE IF NOT EXISTS important_dates (
      id       TEXT PRIMARY KEY,
      title    TEXT NOT NULL,
      date     TEXT,
      category TEXT,
      status   TEXT DEFAULT 'published'
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id        TEXT PRIMARY KEY,
      name      TEXT,
      email     TEXT,
      subject   TEXT,
      message   TEXT,
      status    TEXT DEFAULT 'unread',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS hero_slides (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      subtitle    TEXT,
      description TEXT,
      button_text TEXT,
      button_url  TEXT,
      sort_order  INTEGER DEFAULT 0,
      status      TEXT DEFAULT 'draft',
      image       TEXT
    );

    CREATE TABLE IF NOT EXISTS homepage_sections (
      id           TEXT PRIMARY KEY,
      name         TEXT NOT NULL,
      description  TEXT,
      status       TEXT DEFAULT 'draft',
      last_updated TEXT
    );
  `);

  // Seed if empty
  const countRes = await pool.query("SELECT COUNT(*) as c FROM news");
  const count = parseInt(countRes.rows[0].c, 10);
  if (count === 0) await seedDatabase(pool);
}

async function seedDatabase(pool: Pool) {
  await pool.query(`
    INSERT INTO news (id, title, slug, category, author, published_date, views, status, image, excerpt, seo_title, seo_desc, tags) VALUES
      ('news-1','Oda Bultum University Graduates 1,842 Students in 12th Commencement','obu-graduation-2026','Academic','Kedir Yusuf','01 Jan 2026',4210,'published',NULL,'Oda Bultum University continues to expand its academic footprint across West Hararghe.','Graduation 2026 — OBU','Official news from Oda Bultum University.','obu, graduation'),
      ('news-2','OBU and Haramaya University Sign Research Collaboration Agreement','obu-haramaya-mou','Partnership','Hawi Tolera','05 Feb 2026',1980,'published',NULL,'A new memorandum of understanding will expand student and faculty exchange opportunities.','OBU MoU — Haramaya','Partnership news from OBU.','obu, partnership'),
      ('news-3','Call for Applications: 2026 Postgraduate Programs Now Open','postgraduate-2026','Admissions','Tigist Alemu','10 Mar 2026',6120,'published',NULL,'Applications for 18 masters programs close on 30 June 2026.','Postgraduate Admissions 2026','Admissions news from OBU.','obu, admissions'),
      ('news-4','University Launches New Institute of Climate-Smart Agriculture','climate-agriculture-institute','Research','Dr. Meaza Fikru','15 Apr 2026',2440,'published',NULL,'A new specialised institute will coordinate research on climate resilience and dryland agriculture.','OBU New Institute','Research news from OBU.','obu, research'),
      ('news-5','Chiro Campus Library Extension Officially Inaugurated','library-extension','Campus','Samuel Girma','20 May 2026',1130,'published',NULL,'The new library extension adds 400 study spaces and a digital research hub.','Library Extension','Campus news from OBU.','obu, campus'),
      ('news-6','OBU Community Service Team Reaches 14 Woredas','community-service-2026','Community','Kedir Yusuf','01 Jun 2026',870,'published',NULL,'Health sciences students and faculty provided free screenings and health education in nearby districts.','Community Service','Community news from OBU.','obu, community');

    INSERT INTO announcements (id, title, category, publish_date, expiry_date, status, description, image) VALUES
      ('ann-1','2026 Graduation Ceremony Announcement','Academic','01 Jun 2026','20 Jul 2026','published','All members of the university community are kindly requested to take note of this announcement.',NULL),
      ('ann-2','Undergraduate Registration Deadline Extension','Registrar','01 Mar 2026','12 Mar 2026','published','Registration deadline extended by one week for all undergraduate students.',NULL),
      ('ann-3','Vacancy Announcement — Lecturer Positions (14 Posts)','Vacancy','01 Apr 2026','15 Apr 2026','published','Qualified applicants are invited to apply for 14 open lecturer positions.',NULL),
      ('ann-4','Scholarship Opportunity for Postgraduate Students','Scholarship','01 Aug 2026','01 Sep 2026','published','Merit-based scholarships available for students enrolled in postgraduate programs.',NULL);

    INSERT INTO events (id, title, date, start_time, end_time, location, organizer, registration_url, status, description) VALUES
      ('evt-1','12th Annual Graduation Ceremony','2026-07-18','09:00','15:00','Main Campus Stadium, Chiro','Office of the President','https://obu.edu.et/events/register','published','An official OBU event open to the university community and invited guests.'),
      ('evt-2','National Research Symposium on Dryland Agriculture','2026-08-06','08:30','17:00','OBU Convention Hall','Research & Community Service V/P','https://obu.edu.et/events/register','published','Annual research symposium bringing together researchers from across Ethiopia.'),
      ('evt-3','Freshman Orientation Week','2026-09-14','08:00','12:00','Faculty Auditoriums','Office of the Registrar','https://obu.edu.et/events/register','published','Welcome and orientation for all newly admitted students.'),
      ('evt-4','Career and Job Fair 2026','2026-09-22','09:00','16:00','Student Center Plaza','Student Services Directorate','https://obu.edu.et/events/register','published','Connecting graduating students with employers and career opportunities.');

    INSERT INTO programs (id, name, degree, department, duration, status, requirements, description) VALUES
      ('prg-1','BSc in Plant Science','Bachelor','Plant Science','4 years','active','Ethiopian University Entrance Examination results as per MoE placement criteria.','Accredited program delivered on the Chiro main campus.'),
      ('prg-2','BSc in Animal Science','Bachelor','Animal Science','4 years','active','Ethiopian University Entrance Examination results as per MoE placement criteria.','Accredited program delivered on the Chiro main campus.'),
      ('prg-3','BSc in Public Health Officer','Bachelor','Public Health','4 years','active','Ethiopian University Entrance Examination results as per MoE placement criteria.','Accredited program delivered on the Chiro main campus.'),
      ('prg-4','BSc in Nursing','Bachelor','Nursing','4 years','active','Ethiopian University Entrance Examination results as per MoE placement criteria.','Accredited program delivered on the Chiro main campus.'),
      ('prg-5','BA in Accounting and Finance','Bachelor','Accounting and Finance','3 years','active','Ethiopian University Entrance Examination results as per MoE placement criteria.','Accredited program delivered on the Chiro main campus.'),
      ('prg-6','BSc in Computer Science','Bachelor','Computer Science','3 years','active','Ethiopian University Entrance Examination results as per MoE placement criteria.','Accredited program delivered on the Chiro main campus.'),
      ('prg-7','BSc in Civil Engineering','Bachelor','Civil Engineering','5 years','active','Ethiopian University Entrance Examination results as per MoE placement criteria.','Accredited program delivered on the Chiro main campus.'),
      ('prg-8','MSc in Agronomy','Masters','Plant Science','2 years','active','Relevant BSc and minimum GPA as per university guidelines.','Postgraduate program for advanced agricultural research.'),
      ('prg-9','MSc in Public Health','Masters','Public Health','2 years','active','Relevant BSc and minimum GPA as per university guidelines.','Postgraduate program in public health research and practice.'),
      ('prg-10','MBA in Business Administration','Masters','Management','2 years','active','Relevant Bachelor degree and minimum GPA as per university guidelines.','Postgraduate professional program in business management.');

    INSERT INTO faculties (id, name, dean, departments, status, description) VALUES
      ('fac-1','Faculty of Agriculture','Dr. Tesfaye Lemma',9,'active','An academic faculty offering undergraduate and postgraduate programs.'),
      ('fac-2','Faculty of Health Sciences','Dr. Aster Nigussie',7,'active','An academic faculty offering undergraduate and postgraduate programs.'),
      ('fac-3','Faculty of Business and Economics','Mr. Dereje Shiferaw',5,'active','An academic faculty offering undergraduate programs.'),
      ('fac-4','Faculty of Natural and Computational Sciences','Dr. Yonas Habte',6,'active','An academic faculty offering undergraduate and postgraduate programs.'),
      ('fac-5','Faculty of Engineering and Technology','Mr. Ibrahim Ahmed',4,'active','An academic faculty offering undergraduate engineering programs.'),
      ('fac-6','Faculty of Social Sciences and Humanities','Dr. Chaltu Regassa',6,'active','An academic faculty offering undergraduate programs.');

    INSERT INTO leadership (id, name, position, email, phone, sort_order, status, biography, photo) VALUES
      ('ldr-1','Dr. Getachew Bekele','President','president@obu.edu.et','+251 25 551 0001',1,'active','A senior member of the Oda Bultum University leadership team.',NULL),
      ('ldr-2','Dr. Kumsa Tolera','Academic Vice President','avp@obu.edu.et','+251 25 551 0002',2,'active','A senior member of the Oda Bultum University leadership team.',NULL),
      ('ldr-3','Dr. Meaza Fikru','Research & Community Service V/President','rvp@obu.edu.et','+251 25 551 0003',3,'active','A senior member of the Oda Bultum University leadership team.',NULL),
      ('ldr-4','Mr. Yohannes Desta','Administration & Development V/President','adm@obu.edu.et','+251 25 551 0004',4,'active','A senior member of the Oda Bultum University leadership team.',NULL);

    INSERT INTO research_centers (id, name, director, projects, status, description) VALUES
      ('rc-1','Center for Dryland Agriculture Research','Dr. Firaol Bekele',12,'active','A thematic research center coordinating multi-disciplinary research.'),
      ('rc-2','Center for Public Health Research','Dr. Sara Ahmed',9,'active','A thematic research center coordinating health research.'),
      ('rc-3','Center for Socio-Economic Studies','Dr. Beshadu Kefyalew',7,'active','A thematic research center for social science research.'),
      ('rc-4','Center for Water and Environmental Research','Mr. Fikadu Negash',6,'active','A thematic research center for environmental studies.');

    INSERT INTO publications (id, title, authors, journal, publication_date, doi, category, status, abstract) VALUES
      ('pub-1','Yield Stability of Sorghum Landraces Under Moisture Stress','Bekele F., Lemma T.','Journal of Dryland Agriculture','2026-01-15','10.1080/obu.2026.1001','Agriculture','published','Peer-reviewed research on drought-tolerant sorghum varieties.'),
      ('pub-2','Determinants of Antenatal Care Uptake in Chiro District','Ahmed S., Nigussie A.','Ethiopian Journal of Health Sciences','2025-11-02','10.1080/obu.2025.1002','Health','published','Study of maternal health service utilization in rural woredas.'),
      ('pub-3','Machine Learning for Crop Disease Detection','Hussein A., Getu R.','IEEE Access','2026-02-08','10.1080/obu.2026.1003','Technology','published','Application of ML techniques to agricultural disease detection.');

    INSERT INTO important_dates (id, title, date, category, status) VALUES
      ('dat-1','Undergraduate Registration Opens','2026-09-07','Registration','published'),
      ('dat-2','Late Registration Deadline','2026-09-19','Registration','published'),
      ('dat-3','Add / Drop Deadline','2026-09-26','Registration','published'),
      ('dat-4','Mid-Semester Examinations','2026-11-02','Examination','published'),
      ('dat-5','Semester I Final Examinations','2027-01-11','Examination','published'),
      ('dat-6','Graduation Clearance Deadline','2026-07-04','Graduation','published');

    INSERT INTO settings (key, value) VALUES
      ('university_name','Oda Bultum University'),
      ('address','Chiro, West Hararghe Zone, Oromia Region, Ethiopia'),
      ('phone','+251 25 551 0000'),
      ('email','info@obu.edu.et'),
      ('website','https://www.obu.edu.et'),
      ('student_count','8,084'),
      ('mission_vision','The university aims to produce ethical, competent graduates; conduct problem-solving research; and render demand-based community engagement activities to assure social, economic and political goals in the locality and beyond in a sustainable manner.');

    CREATE TABLE IF NOT EXISTS navigation (
      id       TEXT PRIMARY KEY,
      label    TEXT NOT NULL,
      url      TEXT NOT NULL,
      menu     TEXT,
      "order"  INTEGER,
      status   TEXT DEFAULT 'active'
    );

    INSERT INTO navigation (id, label, url, menu, "order", status) VALUES
      ('nav-1','OBU Procurement','http://egp.mofed.gov.et','Quick Links',1,'active'),
      ('nav-2','OBU e-SHE Platform','http://courses.obu.edu.et','Quick Links',2,'active'),
      ('nav-3','OBU Fleet Management System','https://fms.ppa.gov.et/','Quick Links',3,'active'),
      ('nav-4','OBU LMS Platform','https://10.140.8.5','Quick Links',4,'active'),
      ('nav-5','OBU-FTP','http://10.140.8.6','Quick Links',5,'active'),
      ('nav-6','OBU Institutional Email','https://office.com','Quick Links',6,'active');

    INSERT INTO hero_slides (id, title, subtitle, description, button_text, button_url, sort_order, status, image) VALUES
      ('hero-1', 'Excellence in Teaching, Research and Community Service', 'Oda Bultum University', 'A public university serving West Hararghe and beyond since 2015.', 'Discover OBU', '/about', 1, 'published', 'campus-aerial.jpg'),
      ('hero-2', '2026 Postgraduate Admissions Now Open', 'Admissions', 'Applications for 18 masters programs close on 30 June 2026.', 'Apply Now', '/admissions', 2, 'published', NULL);

    INSERT INTO homepage_sections (id, name, description, status, last_updated) VALUES
      ('sec-1', 'About University', 'Introductory section with university overview and key figures.', 'published', '01 Feb 2026'),
      ('sec-2', 'Mission & Vision', 'Mission, vision and core institutional values.', 'published', '02 Feb 2026'),
      ('sec-3', 'President''s Message', 'Welcome message from the President of the university.', 'published', '03 Feb 2026'),
      ('sec-4', 'Statistics', 'Students, staff, programs and research output counters.', 'published', '04 Feb 2026'),
      ('sec-5', 'Featured News', 'Six most recent published news items.', 'published', '05 Feb 2026'),
      ('sec-6', 'Upcoming Events', 'Next four events from the events calendar.', 'published', '06 Feb 2026'),
      ('sec-7', 'Research Highlights', 'Selected research centers and recent publications.', 'published', '07 Feb 2026'),
      ('sec-8', 'Services', 'Student, library, ICT and health service shortcuts.', 'published', '08 Feb 2026'),
      ('sec-9', 'Gallery', 'Campus photo gallery carousel.', 'published', '09 Feb 2026');
  `);
}
