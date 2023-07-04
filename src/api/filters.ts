import { faker } from "@faker-js/faker";

export type FilterType = { id: string; displayName: string; checked: boolean };

export const getFilters: (
  amount?: number,
  allSelected?: boolean
) => FilterType[] = (amount = 100, allSelected = false) => {
  const response = [];
  for (let i = 0; i < amount; i++) {
    response.push({
      id: faker.string.uuid(),
      displayName: faker.person.fullName(),
      checked: allSelected || faker.datatype.boolean(),
    });
  }
  return response;
};
