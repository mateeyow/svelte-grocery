import { writable, derived } from "svelte/store";
import { chosenFilter } from "$lib/stores/filter";

export type Grocery = {
  item: string;
  id: string;
  purchased: boolean;
  groceries: GroceryStore;
}

export type GroceryStore = Map<string, Grocery>

const generateID = () => {
  return crypto.randomUUID()
}

export function createGroceryStore() {
  const defaultGroceries: GroceryStore = new Map()
  const itemStore = new Map<string, string>();

  // if (typeof localStorage !== 'undefined') {
  //   const localGroceries = window.localStorage.getItem('groceries')
  //   defaultGroceries = JSON.parse(localGroceries || '[]') as Grocery[]
  // }

  const { subscribe, update, } = writable<GroceryStore>(defaultGroceries);

  const renameChild = (item: string, childId: string, parentGroceries: Grocery): Grocery => {
    const childGrocery = parentGroceries.groceries.get(childId)

    if (!childGrocery) {
      return parentGroceries
    }

    childGrocery.item = item
    parentGroceries.groceries.set(childId, childGrocery)
    return parentGroceries
  }

  const addOrRenameParent = (id: string, item: string, groceries?: Grocery): Grocery => {
    // New
    if (!groceries) {
      return {
        item,
        id,
        purchased: false,
        groceries: new Map()
      }
    }

    // Rename
    groceries.item = item
    return groceries
  }

  return {
    subscribe,
    update,
    addOrRename: (item: string, id?: string, childId?: string) => update(groceries => {
      const oldItem = itemStore.get(item)

      // Do nothing if the item is already in the list
      if (oldItem) {
        return groceries
      }

      if (!id) {
        id = generateID()
      }

      const data = groceries.get(id)

      const updatedGrocery = childId && data ? renameChild(item, childId, data) : addOrRenameParent(id, item, data)

      // Remove previous item if it exists as we are renaming them
      if (itemStore.has(data?.item ?? '')) {
        itemStore.delete(data?.item ?? '')
      }

      groceries.set(id, updatedGrocery)
      itemStore.set(item, id)

      return groceries
    }),
    remove: (id: string, childId?: string) => update(groceries => {
      const groceryData = groceries.get(id)
      if (!groceryData) {
        return groceries
      }

      if (childId) {
        groceryData.groceries.delete(childId)
        groceries = groceries.set(id, groceryData)
      } else {
        groceries.delete(id)
      }

      itemStore.delete(groceryData.item)

      return groceries
    }),
    changeState: (id: string) => update(groceries => {
      const data = groceries.get(id)

      if (data) {
        data.purchased = !data.purchased
      }

      return groceries
    }),
    addChild: (parentId: string) => update(groceries => {
      const groceryData = groceries.get(parentId)

      if (!groceryData) {
        return groceries
      }

      const id = generateID()
      groceryData.groceries.set(id, {
        item: '',
        id,
        purchased: false,
        groceries: new Map()
      })

      groceries.set(parentId, groceryData)

      return groceries
    }),
  }
}
// add: (item: string) => update(groceries => {
//   if (!groceries.find(grocery => grocery.item === item)) {
//     groceries.push({ item, purchased: false, groceries: [] });
//   }

//   return groceries;
// }),
// remove: (item: string) => update(groceries => {
//   return groceries.filter(grocery => grocery.item !== item)
// }),
// changeState: (item: string) => update(groceries => {
//   return groceries.map(grocery => {
//     if (grocery.item === item) {
//       grocery.purchased = !grocery.purchased
//     }

//     return grocery
//   })
// }),
// rename: (newName: string, oldName: string) => update(groceries => {
//   return groceries.map(grocery => {
//     if (grocery.item === oldName) {
//       grocery.item = newName
//     }

//     return grocery
//   })
// }),
// addChild: (parent: string) => update(groceries => {
//   return groceries.map(grocery => {
//     if (grocery.item === parent) {
//       grocery.groceries.push({ item: '', purchased: false, groceries: [] })
//     }

//     return grocery
//   })
// })

export const groceries = createGroceryStore()

// groceries.subscribe(groceries => {
//   if (typeof localStorage !== 'undefined') {
//     localStorage.setItem('groceries', JSON.stringify(groceries))
//   }
// })

export const convertToArr = (mapItems: GroceryStore): Grocery[] => {
  return Array.from(mapItems.values())
}

export const allGroceries = derived([groceries, chosenFilter], ([$groceries, chosenFilter]) => {
  const groceriesArr = convertToArr($groceries)

  if (chosenFilter === 'bought') {
    return groceriesArr.filter(grocery => grocery.purchased)
  }

  if (chosenFilter === 'to buy') {
    return groceriesArr.filter(grocery => !grocery.purchased)
  }

  return groceriesArr
})
