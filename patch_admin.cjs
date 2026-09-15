const fs = require("fs");

const content = fs.readFileSync("src/routes/admin.research.projects.tsx", "utf8");

let newContent = content.replace(
  `import { Plus, Edit, Trash2, X, Save } from "lucide-react";`,
  `import { Plus, Edit, Trash2, X, Save, Image as ImageIcon, FileText, Download } from "lucide-react";`,
);

newContent = newContent.replace(
  `import { useState } from "react";`,
  `import { useState, useRef } from "react";\nimport { useMedia } from "@/frontend/admin/hooks/useMedia";\nimport { generateSlug } from "@/frontend/lib/utils";`,
);

newContent = newContent.replace(
  `  const { query, createMutation, updateMutation, deleteMutation } = useResearchProjects();`,
  `  const { query, createMutation, updateMutation, deleteMutation } = useResearchProjects();\n  const { uploadMutation } = useMedia();\n  const imageInputRef = useRef<HTMLInputElement>(null);\n  const docInputRef = useRef<HTMLInputElement>(null);\n\n  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {\n    const file = e.target.files?.[0];\n    if (file) {\n      if (file.size > 10 * 1024 * 1024) {\n        toast.error("Image is too large (max 10MB)");\n        return;\n      }\n      uploadMutation.mutate(file, {\n        onSuccess: (media) => {\n          setEditingItem((prev) => ({\n            ...prev,\n            main_image_id: media.id,\n            media: { file_url: media.file_url },\n          }));\n        },\n      });\n    }\n  };\n\n  const handleDocSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {\n    const file = e.target.files?.[0];\n    if (file) {\n      if (file.size > 20 * 1024 * 1024) {\n        toast.error("Document is too large (max 20MB)");\n        return;\n      }\n      uploadMutation.mutate(file, {\n        onSuccess: (media) => {\n          setEditingItem((prev) => {\n            const existingDocs = Array.isArray(prev.documents) ? prev.documents : [];\n            return {\n              ...prev,\n              documents: [...existingDocs, media],\n            };\n          });\n        },\n      });\n    }\n    if (docInputRef.current) {\n      docInputRef.current.value = "";\n    }\n  };\n\n  const removeDocument = (index: number) => {\n    setEditingItem((prev) => {\n      const existingDocs = Array.isArray(prev.documents) ? [...prev.documents] : [];\n      existingDocs.splice(index, 1);\n      return { ...prev, documents: existingDocs };\n    });\n  };`,
);

newContent = newContent.replace(
  `      project_title: editingItem.project_title,`,
  `      project_title: editingItem.project_title,\n      slug: editingItem.slug,\n      main_image_id: editingItem.main_image_id,\n      documents: editingItem.documents,`,
);

newContent = newContent.replace(
  `<div className="grid grid-cols-1 gap-6">`,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">`,
);

newContent = newContent.replace(
  `          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">`,
  `          <div className="lg:col-span-2 space-y-6">\n          <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">`,
);

newContent = newContent.replace(
  `                <input
                  type="text"
                  value={editingItem.project_title || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, project_title: e.target.value })
                  }`,
  `                <input
                  type="text"
                  value={editingItem.project_title || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setEditingItem((prev) => {
                      if (!prev) return prev;
                      if (!prev.slug || prev.slug === generateSlug(prev.project_title || "")) {
                        return { ...prev, project_title: newTitle, slug: generateSlug(newTitle) };
                      }
                      return { ...prev, project_title: newTitle };
                    });
                  }}`,
);

const slugField = `              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Slug *</label>
                <input
                  type="text"
                  value={editingItem.slug || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#186a42] focus:ring-[#186a42] sm:text-sm p-2 border"
                />
              </div>\n`;

newContent = newContent.replace(
  `              <div>\n                <label className="block text-sm font-medium text-gray-700">Project Code</label>`,
  slugField +
    `              <div>\n                <label className="block text-sm font-medium text-gray-700">Project Code</label>`,
);

newContent = newContent.replace(
  `              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    );\n  }`,
  `              </div>\n            </div>\n          </div>\n          </div>\n          <div className="space-y-6">\n            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">\n              <h2 className="text-sm font-medium text-gray-900">Project Image</h2>\n              <div\n                className="aspect-video w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 overflow-hidden relative"\n                onClick={() => !uploadMutation.isPending && imageInputRef.current?.click()}\n              >\n                {(editingItem as any).media?.file_url ? (\n                  <img\n                    src={(editingItem as any).media.file_url}\n                    alt="Project"\n                    className="object-cover w-full h-full"\n                  />\n                ) : (\n                  <>\n                    <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />\n                    <span className="text-sm text-gray-500">\n                      {uploadMutation.isPending ? "Uploading..." : "Upload Image"}\n                    </span>\n                  </>\n                )}\n                <input\n                  type="file"\n                  ref={imageInputRef}\n                  className="hidden"\n                  accept="image/*"\n                  onChange={handleImageSelect}\n                />\n              </div>\n            </div>\n\n            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-200 space-y-4">\n              <h2 className="text-sm font-medium text-gray-900">Documents</h2>\n              <div className="space-y-3">\n                {Array.isArray(editingItem.documents) &&\n                  editingItem.documents.map((doc: any, i: number) => (\n                    <div\n                      key={i}\n                      className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-gray-50 text-sm"\n                    >\n                      <div className="flex items-center gap-2 truncate">\n                        <FileText className="h-4 w-4 text-[#186a42] flex-shrink-0" />\n                        <span className="truncate">{doc.original_name || doc.file_name || "Document"}</span>\n                      </div>\n                      <button\n                        onClick={() => removeDocument(i)}\n                        className="text-gray-400 hover:text-red-600 flex-shrink-0 ml-2"\n                      >\n                        <X className="h-4 w-4" />\n                      </button>\n                    </div>\n                  ))}\n                <button\n                  onClick={() => !uploadMutation.isPending && docInputRef.current?.click()}\n                  className="flex items-center gap-2 w-full justify-center rounded-md border-2 border-dashed border-gray-300 px-4 py-4 text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50"\n                >\n                  <Plus className="h-4 w-4" />\n                  {uploadMutation.isPending ? "Uploading..." : "Add Document"}\n                </button>\n                <input\n                  type="file"\n                  ref={docInputRef}\n                  className="hidden"\n                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"\n                  onChange={handleDocSelect}\n                />\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    );\n  }`,
);

fs.writeFileSync("src/routes/admin.research.projects.tsx", newContent);
