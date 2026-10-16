import { getCategory, getExercise, loadCategoryExercises } from "../data";

import { catalog } from "../data";
import { filterCategories } from "../data/filterCategories";

describe("exercise data loading", () => {
  it("loads an exercise by category and id", () => {
    const category = getCategory("collocations");
    expect(category).toBeDefined();
    const exercise = getExercise("collocations", category!.exercises[0].id);
    expect(exercise?.questions.length).toBeGreaterThan(0);
  });

  it("returns the cached exercise array on repeated loads", () => {
    const first = loadCategoryExercises("collocations");
    const second = loadCategoryExercises("collocations");
    expect(second).toBe(first);
  });

  it("filters by title or group and combines both filters", () => {
    const group = catalog.categories[0].group;
    const byTitle = filterCategories(catalog.categories, "COLLOCATIONS", null);
    const byGroup = filterCategories(catalog.categories, "", group);
    const combined = filterCategories(catalog.categories, "collocations", group);
    expect(byTitle.length).toBeGreaterThan(0);
    expect(byGroup.every((category) => category.group === group)).toBe(true);
    expect(combined.every((category) => category.group === group && category.title.toLowerCase().includes("collocations"))).toBe(true);
  });
});