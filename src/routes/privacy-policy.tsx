import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <h1 className="text-4xl font-bold font-heading mb-8 text-[#186a42]">
        Privacy and Personal Data Protection Policy
      </h1>

      <div className="prose prose-lg text-gray-700">
        <p className="lead text-xl mb-8">
          This privacy notice explains how Oda Bultum University (OBU) collects, uses, and protects
          your personal data when you use our official website and linked portals.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#0d1b2e]">
          1. Information We Collect
        </h2>
        <p>
          We may collect personal data through our website and linked portals, such as admission
          forms, contact forms, newsletter subscriptions, or online applications. This data may
          include, but is not limited to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Full name and contact details (email, phone number)</li>
          <li>National ID or other identification numbers</li>
          <li>Academic records and history</li>
          <li>Any other information you voluntarily provide in forms</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#0d1b2e]">
          2. Purpose of Collection
        </h2>
        <p>
          Your data is collected only for stated, legitimate purposes related to the operations of
          the University. These include:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li>Processing student admissions and registrations</li>
          <li>Responding to your inquiries and support requests</li>
          <li>Sending official university newsletters, announcements, and updates</li>
          <li>Improving our website and digital services</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#0d1b2e]">
          3. Data Security and Storage
        </h2>
        <p>
          We implement appropriate technical and organizational measures to ensure that your
          personal data is stored securely. Data is retained only as long as necessary to fulfill
          the purposes for which it was collected, or as required by applicable Ethiopian law.
        </p>
        <p className="mb-6">
          The website is served over a valid SSL/TLS certificate (HTTPS), and all data submissions
          are encrypted in transit.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#0d1b2e]">4. Third-Party Sharing</h2>
        <p className="mb-6">
          We do not sell, trade, or otherwise share your personal data with third parties without
          your explicit consent, except when required by law or as necessary to provide university
          services through authorized contractors (who are also bound by confidentiality).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#0d1b2e]">5. Your Rights</h2>
        <p>As a data subject, you have the right to:</p>
        <ul className="list-disc pl-6 mb-6">
          <li>Request access to the personal data we hold about you</li>
          <li>Request correction of inaccurate or incomplete data</li>
          <li>Request deletion of your data, subject to legal and operational requirements</li>
          <li>Withdraw consent for communications like newsletters</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-[#0d1b2e]">6. Contact Us</h2>
        <p className="mb-6">
          If you have any questions or concerns about this privacy policy, or wish to exercise your
          rights, please contact our Data Protection Focal Person or the ICT Directorate via the
          official channels listed on our Contact page.
        </p>
      </div>
    </div>
  );
}
