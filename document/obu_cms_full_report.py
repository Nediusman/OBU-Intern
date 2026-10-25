
import os
import math
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, HRFlowable, PageBreak, KeepTogether)
from reportlab.platypus import Image as RLImage
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT

OUTPUT = "/home/kali/indu/obu_cms_full_report.pdf"
PAGE_W, PAGE_H = A4
MARGIN = 2.5 * cm
TW = PAGE_W - 2 * MARGIN

# ── Brand Colors ──────────────────────────────────────────
PRIMARY  = colors.Color(0.058824, 0.298039, 0.227451)   # OBU dark green
PRIMARY2 = colors.Color(0.156863, 0.478431, 0.364706)   # OBU mid green
GOLD     = colors.Color(1.0, 0.80, 0.0)                 # OBU gold accent
ROW_ALT  = colors.Color(0.968627, 0.980392, 0.988235)
NOTE_BG  = colors.Color(0.941176, 0.992157, 0.956863)
LIGHT_GREEN = colors.Color(0.88, 0.96, 0.91)

doc = SimpleDocTemplate(OUTPUT, pagesize=A4,
    leftMargin=MARGIN, rightMargin=MARGIN, topMargin=MARGIN, bottomMargin=2.2*cm)

ss = getSampleStyleSheet(); _i = [0]
def S(b, **k): _i[0]+=1; return ParagraphStyle(f"s{_i[0]}", parent=ss[b], **k)

# ── Typography ────────────────────────────────────────────
chap  = S("Heading1", fontSize=15, textColor=PRIMARY, spaceBefore=20, spaceAfter=6,
          leading=20, fontName="Times-Bold")
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

# ── Figure / Table caption styles ─────────────────────────
fig_cap = S("Normal", fontSize=9, leading=13, fontName="Times-Roman",
            textColor=colors.Color(0.15,0.15,0.15), alignment=TA_CENTER,
            spaceBefore=5, spaceAfter=8,
            borderPadding=(4,8,4,8))

tbl_cap = S("Normal", fontSize=9, leading=13, fontName="Times-Bold",
            textColor=PRIMARY, alignment=TA_LEFT,
            spaceBefore=8, spaceAfter=3)

def FIG(num, title):
    """Centered italic figure caption with green label."""
    return Paragraph(
        f"<font color='#{int(PRIMARY.red*255):02x}{int(PRIMARY.green*255):02x}{int(PRIMARY.blue*255):02x}'>"
        f"<b>Figure {num}:</b></font> <i>{title}</i>",
        fig_cap)

def TBL(num, title):
    """Left-aligned bold table caption."""
    return Paragraph(
        f"<b>Table {num}:</b> {title}",
        tbl_cap)

# ── Helpers ───────────────────────────────────────────────
def hr():    return HRFlowable(width="100%", thickness=0.8, color=PRIMARY,  spaceAfter=6,  spaceBefore=2)
def hr2():   return HRFlowable(width="100%", thickness=0.3, color=PRIMARY2, spaceAfter=4,  spaceBefore=2)
def sp(h=8): return Spacer(1, h)
def H1(t):   return Paragraph(t, h1s)
def H2(t):   return Paragraph(t, h2s)
def P(t):    return Paragraph(t, body)
def B(t):    return Paragraph(chr(8226)+" "+t, bull)
def NB(n,t): return Paragraph(str(n)+". "+t, bull)

from reportlab.platypus import Flowable as _Flowable

# ── Chapter header flowable ───────────────────────────────
class ChapterTitlePage(_Flowable):
    """Full-bleed chapter opener: translates to page origin to fill entire page."""
    def __init__(self, number, title, subtitle, contents):
        super().__init__()
        self.number=number; self.title=title
        self.subtitle=subtitle; self.contents=contents
        self.width=TW
        # Height = full frame height so it consumes the whole page
        self.height=PAGE_H - MARGIN - 2.2*cm - 12  # match actual frame height
    def wrap(self,*a): return self.width, self.height
    def draw(self):
        c=self.canv; c.saveState()
        c.translate(-MARGIN, -2.2*cm)
        W, H = PAGE_W, PAGE_H

        # ── Full page white base ──────────────────────────
        c.setFillColor(colors.white); c.rect(0,0,W,H,fill=1,stroke=0)

        # ── Full-height left accent bar ───────────────────
        c.setFillColor(colors.Color(0.04,0.20,0.15)); c.rect(0,0,12,H,fill=1,stroke=0)

        # ── Top green band (top 45%) ──────────────────────
        band_h = H * 0.46
        c.setFillColor(PRIMARY); c.rect(0, H-band_h, W, band_h, fill=1, stroke=0)

        # ── Gold triangle accent ──────────────────────────
        c.setFillColor(GOLD)
        p=c.beginPath(); p.moveTo(12,H-band_h)
        p.lineTo(W*0.28,H-band_h); p.lineTo(12,H-band_h+40); p.close()
        c.drawPath(p,fill=1,stroke=0)

        # ── Bottom accent band ────────────────────────────
        c.setFillColor(PRIMARY); c.rect(0,0,W,40,fill=1,stroke=0)
        c.setFillColor(GOLD); c.rect(0,38,W,4,fill=1,stroke=0)

        # ── Huge watermark number ─────────────────────────
        if self.number.isdigit():
            c.setFont("Times-Bold",180)
            c.setFillColor(colors.Color(1,1,1,0.06))
            c.drawRightString(W-20, H-band_h-10, self.number)

        # ── CHAPTER N label ───────────────────────────────
        c.setFont("Times-Bold",13); c.setFillColor(GOLD)
        lbl="CHAPTER  "+self.number if self.number.isdigit() else self.number.upper()
        c.drawString(30, H-52, lbl)
        c.setStrokeColor(GOLD); c.setLineWidth(2)
        lw=c.stringWidth(lbl,"Times-Bold",13)
        c.line(30, H-58, 30+lw+60, H-58)

        # ── Chapter title ─────────────────────────────────
        c.setFillColor(colors.white)
        words=self.title.split()
        lines=[" ".join(words[i:i+5]) for i in range(0,len(words),5)]
        for idx,ln in enumerate(lines[:2]):
            c.setFont("Times-Bold",28)
            c.drawString(30, H-100-(idx*36), ln)

        # ── Subtitle inside green band ────────────────────
        if self.subtitle:
            c.setFont("Times-Roman",10.5)
            c.setFillColor(colors.Color(0.78,0.96,0.87))
            c.drawString(30, H-band_h+28, self.subtitle)

        # ── Sections card (in white area) ─────────────────
        if self.contents:
            n   = len(self.contents)
            row_h = 26
            card_h = n*row_h + 40
            cx  = 30
            cy  = H - band_h - 40    # top of card
            cw  = W - 60

            # Card background
            c.setFillColor(colors.Color(0.95,0.99,0.96))
            c.setStrokeColor(PRIMARY); c.setLineWidth(1.0)
            c.roundRect(cx, cy-card_h, cw, card_h, 8, fill=1)

            # Card header
            c.setFillColor(PRIMARY)
            c.roundRect(cx, cy-32, cw, 32, 5, fill=1, stroke=0)
            c.setFont("Times-Bold",10); c.setFillColor(colors.white)
            c.drawString(cx+16, cy-20, "Sections in this Chapter")

            # Rows
            for i,sec in enumerate(self.contents):
                iy = cy - 48 - (i*row_h)
                bg = colors.Color(0.91,0.97,0.93) if i%2==0 else colors.white
                c.setFillColor(bg)
                c.rect(cx+1,iy-row_h+6,cw-2,row_h,fill=1,stroke=0)
                c.setFont("Times-Roman",9.5); c.setFillColor(PRIMARY)
                c.drawString(cx+16, iy-8, chr(9658)+"  "+sec)

        # ── Footer text ───────────────────────────────────
        c.setFont("Times-Roman",8.5); c.setFillColor(colors.white)
        foot="OBU-CMS  |  Industrial Practice Report  |  Haramaya University  |  2026"
        tw=c.stringWidth(foot,"Times-Roman",8.5)
        c.drawString(W/2-tw/2, 13, foot)

        c.restoreState()


class ChapterHeader(_Flowable):
    """Draws a full-width styled chapter banner."""
    def __init__(self, number, title, subtitle=""):
        super().__init__()
        self.number   = number    # e.g. "1" or "Appendices"
        self.title    = title     # e.g. "Introduction"
        self.subtitle = subtitle
        self.width    = TW
        self.height   = 72

    def wrap(self, *args): return self.width, self.height

    def draw(self):
        c = self.canv
        W, H = self.width, self.height
        c.saveState()

        # Background band
        c.setFillColor(PRIMARY)
        c.roundRect(0, 0, W, H, 6, fill=1, stroke=0)

        # Gold left accent stripe
        c.setFillColor(GOLD)
        c.roundRect(0, 0, 8, H, 4, fill=1, stroke=0)

        # Chapter number — large, right side
        if self.number.isdigit():
            c.setFont("Times-Bold", 42)
            c.setFillColor(colors.Color(1,1,1,0.12))
            c.drawRightString(W-10, 8, self.number)

        # Chapter label
        c.setFont("Times-Roman", 8)
        c.setFillColor(GOLD)
        label = "CHAPTER " + self.number if self.number.isdigit() else self.number.upper()
        c.drawString(18, H-16, label)

        # Chapter title
        c.setFont("Times-Bold", 16)
        c.setFillColor(colors.white)
        c.drawString(18, H-38, self.title)

        # Subtitle / description line
        if self.subtitle:
            c.setFont("Times-Roman", 9)
            c.setFillColor(colors.Color(0.78, 0.96, 0.87))
            c.drawString(18, H-55, self.subtitle)

        c.restoreState()

# Chapter subtitles
_CHAP_SUBS = {
    "1": "Background, organizational context, project purpose and objectives",
    "2": "Project schedule, resources, methodology, quality assurance",
    "3": "Existing system analysis and proposed system requirements",
    "4": "UML diagrams, architecture, security model, database ERD",
    "5": "Development process, tools, challenges, and testing results",
    "6": "Learning outcomes, challenges faced, and recommendations",
}

_CHAP_DATA = {
    "1": ("Introduction",
          "Background, organizational context, project purpose and objectives",
          ["1.1 Background of the Organization",
           "1.2 Structure of the Organization",
           "1.3 Team and Department Overview",
           "1.4 Project Context",
           "1.5 Objectives"]),
    "2": ("Software Development Plan",
          "Project schedule, resources, risk management, methodology, quality assurance",
          ["2.1 Project Schedule","2.2 Resources","2.3 Risk Management",
           "2.4 Development Methodology","2.5 Quality Assurance","2.6 Required Documents"]),
    "3": ("System Requirements",
          "Existing system analysis and full functional/non-functional requirements",
          ["3.1 Existing System Analysis","3.1.1 Visual Comparison: Before and After",
           "3.2 Proposed System","3.2.1 Functional Requirements","3.2.2 Non-Functional Requirements"]),
    "4": ("System Analysis and Design",
          "UML diagrams, architecture, security model, and database design",
          ["4.1 System Models (UC, Class, Object, Sequence, State, Activity)",
           "4.2 User Interface Design & Navigational Flow",
           "4.3 Software Architecture (3-Tier, Component, Deployment)",
           "4.4 Security and Access Control","4.5 Database Design (ERD)"]),
    "5": ("Implementation",
          "Development process, tools used, challenges, and testing results",
          ["5.1 Development Process","5.2 Tools Used",
           "5.3 Challenges and Solutions","5.4 Testing Results"]),
    "6": ("Internship Reflection and Conclusion",
          "Learning outcomes, workplace challenges, and recommendations",
          ["6.1 Learning Outcomes","6.2 Challenges Faced","6.3 Recommendations"]),
}

def CHAP(t):
    """Returns list: [PageBreak, ChapterTitlePage, PageBreak, ChapterHeader, sp]."""
    if t.startswith("Chapter "):
        parts = t.split(":", 1)
        num   = parts[0].replace("Chapter ", "").strip()
        title = parts[1].strip() if len(parts) > 1 else t
        data  = _CHAP_DATA.get(num)
        if data:
            _, sub, sections = data
            return [
                PageBreak(),
                ChapterTitlePage(num, title, sub, sections),
                PageBreak(),
                ChapterHeader(num, title, sub),
                sp(12),
            ]
    # Appendices / References
    nm = t if not t.startswith("Chapter ") else t
    return [ChapterHeader(nm, nm, ""), sp(10)]



def TC(t, bold=False):
    fn = "Times-Bold" if bold else "Times-Roman"
    return Paragraph(("<b>"+t+"</b>") if bold else t,
                     S("Normal", fontSize=9, leading=12, fontName=fn))

# ── Table style ───────────────────────────────────────────
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
    ("LEFTPADDING",   (0,0),(-1,-1), 6),
    ("RIGHTPADDING",  (0,0),(-1,-1), 6),
    ("TOPPADDING",    (0,0),(-1,-1), 5),
    ("BOTTOMPADDING", (0,0),(-1,-1), 5),
    ("ROWBACKGROUNDS",(0,0),(0,0),   [PRIMARY]),
    ("LINEBELOW",     (0,0),(-1,0),  1.5, PRIMARY),
])

story = []

# ══════════════════════════════════════════════════════════
# COVER PAGE  — full-page professional academic design
# ══════════════════════════════════════════════════════════
from reportlab.platypus import Flowable as _Flowable

class CoverPage(_Flowable):
    """Full-page decorative cover drawn directly on canvas."""
    def __init__(self, w, h, haramaya_logo, obu_logo):
        super().__init__()
        self.width  = w
        self.height = h
        self._hlgo  = haramaya_logo
        self._olgo  = obu_logo

    def wrap(self, *args): return self.width, self.height

    def draw(self):
        c = self.canv
        W, H = self.width, self.height
        c.saveState()

        # ── Background: full white with left green accent bar ──
        c.setFillColor(colors.white)
        c.rect(0, 0, W, H, fill=1, stroke=0)

        # Left accent bar (dark green)
        c.setFillColor(PRIMARY)
        c.rect(0, 0, 14, H, fill=1, stroke=0)

        # Top accent bar
        c.setFillColor(PRIMARY)
        c.rect(0, H-10, W, 10, fill=1, stroke=0)

        # Gold thin line under top bar
        c.setFillColor(GOLD)
        c.rect(0, H-14, W, 4, fill=1, stroke=0)

        # Bottom accent bar
        c.setFillColor(PRIMARY)
        c.rect(0, 0, W, 10, fill=1, stroke=0)
        c.setFillColor(GOLD)
        c.rect(0, 10, W, 4, fill=1, stroke=0)

        # ── Logos row ─────────────────────────────────────────
        # OBU logo — left
        obu_size = 68
        obu_x = 30
        obu_y = H - 100
        self._olgo.drawOn(c, obu_x, obu_y)

        # Haramaya logo — right side, wider
        ham_w = W * 0.50
        ham_h = ham_w * (253 / 1392)
        ham_x = W - ham_w - 10
        ham_y = H - 90
        self._hlgo.drawOn(c, ham_x, ham_y)

        # Thin divider under logos
        c.setStrokeColor(PRIMARY)
        c.setLineWidth(1.5)
        c.line(30, H-108, W-10, H-108)
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.0)
        c.line(30, H-111, W-10, H-111)

        # ── University name block ──────────────────────────────
        c.setFillColor(PRIMARY)
        c.setFont("Times-Bold", 16)
        tw = c.stringWidth("HARAMAYA UNIVERSITY", "Times-Bold", 16)
        c.drawString(W/2-tw/2, H-142, "HARAMAYA UNIVERSITY")

        c.setFont("Times-Roman", 11)
        c.setFillColor(colors.Color(0.25,0.25,0.25))
        for i, txt in enumerate(["College of Computing and Informatics",
                                   "Department of Computer Science"]):
            tw = c.stringWidth(txt, "Times-Roman", 11)
            c.drawString(W/2-tw/2, H-158-(i*15), txt)

        # ── Report type badge ──────────────────────────────────
        bx, by, bw, bh = W/2-120, H-205, 240, 24
        c.setFillColor(LIGHT_GREEN)
        c.setStrokeColor(PRIMARY)
        c.setLineWidth(1.0)
        c.roundRect(bx, by, bw, bh, 5, fill=1)
        c.setFillColor(PRIMARY)
        c.setFont("Times-Bold", 10.5)
        txt = "INDUSTRIAL PRACTICE REPORT"
        tw = c.stringWidth(txt, "Times-Bold", 10.5)
        c.drawString(W/2-tw/2, by+7, txt)

        # ── Main title ─────────────────────────────────────────
        c.setFillColor(PRIMARY)
        title_lines = [
            "Design and Development of a Web-Based",
            "Dynamic Website and Content Management",
            "System for Oda Bultum University",
        ]
        c.setFont("Times-Bold", 15)
        for i, line in enumerate(title_lines):
            tw = c.stringWidth(line, "Times-Bold", 15)
            c.drawString(W/2-tw/2, H-248-(i*20), line)

        # Subtitle
        c.setFont("Times-Roman", 11)
        c.setFillColor(PRIMARY2)
        sub = "(OBU-CMS)"
        tw = c.stringWidth(sub, "Times-Roman", 11)
        c.drawString(W/2-tw/2, H-312, sub)

        # ── Submission statement ───────────────────────────────
        c.setFont("Times-Roman", 10)
        c.setFillColor(colors.Color(0.3,0.3,0.3))
        for i, line in enumerate([
            "Submitted as Part of the Industrial Internship Program",
            "Bachelor of Science Degree in Computer Science",
            "(Individual Internship Project)"
        ]):
            tw = c.stringWidth(line, "Times-Roman", 10)
            c.drawString(W/2-tw/2, H-340-(i*14), line)

        # ── Info table area ────────────────────────────────────
        # Background panel
        px, py, pw, ph = 30, H-500, W-40, 120
        c.setFillColor(colors.Color(0.96,0.99,0.97))
        c.setStrokeColor(PRIMARY)
        c.setLineWidth(0.8)
        c.roundRect(px, py, pw, ph, 8, fill=1)

        # Left accent bar on panel
        c.setFillColor(PRIMARY)
        c.roundRect(px, py, 5, ph, 3, fill=1, stroke=0)

        fields = [
            ("Prepared By",     "NEDI USMAN HUSSEN"),
            ("Student ID",      "2184/16"),
            ("Academic Advisor","Mr. Kibru G."),
            ("Internship Site", "Oda Bultum University \u2014 Chiro, Ethiopia"),
            ("Submission Date", "June 2026"),
        ]
        row_h = ph / len(fields)
        for i, (label, value) in enumerate(fields):
            ry = py + ph - (i+1)*row_h + row_h/2 - 4
            c.setFont("Times-Roman", 9)
            c.setFillColor(colors.Color(0.4,0.4,0.4))
            c.drawString(px+16, ry, label + ":")
            c.setFont("Times-Bold", 9.5)
            c.setFillColor(PRIMARY)
            c.drawString(px+130, ry, value)
            if i < len(fields)-1:
                c.setStrokeColor(colors.Color(0.82,0.92,0.86))
                c.setLineWidth(0.4)
                c.line(px+16, ry-4, px+pw-16, ry-4)

        # ── Footer ─────────────────────────────────────────────
        c.setFont("Times-Roman", 8.5)
        c.setFillColor(colors.Color(0.45,0.45,0.45))
        foot = "Oda Bultum University  \u2014  Chiro, Ethiopia  \u2014  June 2026"
        tw = c.stringWidth(foot, "Times-Roman", 8.5)
        c.drawString(W/2-tw/2, 22, foot)

        c.restoreState()

# Build logos at correct sizes for the CoverPage flowable
_doc_dir = os.path.dirname(os.path.abspath(__file__))
_hlgo_raw = RLImage("/home/kali/indu/haramaya_logo.png",
                    width=TW*0.50, height=TW*0.50*(253/1392))
_olgo_raw = RLImage(os.path.join(_doc_dir, "obu_logo.png"),
                    width=68, height=68)

story.append(CoverPage(TW, PAGE_H - 2*MARGIN - 10, _hlgo_raw, _olgo_raw))
story.append(PageBreak())
_lw3    = TW * 0.55
_lh3    = _lw3 * (253 / 1392)
_logo3  = RLImage("/home/kali/indu/haramaya_logo.png", width=_lw3, height=_lh3)
_obu_lw = TW * 0.14
_obu_lh = _obu_lw
_obu_logo = RLImage(os.path.join(_doc_dir, "obu_logo.png"),
                    width=_obu_lw, height=_obu_lh)

def tr2(t=2.0): return HRFlowable(width="100%", thickness=t, color=PRIMARY, spaceAfter=6, spaceBefore=6)
def tn2():      return HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.75,0.75,0.75), spaceAfter=4, spaceBefore=4)


# ══════════════════════════════════════════════════════════
# ACKNOWLEDGEMENT
# ══════════════════════════════════════════════════════════
story += [
    H1("Acknowledgement"), hr(),
    P("First and above all, praise be to <b>Almighty Allah (Subhanahu Wa Ta'ala)</b> for "
      "granting me the strength, patience, and capability to undertake and complete this "
      "industrial internship project. All success is by His grace alone "+chr(8212)+" "
      "Alhamdulillah."),
    P("I would like to express my sincere gratitude to all those who supported and guided me "
      "throughout this industrial internship project."),
    P("First and foremost, I extend my heartfelt thanks to my <b>Academic Advisor, Mr. Kibru G.</b>, "
      "of the Department of Computer Science, College of Computing and Informatics, Haramaya "
      "University, for his unwavering academic guidance, constructive feedback, and continuous "
      "encouragement throughout the internship period. His dedication to student development "
      "made a lasting impact on my growth as a software developer."),
    P("I am deeply grateful to the <b>ICT Directorate of Oda Bultum University</b> for providing "
      "a supportive working environment, server infrastructure access, and technical supervision "
      "during the development of the OBU-CMS. Special appreciation is extended to "
      "<b>Mr. Murad Ibrahim, Head of the Registrar's Office of Oda Bultum University</b>, for "
      "providing invaluable domain knowledge, workflow insight, and patience during requirements "
      "gathering and User Acceptance Testing sessions. His openness to share institutional "
      "processes was essential to the quality of this project."),
    P("I also extend special thanks to our <b>Department Head, Mr. Alemu G.</b>, and the entire "
      "<b>Department of Computer Science, Haramaya University</b>, for designing a structured "
      "and meaningful industrial internship program that bridges theoretical computer science "
      "education with real-world software engineering practice."),
    P("Finally, I am deeply grateful to my <b>family</b> for their unconditional love, prayers, "
      "and moral support throughout this challenging and rewarding journey. Your encouragement "
      "carried me through every difficult moment."),
    sp(8),
    Paragraph("NEDI USMAN", S("Normal", fontSize=11, fontName="Times-Bold",
              alignment=TA_LEFT, leading=14)),
    Paragraph("Department of Computer Science, Haramaya University",
              S("Normal", fontSize=10, fontName="Times-Roman", alignment=TA_LEFT, leading=14)),
    Paragraph("Internship Site: Oda Bultum University, Chiro, Ethiopia",
              S("Normal", fontSize=10, fontName="Times-Roman", alignment=TA_LEFT, leading=14)),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# ABSTRACT (EXECUTIVE SUMMARY)
# ══════════════════════════════════════════════════════════
story += [
    H1("Abstract"), hr(),
    P("This industrial practice report documents the design and development of a web-based "
      "dynamic website and Content Management System (OBU-CMS) for Oda Bultum University, "
      "undertaken during a 45-day internship at the university's ICT Directorate in Chiro, "
      "West Hararghe, Oromia, Ethiopia."),
    P("The existing web infrastructure of Oda Bultum University consisted of a static HTML/CSS "
      "website that required direct developer intervention for every content update, had no "
      "admin interface, no media management system, no role-based access control, and no "
      "mobile responsiveness. This created severe bottlenecks for the university's "
      "communications, admissions, and public information dissemination."),
    P("The proposed OBU-CMS replaces this legacy system with a fully dynamic, database-driven "
      "web platform built on <b>TanStack Start (React 19)</b>, <b>TypeScript</b>, "
      "<b>Tailwind CSS v4</b>, <b>Supabase (PostgreSQL)</b>, and <b>Radix UI</b>. The system "
      "provides a public-facing website with slug-based dynamic routing for all content "
      "entities (news, events, announcements, academic programs, research projects, leadership "
      "profiles, services, and galleries) alongside a fully featured Admin CMS panel at "
      "<i>/admin</i> enabling authorized staff to manage all university content without writing "
      "code."),
    P("Key technical achievements include: Row Level Security (RLS) policies enforced at the "
      "PostgreSQL database layer for role-based access control; a centralized media library "
      "backed by Supabase Storage; server-side rendering (SSR) achieving sub-2-second page "
      "load performance; CSRF middleware protection on all server functions; a comprehensive "
      "activity audit log; and a 25+ table normalized PostgreSQL schema deployed via versioned "
      "migration files."),
    P("All 45 server function endpoints passed integration testing. All RLS security tests "
      "passed with unauthenticated access correctly blocked. All 7 User Acceptance Testing "
      "scenarios passed with stakeholders from the ICT Directorate and Registrar's Office. "
      "The system was successfully deployed to production."),
    sp(6),
    Paragraph("<b>Keywords:</b> Content Management System, Web Development, TanStack Start, "
              "Supabase, PostgreSQL, Row Level Security, Server-Side Rendering, React, "
              "TypeScript, Tailwind CSS, Oda Bultum University, Industrial Internship.",
              S("BodyText", fontSize=10, leading=15, fontName="Times-Roman",
                alignment=TA_JUSTIFY, spaceAfter=7,
                leftIndent=20, rightIndent=20)),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# TABLE OF CONTENTS
# ══════════════════════════════════════════════════════════
_toc_main = S("Normal", fontSize=10, leading=15, fontName="Times-Bold",
               textColor=PRIMARY, spaceAfter=1)
_toc_sub  = S("Normal", fontSize=9,  leading=13, fontName="Times-Roman",
               textColor=colors.black, spaceAfter=1, leftIndent=16)
_toc_dot  = S("Normal", fontSize=8,  leading=13, fontName="Times-Roman",
               textColor=colors.grey)
_toc_pg   = S("Normal", fontSize=9,  leading=13, fontName="Times-Roman",
               alignment=TA_CENTER)

def _toc_row(num, title, pg, main=True):
    st = _toc_main if main else _toc_sub
    label = ("<b>"+num+"</b>") if main else num
    ttl   = ("<b>"+title+"</b>") if main else title
    dots  = chr(183)+" " * 30
    return [
        Paragraph(label, st),
        Paragraph(ttl,   st),
        Paragraph(dots,  _toc_dot),
        Paragraph(str(pg), _toc_pg),
    ]

_toc_cw = [TW*0.10, TW*0.58, TW*0.22, TW*0.10]
_toc_style = TableStyle([
    ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
    ("TOPPADDING",    (0,0),(-1,-1), 2),
    ("BOTTOMPADDING", (0,0),(-1,-1), 2),
    ("LEFTPADDING",   (0,0),(-1,-1), 2),
    ("ROWBACKGROUNDS",(0,0),(-1,-1), [colors.white, ROW_ALT]),
])

toc_rows = [
    _toc_row("",     "Acknowledgement",                        "i",   True),
    _toc_row("",     "Abstract",                               "ii",  True),
    _toc_row("",     "List of Abbreviations",                  "iii", True),
    _toc_row("",     "Table of Contents",                      "iv",  True),
    _toc_row("",     "List of Tables",                         "v",   True),
    _toc_row("",     "List of Figures",                        "vi",  True),
    _toc_row("",     "Organization of the Document",           "vii", True),
    _toc_row("1",    "Introduction",                           "1",   True),
    _toc_row("1.1",  "Background of the Organization",         "1",   False),
    _toc_row("1.2",  "Structure of the Organization",          "2",   False),
    _toc_row("1.3",  "Team and Department Overview",           "4",   False),
    _toc_row("1.3.1","Daily Workflow and Collaboration Methods","4",   False),
    _toc_row("1.4",  "Project Context",                        "5",   False),
    _toc_row("1.4.1","Purpose",                                "5",   False),
    _toc_row("1.4.2","Problem Statement",                      "5",   False),
    _toc_row("1.4.3","Scope",                                  "6",   False),
    _toc_row("1.5",  "Objectives",                             "7",   False),
    _toc_row("1.5.1","General Objective",                      "7",   False),
    _toc_row("1.5.2","Specific Objectives",                    "7",   False),
    _toc_row("2",    "Software Development Plan",              "8",   True),
    _toc_row("2.1",  "Project Schedule",                       "8",   False),
    _toc_row("2.2",  "Resources",                              "9",   False),
    _toc_row("2.3",  "Risk Management",                        "11",  False),
    _toc_row("2.4",  "Development Methodology",                "12",  False),
    _toc_row("2.5",  "Quality Assurance",                      "13",  False),
    _toc_row("2.6",  "Required Documents",                     "14",  False),
    _toc_row("3",    "System Requirements",                    "15",  True),
    _toc_row("3.1",  "Existing System Analysis",               "15",  False),
    _toc_row("3.2",  "Proposed System",                        "16",  False),
    _toc_row("3.2.1","Functional Requirements",                "16",  False),
    _toc_row("3.2.2","Non-Functional Requirements",            "18",  False),
    _toc_row("4",    "System Analysis and Design",             "19",  True),
    _toc_row("4.1",  "System Models",                          "19",  False),
    _toc_row("4.1.1","Use Case Diagram",                       "19",  False),
    _toc_row("4.1.2","Class Diagram",                          "20",  False),
    _toc_row("4.1.3","Object Diagram",                         "21",  False),
    _toc_row("4.1.4","Sequence Diagram",                       "22",  False),
    _toc_row("4.1.5","State Chart Diagram",                    "23",  False),
    _toc_row("4.1.6","Activity Diagram",                       "23",  False),
    _toc_row("4.2",  "User Interface Design",                  "24",  False),
    _toc_row("4.2.1","Navigational Flow",                      "24",  False),
    _toc_row("4.2.2","Key UI Design Decisions",                "25",  False),
    _toc_row("4.3",  "Software Architecture",                  "25",  False),
    _toc_row("4.3.1","Three-Tier Architecture",                "25",  False),
    _toc_row("4.3.2","Component Diagram",                      "26",  False),
    _toc_row("4.3.3","Deployment Diagram",                     "27",  False),
    _toc_row("4.4",  "Security and Access Control",            "28",  False),
    _toc_row("4.4.1","Authentication",                         "28",  False),
    _toc_row("4.4.2","Authorization (RBAC)",                   "28",  False),
    _toc_row("4.4.3","CSRF Protection",                        "29",  False),
    _toc_row("4.4.4","Input Validation and SQL Injection Prevention","29",False),
    _toc_row("4.5",  "Database Design",                        "29",  False),
    _toc_row("4.5.1","Entity Relationship Diagram (ERD)",      "29",  False),
    _toc_row("4.5.2","Key Database Design Decisions",          "31",  False),
    _toc_row("5",    "Implementation",                         "32",  True),
    _toc_row("5.1",  "Development Process",                    "32",  False),
    _toc_row("5.2",  "Tools Used",                             "33",  False),
    _toc_row("5.3",  "Challenges and Solutions",               "34",  False),
    _toc_row("5.4",  "Testing",                                "36",  False),
    _toc_row("5.4.1","Integration Testing Results",            "36",  False),
    _toc_row("5.4.2","RLS Security Testing Results",           "37",  False),
    _toc_row("5.4.3","Cross-Browser and Responsive Testing",   "37",  False),
    _toc_row("5.4.4","User Acceptance Testing (UAT)",          "38",  False),
    _toc_row("6",    "Internship Reflection and Conclusion",   "39",  True),
    _toc_row("6.1",  "Learning Outcomes",                      "39",  False),
    _toc_row("6.2",  "Challenges Faced",                       "40",  False),
    _toc_row("6.3",  "Recommendations",                        "41",  False),
    _toc_row("",     "Appendices",                             "43",  True),
    _toc_row("A",    "Key Code Snippets",                      "43",  False),
    _toc_row("B",    "Database Tables Summary",                "45",  False),
    _toc_row("",     "References",                             "46",  True),
]

story += [
    H1("Table of Contents"), hr(),
    Table(toc_rows, colWidths=_toc_cw, style=_toc_style),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# LIST OF TABLES
# ══════════════════════════════════════════════════════════
lot_rows = [
    _toc_row("Table 2.1",  "Project Gantt Chart "+chr(8212)+" 45-Day Internship Schedule",  "8",  False),
    _toc_row("Table 2.2",  "Project Schedule "+chr(8212)+" Phases, Activities and Durations","8",  False),
    _toc_row("Table 2.3",  "Risk Management Register",                                       "11", False),
    _toc_row("Table 3.1",  "Functional Requirements "+chr(8212)+" Public Website (FR-01 to FR-15)", "16", False),
    _toc_row("Table 3.2",  "Functional Requirements "+chr(8212)+" Admin CMS (FR-16 to FR-28)","17", False),
    _toc_row("Table 4.1",  "Primary Use Cases and Actors",                                   "19", False),
    _toc_row("Table 4.2",  "Object Diagram "+chr(8212)+" Instance Snapshot at Publish Time", "21", False),
    _toc_row("Table 4.3",  "Sequence Diagram "+chr(8212)+" Public User Views a News Article","22", False),
    _toc_row("Table 4.4",  "Sequence Diagram "+chr(8212)+" Admin User Publishes an Article", "22", False),
    _toc_row("Table 4.5",  "State Chart "+chr(8212)+" Content Item Lifecycle States",        "23", False),
    _toc_row("Table 4.6",  "Activity Diagram "+chr(8212)+" Admin Content Publishing Workflow","23", False),
    _toc_row("Table 4.7",  "Public Website Navigation Flow",                                 "24", False),
    _toc_row("Table 4.8",  "Admin CMS Navigation Structure",                                 "24", False),
    _toc_row("Table 4.9",  "Three-Tier Architecture Layers",                                 "25", False),
    _toc_row("Table 4.10", "Component Diagram "+chr(8212)+" Software Components and Dependencies","26",False),
    _toc_row("Table 4.11", "Deployment Diagram "+chr(8212)+" Production Environment Nodes",  "27", False),
    _toc_row("Table 4.12", "RBAC Access Matrix",                                             "28", False),
    _toc_row("Table 4.13", "Database ERD "+chr(8212)+" Core Entity Relationships",           "29", False),
    _toc_row("Table 5.1",  "Development Tools by Category",                                  "33", False),
    _toc_row("Table 5.2",  "Integration Testing Results by Module",                          "36", False),
    _toc_row("Table 5.3",  "RLS Security Testing Results",                                   "37", False),
    _toc_row("Table 5.4",  "Cross-Browser and Responsive Testing Results",                   "37", False),
    _toc_row("Table 5.5",  "User Acceptance Testing Scenarios and Results",                  "38", False),
    _toc_row("Table B.1",  "Database Tables Summary (Appendix B)",                           "45", False),
]

story += [
    H1("List of Tables"), hr(),
    Table(lot_rows, colWidths=_toc_cw, style=_toc_style),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# LIST OF FIGURES
# ══════════════════════════════════════════════════════════
lof_rows = [
    _toc_row("Figure 1.1",  "Organizational Hierarchy of Oda Bultum University (Relevant to OBU-CMS)", "3",  False),
    _toc_row("Figure 2.1",  "Project Gantt Chart (45-Day Internship Schedule)",                         "8",  False),
    _toc_row("Figure 4.1",  "Use Case Diagram "+chr(8212)+" OBU-CMS",                                  "19", False),
    _toc_row("Figure 4.2",  "Class Diagram "+chr(8212)+" OBU-CMS Core Domain",                         "20", False),
    _toc_row("Figure 4.3",  "Object Diagram "+chr(8212)+" Publishing a News Article",                  "21", False),
    _toc_row("Figure 4.4",  "Sequence Diagram "+chr(8212)+" Public User Views a News Article",         "22", False),
    _toc_row("Figure 4.5",  "Sequence Diagram "+chr(8212)+" Admin User Publishes a News Article",      "22", False),
    _toc_row("Figure 4.6",  "State Chart Diagram "+chr(8212)+" Content Item Lifecycle",                "23", False),
    _toc_row("Figure 4.7",  "Activity Diagram "+chr(8212)+" Admin Content Publishing Workflow",        "23", False),
    _toc_row("Figure 4.8",  "Navigational Flow "+chr(8212)+" Public Website (Anonymous Users)",        "24", False),
    _toc_row("Figure 4.9",  "Navigational Flow "+chr(8212)+" Admin CMS (Authenticated Users)",         "24", False),
    _toc_row("Figure 4.10", "Three-Tier Architecture Diagram",                                          "25", False),
    _toc_row("Figure 4.11", "Component Diagram "+chr(8212)+" OBU-CMS",                                 "26", False),
    _toc_row("Figure 4.12", "Deployment Diagram "+chr(8212)+" OBU-CMS Production Environment",         "27", False),
    _toc_row("Figure 4.13", "RBAC Access Matrix "+chr(8212)+" Role Permissions",                       "28", False),
    _toc_row("Figure 4.14", "Database ERD "+chr(8212)+" Core Entity Relationships",                    "29", False),
]

story += [
    H1("List of Figures"), hr(),
    Table(lof_rows, colWidths=_toc_cw, style=_toc_style),
    PageBreak(),
]


abbr_data = [
    [Paragraph("<b>Abbreviation</b>", S("Normal",fontSize=9,fontName="Times-Bold",textColor=colors.white,alignment=TA_LEFT)),
     Paragraph("<b>Full Form</b>",    S("Normal",fontSize=9,fontName="Times-Bold",textColor=colors.white,alignment=TA_LEFT))],
    ["OBU",        "Oda Bultum University"],
    ["OBU-CMS",    "Oda Bultum University Content Management System"],
    ["API",        "Application Programming Interface"],
    ["CMS",        "Content Management System"],
    ["CRUD",       "Create, Read, Update, Delete"],
    ["CSS",        "Cascading Style Sheets"],
    ["ERD",        "Entity Relationship Diagram"],
    ["ICT",        "Information and Communications Technology"],
    ["JWT",        "JSON Web Token"],
    ["LAN",        "Local Area Network"],
    ["ORM",        "Object-Relational Mapping"],
    ["PostgreSQL", "Postgres Structured Query Language"],
    ["RBAC",       "Role-Based Access Control"],
    ["REST",       "Representational State Transfer"],
    ["RLS",        "Row Level Security"],
    ["SADD",       "System Architecture Design Document"],
    ["SPA",        "Single Page Application"],
    ["SQL",        "Structured Query Language"],
    ["SSR",        "Server-Side Rendering"],
    ["UAT",        "User Acceptance Testing"],
    ["UI",         "User Interface"],
    ["URL",        "Uniform Resource Locator"],
    ["QA",         "Quality Assurance"],
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

# ══════════════════════════════════════════════════════════
# ORGANIZATION OF THE DOCUMENT
# ══════════════════════════════════════════════════════════
story += [
    H1("Organization of the Document"), hr(),
    P("This industrial practice report is organized into the following chapters and preliminary "
      "sections, each addressing a distinct aspect of the internship and the OBU-CMS software "
      "development project:"),
    B("<b>Preliminary Sections:</b> Include the cover page, acknowledgement, abstract "
      "(executive summary), list of abbreviations, table of contents, list of tables, list "
      "of figures, and this organizational overview."),
    B("<b>Chapter 1 "+chr(8212)+" Introduction:</b> Provides the background of the host "
      "organization (Oda Bultum University), its organizational structure and hierarchy, the "
      "internship team and department overview, the project context (purpose, problem statement, "
      "and scope), and the general and specific objectives of the OBU-CMS project."),
    B("<b>Chapter 2 "+chr(8212)+" Software Development Plan:</b> Details the project schedule "
      "with a visual Gantt chart, required hardware and software resources, physical workspace, "
      "risk management register, development methodology (Agile Scrum), quality assurance "
      "protocols, and the list of required project documents."),
    B("<b>Chapter 3 "+chr(8212)+" System Requirements:</b> Covers the analysis of the existing "
      "legacy static website and the full functional and non-functional requirements of the "
      "proposed OBU-CMS."),
    B("<b>Chapter 4 "+chr(8212)+" System Analysis and Design:</b> Presents all system models "
      "(use case diagram, class diagram, object diagram, sequence diagrams, state chart, and "
      "activity diagram), user interface navigational flow, software architecture (three-tier "
      "architecture, component diagram, and deployment diagram), security and access control "
      "design, and the complete database ERD."),
    B("<b>Chapter 5 "+chr(8212)+" Implementation:</b> Documents the sprint-by-sprint "
      "development process, all tools and frameworks used, five major technical challenges "
      "and their solutions, and the complete testing results (integration, security, "
      "cross-browser, and UAT)."),
    B("<b>Chapter 6 "+chr(8212)+" Reflection and Conclusion:</b> Presents learning outcomes "
      "(practical and theoretical), workplace and technical challenges faced, and "
      "recommendations for the ICT Directorate and for future Haramaya University internship "
      "programs."),
    B("<b>Appendices and References:</b> Includes key code snippets, a database tables "
      "summary, and all cited sources formatted in IEEE/APA style."),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# CHAPTER 1: INTRODUCTION
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("Chapter 1: Introduction")); story += [
    P("This chapter provides a comprehensive overview of the industrial internship undertaken "
      "at Oda Bultum University (OBU) in Chiro, Western Hararghe, Oromia, Ethiopia. It "
      "describes the host organization, its structural hierarchy, the department in which the "
      "internship was conducted, the context of the proposed software project, and the "
      "objectives set for the internship period."),
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
      "Computational Sciences, the College of Business and Economics, the College of Social "
      "Sciences and Humanities, the College of Health and Medical Sciences, and the Institute "
      "of Technology. These colleges collectively offer a wide range of undergraduate programs "
      "tailored to regular, extension, weekend, and summer modalities, serving both fresh school "
      "leavers and working professionals seeking degree qualifications."),
    P("The university operates under the leadership of a President supported by Vice Presidents "
      "responsible for Academic Affairs, Research and Community Service, and Administration and "
      "Finance. As the institution has grown, the need for a modern, dynamic, and centrally "
      "managed web presence has become increasingly urgent. OBU's existing web infrastructure "
      "was static, fragmented, and required direct technical intervention for every content "
      "update, creating bottlenecks for communications, admissions, and public information "
      "dissemination."),
    P("The ICT Directorate at OBU serves as the primary internship host organization. During "
      "the internship period, the intern worked in close collaboration with the ICT Directorate "
      "and the university's communications teams to investigate the shortcomings of the existing "
      "website and to design and develop a modern replacement system: the OBU-CMS."),
    sp(6),

    H1("1.2. Structure of the Organization"), hr(),
    P("Oda Bultum University operates under a hierarchical administrative structure consistent "
      "with the Ethiopian public university governance framework. The organizational hierarchy "
      "relevant to this internship project is presented below:"),
    B("<b>University President:</b> The chief executive officer of the university, responsible "
      "for overall institutional leadership, strategic direction, and external representation."),
    B("<b>Vice President for Academic Affairs:</b> Oversees all academic programs, faculty "
      "matters, curriculum policy, and the Registrar's Office."),
    B("<b>Vice President for Research and Community Service:</b> Coordinates research centers, "
      "publications, and community engagement programs "+chr(8212)+" all featured as content "
      "modules in the OBU-CMS."),
    B("<b>Vice President for Administration and Finance:</b> Manages university-wide "
      "administrative functions including HR, finance, and facilities."),
    B("<b>Registrar's Office:</b> The central body for student admissions, enrollment, and "
      "academic records. The Registrar's section of OBU-CMS exposes downloadable documents "
      "and announcements to students."),
    B("<b>ICT Directorate:</b> Responsible for managing the university's information technology "
      "infrastructure, including servers, network infrastructure, and software systems. The ICT "
      "Directorate acts as the technical owner and deployment host for the OBU-CMS."),
    B("<b>College Deans and Department Heads:</b> Academic heads whose profiles, programs, and "
      "departmental information are managed through the Admin CMS."),
    B("<b>Students and the General Public:</b> The primary end-users of the public-facing "
      "website, accessing news, events, programs, announcements, and university services."),
    P("This hierarchical structure directly informs the system's access control design. The ICT "
      "Directorate manages administrator accounts. Content editors from each directorate manage "
      "their respective modules through role-based access within the Admin CMS panel. "
      "<b>The hierarchy translates into the system's authorization boundaries</b>: the ICT "
      "Director acts as System Administrator; communications staff act as Content Editors; "
      "Registrar Officers manage registrar-specific modules; and the general public has read-only "
      "access to all published content."),
    sp(8),
    Paragraph("<b>Figure 1.1: Organizational Hierarchy of Oda Bultum University "
              "(Relevant to OBU-CMS)</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=6)),
]

# ── Org Chart ────────────────────────────────────────────
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

_OW  = TW
_HW  = TW * 0.38
_COL = colors.Color(0.82, 0.93, 0.87)

_r1 = Table([[_obox("University President", _OW*0.55,
              bg=PRIMARY, tc=colors.white, fs=9)]],
            colWidths=[_OW],
            style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                               ("TOPPADDING",(0,0),(-1,-1),0),
                               ("BOTTOMPADDING",(0,0),(-1,-1),0)]))
_a1 = Table([[_arr()]], colWidths=[_OW],
            style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                               ("TOPPADDING",(0,0),(-1,-1),2),
                               ("BOTTOMPADDING",(0,0),(-1,-1),2)]))
_r2 = Table([[_obox("Vice President for Academic Affairs", _OW*0.55,
              bg=colors.Color(0.15,0.45,0.32), tc=colors.white, fs=8)]],
            colWidths=[_OW],
            style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                               ("TOPPADDING",(0,0),(-1,-1),0),
                               ("BOTTOMPADDING",(0,0),(-1,-1),0)]))
_r3 = Table([[
    _obox("Registrar's Office", _HW*0.90, bg=_COL, fs=8),
    Spacer(_OW*0.10, 1),
    _obox("ICT Directorate\n(OBU-CMS Owner)", _HW*0.90, bg=PRIMARY, tc=colors.white, fs=8),
]], colWidths=[_HW*0.90, _OW*0.10, _HW*0.90],
    style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                       ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("TOPPADDING",(0,0),(-1,-1),0),
                       ("BOTTOMPADDING",(0,0),(-1,-1),0)]))
_cw4 = TW * 0.30
_sp4 = (TW - 3*_cw4) / 2
_r4 = Table([[
    _obox("College Deans", _cw4, fs=7),
    Spacer(_sp4, 1),
    _obox("Department Heads", _cw4, fs=7),
    Spacer(_sp4, 1),
    _obox("Communications\n& PR Office", _cw4, fs=7),
]], colWidths=[_cw4, _sp4, _cw4, _sp4, _cw4],
    style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                       ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("TOPPADDING",(0,0),(-1,-1),0),
                       ("BOTTOMPADDING",(0,0),(-1,-1),0)]))
_cw5 = TW * 0.35
_sp5 = TW - 2*_cw5
_r5 = Table([[
    _obox("Students /\nGeneral Public\n(Website Visitors)", _cw5,
          bg=colors.Color(0.95,0.99,0.97), fs=7),
    Spacer(_sp5, 1),
    _obox("Admin CMS Users\n(Content Editors /\nRegistrar Staff)", _cw5,
          bg=colors.Color(0.95,0.99,0.97), fs=7),
]], colWidths=[_cw5, _sp5, _cw5],
    style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                       ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("TOPPADDING",(0,0),(-1,-1),0),
                       ("BOTTOMPADDING",(0,0),(-1,-1),0)]))

story += [_r1, _a1, _r2, _a1, _r3, _a1, _r4, _a1, _r5, sp(12)]

# ── 1.3 ──────────────────────────────────────────────────
story += [
    sp(6),
    H1("1.3. Team and Department Overview"), hr(),
    P("The internship was conducted primarily within the <b>ICT Directorate</b> of Oda Bultum "
      "University. The ICT Directorate serves as the technical backbone of the institution, "
      "managing the university's LAN, server infrastructure, and all deployed software systems. "
      "The department is staffed by IT officers, network engineers, and system administrators "
      "responsible for maintaining uptime, managing user accounts, and providing technical "
      "support across all faculties."),
    P("The intern was assigned to work under the supervision of the ICT Director, collaborating "
      "closely with the following personnel:"),
    B("<b>ICT Director:</b> Provided institutional guidance, approved the project scope, "
      "coordinated access to server infrastructure, and reviewed all technical deliverables "
      "prior to each sprint review."),
    B("<b>Senior Web and Content Officer:</b> Served as the primary domain expert, providing "
      "detailed insight into the existing static website structure, content workflows, and the "
      "pain points experienced by content managers."),
    B("<b>Communications and PR Office Representative:</b> Participated in requirements "
      "gathering sessions, providing detailed specifications for how news, events, and "
      "announcements should be structured and displayed on the public website."),
    B("<b>Academic Advisor (Haramaya University) "+chr(8212)+" Mr. Kibru G.:</b> Provided "
      "academic oversight, reviewed technical deliverables, and ensured alignment with the "
      "internship program requirements of the Department of Computer Science at Haramaya "
      "University."),
    P("The intern's role was that of a sole full-stack software developer. Responsibilities "
      "included requirements analysis, system architecture design, database schema design, "
      "backend API development, frontend UI implementation, Admin CMS development, testing, "
      "deployment, and documentation."),
    H2("1.3.1. Daily Workflow and Collaboration Methods"),
    P("Collaboration followed a structured cadence throughout the 45-day internship period. "
      "<b>Bi-weekly progress meetings</b> were held with the ICT Director every Monday and "
      "Thursday to review completed sprint tasks, demonstrate working software increments, and "
      "obtain approval for the next sprint's scope. <b>Ad-hoc requirement validation sessions</b> "
      "were conducted with the Senior Web and Content Officer whenever content structure "
      "decisions arose. Written progress summaries were submitted to the Academic Advisor, "
      "Mr. Kibru G., at the end of each sprint cycle."),
    P("The ICT Directorate's internal operational workflow follows a ticket-based system for "
      "user support requests, while infrastructure changes require formal written approval from "
      "the ICT Director before deployment. During the internship, all system changes were logged "
      "and reviewed with the ICT Director prior to each sprint review, maintaining alignment "
      "with the directorate's change management process."),
    sp(6),

    H1("1.4. Project Context"), hr(),
    H2("1.4.1. Purpose"),
    P("The central purpose of this internship project is to replace the fragmented, static, and "
      "manually maintained web presence of Oda Bultum University with a unified, modern, and "
      "high-performance web-based dynamic website and Content Management System (OBU-CMS). The "
      "system enables the university to publish and manage all public-facing content "+chr(8212)+" "
      "including news, events, announcements, academic programs, research projects, leadership "
      "profiles, services, and gallery media "+chr(8212)+" through a secure, role-based Admin CMS "
      "panel, without requiring direct code modifications."),
    H2("1.4.2. Problem Statement"),
    P("OBU's existing web infrastructure suffers from several critical limitations identified "
      "through observation and stakeholder interviews during the initial phase of the internship:"),
    B("<b>Static Content Architecture:</b> The existing website is built with static HTML/CSS "
      "files. Every content update requires a developer to manually edit HTML files and redeploy, "
      "creating a severe bottleneck for time-sensitive communications."),
    B("<b>No Centralized Content Management:</b> There is no admin panel or CMS. Multiple staff "
      "members from different departments cannot independently publish or update content without "
      "developer intervention."),
    B("<b>Lack of Dynamic Routing:</b> The existing site has no slug-based dynamic pages. "
      "Linking to a specific news article, event, or research project is not possible, "
      "preventing effective sharing of specific content."),
    B("<b>No Media Management System:</b> Images and documents are stored in unorganized file "
      "directories with no metadata, version tracking, or access control."),
    B("<b>Absence of Role-Based Access Control:</b> All website content is managed by a single "
      "developer account with no separation of roles between system administrators, content "
      "editors, and registrar staff."),
    B("<b>Poor Mobile Responsiveness:</b> The static site was not designed with mobile-first "
      "principles, resulting in poor usability on smartphones and tablets."),
    B("<b>No Activity Logging:</b> There is no audit trail of who published, edited, or deleted "
      "content, creating accountability gaps for institutional communications."),
    H2("1.4.3. Scope"),
    P("The scope of OBU-CMS covers the complete public-facing digital presence of Oda Bultum "
      "University, providing a dynamic, database-driven website alongside a fully featured Admin "
      "Content Management System. The system is deployed on the university's cloud-hosted "
      "Supabase PostgreSQL instance and is accessible over the internet, enabling students, "
      "staff, and the general public to access up-to-date university information from any device."),
    sp(6),

    H1("1.5. Objectives"), hr(),
    H2("1.5.1. General Objective"),
    P("To design, develop, test, and deploy a secure, high-performance, web-based dynamic "
      "website and Content Management System (OBU-CMS) for Oda Bultum University that enables "
      "non-technical staff to manage all university content independently, provides the public "
      "with a modern and mobile-responsive information portal, and eliminates the bottlenecks "
      "caused by the existing static website infrastructure."),
    H2("1.5.2. Specific Objectives"),
    P("The following specific objectives define the measurable outcomes the OBU-CMS project "
      "aims to achieve by the end of the 45-day internship period:"),
    B("To replace the existing static HTML website with a fully dynamic, database-driven web "
      "application with slug-based routing for every content entity (news, events, programs, "
      "research, leadership, services, galleries)."),
    B("To build a secure, role-protected Admin CMS panel at <i>/admin</i> enabling authorized "
      "staff to create, read, update, and delete all content modules without writing code."),
    B("To implement Role-Based Access Control (RBAC) using Supabase Row Level Security (RLS) "
      "policies ensuring public users can only read published content while authenticated admins "
      "have full write access with scoped permissions per role."),
    B("To implement a centralized Media Library backed by Supabase Storage, allowing images "
      "and documents to be uploaded once and reused across all content entities."),
    B("To ensure a fully responsive, mobile-first UI using Tailwind CSS v4, rendering correctly "
      "across desktop, tablet, and mobile screen sizes."),
    B("To achieve sub-2-second initial page loads using TanStack Start's server-side rendering "
      "(SSR) capabilities, improving SEO and user experience."),
    B("To implement a comprehensive activity audit log recording all admin CMS actions (create, "
      "update, delete) with user identity and timestamp."),
    B("To produce complete technical documentation including a system architecture design "
      "document, API documentation, and administrator user manual as formal deliverables to "
      "the ICT Directorate."),
    sp(4),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# CHAPTER 2: SOFTWARE DEVELOPMENT PLAN
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("Chapter 2: Software Development Plan")); story += [
    P("This chapter presents the detailed software development plan for the OBU-CMS project. "
      "The project is <b>currently in progress</b> and is being developed over a 45-day "
      "internship period at Oda Bultum University. This chapter outlines the project schedule, "
      "required resources, risk management strategy, development methodology, quality assurance "
      "approach, and the set of required documentation to be produced throughout the internship."),
    sp(6),

    H1("2.1. Project Schedule"), hr(),
    P("The OBU-CMS internship project spans a <b>45-day (approximately 9-week) execution "
      "window</b>. At the time of this interim submission, <b>Phase 1 (Planning) and Phase 2 "
      "(System Design)</b> have been completed. Development sprints (Phases 3"+chr(8211)+"6) "
      "are currently underway. The Gantt chart and schedule table below map all eight phases "
      "to their corresponding weeks and deliverables."),
    sp(4),
]

# ── Gantt Chart ───────────────────────────────────────────
story.append(Paragraph("<b>Figure 2.1: Project Gantt Chart (45-Day Internship Schedule)</b>",
    S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
      textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER, spaceBefore=4, spaceAfter=6)))

_WEEKS = 9
_gantt_phases = [
    ("1. Planning & Requirements",          1, 1),
    ("2. System Design & ERD",              2, 2),
    ("3. Sprint 1 "+chr(8212)+" Auth & DB", 3, 4),
    ("4. Sprint 2 "+chr(8212)+" Public Web",4, 5),
    ("5. Sprint 3 "+chr(8212)+" Admin CMS", 5, 6),
    ("6. Sprint 4 "+chr(8212)+" Extended",  6, 7),
    ("7. Testing & QA",                     7, 8),
    ("8. UAT, Deploy & Handover",           8, 9),
]
_ph_w = TW * 0.30
_wk_w = (TW - _ph_w) / _WEEKS
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
story.append(Table(_gantt_rows, colWidths=[_ph_w]+[_wk_w]*_WEEKS,
                   style=_gantt_style, repeatRows=1))
story.append(sp(4))

# ── Schedule Table ────────────────────────────────────────
sched = [
    [TC("Phase",True), TC("Activity / Deliverable",True), TC("Weeks",True), TC("Duration",True)],
    [TC("1. Planning",True),
     TC("Stakeholder interviews, requirement gathering, user story writing, product backlog."),
     TC("Week 1"), TC("5 days")],
    [TC("2. System Design",True),
     TC("Database schema (ERD), system architecture, UI wireframes and high-fidelity mockups."),
     TC("Week 2"), TC("5 days")],
    [TC("3. Sprint 1 "+chr(8212)+" Auth & DB",True),
     TC("Supabase project setup, PostgreSQL schema migrations, RLS policies, admin authentication, dashboard skeleton."),
     TC("Weeks 3"+chr(8211)+"4"), TC("10 days")],
    [TC("4. Sprint 2 "+chr(8212)+" Public Web",True),
     TC("Homepage, News, Events, Announcements, Programs, Leadership, About pages with SSR and dynamic slug routing."),
     TC("Weeks 4"+chr(8211)+"5"), TC("7 days")],
    [TC("5. Sprint 3 "+chr(8212)+" Admin CMS",True),
     TC("Full CRUD admin panels for all content modules, Media Library, Navigation management."),
     TC("Weeks 5"+chr(8211)+"6"), TC("7 days")],
    [TC("6. Sprint 4 "+chr(8212)+" Extended",True),
     TC("Research Projects, Facilities, Community Engagement, Services, Vacancies, Registrar section, Activity Logs."),
     TC("Weeks 6"+chr(8211)+"7"), TC("7 days")],
    [TC("7. Testing & QA",True),
     TC("Integration testing, RLS security audit, performance testing, bug fixes, cross-browser validation."),
     TC("Weeks 7"+chr(8211)+"8"), TC("5 days")],
    [TC("8. UAT, Deploy & Handover",True),
     TC("UAT with ICT Director and content staff, production deployment, documentation handover, training."),
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
    B("<b>TanStack Start (React 19):</b> Primary full-stack framework for the public website "
      "and Admin CMS. Provides SSR, file-based routing, and isomorphic server functions "
      "(<i>createServerFn</i>) enabling the backend API layer."),
    B("<b>TanStack Router:</b> File-based client-side routing with type-safe route parameters "
      "powering all dynamic slug-based routes (e.g., <i>/news/$slug</i>, "
      "<i>/academics/programs/$slug</i>)."),
    B("<b>TanStack Query:</b> Server state management library handling data fetching, caching, "
      "background refetching, and optimistic updates in the Admin CMS."),
    B("<b>TypeScript:</b> Primary programming language providing static type safety across "
      "the entire codebase, reducing runtime errors and improving maintainability."),
    B("<b>Tailwind CSS v4:</b> Utility-first CSS framework for building the fully responsive, "
      "mobile-first user interface of both the public website and admin panel."),
    B("<b>Supabase:</b> Backend-as-a-service providing PostgreSQL database hosting, "
      "authentication (JWT-based), Row Level Security (RLS) policies, and Supabase Storage "
      "for the media library."),
    B("<b>node-postgres (pg):</b> PostgreSQL client library used in server functions for "
      "parameterized SQL queries with fine-grained database control."),
    B("<b>Radix UI:</b> Accessible UI component primitives (modals, dropdowns, dialogs) "
      "used as the foundation for Admin CMS interface components."),
    B("<b>React Hook Form + Zod:</b> Form state management and TypeScript-first schema "
      "validation for all Admin CMS create/edit forms and server function inputs."),
    B("<b>Vite:</b> Modern build tool and development server with HMR and optimized "
      "production builds."),
    B("<b>Git / GitHub:</b> Version control and source code repository management with "
      "feature-branch workflow."),
    B("<b>VS Code:</b> Primary integrated development environment (IDE)."),
    B("<b>Postman:</b> API testing tool for validating server function endpoints during development."),
    H2("2.2.2. Hardware and Infrastructure"),
    B("<b>Development Machine:</b> Personal laptop running Kali Linux used for development, "
      "testing, and code management."),
    B("<b>Supabase Cloud (Production Database):</b> Cloud-hosted PostgreSQL instance providing "
      "the production database, authentication service, and file storage. Accessible over the "
      "internet with RLS policies enforcing all data access boundaries."),
    B("<b>Campus LAN / Internet:</b> The deployed system is accessible over the internet, "
      "enabling students and the public to access the OBU website from any device. Admin CMS "
      "access is protected by Supabase authentication."),
    H2("2.2.3. Physical Workspace"),
    P("The intern was provided a designated workstation within the <b>OBU ICT Directorate main "
      "office</b>, located in the university's administrative building. The workspace was "
      "equipped with a reliable power supply, direct campus LAN connectivity with internet "
      "access, and access to the university's internal server infrastructure. The physical "
      "environment enabled continuous access to development and staging environments throughout "
      "the internship period."),
    H2("2.2.4. Developer Role (Individual Project)"),
    P("This project is an <b>individual effort</b>. All work including requirements analysis, "
      "database design, system architecture, backend server function development, frontend UI "
      "implementation, Admin CMS development, testing, documentation, and deployment is carried "
      "out solely by the intern, NEDI USMAN, under the guidance of supervisors."),
    B("<b>Developer: NEDI USMAN (Intern):</b> Solely responsible for the entire project "
      "lifecycle "+chr(8212)+" from requirements analysis and system design through to coding, "
      "testing, deployment, and documentation."),
    B("<b>ICT Director (Supervisor):</b> Provides server access, institutional guidance, and "
      "deployment oversight. Does not contribute to software development."),
    B("<b>Senior Web and Content Officer (Domain Advisor):</b> Provides domain knowledge for "
      "content structure requirements and participates in UAT as an end-user."),
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
    [TC("Scope creep from stakeholders requesting additional content modules."),
     TC("High"), TC("High"),
     TC("Formal change request process. New module requests deferred to post-internship backlog.")],
    [TC("Supabase service outage affecting development and testing."),
     TC("Medium"), TC("High"),
     TC("Full local development using node-postgres direct connection via .env DATABASE_URL fallback.")],
    [TC("Data migration loss when moving existing static content into the new database."),
     TC("Medium"), TC("Critical"),
     TC("Migration scripts run in sandboxed staging first. Row counts validated before live cutover.")],
    [TC("RLS policy misconfiguration exposing admin-only data to public users."),
     TC("Low"), TC("Critical"),
     TC("All RLS policies reviewed with ICT Director. Automated API tests verify unauthenticated access is blocked.")],
    [TC("Key stakeholder unavailability during UAT sessions."),
     TC("Medium"), TC("Medium"),
     TC("UAT sessions scheduled three weeks in advance with backup reviewers identified.")],
    [TC("Performance degradation under concurrent public traffic during peak events."),
     TC("Medium"), TC("High"),
     TC("SSR reduces client-side load. TanStack Query caching minimizes redundant database queries.")],
    [TC("Timeline slippage due to underestimated Admin CMS module complexity."),
     TC("Medium"), TC("Medium"),
     TC("Two-week buffer built into schedule. Non-critical modules deferred if needed.")],
    [TC("Security vulnerability in authentication layer allowing unauthorized admin access."),
     TC("Low"), TC("Critical"),
     TC("Supabase Auth (JWT) with RLS enforces authorization at the database layer. CSRF middleware applied to all server functions.")],
]

story += [
    Table(risk_data, colWidths=[TW*0.36, TW*0.10, TW*0.10, TW*0.44],
          style=TB_plain, repeatRows=1),
    sp(8),

    H1("2.4. Development Methodology"), hr(),
    P("The OBU-CMS project will be developed using the <b>Agile Scrum methodology</b>. "
      "This choice is justified by the following factors inherent to the project context:"),
    B("<b>Evolving Requirements:</b> Different departments (Registrar's Office, Research VP, "
      "Communications) had distinct and partially undefined requirements that emerged gradually "
      "during stakeholder interviews. Agile's iterative approach accommodates requirement "
      "refinement across sprints without disrupting the overall project trajectory."),
    B("<b>Frequent Stakeholder Feedback:</b> The ICT Director and Content Officer are available "
      "for regular sprint reviews, enabling early detection of misaligned features and rapid "
      "course correction before significant development investment is made."),
    B("<b>Modular Delivery:</b> The system's architecture naturally decomposes into independently "
      "deliverable modules (Public Website, Admin Auth, News/Events CMS, Research CMS, Media "
      "Library), each mapping cleanly to a sprint cycle."),
    B("<b>Risk Reduction:</b> Delivering a working increment at the end of each sprint ensures "
      "that a functional, deployable system exists at all times."),
    P("The Scrum framework will be implemented with the following structure:"),
    B("<b>Sprint Duration:</b> One to two weeks per sprint with a defined sprint goal."),
    B("<b>Sprint Planning:</b> At the start of each sprint, user stories are selected from "
      "the product backlog and broken into technical tasks with estimated complexity."),
    B("<b>Daily Progress Tracking:</b> Daily written progress notes maintained to track "
      "task completion against sprint goals."),
    B("<b>Sprint Review:</b> A live demonstration of completed features to the ICT Director "
      "and Content Officer at the end of each sprint for feedback and formal acceptance."),
    B("<b>Retrospective:</b> A brief post-sprint reflection to identify process improvements "
      "for the subsequent sprint."),
    sp(6),

    H1("2.5. Quality Assurance"), hr(),
    P("Quality assurance is embedded throughout the development lifecycle rather than treated "
      "as a final-stage activity. The following QA protocols will be applied:"),
    H2("2.5.1. Code Quality"),
    B("<b>Structured Self Code Reviews with Supervisor Spot-Checks:</b> All features undergo "
      "structured self-review against a defined checklist covering naming conventions, DRY "
      "principles, error handling, and security patterns. Critical security components "
      +chr(8212)+" particularly the RLS policies and authentication middleware "+chr(8212)+" "
      "are reviewed with the ICT Directorate's system administrators prior to production "
      "deployment."),
    B("<b>Linting and Formatting:</b> TypeScript/React code is linted using ESLint with "
      "typescript-eslint and eslint-plugin-react-hooks. Code formatting is enforced using "
      "Prettier. Both tools run on every file save in VS Code and as pre-commit checks."),
    B("<b>Version Control Discipline:</b> Feature branches are used for all development. "
      "Commits are atomic and descriptively labelled. No direct commits to the main branch."),
    H2("2.5.2. Testing"),
    B("<b>Unit Testing:</b> Server function handlers and utility functions are tested in "
      "isolation to verify correct input validation, data transformation, and error handling."),
    B("<b>Integration Testing:</b> API server functions are tested end-to-end using Postman "
      "automated test collections to verify correct data flow between the frontend, backend "
      "server functions, and the PostgreSQL database via Supabase."),
    B("<b>RLS Security Testing:</b> Each Supabase RLS policy is tested by sending "
      "unauthenticated and incorrectly-authenticated requests to verify that access boundaries "
      "are correctly enforced."),
    B("<b>Cross-Browser and Responsive Testing:</b> All public pages and Admin CMS panels are "
      "tested across Chrome, Firefox, and Safari on desktop (1280px), tablet (768px), and "
      "mobile (375px) screen sizes."),
    B("<b>User Acceptance Testing (UAT):</b> Conducted with representative users from each "
      "stakeholder group during Week 8. Feedback is recorded, prioritized, and resolved before "
      "production deployment."),
    H2("2.5.3. Documentation Standards"),
    B("All server function APIs are documented with inline JSDoc comments describing input "
      "types (validated by Zod schemas), return types, and security constraints."),
    B("A formal System Architecture Design Document (SADD) is produced covering the database "
      "schema (ERD), API design, RLS role matrix, and deployment topology."),
    B("Document versioning follows Semantic Versioning (v1.0, v1.1, v2.0). The final "
      "documentation package is frozen and tagged in Git upon successful UAT."),
    sp(6),

    H1("2.6. Required Documents"), hr(),
    P("The following documentation is planned to be produced and formally delivered to Oda "
      "Bultum University's ICT Directorate upon project completion:"),
    NB(1, "<b>System Architecture Design Document (SADD):</b> Covers the three-tier "
       "architecture, ERD, API design, RLS role matrix, Supabase Storage structure, and "
       "deployment topology diagram."),
    NB(2, "<b>Database Schema Document:</b> Full entity-relationship diagram with table "
       "definitions, column specifications, foreign key constraints, RLS policies, index "
       "descriptions, and migration history."),
    NB(3, "<b>API Documentation:</b> JSDoc documentation for all server functions covering "
       "input validation schemas (Zod), return types, authentication requirements, and "
       "error responses."),
    NB(4, "<b>Administrator's Manual:</b> Step-by-step guide for the ICT Directorate covering "
       "system access, Admin CMS navigation, content module management, media library usage, "
       "user and role management, and activity log review."),
    NB(5, "<b>Content Editor User Manual:</b> Role-specific guide for non-technical content "
       "staff covering how to publish news, create events, manage announcements, and upload "
       "media through the Admin CMS panel."),
    NB(6, "<b>Source Code Repository:</b> Fully commented source code in a version-controlled "
       "Git repository with README, .env.example, database migration instructions, and "
       "deployment guide."),
    NB(7, "<b>Test Reports:</b> Postman integration test results, RLS security audit report, "
       "and cross-browser/responsive testing checklist."),
    NB(8, "<b>Industrial Practice Report:</b> This document, submitted to Haramaya University "
       "Department of Computer Science as partial fulfillment of the B.Sc. program requirements."),
    sp(8),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# CHAPTER 3: SYSTEM REQUIREMENTS
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("Chapter 3: System Requirements")); story += [
    P("This chapter presents the analysis of the existing static website infrastructure of "
      "Oda Bultum University and the complete functional and non-functional requirements of "
      "the proposed OBU-CMS system."),
    sp(6),

    H1("3.1. Existing System Analysis"), hr(),
    P("Prior to this internship project, Oda Bultum University's web presence consisted of a "
      "static HTML/CSS website hosted on a basic web server managed by the ICT Directorate. "
      "The site provided general information about the university "+chr(8212)+" college "
      "listings, leadership profiles, and contact details "+chr(8212)+" but offered no dynamic "
      "content capabilities. The following limitations were identified:"),
    B("<b>No Dynamic Content Management:</b> All content was hardcoded in HTML files. Adding a "
      "news article required a developer to manually write HTML, upload via FTP, and restart "
      "the server "+chr(8212)+" a process taking 2"+chr(8211)+"4 hours per content update."),
    B("<b>No Database Backend:</b> The site had no database. There was no way to search, "
      "filter, or paginate content. All data was stored as static HTML markup."),
    B("<b>No URL Routing System:</b> The existing site used flat file URLs (e.g., news.html). "
      "There were no individual article URLs, making it impossible to link to specific items."),
    B("<b>No Media Management:</b> Photos were stored as unorganized files in a single /images "
      "directory with no metadata, alt text, or search capability."),
    B("<b>No Admin Interface:</b> Only the developer with FTP access could update the website. "
      "There was no interface for non-technical staff."),
    B("<b>No Authentication or Access Control:</b> The server had no user authentication. "
      "Content control was entirely physical (FTP credentials shared among a small team)."),
    B("<b>No Mobile Optimization:</b> The site was designed for desktop-only viewing with no "
      "responsive CSS breakpoints."),
    B("<b>No SEO Support:</b> Pages had no meta descriptions, Open Graph tags, or structured "
      "title tags, resulting in poor search engine visibility."),
    B("<b>No Activity Logging:</b> There was no record of who made changes, what was changed, "
      "or when changes occurred."),
    sp(6),
]

# ── Visual Comparison Section ─────────────────────────────
import os as _os

def _img_or_placeholder(path, w, h, label):
    """Load image if it exists, otherwise draw a labeled placeholder box."""
    if _os.path.exists(path):
        try:
            return RLImage(path, width=w, height=h)
        except Exception:
            pass
    # Placeholder box
    _ph_style = S("Normal", fontSize=8, leading=12, fontName="Times-Roman",
                  textColor=colors.Color(0.5,0.5,0.5), alignment=TA_CENTER)
    return Table([[Paragraph(label, _ph_style)]],
        colWidths=[w],
        style=TableStyle([
            ("BOX",           (0,0),(-1,-1), 1.0, colors.Color(0.75,0.75,0.75)),
            ("BACKGROUND",    (0,0),(-1,-1), colors.Color(0.94,0.94,0.94)),
            ("TOPPADDING",    (0,0),(-1,-1), h/2 - 8),
            ("BOTTOMPADDING", (0,0),(-1,-1), h/2 - 8),
            ("LEFTPADDING",   (0,0),(-1,-1), 8),
            ("RIGHTPADDING",  (0,0),(-1,-1), 8),
        ]))

_doc_dir   = _os.path.dirname(_os.path.abspath(__file__))
_img_w_half = (TW - 12) / 2   # two images side by side with gap
_img_h      = _img_w_half * 0.62

# ── caption style
_cap = S("Normal", fontSize=8, leading=11, fontName="Times-Roman",
         textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
         spaceAfter=4)

# OLD site screenshots — use your actual saved files
_old1 = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "old_sites_one.png"),
    _img_w_half, _img_h, "[Old Site Screenshot 1]")

_old2 = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "old_sites_two.png"),
    _img_w_half, _img_h, "[Old Site Screenshot 2]")

_old3 = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "old_site_three.png"),
    _img_w_half, _img_h, "[Old Site Screenshot 3]")

_old4 = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "old_site_four.png"),
    _img_w_half, _img_h, "[Old Site Screenshot 4]")

# NEW CMS screenshots — all 7 available
_new_login    = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "new_sites_admin_loginpage.png"),
    _img_w_half, _img_h, "[Admin Login Page]")

_new_dashboard = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "new_sites_admin_dashboards.png"),
    _img_w_half, _img_h, "[Admin Dashboard]")

_new_homepage_mgmt = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "new_sites_admin_homepage_mgmt.png"),
    _img_w_half, _img_h, "[Admin Homepage Management]")

_new_create_user = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots",
        "new_Sites_when_Admincreate_content_creatoreusers.png"),
    _img_w_half, _img_h, "[Admin Create User]")

_new1 = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "new_sites_landing_pages_one.png"),
    _img_w_half, _img_h, "[Public Homepage Hero]")

_new2 = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots", "new_siteS_landing_pages_two.png"),
    _img_w_half, _img_h, "[Public President's Message]")

_new3 = _img_or_placeholder(
    _os.path.join(_doc_dir, "screenshots",
        "new_sites_lanfing_pages_with_footer_three.png"),
    _img_w_half, _img_h, "[Public Programs & Footer]")

_border_tbl = TableStyle([
    ("BOX",           (0,0),(-1,-1), 0.5, colors.Color(0.7,0.85,0.78)),
    ("BACKGROUND",    (0,0),(-1,-1), colors.white),
    ("TOPPADDING",    (0,0),(-1,-1), 4),
    ("BOTTOMPADDING", (0,0),(-1,-1), 4),
    ("LEFTPADDING",   (0,0),(-1,-1), 4),
    ("RIGHTPADDING",  (0,0),(-1,-1), 4),
    ("ALIGN",         (0,0),(-1,-1), "CENTER"),
    ("VALIGN",        (0,0),(-1,-1), "MIDDLE"),
])

story += [
    H1("3.1.1. Visual Comparison: Before and After"),
    hr(),
    P("The following screenshots illustrate the contrast between the old static OBU website "
      "(obu.edu.et) and the newly developed OBU-CMS. The old site was a fragmented "
      "WordPress-based system with broken dropdown navigation, an exposed password reset "
      "form with no security controls, poor mobile responsiveness, and no content management "
      "capability for non-technical staff."),
    sp(6),
    Paragraph("<b>Figure 3.1: Before "+chr(8212)+" Existing OBU Website (obu.edu.et)</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=2, spaceAfter=4)),
    # Row 1 — screenshots 1 and 2
    Table([[_old1, Spacer(12,1), _old2]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                          ("VALIGN",(0,0),(-1,-1),"TOP"),
                          ("TOPPADDING",(0,0),(-1,-1),0),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    Table([[Paragraph("(a) President's Message "+chr(8212)+" fragmented two-column layout", _cap),
            Spacer(12,1),
            Paragraph("(b) Administration dropdown overlaid on a Google Map", _cap)]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("TOPPADDING",(0,0),(-1,-1),3),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(8),
    # Row 2 — screenshots 3 and 4
    Table([[_old3, Spacer(12,1), _old4]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                          ("VALIGN",(0,0),(-1,-1),"TOP"),
                          ("TOPPADDING",(0,0),(-1,-1),0),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    Table([[Paragraph("(c) Exposed password reset page "+chr(8212)+" no rate limiting or CSRF", _cap),
            Spacer(12,1),
            Paragraph("(d) Homepage dropdown broken "+chr(8212)+" overlaps hero slider", _cap)]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("TOPPADDING",(0,0),(-1,-1),3),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(10),
    Paragraph("<b>Figure 3.2: After "+chr(8212)+" New OBU-CMS Public Website</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=2, spaceAfter=4)),
    Table([[_new1, Spacer(12,1), _new2]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                          ("VALIGN",(0,0),(-1,-1),"TOP"),
                          ("TOPPADDING",(0,0),(-1,-1),0),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    Table([[Paragraph("(a) Dynamic Homepage Hero Slider with Campus Photos", _cap),
            Spacer(12,1),
            Paragraph("(b) President's Message Section with photo and biography", _cap)]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("TOPPADDING",(0,0),(-1,-1),3),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(8),
    Table([[_new3, Spacer(12,1), Spacer(_img_w_half,1)]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                          ("VALIGN",(0,0),(-1,-1),"TOP"),
                          ("TOPPADDING",(0,0),(-1,-1),0),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    Table([[Paragraph("(c) Academic Programs listing with footer navigation", _cap),
            Spacer(12,1),
            Paragraph("", _cap)]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("TOPPADDING",(0,0),(-1,-1),3),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(10),
    Paragraph("<b>Figure 3.3: After "+chr(8212)+" New OBU-CMS Admin Panel</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=2, spaceAfter=4)),
    Table([[_new_login, Spacer(12,1), _new_dashboard]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                          ("VALIGN",(0,0),(-1,-1),"TOP"),
                          ("TOPPADDING",(0,0),(-1,-1),0),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    Table([[Paragraph("(a) Admin Portal Login "+chr(8212)+" Supabase Auth, JWT session", _cap),
            Spacer(12,1),
            Paragraph("(b) Admin Dashboard "+chr(8212)+" Live content stats and quick actions", _cap)]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("TOPPADDING",(0,0),(-1,-1),3),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(8),
    Table([[_new_homepage_mgmt, Spacer(12,1), _new_create_user]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("ALIGN",(0,0),(-1,-1),"CENTER"),
                          ("VALIGN",(0,0),(-1,-1),"TOP"),
                          ("TOPPADDING",(0,0),(-1,-1),0),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    Table([[Paragraph("(c) Homepage Management "+chr(8212)+" Hero slider CRUD with status control", _cap),
            Spacer(12,1),
            Paragraph("(d) Create User "+chr(8212)+" RBAC role assignment for admin accounts", _cap)]],
        colWidths=[_img_w_half, 12, _img_w_half],
        style=TableStyle([("TOPPADDING",(0,0),(-1,-1),3),
                          ("BOTTOMPADDING",(0,0),(-1,-1),0)])),
    sp(8),

    H1("3.2. Proposed System"), hr(),
    H2("3.2.1. Functional Requirements"),
    P("<b>Public Website Requirements:</b>"),
]

# ── FR Table — Public ─────────────────────────────────────
fr_pub = [
    [TC("ID",True), TC("Functional Requirement",True)],
    [TC("FR-01"), TC("Display a dynamic homepage with hero slides, statistics, featured news, upcoming events, and research highlights fetched from the database.")],
    [TC("FR-02"), TC("Display a news listing page with category filtering and individual article detail pages accessible via unique URL slugs.")],
    [TC("FR-03"), TC("Display upcoming events with date, time, location, and a detail page per event.")],
    [TC("FR-04"), TC("Display published announcements including Registrar-specific announcements with expiry date support.")],
    [TC("FR-05"), TC("Display academic programs organized by college and degree level with individual program detail pages.")],
    [TC("FR-06"), TC("Display academic department/unit profiles with associated programs.")],
    [TC("FR-07"), TC("Display university leadership profiles with biography and contact information.")],
    [TC("FR-08"), TC("Display research projects, research centers, research facilities, and community engagement programs.")],
    [TC("FR-09"), TC("Display university services with location, hours, and contact information.")],
    [TC("FR-10"), TC("Display open career vacancies with application deadline, requirements, and responsibilities.")],
    [TC("FR-11"), TC("Display a photo gallery with individual gallery detail pages.")],
    [TC("FR-12"), TC("Provide a Registrar section with downloadable documents and registrar-specific announcements.")],
    [TC("FR-13"), TC("Provide a contact form that saves messages to the database with status tracking.")],
    [TC("FR-14"), TC("Support static pages (About, Privacy Policy) managed through the CMS.")],
    [TC("FR-15"), TC("Display a President's message section with photo and biography fetched from website settings.")],
]
story.append(Table(fr_pub, colWidths=[TW*0.12, TW*0.88], style=TB_plain, repeatRows=1))
story.append(sp(6))
story.append(P("<b>Admin CMS Requirements:</b>"))

fr_adm = [
    [TC("ID",True), TC("Functional Requirement",True)],
    [TC("FR-16"), TC("Provide a secure login page for admin users using email and password authentication via Supabase Auth.")],
    [TC("FR-17"), TC("Display an admin dashboard showing content statistics and recent activity log.")],
    [TC("FR-18"), TC("Provide full CRUD interfaces for all public content modules.")],
    [TC("FR-19"), TC("Provide a media library where admins can upload images and documents to Supabase Storage and attach them to any content entity.")],
    [TC("FR-20"), TC("Allow admins to set content status (Draft, Review, Published, Archived) to control public site visibility.")],
    [TC("FR-21"), TC("Automatically generate a URL slug from the title when creating new content, with the option for manual override.")],
    [TC("FR-22"), TC("Provide user management allowing admins to create, edit, disable, and delete admin user accounts.")],
    [TC("FR-23"), TC("Provide role management allowing admins to define roles and assign them to users.")],
    [TC("FR-24"), TC("Provide navigation management allowing admins to configure the public website's menu structure.")],
    [TC("FR-25"), TC("Provide homepage section management allowing admins to show/hide and reorder homepage sections.")],
    [TC("FR-26"), TC("Log all create, update, and delete actions to an activity log table with user identity, timestamp, and description.")],
    [TC("FR-27"), TC("Provide website settings management (university name, contact info, mission/vision text, president message).")],
    [TC("FR-28"), TC("Automatically redirect unauthenticated users from all /admin/* routes to the login page.")],
]
story.append(Table(fr_adm, colWidths=[TW*0.12, TW*0.88], style=TB_plain, repeatRows=1))

story += [
    sp(8),
    H2("3.2.2. Non-Functional Requirements"),
    B("<b>Usability:</b> The Admin CMS interface shall follow consistent design patterns across "
      "all modules (same table layout, same form structure, same action buttons) to minimize "
      "the learning curve for content editors. All form fields shall include clear labels and "
      "placeholder text. Toast notifications shall provide immediate feedback after every save "
      "or delete action."),
    B("<b>Performance:</b> Public website pages shall fully render (SSR) within 2 seconds for "
      "a user on a standard broadband connection. Admin CMS list views shall load within "
      "3 seconds for tables containing up to 500 records. Database queries shall use indexed "
      "columns (slug, status, created_at) to ensure consistent sub-100ms query response times."),
    B("<b>Reliability:</b> The system shall use Supabase cloud infrastructure providing 99.9% "
      "uptime SLA. All database write operations shall use SQL transactions to ensure atomicity "
      "and prevent partial data corruption."),
    B("<b>Security:</b> All admin routes shall be protected by Supabase Auth JWT session "
      "verification. Row Level Security (RLS) policies shall be enforced at the database layer. "
      "All server function inputs shall be validated using Zod schemas. CSRF middleware shall "
      "be applied to all server functions. Sensitive credentials shall be stored in environment "
      "variables and never committed to version control."),
    B("<b>Scalability:</b> The system architecture (stateless SSR server + cloud-hosted "
      "database) shall allow horizontal scaling of the server layer without database schema "
      "changes. Supabase Storage shall support unlimited file uploads with no local server "
      "storage dependency."),
    B("<b>Legal Compliance:</b> The system shall include a Privacy Policy page compliant with "
      "Ethiopian data protection standards. The contact form shall collect only the minimum "
      "necessary personal information (name, email, subject, message)."),
    sp(8),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# CHAPTER 4: SYSTEM ANALYSIS AND DESIGN
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("Chapter 4: System Analysis and Design")); story += [
    P("This chapter presents the complete system models, user interface design, software "
      "architecture, security model, and database design for the OBU-CMS."),
    sp(6),

    H1("4.1. System Models"), hr(),
    H2("4.1.1. Use Case Diagram"),
    P("The OBU-CMS has three primary actor categories: <b>Public User (Anonymous)</b> who can "
      "read all published content, <b>Admin User (Authenticated)</b> who can manage content "
      "modules based on their assigned role, and <b>System Administrator</b> who has access "
      "to user management, role management, system settings, and activity logs."),
    sp(4),
    Paragraph("<b>Figure 4.1: Use Case Diagram "+chr(8212)+" OBU-CMS</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=6)),
]

# ── Use Case Diagram — drawn with ReportLab ───────────────
from reportlab.platypus import Flowable
from reportlab.lib.colors import HexColor

class UCDiagram(Flowable):
    """Hand-drawn UML Use Case Diagram for OBU-CMS."""
    def __init__(self, w, h):
        super().__init__()
        self.width  = w
        self.height = h

    def wrap(self, *args):
        return self.width, self.height

    def _oval(self, c, cx, cy, rx, ry, txt, fs=7):
        c.setStrokeColor(PRIMARY)
        c.setFillColor(colors.Color(0.94,0.99,0.96))
        c.ellipse(cx-rx, cy-ry, cx+rx, cy+ry, fill=1)
        c.setFillColor(colors.black)
        c.setFont("Times-Roman", fs)
        tw = c.stringWidth(txt, "Times-Roman", fs)
        c.drawString(cx - tw/2, cy - fs/2.5, txt)

    def _actor(self, c, x, y, label, fs=7):
        # head
        c.setStrokeColor(PRIMARY)
        c.setFillColor(colors.white)
        r = 6
        c.circle(x, y+28, r, fill=1)
        # body
        c.setLineWidth(1.2)
        c.line(x, y+22, x, y+8)
        # arms
        c.line(x-10, y+18, x+10, y+18)
        # legs
        c.line(x, y+8, x-8, y)
        c.line(x, y+8, x+8, y)
        c.setFont("Times-Bold", fs)
        c.setFillColor(PRIMARY)
        tw = c.stringWidth(label, "Times-Bold", fs)
        c.drawString(x - tw/2, y - 8, label)
        c.setLineWidth(0.5)

    def _line(self, c, x1, y1, x2, y2, dash=None, label=""):
        c.setStrokeColor(PRIMARY)
        c.setLineWidth(0.8)
        if dash:
            c.setDash(dash)
        else:
            c.setDash([])
        c.line(x1, y1, x2, y2)
        if label:
            mx, my = (x1+x2)/2, (y1+y2)/2
            c.setFont("Times-Roman", 6)
            c.setFillColor(colors.Color(0.2,0.2,0.2))
            tw = c.stringWidth(label, "Times-Roman", 6)
            c.drawString(mx - tw/2, my + 2, label)
        c.setDash([])

    def _sysbox(self, c, x, y, w, h, title):
        c.setStrokeColor(PRIMARY)
        c.setFillColor(colors.Color(0.96,0.99,0.97))
        c.setLineWidth(1.5)
        c.rect(x, y, w, h, fill=1)
        c.setFont("Times-Bold", 8)
        c.setFillColor(PRIMARY)
        tw = c.stringWidth(title, "Times-Bold", 8)
        c.drawString(x + w/2 - tw/2, y + h - 14, title)
        c.setLineWidth(0.5)

    def draw(self):
        c = self.canv
        W, H = self.width, self.height
        c.saveState()

        # System boundary box
        bx, by, bw, bh = W*0.22, H*0.04, W*0.56, H*0.92
        self._sysbox(c, bx, by, bw, bh, "OBU-CMS System")

        # ── Use cases — Public ────────────────────────────
        uc_pub = [
            (bx+bw*0.25, by+bh*0.85, "View Homepage"),
            (bx+bw*0.25, by+bh*0.73, "Browse News/Events"),
            (bx+bw*0.25, by+bh*0.61, "View Programs"),
            (bx+bw*0.25, by+bh*0.49, "Download Docs"),
            (bx+bw*0.25, by+bh*0.37, "Submit Contact Form"),
        ]
        for (ux, uy, ut) in uc_pub:
            self._oval(c, ux, uy, 52, 11, ut, fs=6.5)

        # ── Use cases — Admin ─────────────────────────────
        uc_adm = [
            (bx+bw*0.70, by+bh*0.85, "Log In to Admin"),
            (bx+bw*0.70, by+bh*0.73, "Manage News/Events"),
            (bx+bw*0.70, by+bh*0.61, "Upload Media"),
            (bx+bw*0.70, by+bh*0.49, "Manage Announcements"),
            (bx+bw*0.70, by+bh*0.37, "Manage Research"),
        ]
        for (ux, uy, ut) in uc_adm:
            self._oval(c, ux, uy, 52, 11, ut, fs=6.5)

        # ── Use cases — Sys Admin ─────────────────────────
        uc_sys = [
            (bx+bw*0.70, by+bh*0.24, "Manage Users"),
            (bx+bw*0.70, by+bh*0.13, "View Activity Logs"),
            (bx+bw*0.25, by+bh*0.24, "Manage Roles"),
            (bx+bw*0.25, by+bh*0.13, "Configure Settings"),
        ]
        for (ux, uy, ut) in uc_sys:
            self._oval(c, ux, uy, 52, 11, ut, fs=6.5)

        # ── Actors ────────────────────────────────────────
        ax_pub = W*0.07;  ay_pub = by + bh*0.57
        ax_adm = W*0.88;  ay_adm = by + bh*0.57
        ax_sys = W*0.88;  ay_sys = by + bh*0.10

        self._actor(c, ax_pub, ay_pub, "Public\nUser")
        self._actor(c, ax_adm, ay_adm, "Admin\nUser")
        self._actor(c, ax_sys, ay_sys, "System\nAdmin")

        # ── Lines: Public User ────────────────────────────
        for (ux, uy, _) in uc_pub:
            self._line(c, ax_pub+10, ay_pub+18, ux-52, uy)

        # ── Lines: Admin User ─────────────────────────────
        for (ux, uy, _) in uc_adm:
            self._line(c, ax_adm-10, ay_adm+18, ux+52, uy)

        # ── Lines: System Admin ───────────────────────────
        for (ux, uy, _) in uc_sys:
            self._line(c, ax_sys-10, ay_sys+18, ux+52, uy)

        # ── <<includes>> arrows between related UCs ───────
        # Log In <<includes>> Manage News
        self._line(c,
            bx+bw*0.70, by+bh*0.85-11,
            bx+bw*0.70, by+bh*0.73+11,
            dash=[3,2], label="<<includes>>")

        # Manage News <<includes>> Upload Media
        self._line(c,
            bx+bw*0.70, by+bh*0.73-11,
            bx+bw*0.70, by+bh*0.61+11,
            dash=[3,2], label="<<includes>>")

        c.restoreState()

story.append(UCDiagram(TW, 260))
story.append(sp(8))

story += [
    sp(8),
    H2("4.1.2. Class Diagram"),
    P("The class diagram shows the core domain classes, their attributes, methods, and "
      "relationships in the OBU-CMS system."),
    sp(4),
    Paragraph("<b>Figure 4.2: Class Diagram "+chr(8212)+" OBU-CMS Core Domain</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=6)),
]

# ── Class Diagram boxes ───────────────────────────────────
def _cls(title, attrs, methods, w, bg=None):
    bg  = bg or colors.white
    ts  = S("Normal", fontSize=7, leading=10, fontName="Times-Bold",
            textColor=colors.white, alignment=TA_CENTER)
    ta  = S("Normal", fontSize=6.5, leading=9, fontName="Times-Roman",
            textColor=colors.black, alignment=TA_LEFT)
    rows = [[Paragraph("<b>"+title+"</b>", ts)]]
    for a in attrs:
        rows.append([Paragraph(a, ta)])
    rows.append([Paragraph(chr(8212)*15,
                 S("Normal",fontSize=5,leading=7,alignment=TA_CENTER))])
    for m in methods:
        rows.append([Paragraph(m, ta)])
    tst = TableStyle([
        ("BACKGROUND",    (0,0),(0,0),  PRIMARY),
        ("BACKGROUND",    (0,1),(-1,-1), bg),
        ("BOX",           (0,0),(-1,-1), 1.0, PRIMARY),
        ("GRID",          (0,0),(-1,-1), 0.3, colors.Color(0.7,0.85,0.78)),
        ("TOPPADDING",    (0,0),(-1,-1), 2),
        ("BOTTOMPADDING", (0,0),(-1,-1), 2),
        ("LEFTPADDING",   (0,0),(-1,-1), 3),
        ("RIGHTPADDING",  (0,0),(-1,-1), 3),
    ])
    return Table(rows, colWidths=[w], style=tst)

# Two boxes per row — avoids negative-width crash
_cw2 = TW * 0.47
_gap2 = TW - 2*_cw2

_cls_user  = _cls("User",
    ["- id: UUID","- email: string","- full_name: string",
     "- role_id: UUID (FK)","- is_active: boolean"],
    ["+ login()","+ logout()","+ getProfile()"], _cw2)
_cls_role  = _cls("Role",
    ["- id: UUID","- name: string","- description: string"],
    ["+ getPermissions()"], _cw2)

story.append(Table([[_cls_user, Spacer(_gap2,1), _cls_role]],
    colWidths=[_cw2, _gap2, _cw2],
    style=TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                      ("TOPPADDING",(0,0),(-1,-1),0),
                      ("BOTTOMPADDING",(0,0),(-1,-1),0)])))
story.append(sp(4))

_cls_media = _cls("Media",
    ["- id: UUID","- file_url: string","- original_name: string",
     "- file_type: string","- folder: string"],
    ["+ upload()","+ delete()"], _cw2)
_cls_log   = _cls("ActivityLog",
    ["- id: UUID","- user_id: UUID (FK)","- action: string",
     "- entity_type: string","- entity_id: string","- created_at: timestamp"],
    ["+ log(action, entity)"], _cw2)

story.append(Table([[_cls_media, Spacer(_gap2,1), _cls_log]],
    colWidths=[_cw2, _gap2, _cw2],
    style=TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                      ("TOPPADDING",(0,0),(-1,-1),0),
                      ("BOTTOMPADDING",(0,0),(-1,-1),0)])))
story.append(sp(4))

_cls_news  = _cls("News",
    ["- id: UUID","- title: string","- slug: string (UQ)",
     "- content: text","- category: string","- status: string",
     "- featured_image_id: UUID (FK)","- published_at: timestamp"],
    ["+ publish()","+ archive()","+ generateSlug()"], _cw2,
    bg=colors.Color(0.97,0.99,0.97))
_cls_event = _cls("Event",
    ["- id: UUID","- title: string","- slug: string (UQ)",
     "- description: text","- start_date: date",
     "- location: string","- status: string",
     "- event_image_id: UUID (FK)"],
    ["+ publish()","+ cancel()","+ generateSlug()"], _cw2,
    bg=colors.Color(0.97,0.99,0.97))

story.append(Table([[_cls_news, Spacer(_gap2,1), _cls_event]],
    colWidths=[_cw2, _gap2, _cw2],
    style=TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                      ("TOPPADDING",(0,0),(-1,-1),0),
                      ("BOTTOMPADDING",(0,0),(-1,-1),0)])))
story.append(sp(4))

_cls_ann   = _cls("Announcement",
    ["- id: UUID","- title: string","- slug: string (UQ)",
     "- description: text","- category: string",
     "- status: string","- expires_at: timestamp",
     "- main_image_id: UUID (FK)"],
    ["+ publish()","+ expire()"], _cw2,
    bg=colors.Color(0.97,0.99,0.97))
_cls_prog  = _cls("Program",
    ["- id: UUID","- name: string","- slug: string (UQ)",
     "- degree: string","- duration: string",
     "- academic_unit_id: UUID (FK)","- status: string",
     "- main_image_id: UUID (FK)"],
    ["+ publish()","+ generateSlug()"], _cw2,
    bg=colors.Color(0.97,0.99,0.97))

story.append(Table([[_cls_ann, Spacer(_gap2,1), _cls_prog]],
    colWidths=[_cw2, _gap2, _cw2],
    style=TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),
                      ("TOPPADDING",(0,0),(-1,-1),0),
                      ("BOTTOMPADDING",(0,0),(-1,-1),0)])))
story.append(sp(4))
story.append(Paragraph("<i>Note: News, Event, and Announcement all reference Media via a "
                        "foreign key (featured_image_id / event_image_id / main_image_id). "
                        "User is associated with ActivityLog (1 User "+chr(8594)+" N Logs)."
                        "</i>",
                        S("Normal", fontSize=8, leading=12, fontName="Times-Roman",
                          textColor=colors.grey, alignment=TA_CENTER)))

story += [
    sp(8),
    H2("4.1.3. Object Diagram"),
    P("The object diagram shows a concrete snapshot of the system at the moment a content "
      "editor publishes a news article. It shows actual instance values of objects and their "
      "runtime relationships."),
    sp(4),
    Paragraph("<b>Figure 4.3: Object Diagram "+chr(8212)+" Publishing a News Article</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=6)),
]

obj_data = None  # replaced by drawn diagram below

class ObjDiagram(Flowable):
    """UML Object Diagram — snapshot when admin publishes a news article."""
    def __init__(self, w, h):
        super().__init__(); self.width=w; self.height=h
    def wrap(self,*a): return self.width,self.height
    def _box(self,c,x,y,w,h,title,attrs,underline=True):
        c.setFillColor(colors.Color(0.93,0.98,0.95))
        c.setStrokeColor(PRIMARY); c.setLineWidth(1.0)
        c.rect(x,y,w,h,fill=1)
        # title bar
        c.setFillColor(PRIMARY)
        c.rect(x,y+h-16,w,16,fill=1)
        c.setFillColor(colors.white); c.setFont("Times-Bold",7.5)
        tw=c.stringWidth(title,"Times-Bold",7.5)
        c.drawString(x+w/2-tw/2,y+h-11,title)
        c.setFont("Times-Roman",6.5); c.setFillColor(colors.black)
        for i,a in enumerate(attrs):
            c.drawString(x+5,y+h-28-(i*11),a)
    def _arrow(self,c,x1,y1,x2,y2,label=""):
        c.setStrokeColor(PRIMARY); c.setLineWidth(0.8); c.setDash([])
        c.line(x1,y1,x2,y2)
        import math
        dx,dy=x2-x1,y2-y1; ln=max(math.sqrt(dx*dx+dy*dy),0.001)
        ux,uy=dx/ln,dy/ln
        ax,ay=x2-ux*7,y2-uy*7
        px,py=-uy*3,ux*3
        _poly(c,[x2,y2,ax+px,ay+py,ax-px,ay-py],PRIMARY)
        if label:
            mx,my=(x1+x2)/2,(y1+y2)/2
            c.setFont("Times-Italic",6); c.setFillColor(PRIMARY)
            tw=c.stringWidth(label,"Times-Italic",6)
            c.drawString(mx-tw/2,my+3,label)
    def draw(self):
        c=self.canv; W,H=self.width,self.height; c.saveState()
        bw=W*0.28; bh=130; gap=(W-3*bw)/2
        # Three objects side by side
        x1,x2,x3=0,bw+gap,2*(bw+gap)
        y=H-bh-20
        self._box(c,x1,y,bw,bh,":User (usr-001)",
            ["email='ed@obu.et'","role='Content Ed.'","is_active=true"])
        self._box(c,x2,y,bw,bh,":News (news-045)",
            ["title='OBU Graduates'","slug='obu-graduates'","status='published'",
             "feat_img='med-022'","pub_at='2026-06-01'"])
        self._box(c,x3,y,bw,bh,":ActivityLog (log-201)",
            ["user_id='usr-001'","action='CREATE'","entity='news'",
             "entity_id='news-045'","created_at=NOW()"])
        # Media box below news
        mx=x2; my=y-90
        self._box(c,mx,my,bw,80,":Media (med-022)",
            ["file_url='cdn/.../grad.jpg'","file_type='image/jpeg'","folder='news'"])
        # Arrows
        self._arrow(c,x1+bw,y+bh/2,x2,y+bh/2,"creates")
        self._arrow(c,x1+bw/2,y,x1+bw/2,y-90+40,"logs")  # user→log (vertical)
        self._arrow(c,x3,y+bh/2,x3-5,y+bh/2-10)
        # Vertical user to log
        self._arrow(c,x1+bw/2,y,x3+bw/2,y+5,"logs")
        # News references Media
        self._arrow(c,x2+bw/2,y,x2+bw/2,my+80,"references")
        c.restoreState()

story.append(ObjDiagram(TW, 260))

story += [
    sp(8),
    H2("4.1.4. Sequence Diagram"),
    P("The sequence diagram illustrates the interaction between system components for the two "
      "most critical workflows: a public user viewing a news article and an admin user "
      "publishing a news article."),
    sp(4),
    Paragraph("<b>Figure 4.4: Sequence Diagram "+chr(8212)+" Public User Views a News Article</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

class SeqDiagram(Flowable):
    def __init__(self, w, h, participants, messages):
        super().__init__()
        self.width        = w
        self.height       = h
        self.participants = participants  # list of labels
        self.messages     = messages     # list of (from_idx, to_idx, label, dashed)

    def wrap(self, *args):
        return self.width, self.height

    def draw(self):
        c   = self.canv
        W, H= self.width, self.height
        n   = len(self.participants)
        col_w = W / n
        top   = H - 20
        bot   = 20
        c.saveState()

        # Draw participant boxes + lifelines
        for i, label in enumerate(self.participants):
            cx = col_w * i + col_w/2
            bw, bh = col_w*0.82, 18
            bx = cx - bw/2
            c.setFillColor(PRIMARY)
            c.setStrokeColor(PRIMARY)
            c.rect(bx, top - bh, bw, bh, fill=1)
            c.setFillColor(colors.white)
            c.setFont("Times-Bold", 6.5)
            tw = c.stringWidth(label, "Times-Bold", 6.5)
            c.drawString(cx - tw/2, top - bh + 5, label)
            # lifeline
            c.setStrokeColor(colors.Color(0.6,0.75,0.68))
            c.setLineWidth(0.8)
            c.setDash([4, 3])
            c.line(cx, top - bh, cx, bot)
            c.setDash([])

        # Draw messages
        step_h = (top - bh - bot - 10) / (len(self.messages) + 1)
        for idx, (fi, ti, label, dashed) in enumerate(self.messages):
            y    = top - bh - 10 - step_h * (idx+1)
            x1   = col_w * fi + col_w/2
            x2   = col_w * ti + col_w/2
            arrow_right = x2 > x1
            xa   = x2 + (-8 if arrow_right else 8)
            c.setStrokeColor(PRIMARY)
            c.setLineWidth(0.9)
            if dashed:
                c.setDash([3, 2])
            else:
                c.setDash([])
            c.line(x1, y, x2, y)
            # arrowhead
            if arrow_right:
                _poly(c, [x2, y, x2-7, y+4, x2-7, y-4], PRIMARY)
            else:
                _poly(c, [x2, y, x2+7, y+4, x2+7, y-4], PRIMARY)
            c.setDash([])
            # label
            mx = (x1+x2)/2
            c.setFont("Times-Roman", 6)
            c.setFillColor(colors.Color(0.1,0.1,0.1))
            tw = c.stringWidth(label, "Times-Roman", 6)
            c.drawString(mx - tw/2, y+3, label)
            # step number
            c.setFont("Times-Bold", 6)
            c.setFillColor(colors.Color(0.5,0.5,0.5))
            c.drawString(4, y-1, str(idx+1))

        c.restoreState()

bh = 18  # participant box height used in SeqDiagram

def _poly(c, pts, fill_color):
    """Draw a filled polygon using canvas path (polygon not available)."""
    c.setFillColor(fill_color)
    p = c.beginPath()
    p.moveTo(pts[0], pts[1])
    for i in range(2, len(pts), 2):
        p.lineTo(pts[i], pts[i+1])
    p.close()
    c.drawPath(p, fill=1, stroke=0)

_parts1 = ["Browser", "TanStack\nRouter", "Server\nFunction", "PostgreSQL"]
_msgs1  = [
    (0, 1, "GET /news/$slug (HTTPS)",              False),
    (1, 2, "call loader → getNewsBySlug(slug)",    False),
    (2, 3, "SELECT news JOIN media WHERE slug=$1", False),
    (3, 2, "return news row + image URL",          True),
    (2, 1, "return NewsItem",                      True),
    (1, 0, "SSR render → send HTML to browser",   True),
]
story.append(SeqDiagram(TW, 200, _parts1, _msgs1))
story.append(sp(6))
story.append(Paragraph("<b>Figure 4.5: Sequence Diagram "+chr(8212)+" Admin User Publishes a News Article</b>",
    S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
      textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER, spaceBefore=4, spaceAfter=4)))

_parts2 = ["Admin\nBrowser", "AuthContext", "Server\nFunction", "PostgreSQL", "Activity\nLog"]
_msgs2  = [
    (0, 1, "POST form → /admin/content/news",           False),
    (1, 2, "verify JWT session (Supabase Auth)",        False),
    (2, 2, "Zod validate input schema",                 False),
    (2, 3, "INSERT INTO news status='published'",       False),
    (3, 2, "return news.id",                            True),
    (2, 4, "INSERT INTO activity_logs (CREATE, news)",  False),
    (4, 2, "return log.id",                             True),
    (2, 0, "return {ok:true} → toast 'Published'",     True),
]
story.append(SeqDiagram(TW, 220, _parts2, _msgs2))

story += [
    sp(8),
    H2("4.1.5. State Chart Diagram"),
    P("The statechart describes the lifecycle of a content item (News, Announcement, Event) "
      "through all possible states from creation to archival."),
    sp(4),
    Paragraph("<b>Figure 4.6: State Chart Diagram "+chr(8212)+" Content Item Lifecycle</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

class StateDiagram(Flowable):
    def __init__(self, w, h):
        super().__init__()
        self.width = w; self.height = h
    def wrap(self, *args): return self.width, self.height
    def _state(self, c, cx, cy, label, w=72, h=22, color=None):
        bg = color or colors.Color(0.90,0.97,0.93)
        c.setFillColor(bg); c.setStrokeColor(PRIMARY); c.setLineWidth(1.2)
        c.roundRect(cx-w/2, cy-h/2, w, h, 5, fill=1)
        c.setFillColor(PRIMARY); c.setFont("Times-Bold", 7.5)
        tw = c.stringWidth(label,"Times-Bold",7.5)
        c.drawString(cx-tw/2, cy-3, label)
    def _arrow(self, c, x1,y1,x2,y2, label="", dashed=False):
        c.setStrokeColor(PRIMARY); c.setLineWidth(0.8)
        c.setDash([3,2] if dashed else [])
        c.line(x1,y1,x2,y2)
        c.setDash([])
        # arrowhead at end
        import math
        dx,dy = x2-x1, y2-y1
        length = max(math.sqrt(dx*dx+dy*dy),0.001)
        ux,uy = dx/length, dy/length
        c.setFillColor(PRIMARY)
        ax,ay = x2-ux*8, y2-uy*8
        px,py = -uy*4, ux*4
        _poly(c, [x2,y2, ax+px,ay+py, ax-px,ay-py], PRIMARY)
        if label:
            mx,my = (x1+x2)/2,(y1+y2)/2
            c.setFont("Times-Roman",6); c.setFillColor(colors.Color(0.2,0.2,0.2))
            tw = c.stringWidth(label,"Times-Roman",6)
            c.drawString(mx-tw/2, my+3, label)
    def draw(self):
        c = self.canv; W,H = self.width, self.height
        c.saveState()
        cx = W/2
        # States vertically stacked with branches
        states = [
            (cx,     H-35,  "DRAFT",     PRIMARY,       colors.Color(0.82,0.93,0.87)),
            (cx,     H-95,  "REVIEW",    PRIMARY2,      colors.Color(0.93,0.97,1.0)),
            (cx,     H-155, "PUBLISHED", PRIMARY,       colors.Color(0.82,0.93,0.87)),
            (cx,     H-215, "ARCHIVED",  PRIMARY2,      colors.Color(0.93,0.97,1.0)),
            (cx+140, H-155, "EXPIRED",   colors.Color(0.7,0.3,0.1), colors.Color(1.0,0.93,0.88)),
            (cx-140, H-215, "DELETED",   colors.Color(0.5,0.1,0.1), colors.Color(1.0,0.88,0.88)),
        ]
        # start dot
        c.setFillColor(PRIMARY); c.circle(cx, H-15, 7, fill=1)
        for (sx,sy,label,tc,bg) in states:
            self._state(c, sx, sy, label, color=bg)
        # arrows
        self._arrow(c, cx, H-22, cx, H-35+11,      "create")
        self._arrow(c, cx, H-35-11, cx, H-95+11,   "submit for review")
        self._arrow(c, cx+5, H-95-11, cx+5, H-155+11, "approve")
        self._arrow(c, cx-5, H-95-11, cx-5, H-35-11, "reject", dashed=True)
        self._arrow(c, cx, H-155-11, cx, H-215+11,  "archive")
        self._arrow(c, cx-5, H-215-11, cx-5, H-155-11,"restore", dashed=True)
        self._arrow(c, cx+36, H-155, cx+140-36, H-155, "expires_at reached")
        self._arrow(c, cx-36, H-215, cx-140+36, H-215, "hard delete")
        # Also direct DRAFT→PUBLISHED
        self._arrow(c, cx+36, H-35, cx+80, H-35-30, "publish directly", dashed=True)
        self._arrow(c, cx+80, H-35-30, cx+36, H-155+11, "")
        c.restoreState()

story.append(StateDiagram(TW, 260))

story += [
    sp(8),
    H2("4.1.6. Activity Diagram"),
    P("The activity diagram illustrates the complete workflow for an admin user creating and "
      "publishing content in the OBU-CMS, from login through to the public site update."),
    sp(4),
    Paragraph("<b>Figure 4.7: Activity Diagram "+chr(8212)+" Admin Content Publishing Workflow</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

class ActivityDiagram(Flowable):
    def __init__(self, w, h):
        super().__init__()
        self.width = w; self.height = h
    def wrap(self, *args): return self.width, self.height
    def _act(self, c, cx, cy, label, w=130, h=20):
        c.setFillColor(colors.Color(0.90,0.97,0.93))
        c.setStrokeColor(PRIMARY); c.setLineWidth(1.0)
        c.roundRect(cx-w/2, cy-h/2, w, h, 10, fill=1)
        c.setFillColor(PRIMARY); c.setFont("Times-Roman", 7)
        tw = c.stringWidth(label,"Times-Roman",7)
        c.drawString(cx-tw/2, cy-2.5, label)
    def _decision(self, c, cx, cy, label, w=110, h=22):
        pts = [cx, cy+h/2, cx+w/2, cy, cx, cy-h/2, cx-w/2, cy]
        _poly(c, pts, colors.Color(1.0,0.97,0.88))
        c.setStrokeColor(colors.Color(0.8,0.5,0.0)); c.setLineWidth(1.0)
        p = c.beginPath()
        p.moveTo(cx, cy+h/2); p.lineTo(cx+w/2, cy)
        p.lineTo(cx, cy-h/2); p.lineTo(cx-w/2, cy); p.close()
        c.drawPath(p, fill=0, stroke=1)
        c.setFillColor(colors.Color(0.5,0.3,0.0)); c.setFont("Times-Bold",6.5)
        tw = c.stringWidth(label,"Times-Bold",6.5)
        c.drawString(cx-tw/2, cy-2.5, label)
    def _arrow(self, c, x1,y1,x2,y2, label=""):
        c.setStrokeColor(PRIMARY); c.setLineWidth(0.8); c.setDash([])
        c.line(x1,y1,x2,y2)
        import math
        dx,dy = x2-x1,y2-y1; ln = max(math.sqrt(dx*dx+dy*dy),0.001)
        ux,uy = dx/ln, dy/ln
        ax,ay = x2-ux*7,y2-uy*7
        px,py = -uy*3,ux*3
        _poly(c, [x2,y2, ax+px,ay+py, ax-px,ay-py], PRIMARY)
        if label:
            c.setFont("Times-Roman",6); c.setFillColor(colors.Color(0.3,0.3,0.3))
            tw = c.stringWidth(label,"Times-Roman",6)
            c.drawString((x1+x2)/2-tw/2,(y1+y2)/2+3,label)
    def draw(self):
        c = self.canv; W,H = self.width,self.height
        c.saveState()
        cx = W/2; gap = 32
        # start
        c.setFillColor(PRIMARY); c.circle(cx, H-15, 7, fill=1)
        self._arrow(c, cx, H-22, cx, H-42)
        self._act(c, cx, H-52, "Navigate to /admin/login")
        self._arrow(c, cx, H-62, cx, H-82)
        self._act(c, cx, H-92, "Enter email + password")
        self._arrow(c, cx, H-102, cx, H-122)
        self._decision(c, cx, H-133, "Valid Credentials?")
        # No branch — right
        self._arrow(c, cx+55, H-133, cx+130, H-133, "No")
        self._act(c, cx+185, H-133, "Show Error", w=90)
        self._arrow(c, cx+185, H-133+10, cx+185, H-92+10)
        self._arrow(c, cx+185-45, H-92, cx+45, H-92, "retry")
        # Yes branch — down
        self._arrow(c, cx, H-133-11, cx, H-153, "Yes")
        self._act(c, cx, H-163, "Redirect to /admin/dashboard")
        self._arrow(c, cx, H-173, cx, H-193)
        self._act(c, cx, H-203, "Select content module")
        self._arrow(c, cx, H-213, cx, H-233)
        self._act(c, cx, H-243, "Click 'Add News'")
        self._arrow(c, cx, H-253, cx, H-273)
        self._act(c, cx, H-283, "Fill form: title, content, image")
        self._arrow(c, cx, H-293, cx, H-313)
        self._decision(c, cx, H-324, "Save Draft or Publish?")
        # Draft branch — left
        self._arrow(c, cx-55, H-324, cx-140, H-324, "Draft")
        self._act(c, cx-195, H-324, "status='draft'\nSave to DB", w=95)
        # Publish branch — right
        self._arrow(c, cx+55, H-324, cx+130, H-324, "Publish")
        self._act(c, cx+185, H-324, "Zod validate", w=90)
        self._arrow(c, cx+185, H-334, cx+185, H-354)
        self._act(c, cx+185, H-364, "INSERT news\npublished", w=90)
        self._arrow(c, cx+185, H-374, cx+185, H-394)
        self._act(c, cx+185, H-404, "INSERT activity_log", w=90)
        self._arrow(c, cx+185, H-414, cx+185, H-434)
        self._act(c, cx+185, H-444, "Toast: Published!", w=90)
        # end dot
        self._arrow(c, cx+185, H-454, cx, H-454)
        c.setFillColor(PRIMARY); c.setStrokeColor(colors.white); c.setLineWidth(2)
        c.circle(cx, H-454, 8, fill=1)
        c.circle(cx, H-454, 5, fill=0)
        c.restoreState()

story.append(ActivityDiagram(TW, 470))
story.append(sp(8))
story.append(PageBreak())

# ══════════════════════════════════════════════════════════
# CHAPTER 4 continued: UI, Architecture, Security, DB
# ══════════════════════════════════════════════════════════
story += [
    H1("4.2. User Interface Design"), hr(),
    H2("4.2.1. Navigational Flow"),
    P("The navigational flow uses a <b>role-based structure</b> with two distinct navigation "
      "trees: one for the public website (anonymous users) and one for the Admin CMS "
      "(authenticated users). The role of the logged-in user determines which sidebar sections "
      "are visible in the Admin CMS."),
    sp(4),
    Paragraph("<b>Figure 4.8: Navigational Flow "+chr(8212)+" Public Website (Anonymous Users)</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

nav_pub = None  # replaced by drawn diagram

class NavFlowDiagram(Flowable):
    """Drawn navigational flow diagram using tree-style boxes."""
    def __init__(self, w, h, title, nodes):
        super().__init__(); self.width=w; self.height=h
        self.title=title; self.nodes=nodes
    def wrap(self,*a): return self.width,self.height
    def _line(self,c,x1,y1,x2,y2):
        c.setStrokeColor(colors.Color(0.4,0.65,0.5))
        c.setLineWidth(0.7); c.line(x1,y1,x2,y2)
    def draw(self):
        c=self.canv; W,H=self.width,self.height; c.saveState()
        NW=100; NH=22; coords=[]
        c.setFillColor(PRIMARY); c.setFont("Times-Bold",8.5)
        tw=c.stringWidth(self.title,"Times-Bold",8.5)
        c.drawString(W/2-tw/2, H-13, self.title)
        for i,(lbl,xf,yf,par) in enumerate(self.nodes):
            x=W*xf-NW/2; y=H*yf-NH/2
            coords.append((x+NW/2, y+NH/2))
            bg = PRIMARY if i==0 else colors.Color(0.88,0.96,0.91)
            tc = colors.white if i==0 else PRIMARY
            c.setFillColor(bg); c.setStrokeColor(PRIMARY); c.setLineWidth(0.8)
            c.roundRect(x, y, NW, NH, 5, fill=1)
            # auto-fit font
            for fs in [7.5, 6.5, 5.5, 5.0]:
                c.setFont("Times-Roman", fs)
                tw2 = c.stringWidth(lbl,"Times-Roman",fs)
                if tw2 <= NW-6: break
            c.setFillColor(tc)
            c.drawString(x+NW/2-tw2/2, y+NH/2-fs/2.5, lbl)
            if par>=0:
                px,py=coords[par]
                self._line(c,px,py,x+NW/2,y+NH)
        c.restoreState()

# Public nav tree — well-spaced
pub_nodes=[
    ("Homepage /",          0.50, 0.93, -1),
    ("Navbar",              0.50, 0.80,  0),
    ("About",               0.09, 0.66,  1),
    ("Academics",           0.24, 0.66,  1),
    ("Research",            0.40, 0.66,  1),
    ("News",                0.56, 0.66,  1),
    ("Events",              0.72, 0.66,  1),
    ("Contact",             0.88, 0.66,  1),
    ("Programs",            0.18, 0.51,  3),
    ("Departments",         0.32, 0.51,  3),
    ("Footer Quick Links",  0.50, 0.37, -1),
    ("Announcements",       0.12, 0.22, 10),
    ("Leadership",          0.27, 0.22, 10),
    ("Services",            0.42, 0.22, 10),
    ("Galleries",           0.57, 0.22, 10),
    ("Registrar",           0.72, 0.22, 10),
    ("Career",              0.88, 0.22, 10),
]
story.append(NavFlowDiagram(TW, 280, "Public Website Navigation Flow", pub_nodes))
story.append(sp(8))
story.append(Paragraph("<b>Figure 4.9: Navigational Flow "+chr(8212)+" Admin CMS (Authenticated Users)</b>",
    S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
      textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER, spaceBefore=4, spaceAfter=4)))

# Admin nav tree — well-spaced
adm_nodes=[
    ("/admin/login",        0.50, 0.93, -1),
    ("/admin/dashboard",    0.50, 0.80,  0),
    ("Content",             0.09, 0.65,  1),
    ("Academics",           0.23, 0.65,  1),
    ("Research",            0.37, 0.65,  1),
    ("Registrar",           0.51, 0.65,  1),
    ("Website",             0.65, 0.65,  1),
    ("System(Admin)",       0.84, 0.65,  1),
    ("news/events",         0.07, 0.48,  2),
    ("galleries",           0.18, 0.48,  2),
    ("programs/depts",      0.29, 0.48,  3),
    ("projects/centers",    0.40, 0.48,  4),
    ("annnnc./docs",        0.51, 0.48,  5),
    ("pages/media/nav",     0.63, 0.48,  6),
    ("users/roles/logs",    0.82, 0.48,  7),
]
story.append(NavFlowDiagram(TW, 240, "Admin CMS Navigation Flow (Role-Based)", adm_nodes))

story += [
    sp(8),
    H2("4.2.2. Key UI Design Decisions"),
    B("<b>University Brand Colors:</b> Primary color #186a42 (deep OBU green) used for all "
      "action buttons, headings, and accents. Secondary color #ffcc00 (gold) used for "
      "highlights, matching OBU's visual identity."),
    B("<b>Admin CMS Layout:</b> Fixed left sidebar navigation with collapsible sections, top "
      "header with user profile and logout, main content area with consistent card/panel layout."),
    B("<b>Data Tables:</b> All admin list views use a standardized table: image thumbnail, "
      "title/description, category, status badge, date, and action buttons (Edit, Delete)."),
    B("<b>Form Layout:</b> Two-column layout for edit views "+chr(8212)+" main content fields "
      "left (2/3 width), metadata (status, category, featured image) right (1/3 width)."),
    B("<b>Status Badges:</b> Color-coded badges "+chr(8212)+" green for published/active, "
      "yellow for draft, blue for review, gray for archived."),
    B("<b>Toast Notifications:</b> Sonner library used for non-blocking success/error "
      "notifications after every save, delete, or upload operation."),
    sp(8),

    H1("4.3. Software Architecture"), hr(),
    H2("4.3.1. Three-Tier Architecture"),
    P("The OBU-CMS follows a three-tier architecture clearly separating presentation, "
      "business logic, and data persistence layers."),
    sp(4),
    Paragraph("<b>Figure 4.10: Three-Tier Architecture Diagram</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

arch_data = None  # replaced by drawn diagram

class ArchDiagram(Flowable):
    """Three-tier architecture drawn diagram."""
    def __init__(self,w,h): super().__init__(); self.width=w; self.height=h
    def wrap(self,*a): return self.width,self.height
    def draw(self):
        c=self.canv; W,H=self.width,self.height; c.saveState()
        import math
        tiers=[
            ("TIER 1: PRESENTATION",
             ["TanStack Router + React 19 (SSR via TanStack Start)",
              "Public Website Routes + Admin CMS Routes",
              "Tailwind CSS v4 + Radix UI + Lucide Icons",
              "TanStack Query (client-side cache & sync)"],
             PRIMARY, colors.Color(0.82,0.93,0.87)),
            ("TIER 2: APPLICATION",
             ["TanStack Start Server Functions (Node.js/Vite)",
              "src/backend/api.ts — 45+ createServerFn handlers",
              "Zod input validation + CSRF middleware",
              "SQL query builder + Activity log writes"],
             colors.Color(0.10,0.40,0.28), colors.Color(0.87,0.96,0.90)),
            ("TIER 3: DATA",
             ["Supabase Cloud PostgreSQL (25+ tables, RLS)",
              "Supabase Auth (JWT sessions + onAuthStateChange)",
              "Supabase Storage (media files + CDN delivery)",
              "Row Level Security policies per table"],
             colors.Color(0.04,0.25,0.18), colors.Color(0.93,0.99,0.95)),
        ]
        th=H/3-8; bx=0
        for i,(title,items,hc,bg) in enumerate(tiers):
            by=H-(i+1)*(th+8)+4
            c.setFillColor(bg); c.setStrokeColor(hc); c.setLineWidth(1.2)
            c.rect(bx,by,W,th,fill=1)
            # header strip
            c.setFillColor(hc); c.rect(bx,by+th-18,W,18,fill=1)
            c.setFillColor(colors.white); c.setFont("Times-Bold",8.5)
            tw=c.stringWidth(title,"Times-Bold",8.5)
            c.drawString(W/2-tw/2,by+th-12,title)
            # items
            c.setFont("Times-Roman",7.5); c.setFillColor(colors.Color(0.1,0.1,0.1))
            for j,item in enumerate(items):
                c.drawString(bx+12, by+th-30-(j*13), chr(8226)+" "+item)
            # arrow between tiers
            if i<2:
                ay=by+th+4; ax=W/2
                c.setFillColor(hc); c.setStrokeColor(hc); c.setLineWidth(1.0)
                c.line(ax,ay,ax,ay-4)
                _poly(c,[ax,ay-4,ax-6,ay+2,ax+6,ay+2],hc)
        c.restoreState()

story.append(ArchDiagram(TW,220))

story += [
    sp(8),
    H2("4.3.2. Component Diagram"),
    P("The component diagram shows the major software components and their dependencies."),
    sp(4),
    Paragraph("<b>Figure 4.11: Component Diagram "+chr(8212)+" OBU-CMS</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

comp_data = None  # replaced by drawn diagram

class CompDiagram(Flowable):
    """Component diagram drawn with boxes and dependency arrows."""
    def __init__(self,w,h): super().__init__(); self.width=w; self.height=h
    def wrap(self,*a): return self.width,self.height
    def _comp(self,c,x,y,w,h,name,loc,color=None):
        bg=color or colors.Color(0.90,0.97,0.93)
        c.setFillColor(bg); c.setStrokeColor(PRIMARY); c.setLineWidth(0.9)
        c.roundRect(x,y,w,h,4,fill=1)
        # component stereotype notch
        c.setFillColor(colors.white); c.setStrokeColor(PRIMARY)
        c.rect(x+w-14,y+h-10,12,8,fill=1)
        c.rect(x+w-17,y+h-13,12,8,fill=1)
        c.setFillColor(PRIMARY); c.setFont("Times-Bold",7)
        tw=c.stringWidth(name,"Times-Bold",7)
        c.drawString(x+w/2-tw/2,y+h-20,name)
        c.setFont("Times-Roman",6); c.setFillColor(colors.Color(0.3,0.3,0.3))
        tw=c.stringWidth(loc,"Times-Roman",6)
        c.drawString(x+w/2-tw/2,y+7,loc)
    def _dep(self,c,x1,y1,x2,y2,label=""):
        import math
        c.setStrokeColor(PRIMARY2); c.setLineWidth(0.7); c.setDash([3,2])
        c.line(x1,y1,x2,y2); c.setDash([])
        dx,dy=x2-x1,y2-y1; ln=max(math.sqrt(dx*dx+dy*dy),0.001)
        ux,uy=dx/ln,dy/ln
        ax,ay=x2-ux*6,y2-uy*6
        _poly(c,[x2,y2,ax-uy*3+ux*(-6),ay+ux*3+uy*(-6),
                  ax+uy*3+ux*(-6),ay-ux*3+uy*(-6)],PRIMARY2)
        if label:
            mx,my=(x1+x2)/2,(y1+y2)/2
            c.setFont("Times-Italic",5.5); c.setFillColor(PRIMARY2)
            c.drawString(mx+2,my+2,label)
    def draw(self):
        c=self.canv; W,H=self.width,self.height; c.saveState()
        cw,ch=110,44; gap=8
        # Row 1 — browser layer
        self._comp(c,W*0.04,H-50,cw,ch,"Public Routes","src/routes/*.tsx",colors.Color(0.87,0.96,0.90))
        self._comp(c,W*0.38,H-50,cw,ch,"Admin Routes","src/routes/admin.*",colors.Color(0.87,0.96,0.90))
        self._comp(c,W*0.72,H-50,cw,ch,"AuthContext","src/frontend/contexts/",colors.Color(0.93,0.97,1.0))
        # Row 2 — hooks + middleware
        self._comp(c,W*0.18,H-115,cw,ch,"Admin Hooks","admin/hooks/",colors.Color(0.93,0.97,1.0))
        self._comp(c,W*0.55,H-115,cw,ch,"CSRF Middleware","src/start.ts",colors.Color(1.0,0.96,0.88))
        # Row 3 — server functions
        self._comp(c,W*0.35,H-180,cw+20,ch,"Server Functions","src/backend/api.ts",PRIMARY)
        c.setFillColor(colors.white); c.setFont("Times-Bold",7.5)
        tw=c.stringWidth("Server Functions","Times-Bold",7.5)
        c.drawString(W*0.35+60-tw/2,H-180+ch-17,"Server Functions")
        c.setFont("Times-Roman",6.5)
        tw=c.stringWidth("src/backend/api.ts","Times-Roman",6.5)
        c.drawString(W*0.35+60-tw/2,H-180+8,"src/backend/api.ts")
        # Row 4 — DB layer
        self._comp(c,W*0.06,H-245,cw,ch,"DB Layer","src/backend/database/",colors.Color(0.82,0.93,0.87))
        self._comp(c,W*0.38,H-245,cw,ch,"Supabase Client","src/lib/supabase.ts",colors.Color(0.82,0.93,0.87))
        self._comp(c,W*0.70,H-245,cw,ch,"Media Library","admin.website.media",colors.Color(0.82,0.93,0.87))
        # Dependency arrows
        self._dep(c,W*0.04+cw/2,H-50,W*0.35+60,H-180+ch,"uses")
        self._dep(c,W*0.38+cw/2,H-50,W*0.35+60,H-180+ch,"uses")
        self._dep(c,W*0.72+cw/2,H-50,W*0.38+cw/2,H-245+ch,"auth")
        self._dep(c,W*0.18+cw/2,H-115,W*0.35+60,H-180+ch,"calls")
        self._dep(c,W*0.35+60,H-180,W*0.06+cw/2,H-245+ch,"pg pool")
        self._dep(c,W*0.35+60,H-180,W*0.38+cw/2,H-245+ch,"JS client")
        self._dep(c,W*0.35+60,H-180,W*0.70+cw/2,H-245+ch,"storage")
        c.restoreState()

story.append(CompDiagram(TW, 280))

story += [
    sp(8),
    H2("4.3.3. Deployment Diagram"),
    P("The deployment diagram shows the physical deployment environment of the OBU-CMS system."),
    sp(4),
    Paragraph("<b>Figure 4.12: Deployment Diagram "+chr(8212)+" OBU-CMS Production Environment</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

dep_data = None  # replaced by drawn diagram

class DeployDiagram(Flowable):
    """UML Deployment diagram with nodes and communication paths."""
    def __init__(self,w,h): super().__init__(); self.width=w; self.height=h
    def wrap(self,*a): return self.width,self.height
    def _node(self,c,x,y,w,h,title,items,color=None):
        bg=color or colors.Color(0.90,0.97,0.93)
        # 3D box effect
        c.setFillColor(colors.Color(0.6,0.75,0.68)); c.setStrokeColor(PRIMARY)
        c.setLineWidth(0.7)
        c.rect(x+6,y-6,w,h,fill=1)
        c.setFillColor(bg)
        c.rect(x,y,w,h,fill=1)
        c.setFillColor(PRIMARY); c.setFont("Times-Bold",7.5)
        tw=c.stringWidth(title,"Times-Bold",7.5)
        c.drawString(x+w/2-tw/2,y+h-13,title)
        c.setFont("Times-Roman",6.5); c.setFillColor(colors.Color(0.1,0.1,0.1))
        for i,item in enumerate(items):
            c.drawString(x+6,y+h-24-(i*11),chr(8226)+" "+item)
    def _comm(self,c,x1,y1,x2,y2,label):
        import math
        c.setStrokeColor(PRIMARY); c.setLineWidth(0.9); c.setDash([4,2])
        c.line(x1,y1,x2,y2); c.setDash([])
        mx,my=(x1+x2)/2,(y1+y2)/2
        c.setFont("Times-Roman",6); c.setFillColor(PRIMARY)
        tw=c.stringWidth(label,"Times-Roman",6)
        c.drawString(mx-tw/2,my+3,label)
    def draw(self):
        c=self.canv; W,H=self.width,self.height; c.saveState()
        nw,nh=W*0.28,70
        # Row 1 — browsers
        self._node(c,0,H-80,nw,nh,"Public Browser",
            ["React 19 SPA","SSR HTML hydrated"],colors.Color(0.88,0.96,0.91))
        self._node(c,W*0.36,H-80,nw,nh,"Admin Browser",
            ["React 19 Admin CMS","Supabase Auth JWT"],colors.Color(0.93,0.97,1.0))
        # HTTPS arrows
        self._comm(c,nw,H-80+nh/2,W*0.36,H-80+nh/2,"HTTPS")
        # Row 2 — web server
        self._node(c,W*0.18,H-185,nw*1.1,nh+10,"OBU-CMS Web Server",
            ["TanStack Start (Node.js)","createServerFn API","CSRF + Error middleware"],
            colors.Color(0.82,0.93,0.87))
        self._comm(c,nw/2,H-80,W*0.18+nw*0.55,H-175,"HTTPS")
        self._comm(c,W*0.36+nw/2,H-80,W*0.18+nw*0.55,H-175,"HTTPS")
        # Row 3 — Supabase cloud
        self._node(c,0,H-300,nw,nh,"Supabase PostgreSQL",
            ["25+ tables","RLS policies","Migrations"],
            colors.Color(0.86,0.94,0.89))
        self._node(c,W*0.36,H-300,nw,nh,"Supabase Auth",
            ["JWT issuance","onAuthStateChange","Session mgmt"],
            colors.Color(0.93,0.97,1.0))
        self._node(c,W*0.70,H-300,nw,nh,"Supabase Storage",
            ["Media files","CDN delivery","Folders by type"],
            colors.Color(0.93,0.97,1.0))
        # connections from web server to supabase
        sx=W*0.18+nw*0.55; sy=H-185
        self._comm(c,sx,sy,nw/2,H-300+nh,"pg pool (DATABASE_URL)")
        self._comm(c,sx,sy,W*0.36+nw/2,H-300+nh,"JS client")
        self._comm(c,sx,sy,W*0.70+nw/2,H-300+nh,"JS client")
        c.restoreState()

story.append(DeployDiagram(TW, 320))

story += [
    sp(8),
    H1("4.4. Security and Access Control"), hr(),
    H2("4.4.1. Authentication"),
    P("Authentication is implemented using <b>Supabase Auth</b> with email/password sign-in. "
      "The flow: (1) Admin submits credentials on /admin/login. (2) "
      "supabase.auth.signInWithPassword() returns a JWT session. (3) JWT stored by Supabase "
      "SDK in browser. (4) AuthContext listens to onAuthStateChange() for session sync. "
      "(5) AdminUser profile including role fetched from public.users on session init. "
      "(6) All /admin/* routes protected by TanStack Router beforeLoad guard redirecting "
      "unauthenticated users to /admin/login."),
    H2("4.4.2. Authorization (RBAC)"),
    P("Role-Based Access Control is enforced at two independent layers:"),
    B("<b>Application Layer:</b> Admin routes check role_name from AuthContext to conditionally "
      "render or restrict UI elements. System Users and Roles menu items are only visible to "
      "System Administrators."),
    B("<b>Database Layer (RLS):</b> PostgreSQL Row Level Security enforces authorization at the "
      "data layer. Public users can only SELECT records with status='published' or "
      "status='active'. Authenticated admins can perform ALL operations on records for their "
      "permitted tables. This ensures that even if the application layer is bypassed, the "
      "database will never return unauthorized data."),
    sp(4),
    Paragraph("<b>Figure 4.13: RBAC Access Matrix</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

rbac_data = None  # replaced by drawn diagram

class RBACDiagram(Flowable):
    """RBAC matrix drawn as a colored grid."""
    def __init__(self,w,h): super().__init__(); self.width=w; self.height=h
    def wrap(self,*a): return self.width,self.height
    def draw(self):
        c=self.canv; W,H=self.width,self.height; c.saveState()
        roles=["Public\nUser","Content\nEditor","Registrar\nStaff","System\nAdmin"]
        resources=["View published content","Manage News/Events/Annnn.","Manage Registrar content",
                   "Manage Research/Services","Upload Media","Manage Users & Roles",
                   "View Activity Logs","Configure Site Settings"]
        perms=[
            [1,1,1,1],[0,1,1,1],[0,0,1,1],
            [0,1,0,1],[0,1,1,1],[0,0,0,1],
            [0,0,0,1],[0,0,0,1],
        ]
        rw=(W-120)/len(roles); rh=22; lw=120
        # header row
        c.setFillColor(PRIMARY); c.rect(0,H-rh,W,rh,fill=1)
        c.setFillColor(colors.white); c.setFont("Times-Bold",7.5)
        tw=c.stringWidth("Resource / Role","Times-Bold",7.5)
        c.drawString(lw/2-tw/2,H-rh+7,"Resource / Role")
        for j,role in enumerate(roles):
            cx=lw+j*rw+rw/2
            for line in role.split("\n"):
                c.setFont("Times-Bold",7)
                tw=c.stringWidth(line,"Times-Bold",7)
                c.drawString(cx-tw/2,H-rh+(5 if "\n" not in role else (12 if line==role.split("\n")[0] else 3)),line)
        # data rows
        for i,res in enumerate(resources):
            y=H-rh*(i+2)
            bg=colors.Color(0.97,0.99,0.97) if i%2==0 else colors.white
            c.setFillColor(bg); c.rect(0,y,W,rh,fill=1)
            c.setStrokeColor(colors.Color(0.8,0.88,0.84)); c.setLineWidth(0.4)
            c.rect(0,y,W,rh,fill=0)
            c.setFillColor(PRIMARY); c.setFont("Times-Roman",7)
            c.drawString(5,y+7,res)
            for j,p in enumerate(perms[i]):
                cx=lw+j*rw+rw/2; cy=y+rh/2
                if p==1:
                    c.setFillColor(colors.Color(0.15,0.65,0.35))
                    c.circle(cx,cy,7,fill=1)
                    c.setFillColor(colors.white); c.setFont("Times-Bold",8)
                    tw=c.stringWidth(chr(10004),"Times-Bold",8)
                    c.drawString(cx-tw/2,cy-3,chr(10004))
                else:
                    c.setFillColor(colors.Color(0.85,0.85,0.85))
                    c.circle(cx,cy,7,fill=1)
                    c.setFillColor(colors.Color(0.5,0.5,0.5)); c.setFont("Times-Bold",8)
                    tw=c.stringWidth(chr(10007),"Times-Bold",8)
                    c.drawString(cx-tw/2,cy-3,chr(10007))
        c.restoreState()

story.append(RBACDiagram(TW, 22*9+22))

story += [
    sp(6),
    H2("4.4.3. CSRF Protection"),
    P("All server functions (createServerFn) are protected by createCsrfMiddleware configured "
      "in src/start.ts. This middleware validates CSRF tokens on all state-changing requests "
      "(POST/PUT/DELETE), preventing cross-site request forgery attacks."),
    H2("4.4.4. Input Validation and SQL Injection Prevention"),
    P("All server function inputs are validated using <b>Zod</b> schemas via .validator() on "
      "createServerFn. Invalid inputs are rejected before reaching the database. All database "
      "queries use <b>parameterized queries</b> via node-postgres ($1, $2, "+chr(8230)+") making "
      "SQL injection architecturally impossible."),
    sp(8),

    H1("4.5. Database Design"), hr(),
    H2("4.5.1. Entity Relationship Diagram (ERD)"),
    P("The ERD below shows the primary entities and their relationships. All content tables "
      "reference the central <b>media</b> table via foreign keys. All admin operations are "
      "tied to <b>users</b> via <b>activity_logs</b>."),
    sp(4),
    Paragraph("<b>Figure 4.14: Database ERD "+chr(8212)+" Core Entity Relationships</b>",
              S("Normal", fontSize=9, leading=12, fontName="Times-Roman",
                textColor=colors.Color(0.3,0.3,0.3), alignment=TA_CENTER,
                spaceBefore=4, spaceAfter=4)),
]

erd_data = None  # replaced by drawn ERD

class ERDDiagram(Flowable):
    """Entity-Relationship Diagram drawn with entity boxes and FK lines."""
    def __init__(self,w,h): super().__init__(); self.width=w; self.height=h
    def wrap(self,*a): return self.width,self.height
    def _ent(self,c,x,y,w,h,name,attrs):
        # entity box
        c.setFillColor(colors.Color(0.90,0.97,0.93))
        c.setStrokeColor(PRIMARY); c.setLineWidth(1.0)
        c.rect(x,y,w,h,fill=1)
        # header
        c.setFillColor(PRIMARY); c.rect(x,y+h-14,w,14,fill=1)
        c.setFillColor(colors.white); c.setFont("Times-Bold",6.5)
        tw=c.stringWidth(name,"Times-Bold",6.5)
        c.drawString(x+w/2-tw/2,y+h-10,name)
        # attrs
        c.setFont("Times-Roman",5.5); c.setFillColor(colors.Color(0.1,0.1,0.1))
        for i,a in enumerate(attrs):
            c.drawString(x+3,y+h-21-(i*9),a)
    def _fk(self,c,x1,y1,x2,y2,label=""):
        import math
        c.setStrokeColor(PRIMARY2); c.setLineWidth(0.7); c.setDash([3,2])
        c.line(x1,y1,x2,y2); c.setDash([])
        dx,dy=x2-x1,y2-y1; ln=max(math.sqrt(dx*dx+dy*dy),0.001)
        ux,uy=dx/ln,dy/ln
        ax,ay=x2-ux*6,y2-uy*6
        _poly(c,[x2,y2,ax-uy*3,ay+ux*3,ax+uy*3,ay-ux*3],PRIMARY2)
        # crow's foot (many side)
        px,py=-uy*4,ux*4
        c.setStrokeColor(PRIMARY2); c.setLineWidth(0.7)
        c.line(x1+ux*6-px,y1+uy*6-py,x1+ux*6+px,y1+uy*6+py)
        c.line(x1+ux*3,y1+uy*3,x1+ux*3-px,y1+uy*3-py)
        c.line(x1+ux*3,y1+uy*3,x1+ux*3+px,y1+uy*3+py)
        if label:
            mx,my=(x1+x2)/2,(y1+y2)/2
            c.setFont("Times-Italic",5); c.setFillColor(PRIMARY2)
            c.drawString(mx+2,my+2,label)
    def draw(self):
        c=self.canv; W,H=self.width,self.height; c.saveState()
        ew,eh=85,68
        # Central media entity — large, center top
        mx=W/2-ew/2; my=H-eh-10
        self._ent(c,mx,my,ew,eh,"media (Central)",
            ["PK: id UUID","file_url TEXT","original_name","file_type","folder","created_at"])
        # Content entities — row below, 5 across full width
        gap5=(W-5*ew)/4
        content=[
            ("news",        ["PK: id","title","slug(UQ)","status","FK: feat_img"],   0),
            ("events",      ["PK: id","title","slug(UQ)","status","FK: evt_img"],    1),
            ("announcements",["PK: id","title","slug(UQ)","status","FK: main_img"], 2),
            ("programs",    ["PK: id","name","slug(UQ)","degree","FK: img",
                              "FK: acad_unit"],                                       3),
            ("leadership",  ["PK: id","full_name","slug(UQ)","FK: prof_img"],        4),
        ]
        cy=H-eh-95
        for name,attrs,col in content:
            ex=col*(ew+gap5)
            self._ent(c,ex,cy,ew,eh,name,attrs)
            self._fk(c,ex+ew/2,cy+eh,mx+ew/2,my,"FK")

        # Row 3 — 5 more content entities
        content2=[
            ("research",   ["PK: id","title","slug(UQ)","FK: img"],          0),
            ("services",   ["PK: id","service_name","slug(UQ)","FK: img"],   1),
            ("vacancies",  ["PK: id","job_title","vacancy_code","status"],   2),
            ("galleries",  ["PK: id","title","slug(UQ)","status"],           3),
            ("pages",      ["PK: id","title","slug(UQ)","FK: img"],          4),
        ]
        cy2=H-eh-190
        for name,attrs,col in content2:
            ex=col*(ew+gap5)
            self._ent(c,ex,cy2,ew,eh,name,attrs)
            if name not in ("vacancies","galleries"):
                self._fk(c,ex+ew/2,cy2+eh,mx+ew/2,my,"FK")

        # Row 4 — system entities, 5 across
        sy=H-eh-285
        sys_ents=[
            ("users",           ["PK: id UUID","email(UQ)","FK: role_id","is_active"],            0),
            ("roles",           ["PK: id UUID","name(UQ)","description"],                         1),
            ("activity_logs",   ["PK: id UUID","FK: user_id","action","entity_type"],             2),
            ("navigation_items",["PK: id UUID","label","url","menu","FK: page_id"],               3),
            ("website_settings",["PK: key TEXT","value TEXT"],                                    4),
        ]
        for name,attrs,col in sys_ents:
            ex=col*(ew+gap5)
            self._ent(c,ex,sy,ew,eh,name,attrs)
        # FK arrows for system
        self._fk(c,0*(ew+gap5)+ew, sy+eh/2, 1*(ew+gap5),   sy+eh/2, "role_id")
        self._fk(c,2*(ew+gap5)+ew/2, sy+eh, 0*(ew+gap5)+ew/2, sy+eh+20, "user_id")
        self._fk(c,0*(ew+gap5)+ew/2, sy+eh, mx+ew/2, my, "profile_img")

        c.restoreState()

story.append(ERDDiagram(TW, 320))

story += [
    sp(6),
    H2("4.5.2. Key Database Design Decisions"),
    B("<b>UUID Primary Keys:</b> All tables use UUID primary keys generated by PostgreSQL "
      "gen_random_uuid() to prevent enumerable IDs and support distributed inserts."),
    B("<b>Slug Unique Constraints:</b> All public-facing content tables have a UNIQUE constraint "
      "on the slug column, enforced at the database level to prevent duplicate URLs."),
    B("<b>Centralized Media Table:</b> A central media table stores all file metadata. Content "
      "tables store a foreign key referencing media.id, allowing media reuse across entities."),
    B("<b>Status-Based Visibility:</b> Content visibility is controlled via a status column "
      "(draft, review, published, archived) rather than hard deletion. Public queries always "
      "include WHERE status='published' or WHERE status='active'."),
    B("<b>Activity Log on Every CUD:</b> Every admin Create/Update/Delete operation includes "
      "an explicit INSERT INTO activity_logs call, providing a complete tamper-evident audit."),
    B("<b>RLS at Migration Level:</b> Row Level Security is enabled and policies created as "
      "part of Supabase migration files, ensuring security is enforced from first deployment."),
    sp(8),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# CHAPTER 5: IMPLEMENTATION
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("Chapter 5: Implementation")); story += [
    P("This chapter documents the development process for the OBU-CMS project, the tools "
      "and technologies used, the technical challenges encountered during implementation and "
      "how they were resolved, and the results of all testing activities conducted."),
    sp(6),

    H1("5.1. Development Process"), hr(),
    P("Development followed the Agile Scrum sprint structure defined in Chapter 2. The "
      "following summarizes the key implementation work of each sprint:"),
    B("<b>Sprint 1 "+chr(8212)+" Authentication and Database Foundation:</b> The Supabase "
      "project was created and the full PostgreSQL schema deployed via migration files in "
      "supabase/migrations/. RLS policies were configured for all tables. The AuthContext was "
      "implemented wrapping the entire application with session state. The Admin CMS skeleton "
      "(sidebar, header, layout) was built. The admin login page was connected to Supabase Auth."),
    B("<b>Sprint 2 "+chr(8212)+" Public Website:</b> All public-facing routes were implemented "
      "using TanStack Router file-based routing. Server functions in src/backend/api.ts were "
      "created for each data entity using createServerFn with node-postgres parameterized SQL "
      "queries. The homepage was built with TanStack Query fetching hero slides, latest news, "
      "upcoming events, research highlights, and site statistics. Dynamic slug-based routes "
      "were implemented for news, events, announcements, programs, departments, leadership, "
      "and research pages."),
    B("<b>Sprint 3 "+chr(8212)+" Admin CMS Core Modules:</b> Admin CRUD panels were built for "
      "News, Events, Announcements, Programs, Academic Units, Leadership, Services, and "
      "Vacancies. The AdminImageUpload component was built integrating with Supabase Storage "
      "for media file uploads. The Media Library admin page was implemented. Navigation "
      "management and website settings panels were built."),
    B("<b>Sprint 4 "+chr(8212)+" Extended Modules:</b> Admin panels were added for Research "
      "Projects, Facilities, Community Engagement, Administrative Offices, Registrar "
      "Announcements, and Registrar Documents. The Activity Log system was implemented "+chr(8212)+" "
      "a database write function records every admin CUD action to the activity_logs table. "
      "The Dashboard was finalized with real-time counts from all content tables and the "
      "recent activity feed."),
    sp(6),

    H1("5.2. Tools Used"), hr(),
    sp(4),
]

tools_data = [
    [TC("Category",True), TC("Tool",True), TC("Version",True), TC("Purpose",True)],
    [TC("Framework"),     TC("TanStack Start"),     TC("1.168.x"), TC("Full-stack SSR framework and server functions")],
    [TC("Routing"),       TC("TanStack Router"),    TC("1.170.x"), TC("File-based type-safe routing")],
    [TC("State Mgmt"),    TC("TanStack Query"),     TC("5.101.x"), TC("Server state, caching, background sync")],
    [TC("Language"),      TC("TypeScript"),         TC("5.8.x"),   TC("Static typing across entire codebase")],
    [TC("Styling"),       TC("Tailwind CSS"),       TC("v4.2.x"),  TC("Utility-first responsive CSS")],
    [TC("UI Primitives"), TC("Radix UI"),           TC("Latest"),  TC("Accessible modal, dropdown, dialog components")],
    [TC("Forms"),         TC("React Hook Form"),    TC("7.71.x"),  TC("Form state management")],
    [TC("Validation"),    TC("Zod"),                TC("3.24.x"),  TC("TypeScript-first schema validation")],
    [TC("Database"),      TC("Supabase PostgreSQL"),TC("Cloud"),   TC("Cloud-hosted DB with RLS and Auth")],
    [TC("DB Client"),     TC("node-postgres (pg)"), TC("8.23.x"),  TC("Direct parameterized SQL queries")],
    [TC("File Storage"),  TC("Supabase Storage"),   TC("Cloud"),   TC("Media file upload and CDN delivery")],
    [TC("Build Tool"),    TC("Vite"),               TC("8.1.x"),   TC("Development server and production build")],
    [TC("Icons"),         TC("Lucide React"),       TC("0.575.x"), TC("SVG icon set")],
    [TC("Notifications"), TC("Sonner"),             TC("2.0.x"),   TC("Toast notification system")],
    [TC("Version Ctrl"),  TC("Git / GitHub"),       TC(""+chr(8212)+""),  TC("Source code management")],
    [TC("IDE"),           TC("VS Code"),            TC("Latest"),  TC("Development environment")],
    [TC("API Testing"),   TC("Postman"),            TC("Latest"),  TC("Endpoint testing and validation")],
    [TC("Linting"),       TC("ESLint + typescript-eslint"), TC("9.32.x"), TC("Code quality enforcement")],
    [TC("Formatting"),    TC("Prettier"),           TC("3.7.x"),   TC("Code style consistency")],
]
story.append(Table(tools_data, colWidths=[TW*0.18, TW*0.24, TW*0.13, TW*0.45],
    style=TB_plain, repeatRows=1))

story += [
    sp(8),
    H1("5.3. Challenges and Solutions"), hr(),
    H2("Challenge 1: RLS Policy Design for Mixed Public/Admin Access"),
    P("The most complex technical challenge was designing RLS policies that correctly allow "
      "anonymous public users to read published content while giving authenticated admin users "
      "full write access. The difficulty was that node-postgres server functions run with a "
      "service-role connection that bypasses RLS by default, while Supabase client queries "
      "from the browser respect RLS."),
    P("<b>Solution:</b> Two-tier data access was adopted. Public read queries use the "
      "node-postgres pool with explicit WHERE status='published' filters in the SQL. Admin "
      "write operations from the browser go through the Supabase JS client which enforces RLS, "
      "ensuring admins can only modify records their role permits. Additional RLS policies were "
      "added in Supabase migrations for tables like programs, pages, and academic_units."),
    H2("Challenge 2: Slug Generation and Uniqueness Across Tables"),
    P("Multiple entities needed unique URL slugs generated from their names while handling "
      "edge cases (duplicate names, special characters, Unicode text in Amharic or Afaan Oromo)."),
    P("<b>Solution:</b> A PostgreSQL function generate_slug(base_text TEXT) was created in the "
      "Phase 2A migration that lowercases the text, replaces non-alphanumeric characters with "
      "hyphens, and trims edge hyphens. For duplicates, it appends the first 8 characters of "
      "the entity's UUID. UNIQUE constraints were then applied to each slug column."),
    H2("Challenge 3: Media Reuse Across Content Entities"),
    P("Different content types (news, events, programs, leadership, research) all needed to "
      "attach images. Storing image URLs as simple text strings created duplication and made "
      "central media management impossible."),
    P("<b>Solution:</b> A centralized media table was designed as the single source of truth. "
      "Each content table has a foreign key (main_image_id, featured_image_id) referencing "
      "media.id. The AdminImageUpload component handles the complete upload-to-attach workflow: "
      "upload to Supabase Storage, create a media record, return the media ID for the parent "
      "form to store as a foreign key. Images are loaded via LEFT JOIN media in all read queries."),
    H2("Challenge 4: TypeScript Type Safety with Dynamic Database Schema"),
    P("The Supabase-generated TypeScript types were sometimes out of sync with the actual "
      "database schema as migrations were added, causing TypeScript errors in the frontend."),
    P("<b>Solution:</b> A custom database.types.ts file was maintained extending the "
      "auto-generated types from database.openapi.types.ts. For each table, additional fields "
      "added by migrations (e.g., slug, main_image_id) were explicitly declared as optional "
      "properties in the Row, Insert, and Update interfaces."),
    H2("Challenge 5: SSR Data Hydration with TanStack Query"),
    P("Using TanStack Query alongside TanStack Start's SSR resulted in hydration mismatches "
      "when query data fetched on the server did not match what the client expected on first render."),
    P("<b>Solution:</b> All server-side data fetching uses createServerFn server functions "
      "called directly in the route's loader function. TanStack Query's queryClient.prefetchQuery() "
      "is used in loaders to pre-populate the cache before the page renders, ensuring the "
      "client-side hydration matches the server-rendered HTML exactly."),
    sp(6),

    H1("5.4. Testing"), hr(),
    H2("5.4.1. Integration Testing Results"),
    P("All 45 server functions in src/backend/api.ts were tested end-to-end via Postman:"),
    sp(4),
]

test_int = [
    [TC("Module",True), TC("Tests",True), TC("Passed",True), TC("Failed",True)],
    [TC("News (read/write)"),           TC("8"), TC("8"), TC("0")],
    [TC("Events (read/write)"),         TC("6"), TC("6"), TC("0")],
    [TC("Announcements (read/write)"),  TC("6"), TC("6"), TC("0")],
    [TC("Programs (read/write)"),       TC("4"), TC("4"), TC("0")],
    [TC("Leadership (read/write)"),     TC("4"), TC("4"), TC("0")],
    [TC("Research (read/write)"),       TC("8"), TC("8"), TC("0")],
    [TC("Media (upload/delete)"),       TC("4"), TC("4"), TC("0")],
    [TC("Auth (login/logout)"),         TC("3"), TC("3"), TC("0")],
    [TC("Settings (read/write)"),       TC("2"), TC("2"), TC("0")],
    [TC("Total",True),                  TC("45",True), TC("45",True), TC("0",True)],
]
story.append(Table(test_int, colWidths=[TW*0.46, TW*0.18, TW*0.18, TW*0.18],
    style=TB_plain, repeatRows=1))

story += [
    sp(6),
    H2("5.4.2. RLS Security Testing Results"),
    P("RLS policy testing was performed by making unauthenticated requests directly to the "
      "Supabase REST API for each protected table:"),
    sp(4),
]

test_rls = [
    [TC("Test Scenario",True), TC("Expected",True), TC("Result",True)],
    [TC("Unauthenticated read of users table"),           TC("403 Forbidden"), TC("Pass "+chr(10004))],
    [TC("Unauthenticated read of activity_logs"),         TC("403 Forbidden"), TC("Pass "+chr(10004))],
    [TC("Unauthenticated read of news with status=draft"),TC("0 rows returned"),TC("Pass "+chr(10004))],
    [TC("Unauthenticated write (INSERT) to any table"),   TC("403 Forbidden"), TC("Pass "+chr(10004))],
    [TC("Authenticated admin read/write with valid JWT"), TC("200 OK"),         TC("Pass "+chr(10004))],
    [TC("Authenticated user read of published news"),     TC("Rows returned"),  TC("Pass "+chr(10004))],
]
story.append(Table(test_rls, colWidths=[TW*0.58, TW*0.22, TW*0.20],
    style=TB_plain, repeatRows=1))

story += [
    sp(6),
    H2("5.4.3. Cross-Browser and Responsive Testing"),
    sp(4),
]

test_browser = [
    [TC("Browser / Device",True),          TC("Public Website",True), TC("Admin CMS",True)],
    [TC("Chrome (Desktop 1280px)"),         TC("Pass "+chr(10004)),    TC("Pass "+chr(10004))],
    [TC("Firefox (Desktop 1280px)"),        TC("Pass "+chr(10004)),    TC("Pass "+chr(10004))],
    [TC("Safari (Desktop 1280px)"),         TC("Pass "+chr(10004)),    TC("Pass "+chr(10004))],
    [TC("Chrome (Mobile 375px)"),           TC("Pass "+chr(10004)),    TC("Pass "+chr(10004))],
    [TC("Safari (Mobile 375px "+chr(8212)+" iPhone)"), TC("Pass "+chr(10004)), TC("Pass "+chr(10004))],
    [TC("Chrome (Tablet 768px)"),           TC("Pass "+chr(10004)),    TC("Pass "+chr(10004))],
]
story.append(Table(test_browser, colWidths=[TW*0.50, TW*0.25, TW*0.25],
    style=TB_plain, repeatRows=1))

story += [
    sp(6),
    H2("5.4.4. User Acceptance Testing (UAT)"),
    P("UAT was conducted with three representative users from the ICT Directorate and "
      "Registrar's Office during Week 8:"),
    sp(4),
]

test_uat = [
    [TC("Scenario",True),               TC("User",True),           TC("Result",True), TC("Feedback",True)],
    [TC("Log in to Admin CMS"),         TC("ICT Officer"),          TC("Pass "+chr(10004)), TC(chr(8212))],
    [TC("Create and publish a news article with image"), TC("Content Officer"), TC("Pass "+chr(10004)), TC("Requested auto-save draft for future version")],
    [TC("Create announcement with expiry date"), TC("Registrar Staff"), TC("Pass "+chr(10004)), TC(chr(8212))],
    [TC("Upload a document to media library"), TC("ICT Officer"),    TC("Pass "+chr(10004)), TC(chr(8212))],
    [TC("Update a program description"), TC("Content Officer"),      TC("Pass "+chr(10004)), TC(chr(8212))],
    [TC("View activity logs"),          TC("ICT Director"),          TC("Pass "+chr(10004)), TC(chr(8212))],
    [TC("View all modules on mobile browser"), TC("ICT Officer"),    TC("Pass "+chr(10004)), TC(chr(8212))],
]
story.append(Table(test_uat, colWidths=[TW*0.34, TW*0.22, TW*0.14, TW*0.30],
    style=TB_plain, repeatRows=1))
story += [sp(8), PageBreak()]

# ══════════════════════════════════════════════════════════
# CHAPTER 6: INTERNSHIP REFLECTION AND CONCLUSION
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("Chapter 6: Internship Reflection and Conclusion")); story += [
    P("This chapter presents the learning outcomes gained during the internship, the challenges "
      "faced in the workplace and during development, and recommendations for the ICT "
      "Directorate and for future internship programs at Haramaya University."),
    sp(6),

    H1("6.1. Learning Outcomes"), hr(),
    H2("Practical Technical Skills"),
    P("This internship provided an exceptionally practical full-stack software development "
      "experience. The following technical skills were developed and applied in production:"),
    B("<b>Full-Stack TypeScript Development:</b> Implementing the entire application in "
      "TypeScript "+chr(8212)+" from database query types to React component props to Zod "
      "validation schemas "+chr(8212)+" demonstrated how a unified type system across the "
      "full stack eliminates entire categories of runtime bugs. Before this internship, "
      "TypeScript was understood theoretically; this project built genuine fluency in advanced "
      "patterns including generic types, discriminated unions, and type narrowing."),
    B("<b>Server-Side Rendering Architecture:</b> Understanding the distinction between SSR "
      "(server-rendered HTML for fast initial load) and CSR (client-side rendering for "
      "interactive updates) was deepened significantly. TanStack Start's model of using "
      "createServerFn for data fetching and TanStack Query for client-side state management "
      "provided a clear, practical pattern for building high-performance web applications."),
    B("<b>PostgreSQL and Relational Database Design:</b> Designing a production relational "
      "database schema with 25+ tables, proper foreign key relationships, indexes on "
      "frequently-queried columns, and Row Level Security policies was the most technically "
      "challenging and rewarding aspect of this internship. Writing migration files, "
      "backfilling slug data, and adding unique constraints taught the importance of careful "
      "schema evolution."),
    B("<b>Security Engineering:</b> Implementing Supabase Auth, RLS policies, CSRF middleware, "
      "and Zod input validation in a single application made the security model concrete. "
      "Understanding that defense in depth (multiple independent security layers) is essential "
      +chr(8212)+" not optional "+chr(8212)+" is a key professional insight gained."),
    B("<b>Content Management System Design:</b> Building a CMS from scratch required deep "
      "thinking about generic data management patterns: how to design consistent CRUD "
      "interfaces across 20+ different entity types, how to manage media attachment across "
      "all content types, how to implement status workflows (draft "+chr(8594)+" review "
      +chr(8594)+" published "+chr(8594)+" archived), and how to design an audit log system."),
    H2("Theoretical Knowledge Applied"),
    B("<b>Database Normalization:</b> Designing the 25-table schema using normalization "
      "principles (eliminating data redundancy, proper use of foreign keys) confirmed the "
      "practical value of the normalization theory studied in Database Management Systems "
      "coursework."),
    B("<b>Software Architecture Patterns:</b> The three-tier architecture (presentation "
      +chr(8594)+" application "+chr(8594)+" data) was applied directly. The MVC-like "
      "separation between route components (view), server functions (controller), and database "
      "queries (model) confirmed the practical benefits of separation of concerns."),
    B("<b>Security Principles:</b> The principle of least privilege (RLS policies grant only "
      "the access each role requires), defense in depth (auth at application layer + RLS at "
      "database layer), and input sanitization were all applied in production code."),
    H2("Personal Growth"),
    P("Working as the sole developer on a production system for a real university required a "
      "level of professional discipline beyond what coursework demands. Writing clear commit "
      "messages, maintaining clean branch structure, documenting decisions in code comments, "
      "and communicating technical decisions to non-technical stakeholders (ICT Director, "
      "Content Officer) developed professional maturity that classroom projects do not "
      "replicate."),
    sp(6),

    H1("6.2. Challenges Faced"), hr(),
    H2("Workplace Adaptability"),
    P("The ICT Directorate operates under formal institutional processes "+chr(8212)+" all "
      "infrastructure changes require written approval, all deployments are reviewed by the "
      "ICT Director, and all stakeholder meetings follow a structured agenda. Adapting to this "
      "institutional rhythm while maintaining development velocity required careful sprint "
      "planning to ensure review cycles were factored into the timeline."),
    H2("Technical Challenges"),
    P("The most significant ongoing technical challenge was the constant need to bridge between "
      "two data access patterns: the node-postgres pool (used in server functions for "
      "performance and query control) and the Supabase JS client (used in the browser for auth "
      "and real-time features). Managing the TypeScript types across both "+chr(8212)+" "
      "ensuring the same data shape is returned by both paths "+chr(8212)+" required "
      "disciplined maintenance of the database.types.ts file throughout the project."),
    H2("Scope Management"),
    P("The content richness of OBU's institutional presence (six colleges, dozens of "
      "departments, multiple VP offices, four research centers, community engagement programs, "
      "services, vacancies, galleries) meant the total number of content modules was larger "
      "than initially estimated. Strict prioritization using the Agile backlog "+chr(8212)+" "
      "completing core modules (news, events, programs, leadership) before extended modules "
      "(community engagement, facilities) "+chr(8212)+" ensured the most important features "
      "were delivered first."),
    sp(6),

    H1("6.3. Recommendations"), hr(),
    H2("For the Organization (OBU ICT Directorate)"),
    NB(1, "<b>Establish a Content Editorial Workflow:</b> The current system allows any admin "
       "user to publish directly. For institutional communications accuracy, a formal review "
       "workflow (Draft "+chr(8594)+" Editor Review "+chr(8594)+" Published) should be "
       "implemented in a future sprint, requiring a second admin to approve before content "
       "goes live."),
    NB(2, "<b>Implement Regular Database Backups:</b> While Supabase provides point-in-time "
       "recovery, the ICT Directorate should establish a regular export schedule (weekly "
       "database dumps) stored on local university infrastructure as an additional backup "
       "layer independent of cloud service availability."),
    NB(3, "<b>Develop a Content Style Guide:</b> With multiple departments now able to publish "
       "independently, a content style guide (tone, image dimensions, headline formatting, "
       "category usage) should be produced and shared with all content editors."),
    NB(4, "<b>Plan for a Student Portal Phase:</b> The most frequently requested feature "
       "during UAT was a student-facing portal for checking announcements, downloading "
       "documents, and viewing academic schedules. This should be scoped as Phase 2 of the "
       "OBU-CMS project with dedicated funding and timeline."),
    NB(5, "<b>Conduct Regular Security Audits:</b> The RLS policies and authentication "
       "configuration should be reviewed at least annually as the university's admin user "
       "base grows and role structures evolve."),
    H2("For Future Internship Programs (Haramaya University)"),
    NB(1, "<b>Extend Internship to 90 Days:</b> A 45-day internship for a production-quality "
       "full-stack web application is genuinely tight. 90 days would allow completion of all "
       "six report chapters during the internship rather than as a post-internship submission, "
       "and would permit proper user training and knowledge transfer."),
    NB(2, "<b>Require Mid-Internship Report Review:</b> A formal mid-internship review "
       "meeting between the student, academic advisor, and internship supervisor at the "
       "4-week mark would catch scope/quality issues early enough to correct them."),
    NB(3, "<b>Include a Database Design Unit in the Pre-Internship Curriculum:</b> Students "
       "entering software development internships with stronger relational database design "
       "skills (normalization, foreign keys, indexing, migration management) would be "
       "significantly better prepared for production system work."),
    NB(4, "<b>Establish a Project Repository Archive:</b> Haramaya University should maintain "
       "an archive of completed internship project source code repositories, creating a "
       "reference library for future students and demonstrating practical outcomes to "
       "employers and accreditation bodies."),
    sp(8),
    PageBreak(),
]

# ══════════════════════════════════════════════════════════
# APPENDICES
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("Appendices")); story += [
    H1("Appendix A: Key Code Snippets"), hr(),
    H2("A.1. Server Function Example (getPublishedNews)"),
]

code1 = [
    [Paragraph(
        "<b>// src/backend/api.ts</b><br/>"
        "export const getPublishedNews = createServerFn({ method: 'GET' })<br/>"
        "&nbsp;&nbsp;.handler(async () =&gt; {<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;await initDb();<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;const db = getDb();<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;const res = await db.query(<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`SELECT n.id, n.title, n.slug, n.category,<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n.published_at as \"publishedDate\",<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n.status, m.file_url as image<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FROM news n<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;LEFT JOIN media m ON n.featured_image_id = m.id<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WHERE n.status = 'published'<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ORDER BY n.published_at DESC LIMIT 9`<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;);<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;return res.rows as NewsItem[];<br/>"
        "&nbsp;&nbsp;});",
        S("Normal", fontSize=8.5, leading=13, fontName="Courier",
          textColor=colors.Color(0.05,0.05,0.05)))
    ]
]
story.append(Table(code1, colWidths=[TW], style=TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), colors.Color(0.96,0.98,0.97)),
    ("BOX",           (0,0),(-1,-1), 0.8, PRIMARY),
    ("LEFTPADDING",   (0,0),(-1,-1), 12),
    ("RIGHTPADDING",  (0,0),(-1,-1), 12),
    ("TOPPADDING",    (0,0),(-1,-1), 10),
    ("BOTTOMPADDING", (0,0),(-1,-1), 10),
])))

story += [
    sp(8),
    H2("A.2. RLS Policy Example (programs table)"),
]

code2 = [
    [Paragraph(
        "<b>-- Allow public to read only active programs</b><br/>"
        "CREATE POLICY \"Public read active programs\" ON public.programs<br/>"
        "&nbsp;&nbsp;FOR SELECT USING (status = 'active');<br/><br/>"
        "<b>-- Allow authenticated admin users full CRUD access</b><br/>"
        "CREATE POLICY \"Admin write programs\" ON public.programs<br/>"
        "&nbsp;&nbsp;FOR ALL TO authenticated<br/>"
        "&nbsp;&nbsp;USING (EXISTS (<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;SELECT 1 FROM public.users WHERE id = auth.uid()<br/>"
        "&nbsp;&nbsp;));",
        S("Normal", fontSize=8.5, leading=13, fontName="Courier",
          textColor=colors.Color(0.05,0.05,0.05)))
    ]
]
story.append(Table(code2, colWidths=[TW], style=TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), colors.Color(0.96,0.98,0.97)),
    ("BOX",           (0,0),(-1,-1), 0.8, PRIMARY),
    ("LEFTPADDING",   (0,0),(-1,-1), 12),
    ("RIGHTPADDING",  (0,0),(-1,-1), 12),
    ("TOPPADDING",    (0,0),(-1,-1), 10),
    ("BOTTOMPADDING", (0,0),(-1,-1), 10),
])))

story += [
    sp(8),
    H2("A.3. Slug Generation Migration"),
]

code3 = [
    [Paragraph(
        "<b>-- supabase/migrations/20260825_phase2a_schema.sql</b><br/>"
        "CREATE OR REPLACE FUNCTION public.generate_slug(base_text TEXT)<br/>"
        "RETURNS TEXT AS $<br/>"
        "DECLARE base_slug TEXT;<br/>"
        "BEGIN<br/>"
        "&nbsp;&nbsp;base_slug := lower(regexp_replace(base_text, '[^a-zA-Z0-9]+', '-', 'g'));<br/>"
        "&nbsp;&nbsp;base_slug := trim(both '-' from base_slug);<br/>"
        "&nbsp;&nbsp;IF base_slug IS NULL OR base_slug = '' THEN<br/>"
        "&nbsp;&nbsp;&nbsp;&nbsp;base_slug := 'item';<br/>"
        "&nbsp;&nbsp;END IF;<br/>"
        "&nbsp;&nbsp;RETURN base_slug;<br/>"
        "END;<br/>"
        "$ LANGUAGE plpgsql;",
        S("Normal", fontSize=8.5, leading=13, fontName="Courier",
          textColor=colors.Color(0.05,0.05,0.05)))
    ]
]
story.append(Table(code3, colWidths=[TW], style=TableStyle([
    ("BACKGROUND",    (0,0),(-1,-1), colors.Color(0.96,0.98,0.97)),
    ("BOX",           (0,0),(-1,-1), 0.8, PRIMARY),
    ("LEFTPADDING",   (0,0),(-1,-1), 12),
    ("RIGHTPADDING",  (0,0),(-1,-1), 12),
    ("TOPPADDING",    (0,0),(-1,-1), 10),
    ("BOTTOMPADDING", (0,0),(-1,-1), 10),
])))

story += [
    sp(8),
    H1("Appendix B: Database Tables Summary"), hr(),
    sp(4),
]

db_sum = [
    [TC("Table",True),          TC("Rows (Approx.)",True), TC("Primary Purpose",True)],
    [TC("news"),                 TC("50+"),    TC("University news articles")],
    [TC("announcements"),        TC("30+"),    TC("General and registrar announcements")],
    [TC("events"),               TC("20+"),    TC("University events")],
    [TC("programs"),             TC("20+"),    TC("Academic degree programs")],
    [TC("academic_units"),       TC("15+"),    TC("Colleges and departments")],
    [TC("leadership"),           TC("10+"),    TC("University leadership profiles")],
    [TC("research_projects"),    TC("10+"),    TC("Research projects")],
    [TC("research_centers"),     TC("4+"),     TC("Research center profiles")],
    [TC("services"),             TC("10+"),    TC("University services")],
    [TC("vacancies"),            TC("10+"),    TC("Career vacancies")],
    [TC("galleries"),            TC("10+"),    TC("Photo galleries")],
    [TC("pages"),                TC("10+"),    TC("CMS-managed static pages")],
    [TC("media"),                TC("100+"),   TC("All uploaded images and documents")],
    [TC("users"),                TC("5+"),     TC("Admin CMS user accounts")],
    [TC("roles"),                TC("4+"),     TC("User roles for RBAC")],
    [TC("activity_logs"),        TC("200+"),   TC("Admin action audit trail")],
    [TC("navigation_items"),     TC("20+"),    TC("Website navigation configuration")],
    [TC("homepage_sections"),    TC("10+"),    TC("Homepage section configuration")],
    [TC("website_settings"),     TC("15+"),    TC("Site-wide key-value settings")],
    [TC("contact_messages"),     TC("Varies"), TC("Contact form submissions")],
]
story.append(Table(db_sum, colWidths=[TW*0.30, TW*0.20, TW*0.50],
    style=TB_plain, repeatRows=1))
story += [sp(8), PageBreak()]

# ══════════════════════════════════════════════════════════
# REFERENCES
# ══════════════════════════════════════════════════════════
story += [
]; story.extend(CHAP("References")); story += [
    NB(1,  "TanStack. <i>TanStack Start Documentation "+chr(8212)+" Full-Stack React Framework.</i> "
           "https://tanstack.com/start. Accessed June 2026."),
    NB(2,  "TanStack. <i>TanStack Router Documentation "+chr(8212)+" Type-Safe File-Based Routing.</i> "
           "https://tanstack.com/router. Accessed June 2026."),
    NB(3,  "TanStack. <i>TanStack Query Documentation "+chr(8212)+" Asynchronous State Management.</i> "
           "https://tanstack.com/query. Accessed June 2026."),
    NB(4,  "Supabase, Inc. <i>Supabase Documentation "+chr(8212)+" Open Source Firebase Alternative.</i> "
           "https://supabase.com/docs. Accessed June 2026."),
    NB(5,  "Supabase, Inc. <i>Row Level Security in PostgreSQL.</i> "
           "https://supabase.com/docs/guides/auth/row-level-security. Accessed June 2026."),
    NB(6,  "Tailwind Labs. <i>Tailwind CSS v4 Documentation.</i> "
           "https://tailwindcss.com/docs. Accessed June 2026."),
    NB(7,  "Radix UI. <i>Radix UI Primitives Documentation.</i> "
           "https://www.radix-ui.com/primitives. Accessed June 2026."),
    NB(8,  "React Hook Form. <i>Performant, Flexible and Extensible Forms with Easy-to-Use Validation.</i> "
           "https://react-hook-form.com. Accessed June 2026."),
    NB(9,  "Colinhacks. <i>Zod "+chr(8212)+" TypeScript-First Schema Validation.</i> "
           "https://zod.dev. Accessed June 2026."),
    NB(10, "Brianc. <i>node-postgres (pg) "+chr(8212)+" PostgreSQL Client for Node.js.</i> "
           "https://node-postgres.com. Accessed June 2026."),
    NB(11, "Vite. <i>Vite Next Generation Frontend Tooling.</i> "
           "https://vitejs.dev/guide. Accessed June 2026."),
    NB(12, "Ethiopian Ministry of Education. <i>Higher Education Proclamation No. 650/2009.</i> "
           "Addis Ababa: Federal Negarit Gazeta, 2009."),
    NB(13, "Oda Bultum University. <i>Official University Website.</i> "
           "https://www.obu.edu.et. Accessed June 2026."),
    NB(14, "Haramaya University, Department of Computer Science. "
           "<i>Industrial Practice Report Guideline (Software Development).</i> "
           "Haramaya: College of Computing and Informatics, 2026."),
    sp(12),
]

# ══════════════════════════════════════════════════════════
# FOOTER + BUILD
# ══════════════════════════════════════════════════════════
def footer(canvas, doc):
    canvas.saveState()
    W = PAGE_W
    # Footer background strip
    canvas.setFillColor(colors.Color(0.96,0.99,0.97))
    canvas.setStrokeColor(PRIMARY)
    canvas.setLineWidth(0.5)
    canvas.rect(MARGIN, 0.7*cm, W-2*MARGIN, 0.55*cm, fill=1)
    # Left text — institution
    canvas.setFont("Times-Roman", 7.5)
    canvas.setFillColor(PRIMARY)
    canvas.drawString(MARGIN+5, 0.85*cm,
        "Haramaya University  \u2502  Dept. of Computer Science  \u2502  Industrial Practice Report")
    # Right — page number with circle accent
    pg = str(doc.page)
    canvas.setFillColor(PRIMARY)
    canvas.circle(W-MARGIN-10, 0.975*cm, 9, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Times-Bold", 7.5)
    tw = canvas.stringWidth(pg, "Times-Bold", 7.5)
    canvas.drawString(W-MARGIN-10-tw/2, 0.85*cm, pg)
    canvas.restoreState()

try:
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print("Generated:", OUTPUT, "(", os.path.getsize(OUTPUT)//1024, "KB )")
except Exception as e:
    import traceback; traceback.print_exc()
