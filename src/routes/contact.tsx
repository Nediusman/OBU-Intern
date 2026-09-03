import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  User,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Building2,
} from "lucide-react";
import { supabase } from "@/frontend/lib/supabase";
import { getSiteSettings, submitContactMessage } from "@/backend/api";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Us — Oda Bultum University" },
      {
        name: "description",
        content:
          "Get in touch with Oda Bultum University administration, admissions, academic units, and general inquiry offices in Chiro, Ethiopia.",
      },
      { property: "og:title", content: "Contact Us — Oda Bultum University" },
      {
        property: "og:description",
        content:
          "Get in touch with Oda Bultum University administration, admissions, and general inquiry offices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form local state
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Query site settings for dynamic contact info
  const { data: settings } = useQuery({
    queryKey: ["site-settings-contact"],
    queryFn: () => getSiteSettings(),
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      setErrorMessage(null);

      // Attempt insert directly into Supabase contact_messages table
      const { error: supabaseError } = await supabase.from("contact_messages").insert([
        {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone?.trim() || null,
          subject: data.subject.trim(),
          message: data.message.trim(),
          status: "new",
        },
      ]);

      // If client-side Supabase encountered an error (e.g. offline or RLS policy), fallback to server function
      if (supabaseError) {
        console.warn("Supabase client insert failed, attempting serverFn fallback:", supabaseError);
        const res = await submitContactMessage({
          data: {
            name: data.name.trim(),
            email: data.email.trim(),
            phone: data.phone?.trim() || null,
            subject: data.subject.trim(),
            message: data.message.trim(),
          },
        });
        if (!res || !res.success) {
          throw new Error("Unable to deliver message at this time. Please try again.");
        }
      }

      return true;
    },
    onSuccess: () => {
      setSent(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    },
    onError: (err: Error) => {
      setErrorMessage(
        err.message ||
          "An unexpected error occurred while sending your message. Please try again later.",
      );
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setErrorMessage("Please complete all required fields (Name, Email, Subject, and Message).");
      return;
    }

    mutation.mutate(formData);
  }

  const universityAddress = settings?.address || "Chiro, West Hararghe, Oromia, Ethiopia";
  const universityPhone = settings?.phone || "+251 25 551 0356";
  const universityEmail = settings?.email || "info@obu.edu.et";

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <Mail className="w-3.5 h-3.5" />
            Institutional Inquiries & Support
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Have questions about academic programs, admissions, research collaborations, or campus
            operations? Our offices are ready to assist you.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={[{ label: "Contact Us" }]} />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid gap-12 lg:grid-cols-12 items-start">
            {/* ─── LEFT COLUMN: CONTACT DIRECTORY & DETAILS (5 COLS) ─── */}
            <div className="lg:col-span-5 space-y-6 animate-fade-in-up">
              <div className="space-y-2">
                <span className="font-mono text-xs font-bold text-[#186a42] uppercase tracking-[0.25em] bg-[#186a42]/10 px-3 py-1 rounded-full inline-block">
                  University Directory
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-gray-900 tracking-tight">
                  Get in Touch
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Reach out through our direct office channels or submit an official inquiry using
                  the message portal.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Physical Address */}
                <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-xl card-3d-interactive flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-[#ffcc00] transition-colors duration-300 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900 group-hover:text-[#186a42] transition-colors">
                      Main Campus Address
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed font-normal">
                      {universityAddress}
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-xl card-3d-interactive flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-[#ffcc00] transition-colors duration-300 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900 group-hover:text-[#186a42] transition-colors">
                      Telephone & Helpdesk
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 font-medium">
                      <a
                        href={`tel:${universityPhone}`}
                        className="hover:text-[#186a42] hover:underline"
                      >
                        {universityPhone}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Official Email */}
                <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-xl card-3d-interactive flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-[#ffcc00] transition-colors duration-300 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900 group-hover:text-[#186a42] transition-colors">
                      Electronic Mail
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 font-medium">
                      <a
                        href={`mailto:${universityEmail}`}
                        className="hover:text-[#186a42] hover:underline"
                      >
                        {universityEmail}
                      </a>
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-xl card-3d-interactive flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-[#186a42]/10 text-[#186a42] group-hover:bg-[#186a42] group-hover:text-[#ffcc00] transition-colors duration-300 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-gray-900 group-hover:text-[#186a42] transition-colors">
                      Working Hours
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed font-normal">
                      Monday – Friday: 8:00 AM – 5:00 PM (EAT)
                      <br />
                      <span className="text-xs text-gray-400">
                        Closed on Ethiopian Public Holidays
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Registrar Portal Quick Tip */}
              <div className="bg-[#186a42]/5 border border-[#186a42]/20 rounded-3xl p-6 flex items-start gap-3 text-xs text-gray-700 leading-relaxed">
                <Building2 className="w-5 h-5 text-[#186a42] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 font-bold block mb-1">
                    Student Records & Admissions Verification
                  </strong>
                  For student transcripts, certificates, admissions, and academic records, please
                  visit the{" "}
                  <Link
                    to="/registrar"
                    className="text-[#186a42] font-bold underline hover:text-[#125333]"
                  >
                    Registrar Portal
                  </Link>
                  .
                </div>
              </div>
            </div>

            {/* ─── RIGHT COLUMN: MESSAGE FORM INTERFACE (7 COLS) ─── */}
            <div className="lg:col-span-7 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 sm:p-12 card-3d-interactive relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42]" />

                {sent ? (
                  <div className="py-12 px-4 text-center space-y-6 animate-fade-in-up">
                    <div className="mx-auto w-20 h-20 rounded-full bg-[#186a42]/10 text-[#186a42] flex items-center justify-center shadow-inner">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                      <h3 className="font-heading text-3xl font-bold text-gray-900">
                        Message Received
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">
                        Thank you for contacting Oda Bultum University. Your inquiry has been
                        securely stored in our administrative system. Our relevant office will
                        review and respond promptly.
                      </p>
                    </div>

                    <button
                      onClick={() => setSent(false)}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#186a42] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-[#125333] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <RotateCcw className="w-4 h-4" /> Send Another Message
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Send an Official Message
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        Fill out the form below. All fields marked with * are required.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm animate-fade-in-up">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                        <div className="flex-1 font-medium">{errorMessage}</div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Name Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="name"
                            className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                          >
                            Full Name <span className="text-rose-600">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              id="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="e.g. Abebe Kebede"
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all shadow-sm"
                            />
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                          >
                            Email Address <span className="text-rose-600">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="e.g. abebe@example.com"
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all shadow-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Phone Field (Optional) */}
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                          >
                            Phone Number{" "}
                            <span className="text-gray-400 text-[10px] lowercase font-normal">
                              (optional)
                            </span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              id="phone"
                              type="tel"
                              value={formData.phone || ""}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="e.g. +251 91 234 5678"
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all shadow-sm"
                            />
                          </div>
                        </div>

                        {/* Subject Field */}
                        <div className="space-y-2">
                          <label
                            htmlFor="subject"
                            className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                          >
                            Subject / Topic <span className="text-rose-600">*</span>
                          </label>
                          <div className="relative">
                            <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                              id="subject"
                              type="text"
                              required
                              value={formData.subject}
                              onChange={(e) =>
                                setFormData({ ...formData, subject: e.target.value })
                              }
                              placeholder="e.g. Academic Program Inquiry"
                              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all shadow-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                        >
                          Message Content <span className="text-rose-600">*</span>
                        </label>
                        <div className="relative">
                          <textarea
                            id="message"
                            rows={5}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Please provide details about your inquiry..."
                            className="w-full p-4 rounded-2xl bg-gray-50/80 border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent transition-all shadow-sm resize-none"
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={mutation.isPending}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl obu-gradient text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:brightness-110 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {mutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Submitting Inquiry...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Official Message</span>
                              <Send className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
