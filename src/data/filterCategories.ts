import type { Category } from "../types";

export function filterCategories(categories: Category[], query: string, group: string | null) {
  const needle = query.trim().toLowerCase();
  return categories.filter((category) => {
    if (group && category.group !== group) return false;
    if (!needle) return true;
    return category.title.toLowerCase().includes(needle) || category.group.toLowerCase().includes(needle);
  });
}
