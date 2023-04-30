import { useEffect, useRef, useState } from 'react';
import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '../queries/shopping-list';
import { GroceryItem, GroceryList } from '../types/groceries-list';
import { uuid } from '../utils/uuid';
import classNames from 'classnames';
import { debounce } from '../utils/debounce';

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
  // TODO optional date picker for days in future or past
  // TODO maybe show a toast when save is done? and refresh the list?
  // TODO use the new input value when saving?

  const [newInputValue, setNewInputValue] = useState<string>('');

  const [items, setItems] = useState<GroceryItem[]>(
    attachIds(groceryList?.items ?? []),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const editMode = groceryList !== undefined;

  useEffect(() => {
    setItems(attachIds(groceryList?.items ?? []));
  }, [editMode, groceryList]);

  const handleItem = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string | undefined,
  ) => {
    const { value } = event.target;

    if (value) {
      let newItem: GroceryItem;
      if (id) {
        if (items.find((item) => item.id === id)) {
          newItem = { name: value, fetched: false, id };
          handleSave(items.map((item) => (item.id === id ? newItem : item)));
        }
      } else {
        newItem = { name: value, fetched: false, id: uuid() };
        handleSave([...items, newItem]);
      }

      setNewInputValue('');
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string | undefined,
  ) => {
    if (event.key === 'Enter') {
      handleItem(event as any, id);
    }
  };

  const handleSave = debounce((items: GroceryItem[]) => {
    if (editMode) {
      console.log('saving the list: ', items);
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
  }, 200);

  const deleteList = () => {
    if (editMode) {
      deleteShoppingList(collectionId, groceryList.id ?? '');
    }
  };

  const handleDelete = (item: GroceryItem) => {
    handleSave(items.filter((i) => i.id !== item.id || i.name !== item.name));
  };

  const handleCheckbox = (itemId: string) => {
    handleSave(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            fetched: !item.fetched,
          };
        }
        return item;
      }),
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-2">
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
        {items
          .sort((a, b) => {
            return a.fetched === b.fetched ? 0 : a.fetched ? 1 : -1;
          })
          .map((item) => (
            <li
              className={classNames(
                'bg-rosey rounded-lg px-2 py-4 flex items-center gap-2',
                {
                  'line-through': item.fetched,
                },
              )}
              key={item.id}
            >
              <input
                checked={item.fetched}
                onChange={() => handleCheckbox(item.id ?? '')}
                className="bg-rosey"
                type="checkbox"
              />
              <input
                className="bg-rosey w-4/5 focus:outline-none"
                type="text"
                defaultValue={item.name}
                onChange={debounce((e) => handleItem(e, item.id), 1000)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
              />
              <span onClick={() => handleDelete(item)}>
                <i className="fa-regular fa-trash-can"></i>
              </span>
            </li>
          ))}
        <input
          className="p-2 rounded-lg text-lg border-primary border-2"
          type="text"
          placeholder="new item"
          value={newInputValue}
          onChange={(e) => setNewInputValue(e.target.value)}
          onBlur={(e) => handleItem(e, undefined)}
          onKeyDown={(e) => handleKeyDown(e, undefined)}
        />
      </ul>
      <div className="flex gap-2">
        {editMode && (
          <button
            className="bg-rose-200 hover:bg-rose-700 text-white py-2 px-4 rounded"
            onClick={deleteList}
          >
            Delete
          </button>
        )}
        {
          // TODO conver this button to a icon on the top right etc
        }
      </div>

      {
        // TODO this might be removed and all updates can be saved in near real time
      }
    </div>
  );
}
