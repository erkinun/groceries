type GroceryItem = {
  id?: string;
  name: string;
  fetched: boolean;
  quantity?: number;
};

export type GroceryList = {
  id: string;
  date: string;
  name: string;
  items: GroceryItem[];
};

export type GroceryLists = {
  name: string;
  lists: GroceryList[];
};
