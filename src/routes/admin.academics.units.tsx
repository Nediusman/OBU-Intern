import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "@/frontend/admin/components/AdminPageHeader";
import { ChevronRight, ChevronDown, FolderOpen, FileText } from "lucide-react";
import { useState } from "react";
import { useAcademicUnits } from "@/frontend/admin/hooks/useAcademicUnits";
import { usePrograms } from "@/frontend/admin/hooks/usePrograms";

export const Route = createFileRoute("/admin/academics/units")({
  component: AcademicUnitsManagement,
});

type HierarchyNodeData = {
  id: string;
  name: string;
  type?: string;
  unit_type?: string;
  children: HierarchyNodeData[];
};
function HierarchyNode({ node, depth = 0 }: { node: HierarchyNodeData; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center justify-between py-2 px-3 hover:bg-gray-50 border-b border-gray-100`}
      >
        <div className="flex items-center gap-2" style={{ marginLeft: `${depth * 1.5}rem` }}>
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
            <span className="w-4"></span>
          )}
          {node.type === "Program" ? (
            <FileText className="h-4 w-4 text-gray-400" />
          ) : (
            <FolderOpen className={`h-4 w-4 ${depth === 0 ? "text-[#186a42]" : "text-blue-500"}`} />
          )}
          <span className={`text-sm ${depth === 0 ? "font-bold" : "font-medium"} text-gray-900`}>
            {node.name}
          </span>
          <span className="text-xs text-gray-400 ml-2 border border-gray-200 rounded px-1">
            {node.type}
          </span>
        </div>
      </div>
      {expanded && hasChildren && (
        <div className="flex flex-col">
          {node.children.map((child: HierarchyNodeData) => (
            <HierarchyNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function AcademicUnitsManagement() {
  const { query: unitsQuery } = useAcademicUnits();
  const { query: programsQuery } = usePrograms();

  const isLoading = unitsQuery.isLoading || programsQuery.isLoading;

  // Build Hierarchy
  let hierarchy: HierarchyNodeData[] = [];
  if (unitsQuery.data && programsQuery.data) {
    const units = unitsQuery.data;
    const programs = programsQuery.data;

    // 1. Find root nodes (Colleges/Institutes without parents)
    const roots = units.filter((u) => !u.parent_id);

    hierarchy = roots.map((root) => {
      // 2. Find child departments
      const childrenUnits = units.filter((u) => u.parent_id === root.id);

      const children = childrenUnits.map((dept) => {
        // 3. Find programs for this department
        const deptPrograms = programs.filter((p) => p.academic_unit_id === dept.id);

        return {
          id: `dept-${dept.id}`,
          type: dept.unit_type,
          name: dept.name,
          children: deptPrograms.map((p) => ({
            id: `prog-${p.id}`,
            type: "Program",
            name: p.name,
            children: [],
          })),
        };
      });

      // Also attach any programs directly to the college (if any)
      const rootPrograms = programs.filter((p) => p.academic_unit_id === root.id);
      children.push(
        ...rootPrograms.map((p) => ({
          id: `prog-${p.id}`,
          type: "Program",
          name: p.name,
          children: [],
        })),
      );

      return {
        id: `unit-${root.id}`,
        type: root.unit_type,
        name: root.name,
        children: children,
      };
    });
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Academic Hierarchy"
        description="View and manage the university's complete academic structure."
      />

      {isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
          <div className="text-sm text-gray-500">Loading academic structure...</div>
        </div>
      ) : (
        <div className="rounded-lg bg-white p-4 shadow ring-1 ring-gray-200">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Oda Bultum University</h3>
            </div>
            <div className="flex flex-col">
              {hierarchy.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No academic units configured.</div>
              ) : (
                hierarchy.map((unit) => <HierarchyNode key={unit.id} node={unit} />)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
