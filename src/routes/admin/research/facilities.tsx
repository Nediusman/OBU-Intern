import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { AdminBadge } from "@/frontend/admin/components/AdminBadge";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  ImageIcon,
  MapPin,
  Building2,
  Phone,
} from "lucide-react";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/frontend/lib/supabase";
import type { Database } from "@/frontend/lib/database.types";
import { useMedia } from "@/frontend/admin/hooks/useMedia";
import { generateSlug } from "@/frontend/lib/utils";

type ResearchFacility = Database["public"]["Tables"]["research_facilities"]["Row"] & {
  media?: { file_url?: string };
};

export const Route = createFileRoute("/admin/research/facilities")({
  component: AdminResearchFacilities,
});

function AdminResearchFacilities() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [editingItem, setEditingItem] = useState<Partial<ResearchFacility> | null>(null);

  const queryClient = useQueryClient();
  const { uploadMutation } = useMedia();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const query = useQuery({
    queryKey: ["admin_research_facilities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_facilities")
        .select("*, media(file_url)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ResearchFacility[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (item: Partial<ResearchFacility>) => {
      const { media, ...rest } = item;
      const { data, error } = await supabase
        .from("research_facilities")
        .upsert(rest as Record<string, unknown>)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_research_facilities"] });
      setView("list");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("research_facilities").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_research_facilities"] });
    },
  });

  const handleCreate = () => {
    setEditingItem({
      name: "",
      slug: "",
      description: "",
      location: "",
      contact: "",
      services: "",
      status: "active",
      images: [],
      gallery: [],
    });
    setView("editor");
  };

  const handleEdit = (item: ResearchFacility) => {
    setEditingItem({ ...item });
    setView("editor");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this research facility?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = () => {
    if (editingItem && editingItem.name) {
      const slug = editingItem.slug || generateSlug(editingItem.name);
      upsertMutation.mutate({ ...editingItem, slug });
    } else {
      alert("Name is required.");
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      try {
        const result = await uploadMutation.mutateAsync(file);
        setEditingItem({
          ...editingItem,
          main_image_id: result.id,
          media: { file_url: result.file_url },
        });
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    }
  };

  if (view === "editor" && editingItem) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("list")}
              className="rounded-full p-2 hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {editingItem.id ? "Edit Facility" : "New Facility"}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={upsertMutation.isPending}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333] disabled:opacity-50 transition-colors shadow-sm"
          >
            <Save className="h-4 w-4" />
            {upsertMutation.isPending ? "Saving..." : "Save Facility"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facility Name *</label>
                  <input
                    type="text"
                    value={editingItem.name || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    placeholder="e.g. Central Research Laboratory"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                      /research/facilities/
                    </span>
                    <input
                      type="text"
                      value={editingItem.slug || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                      className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={6}
                    value={editingItem.description || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    placeholder="Detailed description of the facility and its purpose..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editingItem.location || ""}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, location: e.target.value })
                        }
                        className="block w-full pl-10 rounded-md border-gray-300 focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                        placeholder="e.g. Main Campus, Building B"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={editingItem.contact || ""}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, contact: e.target.value })
                        }
                        className="block w-full pl-10 rounded-md border-gray-300 focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                        placeholder="Email or Phone number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Services Offered
                  </label>
                  <textarea
                    rows={4}
                    value={editingItem.services || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, services: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                    placeholder="List the services or capabilities this facility provides..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Publishing</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingItem.status || "active"}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">
              <h2 className="text-sm font-medium text-gray-900">Main Image</h2>
              <div
                className="aspect-video w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative"
                onClick={() => !uploadMutation.isPending && imageInputRef.current?.click()}
              >
                {editingItem.media?.file_url ? (
                  <img
                    src={editingItem.media?.file_url}
                    alt="Main"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Research Facilities"
        description="Manage university research facilities, laboratories, and centers."
        action={
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white hover:bg-[#125333]"
          >
            <Plus className="h-4 w-4" />
            Add Facility
          </button>
        }
      />
      <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Facility Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {query.isLoading && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Loading facilities...
                </td>
              </tr>
            )}
            {!query.isLoading && (!query.data || query.data.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No research facilities found.
                </td>
              </tr>
            )}
            {query.data?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  <div className="flex items-center gap-3">
                    {item.media?.file_url ? (
                      <img
                        src={item.media.file_url}
                        className="h-8 w-8 rounded object-cover border"
                        alt=""
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center border">
                        <Building2 className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.location || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <AdminBadge status={item.status || "active"} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-gray-400 hover:text-[#186a42]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteMutation.isPending}
                      className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
