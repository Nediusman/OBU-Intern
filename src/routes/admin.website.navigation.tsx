import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Trash2, Edit, ChevronDown, ChevronRight, X, Save, AlignLeft } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "@/frontend/admin/hooks/useNavigation";
import { usePages } from "@/frontend/admin/hooks/usePages";
import { useAcademicUnits } from "@/frontend/admin/hooks/useAcademicUnits";
import { usePrograms } from "@/frontend/admin/hooks/usePrograms";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";

type DestinationType =
  | "none"
  | "page"
  | "college"
  | "department"
  | "program"
  | "custom";

interface NavigationNode {
  id: string;
  parent_id?: string;
  label: string;
  url?: string;
  page_slug?: string;
  display_order: number;
  status: string;
  pages?: { slug: string } | null;
  children?: NavigationNode[];
  menu: string;
  page_id?: string;
  open_new_tab: boolean;
  created_at: string;
  updated_at: string;
}

type NavigationItemRow = Database["public"]["Tables"]["navigation_items"]["Row"];
type NavigationItemInsert = Database["public"]["Tables"]["navigation_items"]["Insert"];
type NavigationItemUpdate = Database["public"]["Tables"]["navigation_items"]["Update"];

type NavigationFormState = {
  id?: string;
  menu?: string;
  label?: string;
  url?: string | null;
  page_id?: string | null;
  parent_id?: string | null;
  display_order?: number;
  status?: string;
  open_new_tab?: boolean;
  created_at?: string;
  updated_at?: string;
};

function inferDestinationType(
  item: NavigationFormState,
): { type: DestinationType; slug: string } {
  if (item.page_id) {
    return { type: "page", slug: "" };
  }

  const url = item.url?.trim();
  if (!url || url === "#") {
    return { type: "none", slug: "" };
  }

  if (url.startsWith("/academics/departments/")) {
    const slug = url.slice("/academics/departments/".length);
    if (slug) {
      return { type: "department", slug };
    }
  }

  if (url.startsWith("/academics/programs/")) {
    const slug = url.slice("/academics/programs/".length);
    if (slug) {
      return { type: "program", slug };
    }
  }

  if (
    url.startsWith("/academics/") &&
    url !== "/academics" &&
    !url.startsWith("/academics/departments") &&
    !url.startsWith("/academics/programs")
  ) {
    const slug = url.slice("/academics/".length);
    if (slug) {
      return { type: "college", slug };
    }
  }

  return { type: "custom", slug: "" };
}

export const Route = createFileRoute("/admin/website/navigation")({
  component: NavigationManagement,
});

function NavItem({
  item,
  depth = 0,
  onEdit,
  onDelete,
  onAddChild,
}: {
  item: NavigationNode;
  depth?: number;
  onEdit: (item: NavigationNode) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}) {
  const indent = depth * 2;
  const hasChildren = item.children && item.children.length > 0;
  const [expanded, setExpanded] = useState(depth < 2);

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center justify-between p-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-md shadow-sm mb-2"
        style={{ marginLeft: `${indent}rem` }}
      >
        <div className="flex items-center gap-3">
          <AlignLeft className="h-5 w-5 text-gray-400" />
          {hasChildren ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-gray-400 hover:text-gray-600"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
          <span className="font-medium text-sm text-gray-900">{item.label}</span>
          <span className="text-xs text-gray-500 font-mono">
            {item.url || (item.pages ? item.pages.slug : "-")}
          </span>
          <AdminBadge status={item.status} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAddChild(item.id)}
            className="text-gray-400 hover:text-[#186a42] px-2"
            title="Add Child"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="text-gray-400 hover:text-[#186a42] px-2"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-400 hover:text-red-600 px-2"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="flex flex-col relative before:absolute before:border-l-2 before:border-gray-200 before:h-full before:left-[1rem] before:z-[-1]">
          {item.children?.map((child: NavigationNode) => (
            <NavItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationManagement() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<NavigationFormState>({});
  const [destinationType, setDestinationType] = useState<DestinationType>("none");
  const [selectedAcademicSlug, setSelectedAcademicSlug] = useState<string>("");

  const { query, createMutation, updateMutation, deleteMutation } = useNavigation("main");
  const { query: pagesQuery } = usePages();
  const { query: collegesQuery } = useAcademicUnits(["college", "institute", "school"]);
  const { query: departmentsQuery } = useAcademicUnits("department");
  const { query: programsQuery } = usePrograms();

  const activeColleges = (collegesQuery.data || []).filter(
    (u) => u.status === "active" && u.slug && u.slug.trim().length > 0,
  );
  const activeDepartments = (departmentsQuery.data || []).filter(
    (d) => d.status === "active" && d.slug && d.slug.trim().length > 0,
  );
  const activePrograms = (programsQuery.data || []).filter(
    (p) => p.status === "active" && p.slug && p.slug.trim().length > 0,
  );

  const handleEdit = (item: NavigationNode) => {
    // Omitting children property since it's not part of the DB schema
    const { children, pages, page_slug, ...dbFields } = item;
    const formFields: NavigationFormState = {
      ...dbFields,
      url: dbFields.url ?? null,
      page_id: dbFields.page_id ?? null,
      parent_id: dbFields.parent_id ?? null,
    };
    setEditingItem(formFields);

    const inferred = inferDestinationType(formFields);
    setDestinationType(inferred.type);
    setSelectedAcademicSlug(inferred.slug);

    setView("editor");
  };

  const handleCreate = (parentId?: string) => {
    setEditingItem({
      parent_id: parentId ?? null,
      display_order: 0,
      status: "active",
      menu: "main",
      url: null,
      page_id: null,
    });
    setDestinationType("none");
    setSelectedAcademicSlug("");
    setView("editor");
  };

  const handleDestinationTypeChange = (newType: DestinationType) => {
    setDestinationType(newType);
    setSelectedAcademicSlug("");

    if (newType === "none") {
      setEditingItem((prev) => ({
        ...prev,
        url: null,
        page_id: null,
      }));
    } else if (newType === "page") {
      setEditingItem((prev) => ({
        ...prev,
        url: null,
        page_id: prev.page_id || null,
      }));
    } else if (newType === "college" || newType === "department" || newType === "program") {
      setEditingItem((prev) => ({
        ...prev,
        url: null,
        page_id: null,
      }));
    } else if (newType === "custom") {
      setEditingItem((prev) => ({
        ...prev,
        url: prev.url || "",
        page_id: null,
      }));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this navigation item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (!editingItem.label || !editingItem.label.trim()) {
      toast.error("Label is required");
      return;
    }

    let finalUrl: string | null = null;
    let finalPageId: string | null = null;

    if (destinationType === "none") {
      finalUrl = null;
      finalPageId = null;
    } else if (destinationType === "page") {
      finalUrl = null;
      finalPageId = editingItem.page_id || null;
      if (!finalPageId) {
        toast.error("Please select a CMS page");
        return;
      }
    } else if (destinationType === "college") {
      finalPageId = null;
      finalUrl = editingItem.url || null;
      if (!finalUrl) {
        toast.error("Please select a College / Faculty / Institute");
        return;
      }
    } else if (destinationType === "department") {
      finalPageId = null;
      finalUrl = editingItem.url || null;
      if (!finalUrl) {
        toast.error("Please select a Department");
        return;
      }
    } else if (destinationType === "program") {
      finalPageId = null;
      finalUrl = editingItem.url || null;
      if (!finalUrl) {
        toast.error("Please select a Program");
        return;
      }
    } else if (destinationType === "custom") {
      finalPageId = null;
      finalUrl = editingItem.url?.trim() || null;
      if (!finalUrl) {
        toast.error("Please enter a custom or external URL");
        return;
      }
    }

    const payload: NavigationItemInsert = {
      menu: editingItem.menu || "main",
      label: editingItem.label.trim(),
      url: (finalUrl ?? null) as unknown as string,
      page_id: (finalPageId ?? null) as unknown as string,
      parent_id: (editingItem.parent_id || null) as unknown as string,
      display_order: editingItem.display_order || 0,
      status: editingItem.status || "active",
      ...(editingItem.open_new_tab !== undefined ? { open_new_tab: editingItem.open_new_tab } : {}),
    };

    if (editingItem.id) {
      updateMutation.mutate(
        { id: editingItem.id, updates: payload as NavigationItemUpdate },
        { onSuccess: () => setView("list") },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setView("list") });
    }
  };

  // Build tree from flat list
  const buildTree = (items: NavigationNode[]) => {
    const itemMap = new Map();
    items.forEach((item) => itemMap.set(item.id, { ...item, children: [] }));
    const roots: NavigationNode[] = [];
    itemMap.forEach((item) => {
      if (item.parent_id) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(item);
        } else {
          roots.push(item);
        }
      } else {
        roots.push(item);
      }
    });
    // Sort children
    const sortChildren = (nodes: NavigationNode[]) => {
      nodes.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      nodes.forEach((node) => {
        if (node.children) sortChildren(node.children);
      });
    };
    sortChildren(roots);
    return roots;
  };

  const tree = query.data ? buildTree(query.data as unknown as NavigationNode[]) : [];
  const flatItems = (query.data as unknown as NavigationNode[]) || [];

  if (view === "editor") {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <AdminPageHeader
          title={editingItem.id ? "Edit Navigation Item" : "Create Navigation Item"}
          action={
            <div className="flex gap-2">
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save Item
              </button>
            </div>
          }
        />

        <div className="bg-white p-6 shadow-sm ring-1 ring-gray-200 rounded-lg space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
              <input
                type="text"
                value={editingItem.label || ""}
                onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                placeholder="e.g. About Us"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Menu *</label>
              <select
                value={editingItem.menu || "main"}
                onChange={(e) => setEditingItem({ ...editingItem, menu: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              >
                <option value="main">Main Menu</option>
                <option value="footer">Footer Menu</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination Type *
              </label>
              <select
                value={destinationType}
                onChange={(e) => handleDestinationTypeChange(e.target.value as DestinationType)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              >
                <option value="none">None / Dropdown Container</option>
                <option value="page">CMS Page</option>
                <option value="college">College / Faculty / Institute</option>
                <option value="department">Department</option>
                <option value="program">Program</option>
                <option value="custom">Custom / External URL</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Choose how this navigation item directs visitors when clicked.
              </p>
            </div>

            {destinationType === "none" && (
              <div className="sm:col-span-2 rounded-md bg-emerald-50/70 border border-emerald-200 p-3.5 text-sm text-[#0c3822]">
                <p className="font-semibold text-xs uppercase tracking-wider text-[#186a42]">
                  Dropdown Container
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  This item functions purely as a parent container with no direct link. Clicking it on the website toggles its child menu items.
                </p>
              </div>
            )}

            {destinationType === "page" && (
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CMS Page *
                </label>
                <select
                  value={editingItem.page_id || ""}
                  onChange={(e) => {
                    const pageId = e.target.value;
                    const page = (pagesQuery.data || []).find((p: { id: string }) => p.id === pageId);
                    setEditingItem((prev) => ({
                      ...prev,
                      page_id: pageId ? pageId : null,
                      url: null,
                      label: prev.label ? prev.label : (page?.title ?? ""),
                    }));
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                >
                  <option value="">-- Select a CMS Page --</option>
                  {pagesQuery.data?.map((page: { id: string; title: string; slug: string }) => (
                    <option key={page.id} value={page.id}>
                      {page.title} ({page.slug})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select an existing CMS page to link to.
                </p>
              </div>
            )}

            {destinationType === "college" && (
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Destination *
                  </label>
                  <select
                    value={selectedAcademicSlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      setSelectedAcademicSlug(slug);
                      const unit = activeColleges.find((u) => u.slug === slug);
                      const generatedUrl = slug ? `/academics/${slug}` : null;
                      setEditingItem((prev) => ({
                        ...prev,
                        url: generatedUrl,
                        page_id: null,
                        label: prev.label ? prev.label : (unit?.name ?? ""),
                      }));
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                  >
                    <option value="">-- Select College / Faculty / Institute --</option>
                    {selectedAcademicSlug &&
                      !activeColleges.some((u) => u.slug === selectedAcademicSlug) && (
                        <option value={selectedAcademicSlug}>
                          {selectedAcademicSlug} (Current)
                        </option>
                      )}
                    {activeColleges.map((unit) => (
                      <option key={unit.id} value={unit.slug}>
                        {unit.name} ({unit.unit_type.charAt(0).toUpperCase() + unit.unit_type.slice(1)})
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select an active College, Faculty, Institute, or School.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Generated URL
                  </label>
                  <input
                    type="text"
                    value={editingItem.url || ""}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 font-mono text-sm outline-none cursor-not-allowed"
                    placeholder="/academics/[college-slug]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Read-only canonical URL automatically generated from the selected unit slug.
                  </p>
                </div>
              </div>
            )}

            {destinationType === "department" && (
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Destination *
                  </label>
                  <select
                    value={selectedAcademicSlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      setSelectedAcademicSlug(slug);
                      const dept = activeDepartments.find((d) => d.slug === slug);
                      const generatedUrl = slug ? `/academics/departments/${slug}` : null;
                      setEditingItem((prev) => ({
                        ...prev,
                        url: generatedUrl,
                        page_id: null,
                        label: prev.label ? prev.label : (dept?.name ?? ""),
                      }));
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                  >
                    <option value="">-- Select Department --</option>
                    {selectedAcademicSlug &&
                      !activeDepartments.some((d) => d.slug === selectedAcademicSlug) && (
                        <option value={selectedAcademicSlug}>
                          {selectedAcademicSlug} (Current)
                        </option>
                      )}
                    {activeDepartments.map((dept) => (
                      <option key={dept.id} value={dept.slug}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select an active Department.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Generated URL
                  </label>
                  <input
                    type="text"
                    value={editingItem.url || ""}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 font-mono text-sm outline-none cursor-not-allowed"
                    placeholder="/academics/departments/[department-slug]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Read-only canonical URL automatically generated from the selected department slug.
                  </p>
                </div>
              </div>
            )}

            {destinationType === "program" && (
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Destination *
                  </label>
                  <select
                    value={selectedAcademicSlug}
                    onChange={(e) => {
                      const slug = e.target.value;
                      setSelectedAcademicSlug(slug);
                      const prog = activePrograms.find((p) => p.slug === slug);
                      const generatedUrl = slug ? `/academics/programs/${slug}` : null;
                      setEditingItem((prev) => ({
                        ...prev,
                        url: generatedUrl,
                        page_id: null,
                        label: prev.label ? prev.label : (prog?.name ?? ""),
                      }));
                    }}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                  >
                    <option value="">-- Select Program --</option>
                    {selectedAcademicSlug &&
                      !activePrograms.some((p) => p.slug === selectedAcademicSlug) && (
                        <option value={selectedAcademicSlug}>
                          {selectedAcademicSlug} (Current)
                        </option>
                      )}
                    {activePrograms.map((prog) => (
                      <option key={prog.id} value={prog.slug}>
                        {prog.name} {prog.degree ? `(${prog.degree})` : ""}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select an active Program.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Generated URL
                  </label>
                  <input
                    type="text"
                    value={editingItem.url || ""}
                    readOnly
                    className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 font-mono text-sm outline-none cursor-not-allowed"
                    placeholder="/academics/programs/[program-slug]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Read-only canonical URL automatically generated from the selected program slug.
                  </p>
                </div>
              </div>
            )}

            {destinationType === "custom" && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  value={editingItem.url || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => ({
                      ...prev,
                      url: e.target.value,
                      page_id: null,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
                  placeholder="e.g. /news or https://example.com"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter an internal path (e.g. /news) or external URL (e.g. https://example.com).
                </p>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Item</label>
              <select
                value={editingItem.parent_id || ""}
                onChange={(e) => setEditingItem({ ...editingItem, parent_id: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              >
                <option value="">-- No Parent (Root) --</option>
                {flatItems
                  .filter((i) => i.id !== editingItem.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                value={editingItem.display_order || 0}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editingItem.status || "active"}
                onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Navigation Manager"
        description="Build and organize the multi-level main menu."
        action={
          <button
            onClick={() => handleCreate()}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Menu Item
          </button>
        }
      />

      <div className="rounded-lg bg-gray-50 p-6 shadow-sm ring-1 ring-gray-200 space-y-2">
        {query.isLoading ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
            <div className="text-sm text-gray-500">Loading navigation...</div>
          </div>
        ) : tree.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-12">
            <p className="text-sm text-gray-500">No navigation items found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tree.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleCreate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
