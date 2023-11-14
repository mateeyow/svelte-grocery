import { writable, derived } from "svelte/store";
import { chosenFilter } from "$lib/stores/filter";

export type Grocery = {
  item: string;
  purchased: boolean;
  groceries: Grocery[];
}

function createGroceryStore() {
  let defaultGroceries: Grocery[] = []

  if (typeof localStorage !== 'undefined') {
    const localGroceries = window.localStorage.getItem('groceries')
    defaultGroceries = JSON.parse(localGroceries || '[]') as Grocery[]
  }

  const { subscribe, update, ...rest } = writable<Grocery[]>(defaultGroceries);

  return {
    subscribe,
    update,
    ...rest,
    add: (item: string) => update(groceries => {
      if (!groceries.find(grocery => grocery.item === item)) {
        groceries.push({ item, purchased: false, groceries: [] });
      }

      return groceries;
    }),
    remove: (item: string) => update(groceries => {
      return groceries.filter(grocery => grocery.item !== item)
    }),
    changeState: (item: string) => update(groceries => {
      return groceries.map(grocery => {
        if (grocery.item === item) {
          grocery.purchased = !grocery.purchased
        }

        return grocery
      })
    }),
    rename: (newName: string, oldName: string) => update(groceries => {
      return groceries.map(grocery => {
        if (grocery.item === oldName) {
          grocery.item = newName
        }

        return grocery
      })
    })
  }
}

export const groceries = createGroceryStore()

groceries.subscribe(groceries => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('groceries', JSON.stringify(groceries))
  }
})

export const allGroceries = derived([groceries, chosenFilter], ([$groceries, chosenFilter]) => {
  if (chosenFilter === 'bought') {
    return $groceries.filter(grocery => grocery.purchased)
  }

  if (chosenFilter === 'to buy') {
    return $groceries.filter(grocery => !grocery.purchased)
  }

  return $groceries
})
