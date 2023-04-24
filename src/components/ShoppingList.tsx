import { useEffect, useRef, useState } from 'react';
import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '../queries/shopping-list';
import { GroceryItem, GroceryList } from '../types/groceries-list';
import { throttle } from '../utils/throttle';
import { uuid } from '../utils/uuid';

function printHumanReadableDate(date: Date) {
  return date.toLocaleDateString(); // TODO this makes us dependent on the locale of the user
}

type ShoppingListProps = { collectionId: string; groceryList?: GroceryList };

function attachIds(items: GroceryItem[]) {
  return items.map((i) => {
    return {
      ...i,
      id: uuid(),
    };
  });
}

export function ShoppingList({ collectionId, groceryList }: ShoppingListProps) {
  // TODO clear bottom input when handleItem is called
  // TODO styling of the bottom input
  // TODO add checkboxes functionality and styling with strikethrough
  // TODO styling, get rid of inputs active borders and add some padding
  // TODO optional date for days in future or past
  const [items, setItems] = useState<GroceryItem[]>(
    attachIds(groceryList?.items ?? []),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const editMode = groceryList !== undefined;

  useEffect(() => {
    setItems(attachIds(groceryList?.items ?? []));
  }, [editMode, groceryList]);

  const handleItem = throttle((event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value) {
      if (!items.find((item) => item.name === value)) {
        setItems([...items, { name: value, fetched: false, id: uuid() }]);
      }
    }
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleItem(event as any);
    }
  };

  const handleSave = () => {
    if (editMode) {
      updateShoppingList({
        ...groceryList,
        items,
      });
    } else {
      createShoppingList(collectionId, {
        name:
          inputRef.current?.value ||
          `Market for ${printHumanReadableDate(new Date())}`,
        date: printHumanReadableDate(new Date()),
        items,
      });
    }
  };

  const deleteList = () => {
    if (editMode) {
      deleteShoppingList(collectionId, groceryList.id ?? '');
    }
  };

  const handleDelete = (item: GroceryItem) => {
    setItems(items.filter((i) => i.id !== item.id || i.name !== item.name));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <h2 className="font-bold">{!editMode && 'New shopping list'}</h2>

      <div className="flex">
        <input
          className="font-bold"
          ref={inputRef}
          type="text"
          id="name"
          placeholder="Fill in a name to remember"
          defaultValue={groceryList?.name}
        />

        <h3 className="text-neutral-400">
          {editMode ? groceryList.date : printHumanReadableDate(new Date())}
        </h3>
      </div>

      <h4>{items.length} Items</h4>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li
            className="bg-zinc-200 rounded-lg px-2 py-4 flex items-center gap-2"
            key={item.id}
          >
            {
              // TODO don't add a new item, just edit the item
            }
            <input className="bg-zinc-200" type="checkbox" />
            <input
              className="bg-zinc-200 w-4/5"
              type="text"
              defaultValue={item.name}
              onBlur={handleItem}
              onKeyDown={handleKeyDown}
            />
            <span onClick={() => handleDelete(item)}>
              <i className="fa-regular fa-trash-can"></i>
            </span>
          </li>
        ))}
        <input
          type="text"
          placeholder="new item"
          onBlur={handleItem}
          onKeyDown={handleKeyDown}
        />
      </ul>
      <div className="flex gap-2">
        <button
          className="bg-sky-500 hover:bg-sky-700 text-white py-2 px-4 rounded"
          onClick={handleSave}
        >
          Save
        </button>
        {editMode && (
          <button
            className="bg-rose-500 hover:bg-rose-700 text-white py-2 px-4 rounded"
            onClick={deleteList}
          >
            Delete
          </button>
        )}
      </div>

      {
        // TODO this might be removed and all updates can be saved in near real time
      }
    </div>
  );
}
