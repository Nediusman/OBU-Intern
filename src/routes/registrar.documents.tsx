import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/frontend/components/Breadcrumbs";
import { EmptyState } from "@/frontend/components/EmptyState";
import {
  FileText,
  Download,
  Search,
  FileCheck,
  FileSpreadsheet,
  FileType,
  FileCode,
  File as GenericFile,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { getRegistrarDocuments, RegistrarDocumentItem } from "@/backend/api";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/registrar/documents")({
  head: () => ({
    meta: [
      { title: "Registrar Documents & Forms — Oda Bultum University" },
      {
        name: "description",
        content:
          "Download official registrar documents, student application forms, graduation clearance guidelines, and academic records from Oda Bultum University.",
      },
    ],
  }),
  loader: () => getRegistrarDocuments(),
  component: RegistrarDocuments,
});

function formatFileSize(bytes: number | string | null | undefined) {
  if (!bytes) return "0 Bytes";
  const numBytes = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;
  if (isNaN(numBytes) || numBytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));
  return parseFloat((numBytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getFileMeta(fileName: string, fileType?: string | null) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";

  if (ext === "pdf" || fileType?.includes("pdf")) {
    return {
      label: "PDF",
      bgClass: "bg-red-50 text-red-700 border-red-200/80",
      iconBg: "bg-red-500/10 text-red-600",
      Icon: FileText,
    };
  }
  if (
    ext === "doc" ||
    ext === "docx" ||
    fileType?.includes("word") ||
    fileType?.includes("officedocument")
  ) {
    return {
      label: "DOCX",
      bgClass: "bg-blue-50 text-blue-700 border-blue-200/80",
      iconBg: "bg-blue-500/10 text-blue-600",
      Icon: FileText,
    };
  }
  if (
    ext === "xls" ||
    ext === "xlsx" ||
    fileType?.includes("sheet") ||
    fileType?.includes("excel")
  ) {
    return {
      label: "XLSX",
      bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      iconBg: "bg-emerald-500/10 text-emerald-600",
      Icon: FileSpreadsheet,
    };
  }
  return {
    label: ext.toUpperCase() || "DOC",
    bgClass: "bg-gray-100 text-gray-700 border-gray-200/80",
    iconBg: "bg-[#186a42]/10 text-[#186a42]",
    Icon: GenericFile,
  };
}

function RegistrarDocuments() {
  const documents = Route.useLoaderData();
  const [search, setSearch] = useState("");
  const [selectedExt, setSelectedExt] = useState<string>("All");

  // Extract unique extensions
  const extensions = useMemo(() => {
    const exts = new Set<string>();
    documents.forEach((doc) => {
      const ext = doc.original_name?.split(".").pop()?.toUpperCase();
      if (ext) exts.add(ext);
    });
    return ["All", ...Array.from(exts)];
  }, [documents]);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const name = doc.original_name || "";
      const matchesSearch = search === "" || name.toLowerCase().includes(search.toLowerCase());
      const ext = name.split(".").pop()?.toUpperCase() || "";
      const matchesExt = selectedExt === "All" || ext === selectedExt;
      return matchesSearch && matchesExt;
    });
  }, [documents, search, selectedExt]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Page Hero */}
      <div className="obu-gradient py-20 md:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ffcc00] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#186a42] mb-5 shadow-lg">
            <FileCheck className="w-3.5 h-3.5" />
            Official Academic Repository
          </div>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Registrar Documents & Forms
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 max-w-3xl font-medium leading-relaxed">
            Download official student application forms, add/drop slips, academic clearance
            handbooks, and graduation clearance templates.
          </p>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { label: "Office of the Registrar", to: "/registrar" },
              { label: "Documents & Forms" },
            ]}
          />
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
          {/* Document Search & Filter Control Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/80 p-6 rounded-3xl border border-gray-100">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents by title or keyword..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186a42] focus:border-transparent shadow-sm transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
              {extensions.length > 2 &&
                extensions.map((ext) => {
                  const isActive = selectedExt === ext;
                  return (
                    <button
                      key={ext}
                      onClick={() => setSelectedExt(ext)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        isActive
                          ? "bg-[#186a42] text-white shadow-md shadow-[#186a42]/20"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[#186a42] hover:text-[#186a42]"
                      }`}
                    >
                      {ext}
                    </button>
                  );
                })}

              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">
                {filteredDocs.length} {filteredDocs.length === 1 ? "File" : "Files"}
              </span>
            </div>
          </div>

          {/* Document Grid / Empty State */}
          {filteredDocs.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-16 text-center shadow-sm max-w-2xl mx-auto">
              <FileText className="mx-auto h-20 w-20 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                No Documents Found
              </h2>
              <p className="text-gray-500 font-medium">
                {search || selectedExt !== "All"
                  ? "No registrar documents match your query. Try clearing your filters."
                  : "Registrar documents will appear here once published to the media repository."}
              </p>
              {(search || selectedExt !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedExt("All");
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#186a42] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#125333] transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map((doc) => {
                const meta = getFileMeta(doc.original_name, doc.file_type);
                const IconComponent = meta.Icon;

                return (
                  <div
                    key={doc.id}
                    className="group bg-white rounded-3xl p-7 border border-gray-100 shadow-md hover:shadow-2xl hover:border-[#186a42]/30 card-3d-interactive flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#186a42] via-[#ffcc00] to-[#186a42] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div>
                      {/* Top Meta Strip */}
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-110 ${meta.iconBg}`}
                        >
                          <IconComponent className="w-6 h-6" />
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${meta.bgClass}`}
                          >
                            {meta.label}
                          </span>
                          <span className="text-[11px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                            {formatFileSize(doc.file_size)}
                          </span>
                        </div>
                      </div>

                      {/* Document Name */}
                      <h3
                        className="font-heading text-lg font-bold text-gray-900 group-hover:text-[#186a42] transition-colors line-clamp-2 leading-snug mb-2"
                        title={doc.original_name}
                      >
                        {doc.original_name}
                      </h3>
                    </div>

                    {/* Download Button Action */}
                    <div className="pt-6 mt-4 border-t border-gray-100">
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-[#186a42]/20 hover:shadow-lg transition-all duration-300 group/btn"
                      >
                        <Download className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5" />
                        <span>Download Document</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Submission & Form Instructions Guide */}
          <section className="bg-gray-50 rounded-3xl p-8 sm:p-12 border border-gray-200/70 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#186a42]">
                  <ShieldCheck className="w-4 h-4 text-[#ffcc00]" />
                  Submission Guidelines & Verification
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  How to Submit Completed Registrar Documents
                </h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  Completed academic forms, withdrawal letters, and add/drop slips must be signed by
                  the respective Department Head and submitted directly to the Registrar Inquiries
                  Desk before published semester deadlines.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3 justify-end">
                <Link
                  to="/registrar/announcements"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#186a42] hover:bg-[#125333] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                >
                  Check Registration Deadlines <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/registrar"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs uppercase tracking-wider border border-gray-200 transition-colors"
                >
                  Registrar Office Info
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
