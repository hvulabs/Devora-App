import catalogRaw from "./catalog.json";
import { categoryLoaders } from "./dataIndex";
import type { Catalog, Category, FullExercise } from "../types";

export const catalog = catalogRaw as unknown as Catalog;

export function getCategory(slug: string): Category | undefined {
  return catalog.categories.find((c) => c.slug === slug);
}

const cache: Record<string, FullExercise[]> = {};

export function loadCategoryExercises(slug: string): FullExercise[] {
  if (cache[slug]) return cache[slug];
  const loader = categoryLoaders[slug];
  if (!loader) return [];
  const data = loader();
  cache[slug] = data.exercises as FullExercise[];
  return cache[slug];
}

export function getExercise(
  catSlug: string,
  exId: string
): FullExercise | undefined {
  return loadCategoryExercises(catSlug).find((e) => e.id === exId);
}

export const totalExercises = catalog.categories.reduce(
  (n, c) => n + c.exerciseCount,
  0
);
export const totalQuestions = catalog.categories.reduce(
  (n, c) => n + c.questionCount,
  0
);
