import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { Plus, Trash2, Edit, ChevronDown, ChevronRight, X, Save, AlignLeft } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "@/frontend/admin/hooks/useNavigation";
import { usePages } from "@/frontend/admin/hooks/usePages";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";

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
  const [editingItem, setEditingItem] = useState<Partial<NavigationItemRow>>({});

  const { query, createMutation, updateMutation, deleteMutation } = useNavigation("main");
  const { query: pagesQuery } = usePages();

  const handleEdit = (item: NavigationNode) => {
    // Omitting children property since it's not part of the DB schema
    const { children, pages, page_slug, ...dbFields } = item;
    setEditingItem(dbFields as Partial<NavigationItemRow>);
    setView("editor");
  };

  const handleCreate = (parentId?: string) => {
    setEditingItem({ parent_id: parentId, display_order: 0, status: "active" });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this navigation item?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (!editingItem.label) {
      toast.error("Label is required");
      return;
    }

    const payload: NavigationItemInsert = {
      menu: editingItem.menu || "main",
      label: editingItem.label,
      url: editingItem.url,
      page_id: editingItem.page_id || undefined,
      parent_id: editingItem.parent_id || undefined,
      display_order: editingItem.display_order || 0,
      status: editingItem.status || "active",
    };

    if (editingItem.id) {
      updateMutation.mutate(
        { id: editingItem.id, updates: payload },
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to Page</label>
              <select
                value={editingItem.page_id || ""}
                onChange={(e) => {
                  setEditingItem({ ...editingItem, page_id: e.target.value, url: "" });
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42]"
              >
                <option value="">-- Custom URL Instead --</option>
                {pagesQuery.data?.map((page: { id: string; title: string; slug: string }) => (
                  <option key={page.id} value={page.id}>
                    {page.title} ({page.slug})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Select an existing CMS page to link to.</p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom URL</label>
              <input
                type="text"
                value={editingItem.url || ""}
                disabled={!!editingItem.page_id}
                onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#186a42] focus:ring-1 focus:ring-[#186a42] disabled:bg-gray-100 disabled:text-gray-400"
                placeholder="e.g. https://example.com or /custom-path"
              />
              <p className="mt-1 text-xs text-gray-500">Only used if no Page is selected above.</p>
            </div>

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
