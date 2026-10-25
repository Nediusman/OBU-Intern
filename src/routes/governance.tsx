import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, FileText, CheckCircle2, AlertCircle, Building2, UserCheck, Lock, ExternalLink, Printer } from "lucide-react";

export const Route = createFileRoute("/governance")({
  component: GovernancePolicyPage,
});

function GovernancePolicyPage() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Document Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 p-6 md:p-10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                Official Institutional Policy
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0c3822] tracking-tight font-heading">
                Oda Bultum University Website Governance and Management Policy
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Document Owners: <strong>ICT Directorate</strong> & <strong>Directorate of Public & International Relations</strong>
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-gray-600 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="block text-gray-400 font-medium">Status</span>
              <span className="font-semibold text-emerald-700">Official / In Effect</span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Jurisdiction</span>
              <span className="font-semibold text-gray-900">OBU All Campuses</span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Review Frequency</span>
              <span className="font-semibold text-gray-900">Biennial (Every 2 Years)</span>
            </div>
            <div>
              <span className="block text-gray-400 font-medium">Domain Scope</span>
              <span className="font-semibold text-gray-900">obu.edu.et & Subdomains</span>
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 p-6 md:p-12 space-y-10 text-gray-700 leading-relaxed text-base">
          {/* Section 1 */}
          <section id="preamble" className="space-y-3">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              1. Preamble
            </h2>
            <p>
              Oda Bultum University (OBU) is a public higher learning institution located in Chiro town, West Hararghe Zone, Oromia Regional State, established in November 2015 under a decree of the Council of Ministers of the Federal Democratic Republic of Ethiopia. The University's official website (<strong>www.obu.edu.et</strong>) is the primary digital gateway through which prospective and current students, staff, government bodies, partner institutions, and the general public access information about the University's academic programs, administrative services, research, and community engagement activities.
            </p>
            <p>
              As the University's use of digital platforms grows, it is necessary to establish a formal governance framework that defines how the website is managed, who is responsible for its content and security, and what standards it must meet. This Policy sets out that framework.
            </p>
          </section>

          {/* Section 2 */}
          <section id="purpose" className="space-y-3">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              2. Purpose and Objectives
            </h2>
            <p>This Policy is issued to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Establish clear institutional ownership, roles, and accountability for the University's website.</li>
              <li>Ensure that all information published on the website is accurate, timely, consistent, and approved through a defined workflow.</li>
              <li>Protect the confidentiality, integrity, and availability of University data and of personal information submitted by users through the website.</li>
              <li>Ensure the website reflects the University's brand identity, is accessible to persons with disabilities, and complies with applicable Ethiopian laws and international good practice.</li>
              <li>Provide a basis for planning the automation and continuous improvement of website-based services (e.g., online admission, e-registration, e-payment, and self-service portals).</li>
            </ul>
          </section>

          {/* Section 3 & 4 */}
          <section id="scope" className="space-y-3">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              3. Scope of Application & Definitions
            </h2>
            <p>
              This Policy applies to the University's main website (<strong>obu.edu.et</strong>) and all its subdomains, including college, institute, school, directorate, and unit pages; the content management system (CMS) and hosting infrastructure supporting the website; all staff, students, and third-party contractors who create, edit, approve, or publish content on the website; and any web-based portals or online forms integrated with the website.
            </p>
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-sm space-y-2">
              <p><strong>Website:</strong> The official web presence of Oda Bultum University administered on behalf of the University.</p>
              <p><strong>Content Management System (CMS):</strong> The software platform used to create, edit, and publish content.</p>
              <p><strong>Content Owner:</strong> The office or unit responsible for the accuracy of a specific page or section.</p>
              <p><strong>Personal Data:</strong> Any information relating to an identified or identifiable natural person collected through the website.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="legal" className="space-y-3">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              5. Legal and Regulatory Framework
            </h2>
            <p>
              This Policy operates within, and shall be interpreted consistently with, the applicable legal and regulatory framework of the Federal Democratic Republic of Ethiopia:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>The Higher Education Proclamation and subsequent amendments.</li>
              <li>The Freedom of the Mass Media and Access to Information Proclamation.</li>
              <li>The Computer Crime Proclamation governing cybersecurity offences.</li>
              <li>Directives and standards issued by the Ministry of Education, the Ministry of Innovation and Technology (MInT), and the Information Network Security Agency (INSA).</li>
              <li>The University Senate Legislation and internal ICT security guidelines.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="roles" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              6. Governance Structure, Roles and Responsibilities
            </h2>
            <p>
              Effective website management requires clearly assigned roles across technical, editorial, and oversight functions:
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0c3822] text-white">
                  <tr>
                    <th className="p-3.5 font-semibold">Role / Office</th>
                    <th className="p-3.5 font-semibold">Function</th>
                    <th className="p-3.5 font-semibold">Primary Responsibilities</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="p-3.5 font-bold text-gray-900">ICT Directorate</td>
                    <td className="p-3.5 text-emerald-800 font-medium">Custodian of Website</td>
                    <td className="p-3.5 text-gray-600">Hosting, server maintenance, uptime, security patches, backups, domain/SSL management, and enforcing policy technically.</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-3.5 font-bold text-gray-900">Web Governance Committee</td>
                    <td className="p-3.5 text-emerald-800 font-medium">Oversight Body</td>
                    <td className="p-3.5 text-gray-600">Approves website architecture, editorial standards, reviews policy biennially, and resolves escalated disputes.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-gray-900">Public & Int. Relations (PIR)</td>
                    <td className="p-3.5 text-emerald-800 font-medium">Editorial Authority</td>
                    <td className="p-3.5 text-gray-600">Approves and coordinates all public-facing content, press releases, announcements, brand voice, and official social media.</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-3.5 font-bold text-gray-900">College / Dept Content Editors</td>
                    <td className="p-3.5 text-emerald-800 font-medium">Content Contributors</td>
                    <td className="p-3.5 text-gray-600">Draft and submit content for departmental units; keep faculty, program, and department data accurate and current.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-gray-900">Web Administrator</td>
                    <td className="p-3.5 text-emerald-800 font-medium">Day-to-day Operator</td>
                    <td className="p-3.5 text-gray-600">Publishes approved content, manages CMS accounts, page permissions, and emergency broadcast alerts.</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="p-3.5 font-bold text-gray-900">Data Protection Focal Person</td>
                    <td className="p-3.5 text-emerald-800 font-medium">Privacy Oversight</td>
                    <td className="p-3.5 text-gray-600">Monitors personal data processing (inquiries, admissions) and ensures compliance with national privacy principles.</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-gray-900">Office of the President / VPs</td>
                    <td className="p-3.5 text-emerald-800 font-medium">Final Authority</td>
                    <td className="p-3.5 text-gray-600">Final approval for institutional policy declarations and sensitive communications.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7 */}
          <section id="content" className="space-y-4">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              7. Website Content Management
            </h2>
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-lg">7.1 Content Approval Workflow</h3>
              <p>
                All content published on the website must pass through a 4-stage workflow:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold block text-amber-900">1. Draft</span>
                  <span className="text-amber-700">Created by Department Editor</span>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="font-bold block text-blue-900">2. Review</span>
                  <span className="text-blue-700">Fact & Language Quality Checked</span>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
                  <span className="font-bold block text-indigo-900">3. Approval</span>
                  <span className="text-indigo-700">PR Directorate / Dean Sign-off</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="font-bold block text-emerald-900">4. Publishing</span>
                  <span className="text-emerald-700">Live on Web by Webmaster</span>
                </div>
              </div>
              <p className="text-sm italic text-gray-600">
                * Urgent notices (e.g., campus emergencies, weather closures) follow an expedited approval track authorized by the ICT Director or VP.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-gray-900 text-lg">7.2 Content Standards & Designated Languages</h3>
              <ul className="list-disc pl-6 space-y-1.5 text-sm">
                <li>Content must be accurate, current, and published in the University's designated languages (<strong>Afaan Oromo, Amharic, and English</strong>) where feasible.</li>
                <li>Pages must display a 'Last Updated' timestamp where practical.</li>
                <li>Outdated, duplicate, or expired notices are archived rather than left indefinitely online.</li>
                <li>Personal opinions, political endorsements, or unverified claims are strictly prohibited under the University's official brand.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-gray-900 text-lg">7.3 Minimum Update Frequency</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="font-medium text-gray-800">Homepage, News & Notices</span>
                  <span className="text-emerald-700 font-semibold">Continuous / Daily</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="font-medium text-gray-800">Department & Program Pages</span>
                  <span className="text-emerald-700 font-semibold">At least once per semester</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="font-medium text-gray-800">Admissions & Registrar Data</span>
                  <span className="text-emerald-700 font-semibold">Before each intake cycle</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex justify-between">
                  <span className="font-medium text-gray-800">Staff Directory & Contacts</span>
                  <span className="text-emerald-700 font-semibold">Quarterly</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8 & 9 */}
          <section id="standards" className="space-y-3">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              8 & 9. Design, Branding, and Accessibility Standards
            </h2>
            <p>
              The website enforces standard OBU brand guidelines (Forest Green <code>#0F4C3A</code>, Gold <code>#FFCC00</code>, clean modern typography).
            </p>
            <p>
              <strong>Accessibility Policy:</strong> Oda Bultum University is dedicated to making its digital platform accessible to all individuals, including persons with visual or motor impairments. Pages feature descriptive alternative text for images, high color contrast, keyboard-navigable menus, and direct skip links for screen readers.
            </p>
          </section>

          {/* Section 10 & 11 */}
          <section id="security" className="space-y-3">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              10 & 11. Website Security & Personal Data Protection
            </h2>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li><strong>HTTPS Encryption:</strong> All public traffic and administrative sessions are strictly protected via modern TLS encryption.</li>
              <li><strong>Authentication:</strong> Administrative accounts enforce strong passwords and multi-factor authentication (MFA) safeguards.</li>
              <li><strong>Data Privacy:</strong> User data submitted through contact or registration forms is collected solely for legitimate educational/administrative purposes and never sold to third parties. For complete details, see our <Link to="/privacy-policy" className="text-emerald-700 underline font-semibold">Privacy Policy</Link>.</li>
              <li><strong>Data Protection Officer:</strong> Direct inquiries regarding student or staff data handling to <code>dataprotection@obu.edu.et</code>.</li>
            </ul>
          </section>

          {/* Section 13 & 14 */}
          <section id="external" className="space-y-3">
            <h2 className="text-xl font-bold text-[#0c3822] border-l-4 border-[#ffcc00] pl-3">
              13 & 14. Copyright, Third-Party Links and Advertising
            </h2>
            <p>
              All original text, images, research reports, and graphics published on <strong>obu.edu.et</strong> are the intellectual property of Oda Bultum University. Unauthorized commercial reproduction without explicit written permission is prohibited.
            </p>
            <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <strong>External Links Disclaimer:</strong> Outbound links to external websites (e.g., government ministries, academic journals, partner universities) are provided for user convenience. The University does not endorse and assumes no responsibility for third-party content or privacy practices. Paid commercial advertising is strictly prohibited on official OBU web assets.
            </p>
          </section>

          {/* Section 15, 16, 17 */}
          <section id="closing" className="space-y-3 border-t border-gray-100 pt-6 text-sm text-gray-500">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <strong>Approved By:</strong> Office of the President & Senate Executive
              </div>
              <div>
                <strong>Effective Date:</strong> Academic Year 2025/2026
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
