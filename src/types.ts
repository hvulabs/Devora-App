export interface Question {
  q: string;
  code: string | null;
  options: string[];
  correct: number;
  explanation: string | null;
}

export interface CatalogExercise {
  id: string;
  title: string;
  subtitle: string | null;
  level: string;
  tags: string[];
  count: number;
  xp: number;
}

export interface Category {
  slug: string;
  title: string;
  group: string;
  color: string;
  glyph: string;
  exerciseCount: number;
  questionCount: number;
  exercises: CatalogExercise[];
}

export interface Group {
  name: string;
  color: string;
  slugs: string[];
}

export interface Catalog {
  categories: Category[];
  groups: Group[];
}

export interface FullExercise {
  id: string;
  title: string;
  subtitle: string | null;
  level: string;
  tags: string[];
  questions: Question[];
}
