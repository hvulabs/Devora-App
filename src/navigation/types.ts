export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Home: undefined;
  Browse: undefined;
  Category: { slug: string };
  Exercise: { catSlug: string; exId: string };
  Result: {
    catSlug: string;
    exId: string;
    correct: number;
    total: number;
    xp: number;
    newRecord: boolean;
  };
};
