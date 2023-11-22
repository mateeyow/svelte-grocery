import { writable, derived } from "svelte/store";
import { chosenFilter } from "$lib/stores/filter";

export type GroceryMap = {
  item: string;
  id: string;
  purchased: boolean;
  groceries: GroceryStore;
}

export type GroceryData = {
  item: string;
  id: string;
  purchased: boolean;
  groceries: GroceryData[];
}

export type GroceryStore = Map<string, GroceryMap>

const generateID = () => {
  return crypto.randomUUID()
}

function createGroceryStore() {
  let defaultGroceries: GroceryStore = new Map()
  const itemStore = new Map<string, string>();

  if (typeof localStorage !== 'undefined') {
    const localGroceries = window.localStorage.getItem('groceries')
    const groceryArr = JSON.parse(localGroceries || '[]') as GroceryData[]
    defaultGroceries = new Map(groceryArr.map(record => {
      const groceryData = new Map(record.groceries.map((child) => {
        itemStore.set(child.item, child.id)
        return [child.id, { ...child, groceries: new Map() }]
      }))

      itemStore.set(record.item, record.id)
      return [record.id, { ...record, groceries: groceryData }]
    }))
  }

  const { subscribe, update, } = writable<GroceryStore>(defaultGroceries);

  const renameChild = (item: string, childId: string, parentGroceries: GroceryMap): GroceryMap => {
    const childGrocery = parentGroceries.groceries.get(childId)

    if (!childGrocery) {
      return parentGroceries
    }

    itemStore.delete(childGrocery.item)
    itemStore.set(item, childId)
    childGrocery.item = item
    return parentGroceries
  }

  const addOrRenameParent = (id: string, item: string, groceries?: GroceryMap): GroceryMap => {
    itemStore.set(item, id)
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
    itemStore.delete(groceries.item)
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

      groceries.set(id, updatedGrocery)

      return groceries
    }),
    remove: (id: string, childId?: string) => update(groceries => {
      const groceryData = groceries.get(id)
      if (!groceryData) {
        return groceries
      }

      if (childId) {
        itemStore.delete(groceryData.groceries.get(childId)?.item ?? '')
        groceryData.groceries.delete(childId)
        groceries = groceries.set(id, groceryData)
      } else {
        itemStore.delete(groceryData.item)
        groceries.delete(id)
      }


      return groceries
    }),
    changeState: (id: string, childId?: string) => update(groceries => {
      const data = groceries.get(id)

      if (!data) {
        return groceries
      }

      if (childId) {
        const childData = data.groceries.get(childId)
        if (!childData) {
          return groceries
        }

        childData.purchased = !childData.purchased
        const allPurchased = [...data.groceries.values()].every(grocery => grocery.purchased)
        data.purchased = allPurchased
      } else {
        data.purchased = !data.purchased

        data.groceries.forEach(grocery => {
          grocery.purchased = data.purchased
        })
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

export const groceries = createGroceryStore()

groceries.subscribe(groceries => {
  if (typeof localStorage !== 'undefined') {
    const groceryArr = Array.from(groceries.values()).map(record => {
      return {
        ...record,
        groceries: Array.from(record.groceries.values())
      }
    })
    localStorage.setItem('groceries', JSON.stringify(groceryArr))
  }
})

export const convertToArr = (mapItems: GroceryStore): GroceryMap[] => {
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
