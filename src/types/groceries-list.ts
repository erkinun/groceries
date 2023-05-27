export type GroceryItem = {
  id?: string;
  name: string;
  fetched: boolean;
  quantity?: number;
};

export type GroceryList = {
  id?: string;
  date: string;
  name: string;
  items: GroceryItem[];
};

export type TemplateList = GroceryList;

// TODO maybe rename them to collections
export type GroceryLists = {
  id: string;
  name: string;
  lists: GroceryList[];
};
