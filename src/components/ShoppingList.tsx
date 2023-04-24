import { useEffect, useRef, useState } from 'react';
import {
  createShoppingList,
  updateShoppingList,
} from '../queries/shopping-list';
import { GroceryItem, GroceryList } from '../types/groceries-list';
import { throttle } from '../utils/throttle';
import { uuid } from '../utils/uuid';

function printHumanReadableDate(date: Date) {
  return date.toLocaleDateString();
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
  // TODO also might use the existing list to edit
  // TODO clear bottom input when handleItem is called
  // TODO add checkboxes functionality and styling with strikethrough
  // TODO handle the items id so that deletes edits etc can work properly
  // TODO styling, get rid of inputs active borders and add some padding
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
      updateShoppingList(collectionId, {
        ...groceryList,
        items,
      });
    } else {
      createShoppingList(collectionId, {
        name: inputRef.current?.value ?? 'Empty list name',
        date: printHumanReadableDate(new Date()),
        items,
      });
    }
  };

  const handleDelete = (item: GroceryItem) => {
    console.log({ item });
    setItems(items.filter((i) => i.id !== item.id || i.name !== item.name));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg">
      <h2 className="font-bold">{!editMode && 'Shopping list'}</h2>

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
