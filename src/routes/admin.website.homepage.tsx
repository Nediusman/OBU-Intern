import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import { Plus, Edit, Trash2, Search, Filter, Save, X, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useHomepageSections } from "@/frontend/admin/hooks/useHomepageSections";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import type { Database } from "@/frontend/lib/database.types";
import { toast } from "sonner";

type HomepageSectionRow = Database["public"]["Tables"]["homepage_sections"]["Row"];
type HomepageSectionInsert = Database["public"]["Tables"]["homepage_sections"]["Insert"];

export const Route = createFileRoute("/admin/website/homepage")({
  component: HomepageManagement,
});

function HomepageManagement() {
  const [activeTab, setActiveTab] = useState<"hero" | "welcome" | "stats" | "featured">("hero");
  const [view, setView] = useState<"list" | "editor">("list");

  const { query, createMutation, updateMutation, deleteMutation } = useHomepageSections();
  const { query: mediaQuery } = useMedia();
  const [editingItem, setEditingItem] = useState<Partial<HomepageSectionRow>>({});

  // States for singleton sections (Welcome, Stats, Featured)
  const [welcomeSection, setWelcomeSection] = useState<Partial<HomepageSectionRow>>({});

  // We extract specific sections from the flat list
  const heroSlides = query.data?.filter((s) => s.section_type === "hero") || [];

  // Populate singleton states on data load
  useEffect(() => {
    if (query.data) {
      const welcome = query.data.find((s) => s.section_type === "welcome");
      if (welcome) setWelcomeSection(welcome);
    }
  }, [query.data]);

  const handleEditHero = (item: HomepageSectionRow) => {
    setEditingItem(item);
    setView("editor");
  };

  const handleCreateHero = () => {
    setEditingItem({ section_type: "hero", display_order: 0, is_visible: true });
    setView("editor");
  };

  const handleDeleteHero = (id: string) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSaveHero = () => {
    if (!editingItem.title) {
      toast.error("Title is required");
      return;
    }

    const payload: HomepageSectionInsert = {
      section_type: "hero",
      title: editingItem.title,
      content: editingItem.content,
      button_text: editingItem.button_text,
      button_url: editingItem.button_url,
      display_order: editingItem.display_order || 0,
      is_visible: editingItem.is_visible ?? true,
      image_id: editingItem.image_id || undefined,
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

  const handleSaveWelcome = () => {
    const payload: HomepageSectionInsert = {
      section_type: "welcome",
      title: welcomeSection.title || "",
      content: welcomeSection.content || "",
      button_text: welcomeSection.button_text,
      button_url: welcomeSection.button_url,
      display_order: 0,
      is_visible: welcomeSection.is_visible ?? true,
      image_id: welcomeSection.image_id || undefined,
    };

    if (welcomeSection.id) {
      updateMutation.mutate({ id: welcomeSection.id, updates: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage Management"
        description="Control the content displayed on the public landing page."
        action={
          activeTab === "welcome" ? (
            <button
              onClick={handleSaveWelcome}
              disabled={updateMutation.isPending || createMutation.isPending}
              className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333]"
            >
              <Save className="h-4 w-4" />
              Save Section
            </button>
          ) : null
        }
      />

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => {
              setActiveTab("hero");
              setView("list");
            }}
            className={`${activeTab === "hero" ? "border-[#186a42] text-[#186a42]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab("welcome")}
            className={`${activeTab === "welcome" ? "border-[#186a42] text-[#186a42]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Welcome Section
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`${activeTab === "stats" ? "border-[#186a42] text-[#186a42]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab("featured")}
            className={`${activeTab === "featured" ? "border-[#186a42] text-[#186a42]" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"} whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
          >
            Featured Content
          </button>
        </nav>
      </div>

      {activeTab === "hero" && (
        <div className="space-y-6">
          {view === "editor" ? (
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4 max-w-2xl">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
                <h2 className="text-lg font-bold">
                  {editingItem.id ? "Edit Slide" : "Create Slide"}
                </h2>
                <button
                  onClick={() => setView("list")}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={editingItem.title || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.content || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Button Text</label>
                  <input
                    type="text"
                    value={editingItem.button_text || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, button_text: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Button URL</label>
                  <input
                    type="text"
                    value={editingItem.button_url || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, button_url: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editingItem.is_visible ? "Published" : "Draft"}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, is_visible: e.target.value === "Published" })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order || 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <select
                  value={editingItem.image_id || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, image_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                >
                  <option value="">Select an image</option>
                  {mediaQuery.data?.map((media) => (
                    <option key={media.id} value={media.id}>
                      {media.original_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSaveHero}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333]"
                >
                  Save Slide
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900">Hero Slider Slides</h3>
                <button
                  onClick={handleCreateHero}
                  className="flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4" /> Add Slide
                </button>
              </div>

              {query.isLoading ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                  <div className="text-sm text-gray-500">Loading slides...</div>
                </div>
              ) : heroSlides.length === 0 ? (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                  <div className="text-sm text-gray-500">No slides configured.</div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 relative">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {heroSlides.map((slide) => (
                        <tr key={slide.id}>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {slide.title}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {slide.display_order}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <AdminBadge status={slide.is_visible ? "active" : "draft"} />
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditHero(slide)}
                              className="text-[#186a42] hover:text-[#125333] mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteHero(slide.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "welcome" && (
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">Welcome Title</label>
            <input
              type="text"
              value={welcomeSection.title || ""}
              onChange={(e) => setWelcomeSection({ ...welcomeSection, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Welcome Description</label>
            <textarea
              rows={5}
              value={welcomeSection.content || ""}
              onChange={(e) => setWelcomeSection({ ...welcomeSection, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Text</label>
              <input
                type="text"
                value={welcomeSection.button_text || ""}
                onChange={(e) =>
                  setWelcomeSection({ ...welcomeSection, button_text: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Button Link</label>
              <input
                type="text"
                value={welcomeSection.button_url || ""}
                onChange={(e) =>
                  setWelcomeSection({ ...welcomeSection, button_url: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] sm:text-sm"
              />
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b border-gray-200 pb-4">Image</h2>
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Image</label>
            <select
              value={welcomeSection.image_id || ""}
              onChange={(e) => setWelcomeSection({ ...welcomeSection, image_id: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
            >
              <option value="">Select an image</option>
              {mediaQuery.data?.map((media) => (
                <option key={media.id} value={media.id}>
                  {media.original_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={welcomeSection.is_visible ? "Published" : "Hidden"}
              onChange={(e) =>
                setWelcomeSection({ ...welcomeSection, is_visible: e.target.value === "Published" })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm"
            >
              <option value="Published">Published</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>
      )}

      {activeTab === "stats" && (
        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4 max-w-2xl">
          <p className="text-sm text-gray-500 mb-6">
            Statistics are configured via Website Settings or are automatically generated from
            active entities on the dashboard.
          </p>
          <div className="text-center py-6 text-gray-500">
            (Statistics configuration should be handled in a dedicated key-value store or computed
            dynamically)
          </div>
        </div>
      )}

      {activeTab === "featured" && (
        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 max-w-2xl">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Featured Content</h3>
            <p className="text-sm text-gray-500 mb-6">
              To feature news or events, edit the specific news/event record and toggle its
              "Featured" flag.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
