import { writable, derived } from "svelte/store";
import { chosenFilter } from "$lib/stores/filter";

export type Grocery = {
  item: string;
  purchased: boolean;
}

function createGroceryStore() {
  const { subscribe, update } = writable<Map<string, Grocery>>(new Map());

  return {
    subscribe,
    add: (item: string) => update(groceries => {
      if (!groceries.has(item)) {
        groceries.set(item, { item, purchased: false });
      }

      return groceries;
    }),
    remove: (item: string) => update(groceries => {
      groceries.delete(item)
      return groceries
    }),
    changeState: (item: string) => update(groceries => {
      const grocery = groceries.get(item)
      if (grocery) {
        grocery.purchased = !grocery.purchased
        groceries.set(item, grocery)
      }

      return groceries
    })
  }
}

export const groceries = createGroceryStore()

export const allGroceries = derived([groceries, chosenFilter], ([$groceries, chosenFilter]) => {
  const groceryArr = Array.from($groceries.values())

  if (chosenFilter === 'bought') {
    return groceryArr.filter(grocery => grocery.purchased)
  }

  if (chosenFilter === 'to buy') {
    return groceryArr.filter(grocery => !grocery.purchased)
  }

  return groceryArr
})
