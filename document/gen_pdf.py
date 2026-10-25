import os
OUTPUT = "/home/kali/indu/obu_student_management.pdf"
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, HRFlowable, PageBreak, KeepTogether)
from reportlab.platypus import Image as RLImage
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

PAGE_W = A4[0]; MARGIN = 2.2 * cm; TW = PAGE_W - 2 * MARGIN
PRIMARY  = colors.Color(0.058824, 0.298039, 0.227451)
PRIMARY2 = colors.Color(0.156863, 0.478431, 0.364706)
ROW_ALT  = colors.Color(0.968627, 0.980392, 0.988235)
NOTE_BG  = colors.Color(0.941176, 0.992157, 0.956863)

doc = SimpleDocTemplate(OUTPUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=2*cm)
ss = getSampleStyleSheet(); _i = [0]
def S(b, **k): _i[0]+=1; return ParagraphStyle(f"s{_i[0]}", parent=ss[b], **k)

h1s     = S("Heading1", fontSize=13, textColor=PRIMARY, spaceBefore=14, spaceAfter=4, leading=17, fontName="Times-Bold")
h2s     = S("Heading2", fontSize=11, textColor=PRIMARY, spaceBefore=10, spaceAfter=3, leading=15, fontName="Times-Bold")
body    = S("BodyText", fontSize=10, leading=15, alignment=TA_JUSTIFY, spaceAfter=6, fontName="Times-Roman")
bull    = S("BodyText", fontSize=10, leading=15, leftIndent=18, spaceAfter=4, fontName="Times-Roman")
refs    = S("BodyText", fontSize=9,  leading=13, leftIndent=12, spaceAfter=3, fontName="Times-Roman")
cs      = S("Normal",   fontSize=8,  leading=11)
note_st = S("Normal",   fontSize=9,  leading=13, textColor=colors.Color(0.04, 0.22, 0.13),
            leftIndent=8, rightIndent=8, spaceBefore=4, spaceAfter=4, alignment=TA_JUSTIFY, fontName="Times-Roman")

def hr():    return HRFlowable(width="100%", thickness=0.8, color=PRIMARY, spaceAfter=6, spaceBefore=2)
def thr():   return HRFlowable(width="100%", thickness=0.3, color=PRIMARY2, spaceAfter=4)
def sp(h=8): return Spacer(1, h)
def H1(t):   return Paragraph(t, h1s)
def H2(t):   return Paragraph(t, h2s)
def P(t):    return Paragraph(t, body)
def B(t):    return Paragraph(chr(8226)+' '+t, bull)
def NB(n,t): return Paragraph(str(n)+'. '+t, bull)
def C(t, b=False): return Paragraph(('<b>'+t+'</b>') if b else t, cs)

TB = TableStyle([
    ('BACKGROUND',(0,0),(-1,0),PRIMARY), ('TEXTCOLOR',(0,0),(-1,0),colors.white),
    ('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'), ('FONTSIZE',(0,0),(-1,0),9),
    ('ROWBACKGROUNDS',(0,1),(-1,-1),[ROW_ALT,colors.white]), ('FONTSIZE',(0,1),(-1,-1),8),
    ('VALIGN',(0,0),(-1,-1),'TOP'), ('GRID',(0,0),(-1,-1),0.4,colors.Color(0.7,0.85,0.78)),
    ('LEFTPADDING',(0,0),(-1,-1),5), ('RIGHTPADDING',(0,0),(-1,-1),5),
    ('TOPPADDING',(0,0),(-1,-1),2), ('BOTTOMPADDING',(0,0),(-1,-1),2)])

def notebox(t):
    return Table([[Paragraph(t, note_st)]], colWidths=[TW], style=TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),NOTE_BG), ('BOX',(0,0),(-1,-1),0.6,PRIMARY),
        ('LEFTPADDING',(0,0),(-1,-1),10), ('RIGHTPADDING',(0,0),(-1,-1),10),
        ('TOPPADDING',(0,0),(-1,-1),8),  ('BOTTOMPADDING',(0,0),(-1,-1),8)]))

story = []

# COVER
cf = S("Normal", fontSize=11, textColor=colors.white, leading=18, alignment=TA_LEFT, spaceAfter=2)
# ── COVER PAGE — professional white academic style ──────────────────────────
from reportlab.platypus import Image as _IM2
from reportlab.lib.units import cm as _cm2

_lw2 = TW * 0.65
_lh2 = _lw2 * (253 / 1392)
_logo2 = _IM2("/home/kali/indu/haramaya_logo.png", width=_lw2, height=_lh2)

# ── styles ─────────────────────────────────────────────────────────────────────
cv_univ   = S("Normal", fontSize=15, textColor=PRIMARY, leading=20,
              alignment=TA_CENTER, fontName="Times-Bold", spaceAfter=2)
cv_dept   = S("Normal", fontSize=11, textColor=colors.Color(0.2,0.2,0.2),
              leading=15, alignment=TA_CENTER, fontName="Times-Roman", spaceAfter=2)
cv_title  = S("Normal", fontSize=17, textColor=PRIMARY, leading=24,
              alignment=TA_CENTER, fontName="Times-Bold", spaceAfter=6)
cv_sub    = S("Normal", fontSize=12, textColor=colors.Color(0.15,0.15,0.15),
              leading=17, alignment=TA_CENTER, fontName="Times-Roman", spaceAfter=4)
cv_label  = S("Normal", fontSize=10, textColor=colors.Color(0.4,0.4,0.4),
              leading=14, alignment=TA_LEFT, fontName="Times-Roman")
cv_value  = S("Normal", fontSize=10, textColor=colors.Color(0.05,0.05,0.05),
              leading=14, alignment=TA_LEFT, fontName="Times-Bold")
cv_foot   = S("Normal", fontSize=9, textColor=colors.Color(0.5,0.5,0.5),
              leading=12, alignment=TA_CENTER, fontName="Times-Roman")

def thick_rule(w="100%", t=2.0, c=None):
    return HRFlowable(width=w, thickness=t, color=c or PRIMARY, spaceAfter=6, spaceBefore=6)
def thin_rule(w="100%", c=None):
    return HRFlowable(width=w, thickness=0.5, color=c or colors.Color(0.7,0.7,0.7), spaceAfter=4, spaceBefore=4)

# info table — label | value pairs
info_rows = [
    [Paragraph("Prepared By", cv_label),   Paragraph("NEDI USMAN", cv_value)],
    [Paragraph("Academic Advisor", cv_label), Paragraph("Mr. Kibru G.", cv_value)],
    [Paragraph("Internship Site", cv_label),
     Paragraph("Oda Bultum University "+chr(8212)+" Chiro, Ethiopia", cv_value)],
]
info_tbl = Table(info_rows, colWidths=[TW*0.32, TW*0.68],
    style=TableStyle([
        ("LINEBELOW",    (0,0),(-1,-2), 0.3, colors.Color(0.85,0.85,0.85)),
        ("TOPPADDING",   (0,0),(-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("LEFTPADDING",  (0,0),(-1,-1), 0),
        ("RIGHTPADDING", (0,0),(-1,-1), 0),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
    ]))

cover_elements = [
    sp(30),
    # Logo centred
    Table([[_logo2]], colWidths=[TW], style=TableStyle([
        ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ("TOPPADDING",(0,0),(-1,-1),0),
        ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(18),
    thick_rule(),
    sp(6),
    Paragraph("HARAMAYA UNIVERSITY", cv_univ),
    Paragraph("College of Computing and Informatics", cv_dept),
    Paragraph("Department of Computer Science", cv_dept),
    sp(6),
    thin_rule(),
    sp(16),
    Paragraph("INDUSTRIAL INTERNSHIP PROJECT PROPOSAL", cv_sub),
    sp(8),
    Paragraph("Design and Development of a Web-Based<br/>"
              "Centralized Student Information System<br/>(OBU-SIS)<br/>"
              "for Oda Bultum University", cv_title),
    sp(6),
    Paragraph("Modernizing Registrar and Academic Workflows", cv_dept),
    sp(18),
    thin_rule(),
    sp(10),
    info_tbl,
    sp(16),
    thick_rule(t=1.0),
    sp(6),
    Paragraph("Haramaya University, Dire Dawa, Ethiopia  "+chr(8212)+"  June 2025", cv_foot),
]

story += cover_elements + [PageBreak()]

# TOC
ti = [
    ("1.","Project Title",True),("2.","Introduction",True),
    ("2.1.","Background of the Problem",False),("2.2.","Motivation for Developing the System",False),
    ("3.","Problem Statement",True),("3.1.","Existing Challenges",False),
    ("3.2.","Why a New Solution is Needed",False),("4.","Project Objectives",True),
    ("5.","Scope of the Project",True),("5.4.","Detailed Features Matrix",False),
    ("6.","System Architecture Overview",True),("7.","Methodology",True),
    ("8.","Technologies to Be Used",True),("9.","Risk Analysis and Mitigation",True),
    ("10.","Expected Outcomes / Deliverables",True),("11.","Conclusion",True),("12.","References",True),
]
tr = []
for num,title,main in ti:
    sz=10 if main else 9; col=PRIMARY if main else colors.black
    tr.append([
        Paragraph(("<b>"+num+"</b>") if main else num, S("Normal",fontSize=sz,leading=14,textColor=col)),
        Paragraph(("<b>"+title+"</b>") if main else title, S("Normal",fontSize=sz,leading=14)),
        Paragraph(chr(183)+" "+chr(183)+" "+chr(183)+" "+chr(183), S("Normal",fontSize=8,textColor=colors.grey,leading=14)),
    ])
story += [H1("Table of Contents"), hr(),
    Table(tr, colWidths=[TW*.10,TW*.68,TW*.22], style=TableStyle([
        ("ROWBACKGROUNDS",(0,0),(-1,-1),[colors.white,ROW_ALT]),
        ("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3),
        ("LEFTPADDING",(0,0),(-1,-1),4),("VALIGN",(0,0),(-1,-1),"MIDDLE")])),
    PageBreak()]

# 1
story += [H1("1. Project Title"), hr(),
    P("Design and Development of a Web-Based Centralized Student Information System (OBU-SIS) for Oda Bultum University: Modernizing Registrar and Academic Workflows"), sp()]

# 2
story += [H1("2. Introduction"), hr(),
    P("In the contemporary higher education landscape, the operational efficiency, academic rigor, and data integrity of an educational institution are inextricably linked to the performance of its core software infrastructure. A Student Information System (SIS) serves as the primary digital nervous system of a university, securely managing the entire student academic lifecycle from initial undergraduate intake to ultimate degree clearance and transcript compilation. As universities expand in enrollment capacity and programmatic diversity, their foundational software platforms must undergo parallel architectural evolutions. To maintain institutional continuity and support data-driven decision-making, university software ecosystems must scale robustly to execute high-concurrency transactional activities without suffering performance degradation, database deadlocks, or unexpected downtime."),
    H2("2.1. Background of the Problem"),
    P("Oda Bultum University (OBU), established in the year 2015 in Chiro, Western Hararghe, Oromia, Ethiopia, has experienced rapid structural growth over the past decade. The institution has expanded to house six diverse academic colleges"+chr(8212)+"namely the College of Agriculture, the College of Natural and Computational Sciences, the College of Business and Economics, the College of Social Sciences and Humanities, the College of Health and Medical Sciences, and the Institute of Technology"+chr(8212)+"overseeing dozens of undergraduate curricula tailored to different instructional modalities, including regular, weekend, extension, and summer cohorts. However, while physical facilities and enrollment counts have surged, the administrative software technologies supporting the university have remained fundamentally stagnant."),
    P("The Registrar's Office and affiliated academic departments currently rely on an outdated combination of localized desktop applications, disconnected web forms, and manual spreadsheets that operate completely independent of one another. As observed on the primary university domain (<a href=\"https://obu.edu.et/\" color=\"#0F4C3A\">https://obu.edu.et/</a>), severe content delivery blockages often occur, where key dropdown sections such as the College Assistant Registrar updates and Registration Announcements fail to fetch any active server records, leaving pages empty. This structural separation forces administrative personnel to hand-deliver hard-copy records across decentralized physical spaces to complete routine validations, exposing vital student data to inconsistencies and operational delays."),
    H2("2.2. Motivation for Developing the System"),
    P("The primary motivation behind this digital transformation initiative is to replace these broken administrative frameworks with a high-performance web platform built on a strict, type-safe Single Source of Truth (SSoT). Transitioning OBU to an advanced web architecture ensures continuous application availability, guarantees data isolation rules, and slashes the time required to compile, evaluate, and clear student milestones. By shifting computing weights from unoptimized client machines onto structured backend servers, this project maximizes the utility of OBU's campus network resources. Ultimately, this effort provides the university with a bulletproof administrative backbone that reduces manual verification workloads for the registrar, eliminates student friction, and implements a modern framework capable of supporting advanced predictive academic analytics."),
    sp(10),
]

# Flow diagram — Student Interface → Secure Server → Relational Database
_bs = S("Normal", fontSize=9, textColor=PRIMARY, leading=13, alignment=TA_CENTER)
_as = S("Normal", fontSize=13, textColor=PRIMARY, leading=13, alignment=TA_CENTER)
def _fbox(l1, l2=""):
    t = "<b>"+l1+"</b>" + ("<br/><font size='8'>"+l2+"</font>" if l2 else "")
    return Table([[Paragraph(t, _bs)]], colWidths=[TW*0.27], style=TableStyle([
        ("BOX",(0,0),(-1,-1),1.2,PRIMARY), ("BACKGROUND",(0,0),(-1,-1),colors.white),
        ("TOPPADDING",(0,0),(-1,-1),8), ("BOTTOMPADDING",(0,0),(-1,-1),8),
        ("LEFTPADDING",(0,0),(-1,-1),6), ("RIGHTPADDING",(0,0),(-1,-1),6)]))
_ar = Table([[Paragraph(chr(8594), _as)]], colWidths=[TW*0.095], style=TableStyle([
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"), ("ALIGN",(0,0),(-1,-1),"CENTER")]))
_diag = Table([[
    _fbox("Student Interface","Course Add/Drop &amp; Grade Viewing"),
    _ar,
    _fbox("Secure Server Layer","JWT Auth &amp; RBAC Verification"),
    _ar,
    _fbox("Relational Database","3NF Normalized Storage &amp; Indexing"),
]], colWidths=[TW*0.27, TW*0.095, TW*0.27, TW*0.095, TW*0.27], style=TableStyle([
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"), ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ("TOPPADDING",(0,0),(-1,-1),6), ("BOTTOMPADDING",(0,0),(-1,-1),6)]))
story += [
    Table([[_diag]], colWidths=[TW], style=TableStyle([
        ("BOX",(0,0),(-1,-1),0.5,colors.Color(0.8,0.88,0.84)),
        ("BACKGROUND",(0,0),(-1,-1),colors.Color(0.97,0.99,0.98)),
        ("TOPPADDING",(0,0),(-1,-1),12), ("BOTTOMPADDING",(0,0),(-1,-1),12),
        ("LEFTPADDING",(0,0),(-1,-1),8), ("RIGHTPADDING",(0,0),(-1,-1),8)])),
    sp(),
]

# 3
story += [H1("3. Problem Statement"), hr(),
    P("The legacy academic record infrastructure at Oda Bultum University is unstable and inefficient, creating critical operational risks across the entire institution. Because the current software lacks a resilient architecture, it fails to meet the basic data-processing needs of the expanding campus network, introducing vulnerabilities in performance, security, and data accuracy."),
    H2("3.1. Existing Challenges"),
    B("<b>High-Concurrency Failures During Critical Windows:</b> During peak operational phases, such as the three-to-four-day windows allocated for semester registration and final grade entries, the existing server stack experiences immediate resource starvation. Concurrent requests overwhelm unindexed tables, depleting database connection pools and triggering system-wide crashes. This forces users into long lookup loops, causes timeout errors, and leaves database states corrupted or partially saved."),
    B("<b>Severe Data Fragmentation and Siloed Archives:</b> Because separate colleges maintain isolated record fragments, the institution lacks a unified data sync mechanism. For instance, when a student transitions between majors or colleges, their historical academic records must be hand-verified and re-entered manually into distinct spreadsheets, slowing down verification and introducing transcription errors."),
    B("<b>Severe Processing Lag for Grades and Performance Standing:</b> The current process relies on instructors manually compiling physical mark sheets, securing physical signatures from Department Heads, and hand-delivering copies to the main Registrar. This physical delivery chain creates an administrative lag of several weeks into the next term. Consequently, students routinely register for advanced courses without knowing if they passed required prerequisites, distorting academic enforcement."),
    B("<b>Vulnerable System Boundaries and Lack of Auditing:</b> The current system lacks centralized access controls and tamper-proof logging tools. On the main portal (<a href=\"http://obu.edu.et\" color=\"#0F4C3A\">obu.edu.et</a>), public entryways like the unhardened account retrieval parameters (e.g., ?action=lostpassword) remain structurally unmonitored. There are no secure cryptographic logs to track who modified a grade, adjusted a curriculum, or changed an enrollment profile, exposing the university to insider threats, data manipulation, and a structural lack of accountability. Meanwhile, external auxiliary student registration details are completely isolated on separate staging domains like <a href=\"http://www.obustudentservice.site\" color=\"#0F4C3A\">www.obustudentservice.site</a>, meaning there is no cross-validation loop to verify user legitimacy against active registrar data pools."),
    H2("3.2. Why a New Solution is Needed"),
    P("Continuing to patch or maintain the legacy platform is no longer technically or financially viable. The old software is a rigid, monolithic system that cannot scale horizontally or support automated data processes. Attempting to modify this code creates structural regression defects across the system. A completely fresh, optimized solution is required to replace this broken setup. This new platform will be built from scratch using strict object-relational mapping, custom indexing, and robust error-handling mechanisms to safeguard data integrity and support OBU's academic expansion."), sp()]

# 4
story += [H1("4. Project Objectives"), hr(),
    H2("4.1. General Objective"),
    P("To design, implement, thoroughly test, and deploy a secure, high-concurrency, web-based Centralized Student Information System (OBU-SIS) that automates the university academic lifecycle, guarantees absolute transactional data integrity, and eliminates manual administrative bottlenecks across all campuses of Oda Bultum University."),
    H2("4.2. Specific Objectives"),
    B("To engineer a relational database schema normalized strictly to Third Normal Form (3NF), implementing strict foreign key constraints, cascading triggers, and compound indexes to ensure data redundancy is maintained at exactly R=0."),
    B("To develop a secure Role-Based Access Control (RBAC) middleware filter that securely segregates data access boundaries for five distinct user groups, neutralizing unauthorized privilege escalation attempts."),
    B("To program an automated, server-side grade calculation engine that instantly processes Semester GPA and Cumulative GPA (CGPA) upon final grade submission based on OBU Senate legislation, preventing manual computation discrepancies."),
    B("To optimize backend query delivery and API response times, ensuring that complex multi-criteria student record searches execute within a performance threshold of t&lt;2.0 seconds under a simulated load of concurrent active requests."),
    B("To design a clean, responsive, and low-bandwidth web user interface that enables end-users to register for courses and review academic portfolios across both desktop and mobile networks."),
    B("To implement an automated database backup and disaster recovery mechanism, ensuring institutional data can be restored within a defined Recovery Time Objective (RTO)."), sp()]

# 5
story += [H1("5. Scope of the Project"), hr(),
    H2("5.1. Functional Boundaries"),
    P("The functional boundary of the proposed OBU-SIS encompasses the entire academic scope of the student life cycle. This begins at initial undergraduate admission, extends through curriculum progression and grading phases, and concludes with final graduation clearance auditing. The software bridges the gaps between the physical layers of university hierarchy, turning manual administrative sign-offs into a smooth, structured digital sequence."),
    H2("5.2. Target Users"),
    P("The proposed platform features customized user interfaces and access permissions designed specifically for five core operational roles:"),
    NB(1,"<b>System Administrators (ICT Directorate):</b> Technical staff responsible for monitoring system health, managing database backups, making adjustments to system variables, and auditing security logs."),
    NB(2,"<b>Registrar Officers (Main Campus):</b> Institutional managers who control global student intake, adjust master curriculum rules, manage the university calendar, and authorize the issuance of official transcripts."),
    NB(3,"<b>College Deans &amp; Department Heads:</b> Academic supervisors who review departmental grading distributions, authorize course offerings, and process student add/drop adjustments."),
    NB(4,"<b>Instructors / Faculty Members:</b> Academic staff who manage digital class lists, input ongoing continuous assessments, and submit final marks directly to the system."),
    NB(5,"<b>Students (Regular, Extension, and Summer):</b> End-users who use the portal to complete semester registration, verify advisor approvals, and monitor their grade progress."),
    H2("5.3. Geographic and Organizational Limitations"),
    P("Geographically, the system will be tailored for deployment within the local network topology and central server infrastructure of Oda Bultum University's main campus in Chiro, Ethiopia. It will be optimized to perform reliably over local campus intranets and constrained external connections. Organizationally, the scope is restricted exclusively to the six foundational colleges of the university for undergraduate degrees. It will not manage external national university matching loops, nor will it handle cross-institutional research sharing networks beyond OBU boundaries."), sp(1)]

story += [H2("5.4. Detailed Features Matrix"), sp(1)]
# compact cell style for matrix
# matrix styles — header: white on green | module col: bold dark on light green | data: normal
_mhdr = S("Normal", fontSize=8,   leading=12, textColor=colors.white, fontName="Helvetica-Bold")
_mmod = S("Normal", fontSize=7.5, leading=11, textColor=PRIMARY,       fontName="Helvetica-Bold")
_mdat = S("Normal", fontSize=7.5, leading=11, fontName="Times-Roman")
_mbul = S("Normal", fontSize=7.5, leading=12, fontName="Times-Roman", spaceBefore=1, spaceAfter=1)
def MH(t):  return Paragraph("<b>"+t+"</b>", _mhdr)
def MM(t):  return Paragraph("<b>"+t+"</b>", _mmod)
def MD(*items):
    """Each item renders as its own line with a bullet prefix."""
    from reportlab.platypus import ListFlowable, ListItem
    paras = [Paragraph(it, _mbul) for it in items]
    return paras
_TBm = TableStyle([
    # header row
    ("BACKGROUND",    (0,0), (-1,0),  PRIMARY),
    ("TEXTCOLOR",     (0,0), (-1,0),  colors.white),
    ("FONTNAME",      (0,0), (-1,0),  "Helvetica-Bold"),
    # module name column (col 0, rows 1+) — light green bg
    ("BACKGROUND",    (0,1), (0,-1),  colors.Color(0.82, 0.93, 0.87)),
    ("FONTNAME",      (0,1), (0,-1),  "Helvetica-Bold"),
    # alternating rows for data columns
    ("ROWBACKGROUNDS",(1,1), (-1,-1), [ROW_ALT, colors.white]),
    # grid and padding
    ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ("GRID",          (0,0), (-1,-1), 0.5, colors.Color(0.6, 0.82, 0.72)),
    ("LEFTPADDING",   (0,0), (-1,-1), 4),
    ("RIGHTPADDING",  (0,0), (-1,-1), 4),
    ("TOPPADDING",    (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ("FONTSIZE",      (0,0), (-1,-1), 7),
])
cw=[TW*.20, TW*.40, TW*.40]
def cell(*items):
    """Return a list of Paragraphs, one per bullet item."""
    return [Paragraph(it, _mbul) for it in items]

ok  = chr(10004)+" "   # ✔
no  = chr(10007)+" "   # ✗

mx=[
    [MH("System Module"), MH("In-Scope Features"), MH("Out-of-Scope Features")],
    [MM("Authentication\n& Security"),
     cell(ok+"Multi-factor Role-Based Access Control (RBAC) middleware.",
          ok+"Encrypted JWT token-based stateless session management.",
          ok+"Tamper-proof cryptographic audit logs for all record changes.",
          ok+"Automated account lockout on repeated failed login attempts."),
     cell(no+"External federated or social login integrations.",
          no+"Biometric identity verification interfaces.")],
    [MM("Student Profiles\n& Lifecycle"),
     cell(ok+"Digital student profile generation with unique institutional ID.",
          ok+"Automated processing and validation of student ID records.",
          ok+"Inter-college and inter-major transfer validation workflow.",
          ok+"Graduation eligibility and clearance progress tracking."),
     cell(no+"Alumni network and donor record management.",
          no+"Pre-admission university entrance exam metrics.")],
    [MM("Course\nRegistration"),
     cell(ok+"Automated curriculum compliance and credit-load verification.",
          ok+"Hard prerequisite constraint enforcement at registration.",
          ok+"Asynchronous digital advisor approval and routing queue.",
          ok+"Add/drop period management with deadline enforcement."),
     cell(no+"Predictive classroom seat allocation and optimization.",
          no+"Real-time biometric attendance hardware synchronization.")],
    [MM("Grading &\nAcademic Records"),
     cell(ok+"Faculty portal for continuous assessment and final grade entry.",
          ok+"Automated server-side GPA and CGPA computation (OBU Senate rules).",
          ok+"Instant academic probation and warning alert generation.",
          ok+"Official transcript generation and issuance module."),
     cell(no+"Automated plagiarism detection for uploaded assignments.",
          no+"Synchronous lecture video streaming capabilities.")],
    [MM("Clearance &\nFinance"),
     cell(ok+"Multi-department graduation clearance workflow (Finance, Library, Dept.).",
          ok+"Real-time clearance status checks from finance endpoints.",
          ok+"Graduation audit and eligibility confirmation tool."),
     cell(no+"Direct mobile banking or payment gateway transaction processing.",
          no+"Physical dormitory and inventory management.")],
]
story+=[Table(mx,colWidths=cw,style=_TBm,repeatRows=1),sp(4),
    notebox("<b>Strategic Project Advantage:</b> By isolating core academic performance layers and addressing database concurrency bottlenecks, this project provides a clean, maintainable system. It delivers an enterprise-grade platform that solves real administration issues, matching the practical standards required for a successful industrial internship."),sp()]

# 6
story+=[H1("6. System Architecture Overview"),hr(),
    P("The OBU-SIS follows a three-tier client-server architecture, clearly separating presentation, business logic, and data persistence layers. This separation improves maintainability, security, and horizontal scalability."),sp(6)]
ah=S("Normal",fontSize=9,textColor=colors.white,alignment=TA_CENTER,leading=13)
ad=S("Normal",fontSize=9,textColor=PRIMARY,alignment=TA_CENTER,leading=13)
ar=[
    [Paragraph("<b>PRESENTATION LAYER (Client)</b>",ah),"",""],
    [C("React.js SPA\n(Student Portal)"),C("React.js SPA\n(Staff / Faculty Portal)"),C("React.js SPA\n(Admin Dashboard)")],
    [Paragraph("<b>"+chr(9660)+"  HTTPS / REST API  "+chr(9660)+"</b>",ad),"",""],
    [Paragraph("<b>APPLICATION LAYER (Django Backend)</b>",ah),"",""],
    [C("Auth &\nRBAC Middleware"),C("Business Logic\n(Registration, Grading,\nClearance Modules)"),C("REST API\n(DRF + SimpleJWT)")],
    [Paragraph("<b>"+chr(9660)+"  Django ORM Queries  "+chr(9660)+"</b>",ad),"",""],
    [Paragraph("<b>DATA LAYER</b>",ah),"",""],
    [C("PostgreSQL\n(Primary DB"+chr(8212)+"3NF Normalized)"),C("Automated Backup\nService\n(Scheduled Dumps)"),C("Audit Log Store\n(Tamper-Proof\nCryptographic)")],
]
ast=TableStyle([
    ("BACKGROUND",(0,0),(-1,0),PRIMARY),("SPAN",(0,0),(-1,0)),
    ("BACKGROUND",(0,3),(-1,3),PRIMARY),("SPAN",(0,3),(-1,3)),
    ("BACKGROUND",(0,6),(-1,6),PRIMARY),("SPAN",(0,6),(-1,6)),
    ("SPAN",(0,2),(-1,2)),("BACKGROUND",(0,2),(-1,2),NOTE_BG),("ALIGN",(0,2),(-1,2),"CENTER"),
    ("SPAN",(0,5),(-1,5)),("BACKGROUND",(0,5),(-1,5),NOTE_BG),("ALIGN",(0,5),(-1,5),"CENTER"),
    ("BACKGROUND",(0,1),(-1,1),colors.white),("BACKGROUND",(0,4),(-1,4),colors.white),("BACKGROUND",(0,7),(-1,7),ROW_ALT),
    ("GRID",(0,0),(-1,-1),0.4,colors.Color(0.7,0.85,0.78)),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
    ("ALIGN",(0,1),(-1,7),"CENTER"),("FONTSIZE",(0,0),(-1,-1),8),
    ("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)])
story+=[Table(ar,colWidths=[TW/3,TW/3,TW/3],style=ast),sp(8),
    P("<b>Key Architectural Decisions:</b>"),
    B("<b>Stateless JWT Authentication:</b> Each API request carries a signed token verified by the RBAC middleware, enabling the application server to scale without session affinity."),
    B("<b>Database Connection Pooling (PgBouncer):</b> A connection pooler sits between Django and PostgreSQL to manage concurrent connections efficiently during peak registration windows"+chr(8212)+"directly addressing the concurrency crash problem identified in Section 3."),
    B("<b>Nginx Reverse Proxy:</b> Handles TLS termination, serves static assets with caching headers, and proxies dynamic requests to Gunicorn workers, improving response times."),
    B("<b>Modular Django Apps:</b> Each module (Registration, Grading, Clearance, Auth) is a dedicated Django app with its own models, serializers, and views"+chr(8212)+"independently testable and maintainable."),sp()]

# 7
story+=[PageBreak(), H1("7. Methodology"),hr(),
    P("To ensure a structured, efficient, and adaptive development process, the project will be executed using an <b>Agile (Scrum) methodology</b>. This iterative approach is ideally suited for a project of this complexity, allowing for continuous feedback, rapid adaptation to changing requirements, and the delivery of a high-quality product. The project will be divided into distinct, time-boxed <b>Sprints</b>, typically lasting two weeks each. Each sprint will focus on delivering a functional increment of the software. The key phases of this methodology are as follows:"),
    Paragraph("<b>1. Project Planning and Requirement Finalization:</b> This initial phase involves a deep-dive into the requirements outlined in this proposal. User stories will be created for each feature (e.g., 'As a student, I want to register for courses so that I can enroll in the upcoming semester'). A product backlog will be prioritized in collaboration with key stakeholders.",bull),
    Paragraph("<b>2. Design and Prototyping:</b> This stage involves creating both high-level architectural designs and detailed database schemas. Low-fidelity wireframes and high-fidelity mockups of the user interface will be developed for key user roles (Student, Instructor, Registrar) to validate the user experience early in the process.",bull),
    Paragraph("<b>3. Iterative Development (Sprints):</b> The heart of the project. Each sprint will include the full development cycle: Sprint Planning (selecting a set of user stories from the product backlog to complete); Development and Testing (building the features, writing unit and integration tests, and performing code reviews, with the architecture developed in layers: Database, Backend API, and Frontend); and Sprint Review (demonstrating the completed features to stakeholders for immediate feedback).",bull),
    Paragraph("<b>4. Integration and System Testing:</b> As the features stabilize, comprehensive system testing will be conducted. This includes performance testing to simulate high-concurrency loads, security testing to validate the RBAC and audit systems, and end-to-end testing to ensure all modules (Registration, Grading, etc.) work seamlessly together.",bull),
    Paragraph("<b>5. Deployment, User Acceptance Testing (UAT), and Training:</b> The final system will be deployed to a staging environment for rigorous UAT with a representative group of end-users. Simultaneously, training materials and user manuals will be created, and training sessions will be conducted for all user groups.",bull),
    Paragraph("<b>6. Deployment and Handover:</b> Following successful UAT, the system will be deployed to the production environment on OBU's servers. The final codebase, documentation, and deployment procedures will be formally handed over to the ICT Directorate.",bull),sp()]

# 8
story+=[H1("8. Technologies to Be Used"),hr(),
    P("The OBU-SIS will be built using a modern, robust, and scalable technology stack, carefully selected to meet the project's performance and security objectives."),
    H2("8.1. Frontend (Client-Side)"),
    B("<b>Framework: React.js</b> "+chr(8212)+" A highly popular and performant library for building dynamic user interfaces. Its component-based architecture promotes reusability and maintainability."),
    B("<b>State Management: Redux Toolkit</b> "+chr(8212)+" To manage complex application state, such as user sessions, registration data, and grade reports, in a predictable and efficient manner."),
    B("<b>UI Library: Tailwind CSS</b> "+chr(8212)+" A low-level, utility-first CSS framework that allows for the creation of fast, responsive, and consistent custom designs without writing custom CSS from scratch."),
    B("<b>HTTP Client: Axios</b> "+chr(8212)+" For making secure, asynchronous HTTP requests to the backend API."),
    H2("8.2. Backend (Server-Side)"),
    B("<b>Framework: Django (Python)</b> "+chr(8212)+" A high-level, 'batteries-included' web framework that promotes rapid development, clean design, and robust security. It is well-suited for building secure and complex data-driven applications."),
    B("<b>API Implementation: Django REST Framework (DRF)</b> "+chr(8212)+" A powerful toolkit for building scalable RESTful APIs. It provides features like authentication, serialization, and view sets that will accelerate development."),
    B("<b>Security:</b> The backend will leverage Django's built-in protection against common threats (SQL injection, XSS, CSRF). It will implement <b>JWT (JSON Web Token)</b> authentication for stateless session management and a robust <b>Role-Based Access Control (RBAC)</b> middleware to enforce user permissions."),
    H2("8.3. Database"),
    B("<b>RDBMS: PostgreSQL</b> "+chr(8212)+" A powerful, open-source object-relational database system renowned for its reliability, feature robustness (e.g., JSONB support), and performance, making it ideal for managing complex academic data with strict integrity requirements."),
    B("<b>ORM: Django's built-in ORM</b> will be the primary interface for database interactions. It abstracts the SQL layer, making the codebase more maintainable and less prone to SQL injection vulnerabilities."),
    H2("8.4. Deployment"),
    B("<b>Primary Deployment: OBU Campus Server (LAN Only)</b> "+chr(8212)+" The application is hosted on a dedicated physical server located within Oda Bultum University's main campus in Chiro, Ethiopia. The system is accessible exclusively over the university's Local Area Network (LAN) and is intentionally isolated from the public internet to protect sensitive student records. External access is not supported in the current scope."),
    B("<b>Web Server: Nginx</b> "+chr(8212)+" Serves static and media files and acts as a reverse proxy to the Gunicorn application server within the LAN environment."),
    B("<b>Application Server: Gunicorn</b> "+chr(8212)+" A Python WSGI HTTP Server that serves the Django application under concurrent load."),
    B("<b>Cloud Reference: Vercel (Frontend)</b> "+chr(8212)+" As a development and testing reference, the React.js frontend can optionally be previewed via <a href=\"https://vercel.com\" color=\"#0F4C3A\">Vercel</a>, a modern deployment platform that enables fast, zero-config frontend builds. In the production LAN environment, static assets are served directly through Nginx."),
    B("<b>Cloud Reference: Supabase (Database)</b> "+chr(8212)+" <a href=\"https://supabase.com\" color=\"#0F4C3A\">Supabase</a> is referenced as a PostgreSQL-as-a-service alternative for rapid prototyping and staging environments. It provides a hosted PostgreSQL instance with a built-in REST API, authentication, and a web-based dashboard useful for testing and demo purposes. The production system uses a self-hosted PostgreSQL instance on the university's LAN server."),
    B("<b>Version Control: Git / GitHub</b> "+chr(8212)+" All source code is managed via Git with a remote repository on GitHub or GitLab for collaboration and release tracking."),
    sp()]

# 9
story+=[PageBreak(), H1("9. Risk Analysis and Mitigation"),hr(),
    P("A proactive risk assessment is critical for a project of this scope. The table below identifies key risks, their probability and impact, and the planned mitigation strategy."),sp(4)]
rh_s=S("Normal",fontSize=8,leading=11,textColor=colors.Color(0.7,0.1,0.1))
rm_s=S("Normal",fontSize=8,leading=11,textColor=colors.Color(0.6,0.35,0.0))
rl_s=S("Normal",fontSize=8,leading=11,textColor=colors.Color(0.1,0.45,0.18))
def RC(t,lv=None):
    if lv=="H": return Paragraph("<b>"+t+"</b>",rh_s)
    if lv=="M": return Paragraph("<b>"+t+"</b>",rm_s)
    if lv=="L": return Paragraph("<b>"+t+"</b>",rl_s)
    return Paragraph(t,cs)
rd=[
    [C("Risk Description",True),C("Prob.",True),C("Impact",True),C("Mitigation Strategy",True)],
    [RC("Scope creep"+chr(8212)+"stakeholders requesting features beyond agreed scope"),RC("High","H"),RC("High","H"),RC("Strict change request process; all new features deferred to a future phase backlog.")],
    [RC("Unstable campus network causing deployment or testing issues"),RC("Medium","M"),RC("High","H"),RC("Develop with offline-first fallback; test on local intranet simulation before live deploy.")],
    [RC("Data loss during migration from legacy spreadsheets"),RC("Medium","M"),RC("Critical","H"),RC("Run migration scripts in sandboxed environment first; validate row counts and checksums before cutover.")],
    [RC("Key stakeholder unavailability during UAT"),RC("Medium","M"),RC("Medium","M"),RC("Schedule UAT sessions early; identify backup contacts in each department.")],
    [RC("Security vulnerabilities in authentication or RBAC layer"),RC("Low","L"),RC("Critical","H"),RC("Code review of all auth logic; OWASP-aligned security checklist; Django's built-in protections.")],
    [RC("Performance failure under peak concurrent load"),RC("Medium","M"),RC("High","H"),RC("Implement PgBouncer connection pooling; run Locust load tests and tune accordingly.")],
    [RC("Timeline slippage due to underestimated task complexity"),RC("Medium","M"),RC("Medium","M"),RC("Buffer week built into schedule; weekly sprint reviews to detect delays early and re-prioritize backlog.")],
]
story+=[Table(rd,colWidths=[TW*.33,TW*.10,TW*.10,TW*.47],style=TB,repeatRows=1),sp()]

# 10
story+=[H1("10. Expected Outcomes / Deliverables"),hr(),
    P("At the successful conclusion of this project, the following tangible deliverables will be produced and handed over to the university."),
    NB(1,"<b>A Fully Functional and Deployed Web Application:</b> A secure, high-performance OBU-SIS deployed on the university's server, ready for live use by all target users."),
    NB(2,"<b>Comprehensive Database Schema &amp; Data Migration Tools:</b> The final, normalized database structure and scripts for securely migrating data from legacy spreadsheets and systems into the new platform."),
    NB(3,"<b>Technical Documentation:</b> System Architecture Design Document detailing the overall system architecture, database schema, API design, and security protocols; an Administrator's Manual for the ICT Directorate on system deployment, server maintenance, user account management, and security auditing; User Manuals for students, instructors, and registrar staff; and the complete, well-commented source code in a version-controlled repository."),
    NB(4,"<b>API Documentation:</b> Generated and interactive documentation (e.g., using Swagger/OpenAPI) for the backend REST APIs, enabling future expansion and integration by the ICT directorate."),
    NB(5,"<b>Training and Support:</b> Delivery of training workshops for system administrators, registrar officers, academic staff, and a representative group of students. A defined handover protocol and post-deployment support period will also be included."),
    NB(6,"<b>Test Reports:</b> Unit test results, integration test coverage report, and load testing performance report (Locust) demonstrating the system meets the &lt;2.0s response time objective under concurrent load."),sp()]

# 11
story+=[H1("11. Conclusion"),hr(),
    P("The current state of academic administration at Oda Bultum University is fraught with inefficiencies, data integrity risks, and security vulnerabilities. This proposal outlines a comprehensive and strategic plan to replace the legacy, fragmented systems with the <b>OBU-Centralized Student Information System (OBU-SIS)</b>."),
    P("The proposed solution is not merely a software patch but a complete, architectural overhaul built on a modern, scalable, and secure technology stack. By implementing a Single Source of Truth with strict database integrity, automating complex academic calculations, and enforcing robust role-based access, this system will directly resolve the critical challenges identified in this document."),
    P("The development methodology and technology choices ensure the project can be delivered on time and to a high standard, fully meeting the practical standards required for both a successful industrial internship and a lasting contribution to the university. The tangible outcomes will significantly reduce administrative overhead, improve the student experience, and provide a solid foundation for future data-driven academic analytics. The ICT Directorate and the university leadership are invited to approve this proposal and initiate this vital digital transformation project."),sp()]

# 12
story+=[H1("12. References"),hr(),
    Paragraph("1. Radcliffe, B., &amp; Higdon, T. (2016). <i>Student Information Systems: A Guide for the Higher Education CIO</i>. Educause Review.",refs),
    Paragraph("2. Drummond, J. (2018). <i>Database Design for Mere Mortals: A Hands-On Guide to Relational Database Design</i> (3rd ed.). Addison-Wesley. (Referenced for 3NF and normalization principles).",refs),
    Paragraph("3. Python Software Foundation. (2023). <i>Django Documentation</i>. Retrieved from https://docs.djangoproject.com/",refs),
    Paragraph("4. Django Software Foundation. (2023). <i>Django REST Framework Documentation</i>. Retrieved from https://www.django-rest-framework.org/",refs),
    Paragraph("5. The PostgreSQL Global Development Group. (2023). <i>PostgreSQL Documentation</i>. Retrieved from https://www.postgresql.org/docs/",refs),
    Paragraph("6. Fielding, R. T. (2000). <i>Architectural Styles and the Design of Network-based Software Architectures</i> (Doctoral dissertation, University of California, Irvine). (Referenced for RESTful API principles).",refs),
    Paragraph("7. OWASP Foundation. (2023). <i>OWASP Top Ten Web Application Security Risks</i>. Retrieved from https://owasp.org/www-project-top-ten/",refs),
    Paragraph("8. Schwaber, K., &amp; Sutherland, J. (2020). <i>The Scrum Guide</i>. Retrieved from https://scrumguides.org/",refs),
    Paragraph("9. Oda Bultum University. (2023). <i>Senate Legislation on Undergraduate Program Administration</i> (Internal Policy Document).",refs),sp()]

# FOOTER + BUILD
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColorRGB(0.058824, 0.298039, 0.227451)
    canvas.drawString(MARGIN, 1.2*cm, "Haramaya University  |  Dept. of Computer Science  |  OBU-SIS Internship Proposal")
    canvas.setFillColorRGB(0.4, 0.4, 0.4)
    canvas.drawRightString(PAGE_W - MARGIN, 1.2*cm, "Page "+str(doc.page))
    canvas.restoreState()

try:
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print("Generated:", OUTPUT, "(", os.path.getsize(OUTPUT)//1024, "KB )")
except Exception as e:
    import traceback; traceback.print_exc()
