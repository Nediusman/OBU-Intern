
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable, PageBreak, KeepTogether)
from reportlab.platypus import Image as RLImage
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

OUTPUT = "/home/kali/indu/obu_sis_internship_report_ch1_ch2.pdf"
PAGE_W, PAGE_H = A4
MARGIN = 2.5 * cm
TW = PAGE_W - 2 * MARGIN

PRIMARY  = colors.Color(0.058824, 0.298039, 0.227451)
PRIMARY2 = colors.Color(0.156863, 0.478431, 0.364706)
ROW_ALT  = colors.Color(0.968627, 0.980392, 0.988235)
NOTE_BG  = colors.Color(0.941176, 0.992157, 0.956863)

doc = SimpleDocTemplate(OUTPUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=2.2*cm)

ss = getSampleStyleSheet(); _i = [0]
def S(b, **k): _i[0]+=1; return ParagraphStyle(f"s{_i[0]}", parent=ss[b], **k)

chap  = S("Heading1", fontSize=14, textColor=PRIMARY, spaceBefore=18, spaceAfter=6,
          leading=18, fontName="Times-Bold")
h1s   = S("Heading1", fontSize=13, textColor=PRIMARY, spaceBefore=14, spaceAfter=4,
          leading=17, fontName="Times-Bold")
h2s   = S("Heading2", fontSize=11, textColor=PRIMARY2, spaceBefore=10, spaceAfter=3,
          leading=15, fontName="Times-Bold")
body  = S("BodyText", fontSize=11, leading=17, alignment=TA_JUSTIFY, spaceAfter=7,
          fontName="Times-Roman")
bull  = S("BodyText", fontSize=11, leading=16, leftIndent=20, spaceAfter=4,
          fontName="Times-Roman")
refs  = S("BodyText", fontSize=10, leading=14, leftIndent=14, spaceAfter=3,
          fontName="Times-Roman")
cs    = S("Normal",   fontSize=9,  leading=12, fontName="Times-Roman")

def hr():    return HRFlowable(width="100%", thickness=0.8, color=PRIMARY, spaceAfter=6, spaceBefore=2)
def thr():   return HRFlowable(width="100%", thickness=0.3, color=PRIMARY2, spaceAfter=4)
def sp(h=8): return Spacer(1, h)
def H1(t):   return Paragraph(t, h1s)
def H2(t):   return Paragraph(t, h2s)
def P(t):    return Paragraph(t, body)
def B(t):    return Paragraph(chr(8226)+" "+t, bull)
def NB(n,t): return Paragraph(str(n)+". "+t, bull)
def CHAP(t): return Paragraph(t, chap)

story = []

# ══════════════════════════════════════════════════════════
# COVER PAGE
# ══════════════════════════════════════════════════════════
cv = S("Normal", fontSize=11, textColor=colors.white, leading=17, alignment=TA_CENTER)
cv_s = S("Normal", fontSize=10, textColor=colors.Color(0.78,0.96,0.87), leading=15, alignment=TA_CENTER)
cv_f = S("Normal", fontSize=11, textColor=colors.white, leading=18, alignment=TA_LEFT)

# ── COVER PAGE — professional white academic style ──────────────────────────
_lw3 = TW * 0.65
_lh3 = _lw3 * (253 / 1392)
_logo3 = RLImage("/home/kali/indu/haramaya_logo.png", width=_lw3, height=_lh3)

cv_univ2  = S("Normal", fontSize=15, textColor=PRIMARY, leading=20,
               alignment=TA_CENTER, fontName="Times-Bold", spaceAfter=2)
cv_dept2  = S("Normal", fontSize=11, textColor=colors.Color(0.2,0.2,0.2),
               leading=15, alignment=TA_CENTER, fontName="Times-Roman", spaceAfter=2)
cv_title2 = S("Normal", fontSize=16, textColor=PRIMARY, leading=23,
               alignment=TA_CENTER, fontName="Times-Bold", spaceAfter=5)
cv_sub2   = S("Normal", fontSize=11, textColor=colors.Color(0.25,0.25,0.25),
               leading=16, alignment=TA_CENTER, fontName="Times-Roman", spaceAfter=4)
cv_label2 = S("Normal", fontSize=10, textColor=colors.Color(0.4,0.4,0.4),
               leading=14, alignment=TA_LEFT, fontName="Times-Roman")
cv_value2 = S("Normal", fontSize=10, textColor=colors.Color(0.05,0.05,0.05),
               leading=14, alignment=TA_LEFT, fontName="Times-Bold")
cv_foot2  = S("Normal", fontSize=9, textColor=colors.Color(0.5,0.5,0.5),
               leading=12, alignment=TA_CENTER, fontName="Times-Roman")

def tr2(t=2.0): return HRFlowable(width="100%", thickness=t, color=PRIMARY, spaceAfter=6, spaceBefore=6)
def tn2():      return HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.75,0.75,0.75), spaceAfter=4, spaceBefore=4)

info2 = [
    [Paragraph("Prepared By",     cv_label2), Paragraph("NEDI USMAN", cv_value2)],
    [Paragraph("Student ID",      cv_label2), Paragraph("________________________", cv_value2)],
    [Paragraph("Academic Advisor",cv_label2), Paragraph("Mr. Kibru G.", cv_value2)],
    [Paragraph("Internship Site", cv_label2),
     Paragraph("Oda Bultum University "+chr(8212)+" Chiro, Ethiopia", cv_value2)],
    [Paragraph("Submission Date", cv_label2), Paragraph("________________________", cv_value2)],
]
info_tbl2 = Table(info2, colWidths=[TW*0.32, TW*0.68],
    style=TableStyle([
        ("LINEBELOW",    (0,0),(-1,-2), 0.3, colors.Color(0.85,0.85,0.85)),
        ("TOPPADDING",   (0,0),(-1,-1), 5),
        ("BOTTOMPADDING",(0,0),(-1,-1), 5),
        ("LEFTPADDING",  (0,0),(-1,-1), 0),
        ("RIGHTPADDING", (0,0),(-1,-1), 0),
        ("VALIGN",       (0,0),(-1,-1), "MIDDLE"),
    ]))

cover_els = [
    sp(28),
    Table([[_logo3]], colWidths=[TW], style=TableStyle([
        ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ("TOPPADDING",(0,0),(-1,-1),0),
        ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(16),
    tr2(),
    sp(4),
    Paragraph("HARAMAYA UNIVERSITY", cv_univ2),
    Paragraph("College of Computing and Informatics", cv_dept2),
    Paragraph("Department of Computer Science", cv_dept2),
    sp(4),
    tn2(),
    sp(14),
    Paragraph("INDUSTRIAL PRACTICE REPORT", cv_sub2),
    sp(8),
    Paragraph("Design and Development of a Web-Based<br/>"
              "Centralized Student Information System (OBU-SIS)<br/>"
              "for Oda Bultum University", cv_title2),
    sp(6),
    Paragraph("Submitted as Part of the Industrial Internship Program<br/>"
              "Bachelor of Science Degree in Computer Science<br/>"
              "<i>(Individual Internship Project)</i>", cv_sub2),
    sp(16),
    tn2(),
    sp(8),
    info_tbl2,
    sp(14),
    tr2(t=1.0),
    sp(6),
    Paragraph("Oda Bultum University  "+chr(8212)+"  Chiro, Ethiopia  "+chr(8212)+"  June 2026", cv_foot2),
]

story += cover_els + [PageBreak()]

# ══════════════════════════════════════════════════════════
# CHAPTER 1: INTRODUCTION
# ══════════════════════════════════════════════════════════

# ══════════════════════════════════════════════════════════
# PRELIMINARY SECTIONS
# ══════════════════════════════════════════════════════════

# ── Acknowledgement ───────────────────────────────────────
# ── Interim Submission Notice ────────────────────────────────────────────
story += [
    Table([[Paragraph(
        "<b>Note to Evaluator:</b> This report represents an <b>interim submission</b> covering "
        "<b>Chapter 1 (Introduction)</b> and <b>Chapter 2 (Software Development Plan)</b> only. "
        "The OBU-SIS software development project is currently in progress. Chapters 3 through 6, "
        "covering System Requirements, System Design, Implementation, and Reflection, will be "
        "submitted upon project completion at the end of the 45-day internship period.",
        S("Normal", fontSize=9, fontName="Times-Roman", leading=14,
          textColor=colors.Color(0.1,0.3,0.15), alignment=TA_JUSTIFY))]], colWidths=[TW],
        style=TableStyle([
            ("BACKGROUND",    (0,0),(-1,-1), NOTE_BG),
            ("BOX",           (0,0),(-1,-1), 1.0, PRIMARY),
            ("LEFTPADDING",   (0,0),(-1,-1), 12),
            ("RIGHTPADDING",  (0,0),(-1,-1), 12),
            ("TOPPADDING",    (0,0),(-1,-1), 10),
            ("BOTTOMPADDING", (0,0),(-1,-1), 10),
        ])),
    sp(16),
    H1("Acknowledgement"), hr(),

    P("I would like to express my sincere gratitude to all those who supported and guided me "
      "throughout this industrial internship project."),
    P("First and foremost, I extend my heartfelt thanks to my <b>Academic Advisor, Mr. Kibru G.</b>, "
      "of the Department of Computer Science, College of Computing and Informatics, Haramaya University, "
      "for his unwavering academic guidance, constructive feedback, and continuous encouragement "
      "throughout the internship period."),
    P("I am deeply grateful to the <b>ICT Directorate of Oda Bultum University</b> for providing "
      "a supportive working environment, server infrastructure access, and technical supervision "
      "during the development of the OBU-SIS. Special appreciation is extended to the "
      "<b>Senior Registrar Officer</b> for the invaluable domain knowledge, workflow documentation, "
      "and patience during requirements gathering and User Acceptance Testing sessions."),
    P("I also thank the <b>Department of Computer Science, Haramaya University</b>, for designing "
      "a structured industrial internship program that bridges theoretical computer science education "
      "with real-world software engineering practice."),
    P("Finally, I am grateful to my family and peers for their moral support throughout this "
      "challenging and rewarding experience."),
    sp(8),
    Paragraph("NEDI USMAN", S("Normal", fontSize=11, fontName="Times-Bold",
              alignment=TA_LEFT, leading=14)),
    Paragraph("Department of Computer Science, Haramaya University",
              S("Normal", fontSize=10, fontName="Times-Roman", alignment=TA_LEFT, leading=14)),
    Paragraph("Internship Site: Oda Bultum University, Chiro, Ethiopia",
              S("Normal", fontSize=10, fontName="Times-Roman", alignment=TA_LEFT, leading=14)),
    PageBreak(),
]

# ── List of Abbreviations ─────────────────────────────────
abbr_data = [
    [Paragraph("<b>Abbreviation</b>", S("Normal",fontSize=9,fontName="Times-Bold",textColor=colors.white,alignment=TA_LEFT)),
     Paragraph("<b>Full Form</b>",    S("Normal",fontSize=9,fontName="Times-Bold",textColor=colors.white,alignment=TA_LEFT))],
    ["OBU-SIS",  "Oda Bultum University Student Information System"],
    ["OBU",      "Oda Bultum University"],
    ["API",      "Application Programming Interface"],
    ["RBAC",     "Role-Based Access Control"],
    ["JWT",      "JSON Web Token"],
    ["3NF",      "Third Normal Form"],
    ["GPA",      "Grade Point Average"],
    ["CGPA",     "Cumulative Grade Point Average"],
    ["LAN",      "Local Area Network"],
    ["UAT",      "User Acceptance Testing"],
    ["ORM",      "Object-Relational Mapping"],
    ["WSGI",     "Web Server Gateway Interface"],
    ["RTO",      "Recovery Time Objective"],
    ["SADD",     "System Architecture Design Document"],
    ["ERD",      "Entity Relationship Diagram"],
    ["DRF",      "Django REST Framework"],
    ["SIS",      "Student Information System"],
    ["ICT",      "Information and Communications Technology"],
    ["QA",       "Quality Assurance"],
    ["CRUD",     "Create, Read, Update, Delete"],
]

_abbr_style = TableStyle([
    ("BACKGROUND",    (0,0),(-1,0),  PRIMARY),
    ("TEXTCOLOR",     (0,0),(-1,0),  colors.white),
    ("ROWBACKGROUNDS",(0,1),(-1,-1), [ROW_ALT, colors.white]),
    ("FONTNAME",      (0,1),(-1,-1), "Times-Roman"),
    ("FONTSIZE",      (0,0),(-1,-1), 9),
    ("GRID",          (0,0),(-1,-1), 0.4, colors.Color(0.7,0.85,0.78)),
    ("TOPPADDING",    (0,0),(-1,-1), 4),
    ("BOTTOMPADDING", (0,0),(-1,-1), 4),
    ("LEFTPADDING",   (0,0),(-1,-1), 8),
    ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
])

_abbr_rows = []
for row in abbr_data:
    if isinstance(row, list) and isinstance(row[0], str):
        _abbr_rows.append([
            Paragraph(row[0], S("Normal",fontSize=9,fontName="Times-Bold",leading=12)),
            Paragraph(row[1], S("Normal",fontSize=9,fontName="Times-Roman",leading=12)),
        ])
    else:
        _abbr_rows.append(row)

story += [
    H1("List of Abbreviations"), hr(),
    Table(_abbr_rows, colWidths=[TW*0.20, TW*0.80], style=_abbr_style, repeatRows=1),
    PageBreak(),
]

# ── Organization of the Document ─────────────────────────
story += [
    H1("Organization of the Document"), hr(),
    P("This industrial practice report is organized into the following chapters and preliminary "
      "sections, each addressing a distinct aspect of the internship and the OBU-SIS software "
      "development project:"),
    B("<b>Preliminary Sections:</b> Include the cover page, acknowledgement, list of abbreviations, "
      "table of contents, and this organizational overview."),
    B("<b>Chapter 1 "+chr(8212)+" Introduction:</b> Provides the background of the host organization "
      "(Oda Bultum University), its organizational structure and hierarchy, the internship team and "
      "department overview, the project context (purpose, problem statement, and scope), and the "
      "general and specific objectives of the OBU-SIS project."),
    B("<b>Chapter 2 "+chr(8212)+" Software Development Plan:</b> Details the project schedule with "
      "a visual Gantt chart, required hardware and software resources, physical workspace, risk "
      "management register, development methodology (Agile Scrum), quality assurance protocols, "
      "and the list of required project documents."),
    B("<b>Chapter 3 "+chr(8212)+" System Requirements (Planned):</b> Will cover the analysis of the "
      "existing legacy system and the full functional and non-functional requirements of the proposed "
      "OBU-SIS."),
    B("<b>Chapter 4 "+chr(8212)+" System Analysis and Design (Planned):</b> Will present use case "
      "diagrams, class diagrams, sequence diagrams, UI mockups, software architecture decomposition, "
      "and security and access control design."),
    B("<b>Chapter 5 "+chr(8212)+" Implementation (Planned):</b> Will document the development "
      "process, tools used, technical challenges and their resolutions, and testing results."),
    B("<b>Chapter 6 "+chr(8212)+" Reflection and Conclusion (Planned):</b> Will present learning "
      "outcomes, challenges faced during the internship, and recommendations for the organization "
      "and future internship programs."),
    B("<b>Appendices and References:</b> Will include code snippets, full diagrams, and all "
      "cited sources formatted in IEEE/APA style."),
    PageBreak(),
]

story += [
    CHAP("Chapter 1: Introduction"), hr(),
    P("This chapter provides a comprehensive overview of the industrial internship undertaken "
      "at Oda Bultum University (OBU) in Chiro, Western Hararghe, Oromia, Ethiopia. It describes "
      "the host organization, its structural hierarchy, the department in which the internship was "
      "conducted, the context of the proposed software project, and the objectives set for the "
      "internship period."),
    sp(6),

    H1("1.1. Background of the Organization"), hr(),
    P("Oda Bultum University (OBU) is a public higher education institution established in 2015 "
      "under the Ethiopian Ministry of Education, located in Chiro, the capital of West Hararghe "
      "Zone, Oromia Regional State. The university was founded to expand access to quality higher "
      "education in the eastern regions of Ethiopia, addressing a critical gap in the availability "
      "of tertiary institutions serving a large and historically underserved population."),
    P("Since its establishment, OBU has grown rapidly in enrollment, academic programs, and "
      "physical infrastructure. The university currently serves thousands of undergraduate students "
      "across six academic colleges: the College of Agriculture, the College of Natural and "
      "Computational Sciences, the College of Business and Economics, the College of Social Sciences "
      "and Humanities, the College of Health and Medical Sciences, and the Institute of Technology. "
      "These colleges collectively offer a wide range of undergraduate programs tailored to regular, "
      "extension, weekend, and summer modalities, serving both fresh school leavers and working "
      "professionals seeking degree qualifications."),
    P("The university operates under the leadership of a President supported by Vice Presidents "
      "responsible for Academic Affairs, Research and Community Service, and Administration and "
      "Finance. The Registrar's Office is a central administrative body that operates directly "
      "under the Vice President for Academic Affairs and is responsible for the management of all "
      "student academic records, enrollment data, grade processing, and transcript issuance across "
      "all colleges. As the institution has grown, the demands placed on the Registrar's Office "
      "have intensified, exposing significant weaknesses in the existing administrative systems."),
    P("The Registrar's Office at OBU serves as the primary internship host organization. During "
      "the internship period, the intern worked in close collaboration with the ICT Directorate "
      "and selected academic departments to investigate the systemic inefficiencies of the existing "
      "student record management infrastructure and to design and develop a replacement system."),
    sp(6),

    H1("1.2. Structure of the Organization"), hr(),
    P("Oda Bultum University operates under a hierarchical administrative structure consistent "
      "with the Ethiopian public university governance framework. The organizational hierarchy "
      "relevant to this internship project is presented below:"),
    B("<b>University President:</b> The chief executive officer of the university, responsible "
      "for overall institutional leadership, strategic direction, and external representation."),
    B("<b>Vice President for Academic Affairs:</b> Oversees all academic programs, faculty "
      "matters, curriculum policy, and the Registrar's Office."),
    B("<b>Registrar's Office:</b> The central body for student admissions, enrollment management, "
      "academic record keeping, grade processing, graduation auditing, and transcript issuance. "
      "The Registrar directly supervises College Assistant Registrars embedded within each college."),
    B("<b>College Deans:</b> Academic heads of each of the six colleges, responsible for "
      "curriculum oversight, academic quality, and coordination between the faculty and the "
      "Registrar's Office."),
    B("<b>Department Heads:</b> Heads of academic departments within each college, responsible "
      "for coordinating course offerings, supervising faculty grade submissions, and processing "
      "student add/drop requests."),
    B("<b>ICT Directorate:</b> Responsible for managing the university's information technology "
      "infrastructure, including servers, network infrastructure, and software systems. The ICT "
      "Directorate acts as the technical counterpart for the OBU-SIS deployment."),
    B("<b>Faculty Members / Instructors:</b> Academic staff responsible for teaching, continuous "
      "assessment, and submitting final student grade sheets to Department Heads."),
    B("<b>Students:</b> The primary end-users of the academic services, including course "
      "registration, grade viewing, and graduation clearance."),

    P("This hierarchical structure defines the primary stakeholder map for the OBU-SIS project. "
      "Each level of the hierarchy has distinct roles within the student academic lifecycle, and "
      "the proposed system is designed to digitize and streamline interactions across all levels. "
      "<b>The hierarchy directly translates into the system's authorization boundaries</b>: the "
      "President and VP level are represented by the System Administrator role; the Registrar "
      "maps to the Registrar Officer role; College Deans and Department Heads map to the "
      "Academic Supervisor role; and Instructors and Students each have dedicated portal access. "
      "This ensures that all data modifications within OBU-SIS follow the official university "
      "administrative approval chain."),
    sp(8),
    Paragraph("<b>Figure 1.1: Organizational Hierarchy of Oda Bultum University (Relevant to OBU-SIS)</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER, spaceBefore=4, spaceAfter=6)),
]

# ── Org Chart drawn with nested tables ────────────────────────────────────────
def _obox(text, w, bg=None, tc=None, fs=8):
    bg  = bg or colors.white
    tc2 = tc or PRIMARY
    fn  = "Times-Bold" if tc2 == PRIMARY else "Times-Roman"
    p   = Paragraph(f"<b>{text}</b>" if fn == "Times-Bold" else text,
                    S("Normal", fontSize=fs, leading=11, textColor=tc2,
                      alignment=TA_CENTER, fontName=fn))
    return Table([[p]], colWidths=[w], style=TableStyle([
        ("BOX",          (0,0),(-1,-1), 1.2, PRIMARY),
        ("BACKGROUND",   (0,0),(-1,-1), bg),
        ("TOPPADDING",   (0,0),(-1,-1), 6),
        ("BOTTOMPADDING",(0,0),(-1,-1), 6),
        ("LEFTPADDING",  (0,0),(-1,-1), 4),
        ("RIGHTPADDING", (0,0),(-1,-1), 4),
    ]))

def _arr():
    return Paragraph(chr(9660), S("Normal", fontSize=10, textColor=PRIMARY,
                                  alignment=TA_CENTER, leading=12))

_OW  = TW                          # full width
_HW  = TW * 0.38                   # half-ish
_COL = colors.Color(0.82,0.93,0.87) # light green bg for secondary boxes

# Row 1 — President
_r1 = Table([[_obox("University President", _OW*0.55,
              bg=PRIMARY, tc=colors.white, fs=9)]],
            colWidths=[_OW],
            style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                               ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
# arrow
_a1 = Table([[_arr()]], colWidths=[_OW],
            style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                               ("TOPPADDING",(0,0),(-1,-1),2),("BOTTOMPADDING",(0,0),(-1,-1),2)]))
# Row 2 — VP Academic Affairs
_r2 = Table([[_obox("Vice President\nfor Academic Affairs", _OW*0.50,
              bg=colors.Color(0.15,0.45,0.32), tc=colors.white, fs=8)]],
            colWidths=[_OW],
            style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                               ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
# Row 3 — Registrar + ICT side by side
_r3 = Table([[
    _obox("Registrar's Office", _HW*0.90, bg=_COL, fs=8),
    Spacer(_OW*0.10, 1),
    _obox("ICT Directorate", _HW*0.90, bg=_COL, fs=8),
]], colWidths=[_HW*0.90, _OW*0.10, _HW*0.90],
    style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                       ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
# Row 4 — Deans + Dept Heads
_cw4 = TW * 0.30
_sp4 = (TW - 3*_cw4) / 2
_r4 = Table([[
    _obox("College Deans", _cw4, fs=7),
    Spacer(_sp4, 1),
    _obox("Department Heads", _cw4, fs=7),
    Spacer(_sp4, 1),
    _obox("Asst. Registrars", _cw4, fs=7),
]], colWidths=[_cw4, _sp4, _cw4, _sp4, _cw4],
    style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                       ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
# Row 5 — Instructors + Students
_cw5 = TW * 0.35
_sp5 = TW - 2*_cw5
_r5 = Table([[
    _obox("Instructors /\nFaculty Members", _cw5, bg=colors.Color(0.95,0.99,0.97), fs=7),
    Spacer(_sp5, 1),
    _obox("Students\n(Regular / Extension / Summer)", _cw5, bg=colors.Color(0.95,0.99,0.97), fs=7),
]], colWidths=[_cw5, _sp5, _cw5],
    style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                       ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))

story += [_r1, _a1, _r2, _a1, _r3, _a1, _r4, _a1, _r5, sp(12)]

story += [
    sp(6),

    H1("1.3. Team and Department Overview"), hr(),
    P("The internship was conducted primarily within the ICT Directorate and the Registrar's "
      "Office of Oda Bultum University. The ICT Directorate serves as the technical backbone of "
      "the institution, managing the university's Local Area Network (LAN), server infrastructure, "
      "and all deployed software systems. The department is staffed by IT officers, network "
      "engineers, and system administrators who are responsible for maintaining uptime, managing "
      "user accounts, and providing technical support across all faculties."),
    P("The intern was assigned to work under the supervision of the ICT Director, collaborating "
      "closely with the following personnel:"),
    B("<b>ICT Director:</b> Provided institutional guidance, approved the project scope, and "
      "coordinated access to server infrastructure and existing system documentation."),
    B("<b>Senior Registrar Officer:</b> Served as the primary domain expert, providing detailed "
      "insight into the existing manual workflows, data structures, and pain points in the "
      "current system."),
    B("<b>College Assistant Registrars (x3):</b> Representatives from the Colleges of Natural "
      "Sciences, Business and Economics, and the Institute of Technology participated in "
      "requirements gathering sessions and early UAT walkthroughs."),
    B("<b>Academic Advisor (Haramaya University):</b> Mr. Kibru G. provided academic oversight, "
      "reviewed technical deliverables, and ensured alignment with the internship program "
      "requirements of the Department of Computer Science at Haramaya University."),
    P("The intern's role was that of a sole full-stack software developer and systems analyst. "
      "Responsibilities included requirement analysis, system architecture design, backend API "
      "and frontend development, testing, documentation, and LAN deployment."),
    H2("1.3.1. Daily Workflow and Collaboration Methods"),
    P("Collaboration followed a structured cadence throughout the 45-day internship period. "
      "<b>Bi-weekly progress meetings</b> were held with the ICT Director every Monday and "
      "Thursday to review completed sprint tasks, demonstrate working software increments, and "
      "obtain approval for the next sprint's scope. <b>Ad-hoc requirement validation sessions</b> "
      "were conducted with the Senior Registrar Officer whenever ambiguity arose around academic "
      "workflows, grade processing rules, or clearance procedures. Written progress summaries "
      "were submitted to the Academic Advisor, Mr. Kibru G., at the end of each sprint cycle."),
    P("The ICT Directorate's internal operational workflow follows a ticket-based system for "
      "user support requests, while infrastructure changes require formal written approval from "
      "the ICT Director before deployment. During the internship, all system changes were logged "
      "and reviewed with the ICT Director prior to each sprint review, maintaining alignment "
      "with the directorate's change management process."),
    sp(6),

    H1("1.4. Project Context"), hr(),
    H2("1.4.1. Purpose"),
    P("The central purpose of this internship project is to replace the fragmented, inefficient, "
      "and error-prone administrative systems currently used to manage student academic records at "
      "Oda Bultum University with a unified, secure, and high-performance web-based Student "
      "Information System (OBU-SIS). The project addresses a direct institutional need identified "
      "through observation and stakeholder interviews during the initial phase of the internship."),
    H2("1.4.2. Problem Statement"),
    P("The Registrar's Office and affiliated academic departments at OBU currently operate using "
      "a fragmented combination of standalone desktop applications, disconnected web forms, and "
      "manual paper-based spreadsheets. This legacy infrastructure introduces multiple critical "
      "failure points:"),
    B("<b>High-Concurrency System Failures:</b> During peak registration and grade-entry windows, "
      "the existing server stack collapses under concurrent load, causing data corruption, "
      "timeout errors, and administrative downtime lasting hours or days."),
    B("<b>Data Fragmentation:</b> Each college maintains isolated student records with no "
      "centralized synchronization, leading to inconsistencies when students transfer programs "
      "or require cross-departmental verification."),
    B("<b>Manual Grade Processing Lag:</b> Physical grade sheets are compiled, signed, and "
      "hand-delivered by instructors, introducing a multi-week delay between grade submission "
      "and student notification. This prevents timely prerequisite enforcement."),
    B("<b>Absence of Audit Controls:</b> There are no tamper-proof logs to record changes to "
      "student records, grades, or enrollment statuses, creating serious accountability and "
      "integrity risks."),
    B("<b>No Backup or Disaster Recovery:</b> The current infrastructure has no automated backup "
      "policy, placing years of irreplaceable student academic records at risk of permanent loss."),
    H2("1.4.3. Scope"),
    P("The scope of OBU-SIS covers the complete undergraduate student academic lifecycle "
      "across all six colleges of Oda Bultum University, from initial admission intake through "
      "course registration, grade processing, academic standing computation, clearance workflows, "
      "and graduation auditing. The system is deployed on the university's internal LAN "
      "infrastructure and is not accessible from the public internet, ensuring data privacy and "
      "compliance with the institution's security requirements."),
    sp(6),

    H1("1.5. Objectives"), hr(),
    H2("1.5.1. General Objective"),
    P("To design, develop, test, and deploy a secure, high-performance, web-based Centralized "
      "Student Information System (OBU-SIS) that automates the academic record management "
      "lifecycle of Oda Bultum University, guarantees transactional data integrity, and "
      "eliminates manual administrative bottlenecks across all six colleges."),
    P("The following specific objectives define the measurable outcomes the OBU-SIS project "
      "aims to achieve by the end of the 45-day internship period:"),
    B("To engineer a relational database schema normalized to Third Normal Form (3NF) with "
      "strict foreign key constraints, cascading triggers, and compound indexes ensuring "
      "data redundancy SR = 0."),
    B("To develop a Role-Based Access Control (RBAC) middleware layer that enforces strict "
      "data access boundaries across five user roles: System Administrator, Registrar Officer, "
      "College Dean/Department Head, Instructor, and Student."),
    B("To implement an automated server-side GPA and CGPA computation engine based on OBU "
      "Senate legislation, eliminating all manual grade calculation discrepancies."),
    B("To optimize API query performance so that multi-criteria student record searches "
      "execute within a response threshold of t < 2.0 seconds under simulated concurrent load."),
    B("To design a responsive, low-bandwidth web user interface accessible over the university's "
      "campus LAN on both desktop and mobile devices."),
    B("To implement an automated database backup and point-in-time recovery mechanism with "
      "a defined Recovery Time Objective (RTO) to protect institutional academic records."),
    B("To produce comprehensive technical documentation including a system architecture design "
      "document, administrator's manual, role-specific user guides, and full API documentation "
      "using Swagger/OpenAPI."),
    sp(4),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# CHAPTER 2: SOFTWARE DEVELOPMENT PLAN
# ══════════════════════════════════════════════════════════
story += [
    CHAP("Chapter 2: Software Development Plan"), hr(),
    P("This chapter presents the detailed software development plan for the OBU-SIS project. "
      "The project is <b>currently in progress</b> and is being developed over a 45-day "
      "internship period at Oda Bultum University. This chapter outlines the project schedule, "
      "required resources, risk management strategy, development methodology, quality assurance "
      "approach, and the set of required documentation to be produced throughout the internship."),
    sp(6),

    H1("2.1. Project Schedule"), hr(),
    P("The OBU-SIS internship project spans a <b>45-day (approximately 9-week) execution "
      "window</b>. At the time of this interim submission, <b>Phase 1 (Planning) and Phase 2 "
      "(System Design)</b> have been completed. Development sprints (Phases 3"+chr(8211)+"6) "
      "are currently underway. The Gantt chart and schedule table below map all eight phases "
      "to their corresponding weeks and deliverables."),
    sp(4),
]

# ── Gantt Chart ──────────────────────────────────────────────────────────────
story.append(Paragraph("<b>Figure 2.1: Project Gantt Chart (45-Day Internship Schedule)</b>",
    S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
      textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER, spaceBefore=4, spaceAfter=6)))

_WEEKS = 9
_gantt_phases = [
    ("1. Planning & Requirements",    1, 1),
    ("2. System Design & ERD",        2, 2),
    ("3. Sprint 1 — Auth & RBAC",     3, 4),
    ("4. Sprint 2 — Registration",    4, 5),
    ("5. Sprint 3 — Grading",         5, 6),
    ("6. Sprint 4 — Clearance",       6, 7),
    ("7. Testing & QA",               7, 8),
    ("8. UAT, Deploy & Handover",     8, 9),
]

_week_labels = [S("Normal", fontSize=7, leading=10, fontName="Times-Bold",
                   textColor=colors.white, alignment=TA_CENTER)
                for _ in range(_WEEKS)]
_ph_w  = TW * 0.30
_wk_w  = (TW - _ph_w) / _WEEKS

# header row
_gh = [Paragraph("<b>Phase</b>", S("Normal", fontSize=7.5, leading=10,
        fontName="Times-Bold", textColor=colors.white, alignment=TA_LEFT))]
_gh += [Paragraph(f"W{i+1}", S("Normal", fontSize=7, leading=10,
        fontName="Times-Bold", textColor=colors.white, alignment=TA_CENTER))
        for i in range(_WEEKS)]

_gantt_rows = [_gh]
for label, ws, we in _gantt_phases:
    row = [Paragraph(label, S("Normal", fontSize=7.5, leading=10,
                               fontName="Times-Roman", alignment=TA_LEFT))]
    for w in range(1, _WEEKS+1):
        if ws <= w <= we:
            row.append(Table([[""]], colWidths=[_wk_w], style=TableStyle([
                ("BACKGROUND",(0,0),(-1,-1), PRIMARY),
                ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0),
                ("LEFTPADDING",(0,0),(-1,-1),1),("RIGHTPADDING",(0,0),(-1,-1),1)])))
        else:
            row.append("")
    _gantt_rows.append(row)

_gantt_col_ws = [_ph_w] + [_wk_w]*_WEEKS
_gantt_style = TableStyle([
    ("BACKGROUND",    (0,0), (-1,0),  PRIMARY),
    ("TEXTCOLOR",     (0,0), (-1,0),  colors.white),
    ("ROWBACKGROUNDS",(0,1), (-1,-1), [ROW_ALT, colors.white]),
    ("GRID",          (0,0), (-1,-1), 0.3, colors.Color(0.75,0.85,0.80)),
    ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
    ("TOPPADDING",    (0,0), (-1,-1), 3),
    ("BOTTOMPADDING", (0,0), (-1,-1), 3),
    ("LEFTPADDING",   (0,0), (-1,-1), 3),
    ("RIGHTPADDING",  (0,0), (-1,-1), 3),
])

story.append(Table(_gantt_rows, colWidths=_gantt_col_ws, style=_gantt_style, repeatRows=1))
story.append(sp(4))

# Schedule table
TB_plain = TableStyle([
    ("BACKGROUND",    (0,0),(-1,0),  PRIMARY),
    ("TEXTCOLOR",     (0,0),(-1,0),  colors.white),
    ("FONTNAME",      (0,0),(-1,0),  "Times-Bold"),
    ("FONTSIZE",      (0,0),(-1,0),  9),
    ("ROWBACKGROUNDS",(0,1),(-1,-1), [ROW_ALT, colors.white]),
    ("FONTSIZE",      (0,1),(-1,-1), 9),
    ("FONTNAME",      (0,1),(-1,-1), "Times-Roman"),
    ("VALIGN",        (0,0),(-1,-1), "TOP"),
    ("GRID",          (0,0),(-1,-1), 0.4, colors.Color(0.7,0.85,0.78)),
    ("LEFTPADDING",   (0,0),(-1,-1), 5),
    ("RIGHTPADDING",  (0,0),(-1,-1), 5),
    ("TOPPADDING",    (0,0),(-1,-1), 4),
    ("BOTTOMPADDING", (0,0),(-1,-1), 4),
    ("FONTNAME",      (0,1),(0,-1),  "Times-Bold"),
])

def TC(t, bold=False):
    fn = "Times-Bold" if bold else "Times-Roman"
    return Paragraph(("<b>"+t+"</b>") if bold else t,
                     S("Normal", fontSize=9, leading=12, fontName=fn))

sched = [
    [TC("Phase",True), TC("Activity / Deliverable",True), TC("Weeks",True), TC("Duration",True)],
    [TC("1. Planning",True),
     TC("Stakeholder interviews, requirement gathering, user story writing, product backlog creation."),
     TC("Week 1"), TC("5 days")],
    [TC("2. System Design",True),
     TC("3NF database schema (ERD), system architecture design, UI wireframes and high-fidelity mockups."),
     TC("Week 2"), TC("5 days")],
    [TC("3. Sprint 1 "+chr(8212)+" Auth",True),
     TC("User authentication module, RBAC middleware, JWT integration, admin dashboard skeleton."),
     TC("Weeks 3"+chr(8211)+"4"), TC("10 days")],
    [TC("4. Sprint 2 "+chr(8212)+" Registration",True),
     TC("Course catalogue, prerequisite enforcement, student registration module, advisor workflow."),
     TC("Weeks 4"+chr(8211)+"5"), TC("7 days")],
    [TC("5. Sprint 3 "+chr(8212)+" Grading",True),
     TC("Grade entry, automated GPA/CGPA engine, probation alerts, transcript generation."),
     TC("Weeks 5"+chr(8211)+"6"), TC("7 days")],
    [TC("6. Sprint 4 "+chr(8212)+" Clearance",True),
     TC("Multi-department clearance module, finance integration, graduation audit tool."),
     TC("Weeks 6"+chr(8211)+"7"), TC("7 days")],
    [TC("7. Testing & QA",True),
     TC("Integration testing, Locust load tests, RBAC security audit, bug fixes."),
     TC("Weeks 7"+chr(8211)+"8"), TC("5 days")],
    [TC("8. UAT, Deploy & Handover",True),
     TC("UAT with end-users, training sessions, production LAN deployment, documentation handover."),
     TC("Weeks 8"+chr(8211)+"9"), TC("4 days")],
]

story += [
    Table(sched, colWidths=[TW*0.22, TW*0.52, TW*0.13, TW*0.13],
          style=TB_plain, repeatRows=1),
    sp(4),
    Paragraph("<i>Note: The schedule is subject to minor adjustments based on stakeholder "
              "availability and sprint review feedback.</i>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.grey)),
    sp(8),

    H1("2.2. Resources"), hr(),
    H2("2.2.1. Software Tools"),
    B("<b>Django 4.x (Python):</b> Primary backend web framework for API development, ORM-based "
      "database interaction, and server-side business logic."),
    B("<b>Django REST Framework (DRF):</b> Toolkit for building and documenting scalable RESTful APIs."),
    B("<b>React.js 18:</b> Frontend JavaScript library for building the dynamic single-page application."),
    B("<b>Redux Toolkit:</b> State management library for the React frontend."),
    B("<b>Tailwind CSS:</b> Utility-first CSS framework for responsive UI design."),
    B("<b>PostgreSQL 15:</b> Primary relational database management system."),
    B("<b>Nginx:</b> Production web server acting as a reverse proxy and static asset server."),
    B("<b>Gunicorn:</b> Python WSGI application server for serving Django in production."),
    B("<b>Git / GitHub:</b> Version control and source code repository management."),
    B("<b>VS Code:</b> Primary integrated development environment (IDE)."),
    B("<b>Postman:</b> API testing and documentation tool used during development."),
    B("<b>Locust:</b> Open-source load testing framework for performance validation."),
    B("<b>Swagger / OpenAPI:</b> Automated interactive API documentation generation."),
    H2("2.2.2. Hardware and Infrastructure"),
    B("<b>Development Machine:</b> Personal laptop running Kali Linux (used for development, "
      "testing, and code management)."),
    B("<b>OBU Campus Server (Production):</b> A dedicated physical server located within the "
      "university's data center, accessible exclusively over the campus LAN. The system is "
      "intentionally isolated from the public internet to protect sensitive student records."),
    B("<b>Campus Local Area Network (LAN):</b> The university's internal network infrastructure "
      "over which the deployed system is accessed by all user groups."),
    H2("2.2.3. Physical Workspace"),
    P("The intern was provided a designated workstation within the <b>OBU ICT Directorate main "
      "office</b>, located in the university's administrative building. The workspace was equipped "
      "with a reliable power supply, direct campus LAN drop-point connectivity, and access to "
      "the university's internal server infrastructure. The physical environment enabled continuous "
      "access to the development and staging servers throughout the internship period without "
      "dependency on external internet connectivity."),
    H2("2.2.4. Developer Role (Individual Project)"),
    P("This project is an <b>individual effort</b>. All work including requirements "
      "analysis, database design, system architecture, backend and frontend development, "
      "testing, documentation, and deployment is carried out solely by the intern, "
      "NEDI USMAN, under the guidance of supervisors. There is no development team."),
    B("<b>Developer: NEDI USMAN (Intern):</b> Solely responsible for the entire "
      "project lifecycle "+chr(8212)+" from requirements analysis and system design "
      "through to coding, testing, deployment, and documentation."),
    B("<b>ICT Director (Supervisor):</b> Provides server access, institutional guidance, "
      "and deployment oversight. Does not contribute to software development."),
    B("<b>Senior Registrar Officer (Domain Advisor):</b> Provides domain knowledge "
      "for requirements validation and participates in UAT as an end-user."),
    B("<b>Academic Advisor, Mr. Kibru G. (Haramaya University):</b> Provides academic "
      "oversight, reviews progress reports, and gives feedback on deliverables."),
    sp(6),

    H1("2.3. Risk Management"), hr(),
    P("A proactive risk register was established at the start of the project. The table below "
      "identifies each key risk, its probability, potential impact, and the planned mitigation "
      "and contingency strategy."),
    sp(4),
]

risk_data = [
    [TC("Risk",True), TC("Prob.",True), TC("Impact",True), TC("Mitigation / Contingency",True)],
    [TC("Scope creep from stakeholders requesting features beyond agreed scope."),
     TC("High"), TC("High"),
     TC("Formal change request process in place. All new feature requests deferred to a post-internship backlog.")],
    [TC("Unstable campus LAN causing deployment and testing disruptions."),
     TC("Medium"), TC("High"),
     TC("Full local development and testing on a localhost mirror. LAN deployment only after stable build is confirmed.")],
    [TC("Data loss or corruption during migration from legacy spreadsheets."),
     TC("Medium"), TC("Critical"),
     TC("Migration scripts run in a sandboxed staging environment. Row counts and checksums validated before live cutover.")],
    [TC("Key stakeholder unavailability during User Acceptance Testing."),
     TC("Medium"), TC("Medium"),
     TC("UAT sessions scheduled three weeks in advance with backup contacts identified in each department.")],
    [TC("Security vulnerabilities in the RBAC or authentication layer."),
     TC("Low"), TC("Critical"),
     TC("All authentication code peer-reviewed. OWASP Top 10 checklist applied. Django's built-in CSRF and XSS protections enabled.")],
    [TC("API performance failure under peak concurrent load."),
     TC("Medium"), TC("High"),
     TC("PgBouncer connection pooling implemented. Locust load tests run at end of Sprint 4 with tuning applied before UAT.")],
    [TC("Timeline slippage due to underestimated development complexity."),
     TC("Medium"), TC("Medium"),
     TC("Two-week buffer built into schedule. Weekly sprint reviews used to detect delays and re-prioritize the backlog.")],
]

story += [
    Table(risk_data, colWidths=[TW*0.36, TW*0.10, TW*0.10, TW*0.44],
          style=TB_plain, repeatRows=1),
    sp(8),

    H1("2.4. Development Methodology"), hr(),
    P("The OBU-SIS project will be developed using the <b>Agile Scrum methodology</b>. "
      "This choice is justified by the following factors inherent to the project context:"),
    B("<b>Evolving Requirements:</b> Initial stakeholder interviews revealed that the full "
      "scope of requirements could not be perfectly defined upfront. Agile's iterative "
      "approach accommodates requirement refinement across sprints without disrupting the "
      "overall project trajectory."),
    B("<b>Frequent Stakeholder Feedback:</b> The Registrar's Office and ICT Directorate "
      "are available for regular sprint reviews. This enables early detection of misaligned "
      "features and rapid course correction before significant development investment is made."),
    B("<b>Modular Delivery:</b> The system's architecture naturally decomposes into "
      "independently deliverable modules (Auth, Registration, Grading, Clearance), each "
      "of which maps cleanly to a two-week sprint cycle."),
    B("<b>Risk Reduction:</b> Delivering a working increment at the end of each sprint "
      "ensures that a functional, deployable system exists at all times, reducing the risk "
      "of total project failure."),
    P("The Scrum framework will be implemented with the following structure:"),
    B("<b>Sprint Duration:</b> Two weeks per sprint with a defined sprint goal."),
    B("<b>Sprint Planning:</b> At the start of each sprint, user stories are selected from "
      "the product backlog and assigned story points based on estimated complexity."),
    B("<b>Daily Progress Tracking:</b> Daily written progress notes maintained to track "
      "task completion against sprint goals."),
    B("<b>Sprint Review:</b> A demonstration of completed features to the ICT Director "
      "and Registrar Officer at the end of each sprint for feedback and acceptance."),
    B("<b>Retrospective:</b> A brief post-sprint reflection to identify process improvements "
      "for the subsequent sprint."),
    sp(6),

    H1("2.5. Quality Assurance"), hr(),
    P("Quality assurance is embedded throughout the development lifecycle rather than "
      "treated as a final-stage activity. The following QA protocols will be applied:"),
    H2("2.5.1. Code Quality"),
    B("<b>Structured Self Code Reviews with Supervisor Spot-Checks:</b> As a solo developer, "
      "all features undergo structured self-review against a defined checklist covering naming "
      "conventions, DRY principles, error handling, and security patterns. To compensate for "
      "solo development constraints, critical security endpoints "+chr(8212)+"particularly the "
      "RBAC middleware and authentication layer"+chr(8212)+"were peer-reviewed with the ICT "
      "Directorate's system administrators prior to production staging. This ensures an "
      "independent technical perspective on the most security-sensitive components."),
    B("<b>Linting and Formatting:</b> Python code is formatted using Black and checked "
      "with Flake8. JavaScript/React code is linted using ESLint with the Airbnb "
      "style guide configuration."),
    B("<b>Version Control Discipline:</b> Feature branches are used for all development. "
      "Commits are atomic and descriptively labelled. No direct commits to the main branch."),
    H2("2.5.2. Testing"),
    B("<b>Unit Testing:</b> Django's built-in test framework (pytest-django) is used to "
      "write unit tests for all model methods, serializers, and API view logic. Target "
      "coverage: minimum 75% of backend business logic."),
    B("<b>Integration Testing:</b> API endpoints are tested end-to-end using Postman "
      "automated test collections to verify correct data flow between the frontend, "
      "backend, and database layers."),
    B("<b>Performance / Load Testing:</b> Locust is used to simulate concurrent user "
      "sessions during peak registration load. The acceptance criterion is that all "
      "multi-criteria student record searches complete within t < 2.0 seconds under "
      "simulated concurrent active requests."),
    B("<b>Security Testing:</b> OWASP Top 10 checklist applied manually. SQL injection, "
      "XSS, and CSRF protection verified. JWT token expiry and refresh logic tested "
      "under edge cases."),
    B("<b>User Acceptance Testing (UAT):</b> Conducted with representative users from "
      "each of the five user roles during Week 15. Feedback is recorded, prioritized, "
      "and resolved before production deployment."),
    H2("2.5.3. Documentation Standards"),
    B("All API endpoints documented using Swagger/OpenAPI, generating interactive "
      "documentation accessible to the ICT Directorate for future maintenance."),
    B("Inline code comments follow the Google Python Style Guide for backend code "
      "and JSDoc conventions for React components."),
    B("A formal System Architecture Design Document (SADD) is produced covering the "
      "database schema (ERD), API design, RBAC role matrix, and deployment topology."),
    H2("2.5.4. Documentation Version Control and Update Standards"),
    P("All system documentation is maintained under version control in the same Git repository "
      "as the source code, using a <b>docs/</b> directory with clearly named versioned files. "
      "Documentation must adhere to the following standards:"),
    B("All living documents (SADD, User Manuals, API Docs) are reviewed and updated at the "
      "conclusion of every development sprint to reflect any changes introduced during that cycle."),
    B("Document versioning follows Semantic Versioning (v1.0, v1.1, v2.0). Minor sprint updates "
      "increment the minor version; major architectural changes increment the major version."),
    B("The final documentation package is frozen and tagged in Git upon successful User "
      "Acceptance Testing, ensuring the ICT Directorate receives a stable, consistent set of "
      "reference documents aligned with the production release."),
    sp(6),

    H1("2.6. Required Documents"), hr(),
    P("The following documentation is planned to be produced and formally delivered to Oda Bultum "
      "University's ICT Directorate upon project completion:"),
    NB(1, "<b>System Architecture Design Document (SADD):</b> Covers the three-tier "
       "architecture, ERD, API design, RBAC role matrix, and LAN deployment topology diagram."),
    NB(2, "<b>Database Schema Document:</b> Full 3NF entity-relationship diagram with table "
       "definitions, column specifications, foreign key constraints, and index descriptions."),
    NB(3, "<b>API Documentation (Swagger/OpenAPI):</b> Auto-generated interactive documentation "
       "for all REST API endpoints, including request/response schemas and authentication requirements."),
    NB(4, "<b>Administrator's Manual:</b> Step-by-step guide for the ICT Directorate covering "
       "system installation, server configuration, backup procedures, user account management, "
       "and security audit log review."),
    NB(5, "<b>User Manuals (Role-Specific):</b> Separate manuals for Students, Instructors, "
       "Registrar Officers, and College Deans covering all system features relevant to each role."),
    NB(6, "<b>Test Reports:</b> Unit test coverage report, Postman integration test results, "
       "and Locust load testing performance report demonstrating compliance with the "
       "t < 2.0 second response time objective."),
    NB(7, "<b>Source Code Repository:</b> Fully commented frontend and backend source code "
       "in a version-controlled Git repository with a README, environment setup guide, "
       "and deployment instructions."),
    NB(8, "<b>Industrial Practice Report:</b> This document, submitted to Haramaya University "
       "Department of Computer Science as partial fulfillment of the B.Sc. program requirements."),
    sp(8),
]

# ══════════════════════════════════════════════════════════
# FOOTER + BUILD
# ══════════════════════════════════════════════════════════
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Times-Roman", 8)
    canvas.setFillColorRGB(0.058824, 0.298039, 0.227451)
    canvas.drawString(MARGIN, 1.3*cm,
        "Haramaya University  |  Dept. of Computer Science  |  Industrial Practice Report")
    canvas.setFillColorRGB(0.4, 0.4, 0.4)
    canvas.drawRightString(PAGE_W - MARGIN, 1.3*cm, "Page " + str(doc.page))
    canvas.restoreState()

try:
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print("Generated:", OUTPUT, "(", os.path.getsize(OUTPUT)//1024, "KB )")
except Exception as e:
    import traceback; traceback.print_exc()
