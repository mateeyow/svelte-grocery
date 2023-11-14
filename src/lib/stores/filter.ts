import { writable } from "svelte/store";

export const filters = ['view all', 'to buy', 'bought'] as const;
export type FilterTypes = (typeof filters)[number];

export const chosenFilter = writable<FilterTypes>('view all');
