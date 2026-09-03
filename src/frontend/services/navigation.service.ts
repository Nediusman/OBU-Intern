export type NavItem = {
  label: string;
  to?: string;
  href?: string;
  groups?: { heading?: string; items: { label: string; to?: string; href?: string }[] }[];
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

  const itemMap = new Map();
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
    nodes.forEach((node) => sortChildren(node.children));
  };
  sortChildren(roots);

  return roots.map((root) => mapToNavItem(root));
};

const resolveLinkUrl = (
  pageSlug?: string | null,
  customUrl?: string | null,
): string | undefined => {
  if (pageSlug && pageSlug.trim().length > 0) {
    const clean = pageSlug.replace(/^\/+|\/+$/g, "").trim();
    return `/pages/${clean}`;
  }
  if (customUrl && customUrl.trim().length > 0) {
    return customUrl.trim();
  }
  return undefined;
};

const mapToNavItem = (item: NavigationNode): NavItem => {
  // If it's a page link, resolve to /pages/cleanSlug. Otherwise use url if present.
  const linkUrl = resolveLinkUrl(item.page_slug, item.url);
  const isExternal = Boolean(linkUrl && linkUrl.startsWith("http"));

  const navItem: NavItem = {
    label: item.label,
  };

  if (item.children && item.children.length > 0) {
    const hasSubChildren = item.children.some(
      (c: NavigationNode) => c.children && c.children.length > 0,
    );

    if (hasSubChildren) {
      navItem.groups = item.children.map((child: NavigationNode) => {
        const childLink = resolveLinkUrl(child.page_slug, child.url) || "/";
        const isChildExternal = childLink.startsWith("http");

        return {
          heading: child.label,
          items:
            child.children && child.children.length > 0
              ? child.children.map((sub: NavigationNode) => {
                  const subLink = resolveLinkUrl(sub.page_slug, sub.url) || "/";
                  return {
                    label: sub.label,
                    [subLink.startsWith("http") ? "href" : "to"]: subLink,
                  };
                })
              : [{ label: child.label, [isChildExternal ? "href" : "to"]: childLink }],
        };
      });
    } else {
      navItem.groups = [
        {
          items: item.children.map((child: NavigationNode) => {
            const childLink = resolveLinkUrl(child.page_slug, child.url) || "/";
            return {
              label: child.label,
              [childLink.startsWith("http") ? "href" : "to"]: childLink,
            };
          }),
        },
      ];
    }

    if (linkUrl) {
      if (isExternal) navItem.href = linkUrl;
      else navItem.to = linkUrl;
    }
  } else {
    const fallbackUrl = linkUrl || "/";
    if (fallbackUrl.startsWith("http")) navItem.href = fallbackUrl;
    else navItem.to = fallbackUrl;
  }

  return navItem;
};
