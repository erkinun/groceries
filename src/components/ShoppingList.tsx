import { useEffect, useRef, useState } from 'react';
import {
  createShoppingList,
  updateShoppingList,
} from '../queries/shopping-list';
import { GroceryList } from '../types/groceries-list';

function printHumanReadableDate(date: Date) {
  return date.toLocaleDateString();
}

type ShoppingListProps = { collectionId: string; groceryList?: GroceryList };

export function ShoppingList({ collectionId, groceryList }: ShoppingListProps) {
  // TODO use the shopping list type later on
  // TODO also might use the existing list to edit
  // TODO clear bottom input when handleItem is called
  const [items, setItems] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const editMode = groceryList !== undefined;

  useEffect(() => {
    setItems(groceryList?.items.map((item) => item.name) ?? []);
  }, [editMode]);

  const handleItem = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value) {
      if (!items.includes(value)) {
        setItems([...items, value]);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleItem(event as any);
    }
  };

  const handleSave = () => {
    console.log('clicking save with', collectionId);
    // TODO edit mode
    if (editMode) {
      updateShoppingList(collectionId, {
        ...groceryList,
        // TODO replace this with correct types items state
        items: items.map((item) => ({
          name: item,
          fetched: false,
        })),
      });
    } else {
      createShoppingList(collectionId, {
        name: inputRef.current?.value ?? 'Empty list name',
        date: printHumanReadableDate(new Date()),
        items: items.map((item) => ({
          name: item,
          fetched: false,
        })),
      });
    }
  };

  return (
    <div className="p-4 border-solid border-black border  rounded-xl shadow-lg">
      <h2 className="font-bold">
        {editMode ? groceryList.name : 'Shopping list'}
      </h2>

      <h3 className="text-neutral-400">
        {editMode ? groceryList.date : printHumanReadableDate(new Date())}
      </h3>

      <div>
        <input
          className="font-bold"
          ref={inputRef}
          type="text"
          id="name"
          placeholder="Fill in a name to remember"
          defaultValue={groceryList?.name}
        />
      </div>

      <h4>{items.length} Items</h4>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            className="bg-zinc-200 rounded-lg px-2 py-4 flex items-center gap-2"
            key={item}
          >
            {
              // TODO don't add a new item, just edit the item
            }
            <input className="bg-zinc-200" type="checkbox" />
            <input
              className="bg-zinc-200"
              type="text"
              defaultValue={item}
              onBlur={handleItem}
              onKeyDown={handleKeyDown}
            />
          </li>
        ))}
        <input
          type="text"
          placeholder="new item"
          onBlur={handleItem}
          onKeyDown={handleKeyDown}
        />
      </ul>
      <button
        className="bg-sky-500 hover:bg-sky-700 text-white py-2 px-4 rounded"
        onClick={handleSave}
      >
        Save
      </button>
      {
        // TODO this might be removed and all updates can be saved in near real time
      }
    </div>
  );
}
