export type NavItem = {
  id: string;
  label: string;
  to?: string;
  href?: string;
  children?: NavItem[];
};

export interface NavigationDBItem {
  id: string;
  parent_id?: string | null;
  label: string;
  page_slug?: string | null;
  url?: string | null;
  display_order?: number;
}

export interface NavigationNode extends NavigationDBItem {
  children: NavigationNode[];
}

export const buildNavTree = (dbItems: NavigationDBItem[]): NavItem[] => {
  if (!dbItems || dbItems.length === 0) return [];

  const itemMap = new Map<string, NavigationNode>();
  dbItems.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

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

  const sortChildren = (nodes: NavigationNode[]) => {
    nodes.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children);
      }
    });
  };
  sortChildren(roots);

  return roots.map((root) => mapToNavItem(root));
};

export const resolveLinkUrl = (
  pageSlug?: string | null,
  customUrl?: string | null,
): string | undefined => {
  if (pageSlug && pageSlug.trim().length > 0) {
    const clean = pageSlug.replace(/^\/+|\/+$/g, "").trim();
    return `/pages/${clean}`;
  }
  if (customUrl && customUrl.trim().length > 0) {
    const trimmed = customUrl.trim();
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:")
    ) {
      return trimmed;
    }
    // Ensure internal path starts with '/'
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }
  return undefined;
};

export const mapToNavItem = (item: NavigationNode): NavItem => {
  const linkUrl = resolveLinkUrl(item.page_slug, item.url);
  const isExternal = Boolean(linkUrl && linkUrl.startsWith("http"));

  const navItem: NavItem = {
    id: item.id,
    label: item.label,
    ...(linkUrl
      ? isExternal
        ? { href: linkUrl }
        : { to: linkUrl }
      : {}),
    children:
      item.children && item.children.length > 0
        ? item.children.map((child) => mapToNavItem(child))
        : undefined,
  };

  return navItem;
};
