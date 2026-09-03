import { createFileRoute } from "@tanstack/react-router";
import { Edit, Plus, Save, Search, Trash2, X, Building2, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminImageUpload } from "@/frontend/admin/components/AdminImageUpload";
import {
  useAdministrativeOffices,
  type AdministrativeOfficeWithMedia,
} from "@/frontend/admin/hooks/useAdministrativeOffices";
import type { Database } from "@/frontend/lib/database.types";
import { generateSlug } from "@/frontend/lib/utils";

type OfficeInsert = Database["public"]["Tables"]["administrative_offices"]["Insert"];

export const Route = createFileRoute("/admin/administration")({
  component: AdministrationManagement,
});

function AdministrationManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingOffice, setEditingOffice] = useState<Partial<AdministrativeOfficeWithMedia>>({});
  const [search, setSearch] = useState("");
  const { query, createMutation, updateMutation, deleteMutation } = useAdministrativeOffices();
  const pending = createMutation.isPending || updateMutation.isPending;
  const offices = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return query.data ?? [];
    return (query.data ?? []).filter((office) =>
      [
        office.office_name,
        office.head_of_office,
        office.email,
        office.phone,
        office.office_category,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [query.data, search]);
  const set = <K extends keyof AdministrativeOfficeWithMedia>(
    key: K,
    value: AdministrativeOfficeWithMedia[K],
  ) => setEditingOffice((old) => ({ ...old, [key]: value }));
  const save = () => {
    if (pending) return;
    const name = editingOffice.office_name?.trim();
    if (!name) {
      toast.error("Office Name is required");
      return;
    }
    const finalSlug = (editingOffice.slug?.trim() || generateSlug(name)).trim();
    if (!finalSlug) {
      toast.error("Valid URL slug is required");
      return;
    }

    // Pre-submission client-side duplicate check
    const isDuplicate = (query.data ?? []).some(
      (item) =>
        item.slug?.toLowerCase() === finalSlug.toLowerCase() && item.id !== editingOffice.id,
    );
    if (isDuplicate) {
      toast.error("An administrative office with this URL slug already exists.");
      return;
    }

    const payload: OfficeInsert = {
      office_name: name,
      office_category: editingOffice.office_category?.trim() || undefined,
      description: editingOffice.description?.trim() || undefined,
      head_of_office: editingOffice.head_of_office?.trim() || undefined,
      email: editingOffice.email?.trim() || undefined,
      phone: editingOffice.phone?.trim() || undefined,
      location: editingOffice.location?.trim() || undefined,
      responsibilities: editingOffice.responsibilities?.trim() || undefined,
      display_order: editingOffice.display_order ?? 0,
      status: editingOffice.status || "active",
      main_image_id: editingOffice.main_image_id || null,
      slug: finalSlug,
    };
    if (editingOffice.id)
      updateMutation.mutate(
        { id: editingOffice.id, updates: payload },
        { onSuccess: () => setView("list") },
      );
    else createMutation.mutate(payload, { onSuccess: () => setView("list") });
  };
  if (view === "editor")
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <AdminPageHeader
          title={editingOffice.id ? "Edit Administrative Office" : "Add Administrative Office"}
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setView("list")}
                disabled={pending}
                className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 disabled:opacity-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Office
                  </>
                )}
              </button>
            </div>
          }
        />
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="space-y-4">
            <AdminImageUpload
              label="Office Main Image"
              description="Upload a cover photo or representative image for this office (Max 10MB)"
              value={editingOffice.main_image_id}
              imageUrl={editingOffice.media?.file_url}
              onChange={(media) => {
                setEditingOffice((prev) => ({
                  ...prev,
                  main_image_id: media?.id ?? null,
                  media: media?.id ? { id: media.id, file_url: media.file_url! } : null,
                }));
              }}
              disabled={pending}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Office Name *">
              <input
                value={editingOffice.office_name || ""}
                onChange={(e) => {
                  const office_name = e.target.value;
                  setEditingOffice((old) => ({
                    ...old,
                    office_name,
                    slug:
                      !old.slug || old.slug === generateSlug(old.office_name || "")
                        ? generateSlug(office_name)
                        : old.slug,
                  }));
                }}
              />
            </Field>
            <Field label="Office Category">
              <input
                value={editingOffice.office_category || ""}
                onChange={(e) => set("office_category", e.target.value)}
              />
            </Field>
            <Field label="Public URL Slug">
              <input
                value={editingOffice.slug || ""}
                onChange={(e) => set("slug", generateSlug(e.target.value))}
              />
            </Field>
            <Field label="Head of Office">
              <input
                value={editingOffice.head_of_office || ""}
                onChange={(e) => set("head_of_office", e.target.value)}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={editingOffice.email || ""}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <Field label="Phone">
              <input
                value={editingOffice.phone || ""}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                value={editingOffice.location || ""}
                onChange={(e) => set("location", e.target.value)}
              />
            </Field>
            <Field label="Display Order">
              <input
                type="number"
                value={editingOffice.display_order ?? 0}
                onChange={(e) => set("display_order", Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Status">
              <select
                value={editingOffice.status || "active"}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={5}
              value={editingOffice.description || ""}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
          <Field label="Responsibilities">
            <textarea
              rows={5}
              value={editingOffice.responsibilities || ""}
              onChange={(e) => set("responsibilities", e.target.value)}
            />
          </Field>
        </div>
      </div>
    );
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administrative Offices"
        description="Manage the directorates and administrative offices of the university."
        action={
          <button
            type="button"
            onClick={() => {
              setEditingOffice({ display_order: 0, status: "active", main_image_id: null });
              setView("editor");
            }}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Office
          </button>
        }
      />
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search offices..."
          className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300"
        />
      </div>
      {query.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Unable to load administrative offices. Refresh and check your access.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Image", "Office Name", "Director / Head", "Contact Info", "Status"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {query.isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    Loading administrative offices...
                  </td>
                </tr>
              ) : offices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No administrative offices found.
                  </td>
                </tr>
              ) : (
                offices.map((office) => (
                  <tr key={office.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {office.media?.file_url ? (
                        <img
                          src={office.media.file_url}
                          alt={office.office_name}
                          className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                          <Building2 className="h-5 w-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      {office.office_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {office.head_of_office || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>{office.email || "—"}</div>
                      <div className="text-xs text-gray-500">{office.phone || "—"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminBadge status={office.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingOffice(office);
                            setView("editor");
                          }}
                          className="text-gray-400 hover:text-[#186a42]"
                          aria-label={`Edit ${office.office_name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            confirm(`Delete ${office.office_name}?`) &&
                            deleteMutation.mutate(office.id)
                          }
                          disabled={deleteMutation.isPending}
                          className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                          aria-label={`Delete ${office.office_name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <div className="mt-1 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-gray-300 [&_input]:p-2 [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-gray-300 [&_select]:p-2 [&_textarea]:w-full [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-gray-300 [&_textarea]:p-2">
        {children}
      </div>
    </label>
  );
}
