import { Link } from "@tanstack/react-router";

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionText,
  actionTo,
}: {
  title: string;
  description: string;
  icon?: React.ElementType;
  actionText?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 my-8">
      {Icon && <Icon className="h-12 w-12 text-gray-400 mb-4" />}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {actionText && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center justify-center rounded-md bg-[#186a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#125333]"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
