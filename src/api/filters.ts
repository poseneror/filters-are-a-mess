export type FilterType = { id: string; checked: boolean };

export const getFilters: (amount: number) => FilterType[] = (amount) => {
  const response = [];
  for (let i = 0; i < amount; i++) {
    response.push({ id: `some-filter-${i}`, checked: Math.random() > 0.5 });
  }
  return response;
};
