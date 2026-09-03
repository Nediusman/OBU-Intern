import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import {
  Search,
  X,
  Check,
  Trash2,
  CornerUpLeft,
  Mail,
  Phone,
  Clock,
  User,
  Inbox,
  Filter,
  CheckCheck,
  AlertCircle,
  RefreshCw,
  Eye,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useMessages } from "@/frontend/admin/hooks/useMessages";
import type { Database } from "@/frontend/lib/database.types";

type MessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];

export const Route = createFileRoute("/admin/content/messages")({
  component: MessagesManagement,
});

function MessagesManagement() {
  const [activeMessage, setActiveMessage] = useState<MessageRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied">("all");

  const { query, updateMutation, deleteMutation } = useMessages();
  const messages = query.data || [];

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      // Status filter
      if (statusFilter !== "all") {
        const msgStatus = (msg.status || "new").toLowerCase();
        if (msgStatus !== statusFilter) return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = msg.name?.toLowerCase().includes(q);
        const matchesEmail = msg.email?.toLowerCase().includes(q);
        const matchesPhone = msg.phone?.toLowerCase().includes(q);
        const matchesSubject = msg.subject?.toLowerCase().includes(q);
        const matchesMessage = msg.message?.toLowerCase().includes(q);
        return Boolean(
          matchesName || matchesEmail || matchesPhone || matchesSubject || matchesMessage,
        );
      }

      return true;
    });
  }, [messages, statusFilter, searchTerm]);

  // Counts for status tabs
  const counts = useMemo(() => {
    let newCount = 0;
    let readCount = 0;
    let repliedCount = 0;

    for (const m of messages) {
      const st = (m.status || "new").toLowerCase();
      if (st === "new" || st === "unread") newCount++;
      else if (st === "read") readCount++;
      else if (st === "replied") repliedCount++;
    }

    return {
      all: messages.length,
      new: newCount,
      read: readCount,
      replied: repliedCount,
    };
  }, [messages]);

  const handleViewMessage = (msg: MessageRow) => {
    setActiveMessage(msg);
    if (
      (msg.status || "new").toLowerCase() === "new" ||
      (msg.status || "new").toLowerCase() === "unread"
    ) {
      updateMutation.mutate({ id: msg.id, updates: { status: "read" } });
    }
  };

  const handleMarkReplied = () => {
    if (activeMessage) {
      updateMutation.mutate(
        { id: activeMessage.id, updates: { status: "replied" } },
        {
          onSuccess: (updated) => {
            if (updated) {
              setActiveMessage(updated);
            }
          },
        },
      );
    }
  };

  const handleMarkRead = () => {
    if (activeMessage) {
      updateMutation.mutate(
        { id: activeMessage.id, updates: { status: "read" } },
        {
          onSuccess: (updated) => {
            if (updated) {
              setActiveMessage(updated);
            }
          },
        },
      );
    }
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (
      confirm("Are you sure you want to delete this contact message? This action cannot be undone.")
    ) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          if (activeMessage?.id === id) {
            setActiveMessage(null);
          }
        },
      });
    }
  };

  // Detail View Panel
  if (activeMessage) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <AdminPageHeader
          title="Message Details"
          description={`Viewing inquiry from ${activeMessage.name}`}
          action={
            <button
              onClick={() => setActiveMessage(null)}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
              Close Details
            </button>
          }
        />

        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 divide-y divide-gray-100">
          {/* Header & Sender Metadata */}
          <div className="p-6 bg-gradient-to-r from-gray-50/80 to-white">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{activeMessage.subject}</h2>
                  <AdminBadge status={activeMessage.status || "new"} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  <span>
                    Submitted{" "}
                    {new Date(activeMessage.created_at).toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(activeMessage.id)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100/70 transition-colors disabled:opacity-50"
                  title="Delete message"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>

            {/* Sender Cards Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200/80 bg-white p-3 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Sender Name
                  </div>
                  <div className="text-sm font-bold text-gray-900 truncate">
                    {activeMessage.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200/80 bg-white p-3 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Email Address
                  </div>
                  <a
                    href={`mailto:${activeMessage.email}`}
                    className="text-sm font-semibold text-blue-600 hover:underline truncate block"
                  >
                    {activeMessage.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200/80 bg-white p-3 shadow-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Phone Number
                  </div>
                  {activeMessage.phone ? (
                    <a
                      href={`tel:${activeMessage.phone}`}
                      className="text-sm font-semibold text-gray-900 hover:text-amber-700 truncate block"
                    >
                      {activeMessage.phone}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400 italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div className="p-6 md:p-8 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Message Content
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 text-base leading-relaxed text-gray-800 font-normal whitespace-pre-wrap selection:bg-emerald-100">
              {activeMessage.message}
            </div>
          </div>

          {/* Action Bar Footer */}
          <div className="p-6 bg-gray-50/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || "")}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#186a42] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] transition-colors"
              >
                <CornerUpLeft className="h-4 w-4" />
                Reply via Email
              </a>

              {activeMessage.status !== "replied" && (
                <button
                  onClick={handleMarkReplied}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <CheckCheck className="h-4 w-4 text-emerald-600" />
                  Mark as Replied
                </button>
              )}

              {activeMessage.status === "new" && (
                <button
                  onClick={handleMarkRead}
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Check className="h-4 w-4 text-blue-600" />
                  Mark as Read
                </button>
              )}
            </div>

            <button
              onClick={() => setActiveMessage(null)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to Inbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inbox List View
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Contact Messages"
        description="Inbox for public inquiries and contact messages submitted through the website."
        action={
          <button
            onClick={() => query.refetch()}
            disabled={query.isFetching}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 text-gray-500 ${query.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        }
      />

      {/* Error state */}
      {query.isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <span>Failed to load contact messages. Please check your connection.</span>
          </div>
          <button
            onClick={() => query.refetch()}
            className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 overflow-x-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              statusFilter === "all"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "hover:text-gray-900"
            }`}
          >
            <span>All</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                statusFilter === "all"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-200/60 text-gray-500"
              }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("new")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              statusFilter === "new"
                ? "bg-white text-blue-700 shadow-xs font-bold"
                : "hover:text-blue-700"
            }`}
          >
            <span>New</span>
            {counts.new > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-bold">
                {counts.new}
              </span>
            )}
          </button>

          <button
            onClick={() => setStatusFilter("read")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              statusFilter === "read"
                ? "bg-white text-gray-900 shadow-xs font-bold"
                : "hover:text-gray-900"
            }`}
          >
            <span>Read</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-200/60 text-gray-500">
              {counts.read}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("replied")}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              statusFilter === "replied"
                ? "bg-white text-emerald-700 shadow-xs font-bold"
                : "hover:text-emerald-700"
            }`}
          >
            <span>Replied</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {counts.replied}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by sender, subject, email..."
            className="block w-full rounded-lg border-0 py-2 pl-9 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#186a42] sm:text-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Desktop Table & Mobile Cards */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {/* Loading State */}
        {query.isLoading && (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <RefreshCw className="h-6 w-6 mx-auto animate-spin text-emerald-700" />
            <p className="text-sm font-medium">Loading contact messages from database...</p>
          </div>
        )}

        {/* Empty State — No messages in database */}
        {!query.isLoading && messages.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No contact messages yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Messages submitted by visitors through the public website contact form will appear
              here.
            </p>
          </div>
        )}

        {/* Empty State — Filtered out */}
        {!query.isLoading && messages.length > 0 && filteredMessages.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No matching messages</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              No messages match your current filter or search criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#186a42] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Messages List */}
        {!query.isLoading && filteredMessages.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50/75 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <tr>
                    <th scope="col" className="px-6 py-3.5">
                      Sender
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Subject & Preview
                    </th>
                    <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
                      Date / Time
                    </th>
                    <th scope="col" className="px-6 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3.5 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredMessages.map((item) => {
                    const isNew =
                      (item.status || "new").toLowerCase() === "new" ||
                      (item.status || "new").toLowerCase() === "unread";
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleViewMessage(item)}
                        className={`group cursor-pointer transition-colors hover:bg-gray-50/90 ${
                          isNew ? "bg-blue-50/20 font-medium" : ""
                        }`}
                      >
                        {/* Sender */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {isNew && (
                              <span
                                className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0"
                                title="Unread"
                              />
                            )}
                            <div>
                              <div
                                className={`text-sm ${isNew ? "font-bold text-gray-900" : "font-medium text-gray-900"}`}
                              >
                                {item.name}
                              </div>
                              <div className="text-xs text-gray-500 font-normal">{item.email}</div>
                              {item.phone && (
                                <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                                  Tel: {item.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Subject & Preview */}
                        <td className="px-6 py-4 max-w-md">
                          <div
                            className={`text-sm truncate ${isNew ? "font-bold text-gray-900" : "text-gray-900 font-medium"}`}
                          >
                            {item.subject}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1 font-normal mt-0.5">
                            {item.message}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          <div className="text-[11px] text-gray-400">
                            {new Date(item.created_at).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <AdminBadge status={item.status || "new"} />
                        </td>

                        {/* Actions */}
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                          <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewMessage(item);
                              }}
                              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#186a42] transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              disabled={deleteMutation.isPending}
                              className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                              title="Delete message"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredMessages.map((item) => {
                const isNew =
                  (item.status || "new").toLowerCase() === "new" ||
                  (item.status || "new").toLowerCase() === "unread";
                return (
                  <div
                    key={item.id}
                    onClick={() => handleViewMessage(item)}
                    className={`p-4 active:bg-gray-50 transition-colors cursor-pointer space-y-2.5 ${
                      isNew ? "bg-blue-50/25" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {isNew && (
                          <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm truncate ${isNew ? "font-bold text-gray-900" : "font-semibold text-gray-900"}`}
                        >
                          {item.name}
                        </span>
                      </div>
                      <AdminBadge status={item.status || "new"} />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {item.subject}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{item.message}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1 border-t border-gray-50">
                      <span>{item.email}</span>
                      <span>
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
