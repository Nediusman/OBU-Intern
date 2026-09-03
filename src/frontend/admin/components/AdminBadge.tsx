import { ReactNode } from "react";

export type BadgeStatus =
  | "Draft"
  | "Review"
  | "Published"
  | "Archived"
  | "Active"
  | "Inactive"
  | "Expired"
  | "New"
  | "Read"
  | "Replied";

interface AdminBadgeProps {
  status: BadgeStatus | string;
  className?: string;
}

export function AdminBadge({ status, className = "" }: AdminBadgeProps) {
  const getBadgeStyle = (s: string) => {
    switch (s.toLowerCase()) {
      case "published":
      case "active":
      case "replied":
        return "bg-green-100 text-green-800";
      case "review":
      case "new":
        return "bg-blue-100 text-blue-800";
      case "draft":
      case "read":
        return "bg-gray-100 text-gray-800";
      case "archived":
      case "inactive":
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${getBadgeStyle(status)} ${className}`}
    >
      {status}
    </span>
  );
}
