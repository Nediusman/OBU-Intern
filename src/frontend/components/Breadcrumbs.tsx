import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center text-xs sm:text-sm font-medium text-gray-500 mb-6 bg-gray-50/90 border border-gray-200/50 py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl w-fit max-w-full gap-y-1.5 leading-normal shadow-xs"
    >
      <Link
        to="/"
        className="hover:text-[#186a42] flex items-center gap-1 shrink-0 transition-colors"
        title="Home"
      >
        <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-500 hover:text-[#186a42]" />
      </Link>

      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center min-w-0">
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400 shrink-0" />
          {item.to ? (
            <Link
              to={item.to}
              className="hover:text-[#186a42] truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] transition-colors"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="text-gray-900 font-semibold truncate max-w-[130px] sm:max-w-[220px] md:max-w-[350px]"
              title={item.label}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
