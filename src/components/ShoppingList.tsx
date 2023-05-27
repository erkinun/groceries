import { useEffect, useRef, useState } from 'react';
import {
  createShoppingList,
  deleteShoppingList,
  updateShoppingList,
} from '../queries/shopping-list';
import {
  GroceryItem,
  GroceryList,
  TemplateList,
} from '../types/groceries-list';
import { uuid } from '../utils/uuid';
import classNames from 'classnames';
import { debounce } from '../utils/debounce';
import Modal from './Modal';
import { useDrag, useDrop } from 'react-dnd';
import { printHumanReadableDate } from '../utils/date';
import { TemplatePicker } from './TemplatePicker';

type ShoppingListProps = {
  collectionId: string;
  groceryList?: GroceryList;
  saveFn?: (
    items: GroceryItem[],
    editMode: boolean,
    collectionId: string,
    groceryList?: GroceryList,
    listName?: string,
  ) => void;
  deleteFn?: (collectionId: string, listId: string) => void;
  templateMode?: boolean;
  templates: TemplateList[];
};

function attachIds(items: GroceryItem[]) {
  return items.map((i) => {
    return {
      ...i,
      id: uuid(),
    };
  });
}

// default function to save a shopping list
function saveShoppingList(
  items: GroceryItem[],
  editMode: boolean,
  collectionId: string,
  groceryList?: GroceryList,
  listName?: string,
) {
  if (groceryList !== undefined && editMode) {
    updateShoppingList({
      ...groceryList,
      items,
    });
  } else {
    createShoppingList(collectionId, {
      name: listName || `Market for ${printHumanReadableDate(new Date())}`,
      date: printHumanReadableDate(new Date()),
      items,
    });
  }
}

export function ShoppingList({
  collectionId,
  groceryList,
  saveFn = saveShoppingList,
  deleteFn = deleteShoppingList,
  templateMode = false,
  templates = [],
}: ShoppingListProps) {
  // TODO optional date picker for days in future or past
  // TODO maybe show a toast when save is done? and refresh the list?
  // TODO use the new input value when saving?

  const [newInputValue, setNewInputValue] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [items, setItems] = useState<GroceryItem[]>(
    attachIds(groceryList?.items ?? []),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const editMode = groceryList !== undefined;

  useEffect(() => {
    setItems(attachIds(groceryList?.items ?? []));
  }, [editMode, groceryList]);

  const innerSave = (items: GroceryItem[]) => {
    saveFn(items, editMode, collectionId, groceryList, inputRef.current?.value);
  };

  const deleteList = () => {
    if (editMode) {
      deleteFn(collectionId, groceryList.id ?? '');
    }
  };

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

  const handleSave = debounce(innerSave, 200);

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

  const handleReorder = (draggId: string, hoverId: string) => {
    const dragItem = items.find((item) => item.id === draggId);
    const hoverItem = items.find((item) => item.id === hoverId);
    if (dragItem && hoverItem) {
      const dragIndex = items.indexOf(dragItem);
      const hoverIndex = items.indexOf(hoverItem);
      const newItems = [...items];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, dragItem);
      setItems(newItems);
      handleSave(newItems);
    }
  };

  const templateSelect = (templateId: string) => {
    console.log(`selected ${templateId}`);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      const newItems = items.concat(template.items);
      setItems(newItems);
      handleSave(newItems);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col gap-2">
      <h2 className="font-bold">
        {!editMode &&
          (templateMode ? 'New shopping template' : 'New shopping list')}
      </h2>

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

      {!templateMode && (
        <TemplatePicker templates={templates} onSelect={templateSelect} />
      )}

      <input
        className="p-2 rounded-lg text-lg border-primary border-2"
        type="text"
        placeholder="new item"
        value={newInputValue}
        onChange={(e) => setNewInputValue(e.target.value)}
        onBlur={(e) => handleItem(e, undefined)}
        onKeyDown={(e) => handleKeyDown(e, undefined)}
      />

      <h4>{items.length} Items</h4>
      <ul className="flex flex-col gap-2">
        {items
          .sort((a, b) => {
            return a.fetched === b.fetched ? 0 : a.fetched ? 1 : -1;
          })
          .map((item) => (
            <DropItem
              key={item.id}
              item={item}
              handleCheckbox={handleCheckbox}
              handleItem={handleItem}
              handleKeyDown={handleKeyDown}
              handleDelete={handleDelete}
              handleReorder={handleReorder}
            />
          ))}
      </ul>
      <div className="flex justify-end gap-2">
        {editMode && (
          <button
            className="bg-rose-200 hover:bg-rose-700 text-white py-2 px-4 rounded"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </button>
        )}
        {editMode &&
          deleteModal(deleteModalOpen, setDeleteModalOpen, deleteList)}
        {
          // TODO conver this button to a icon on the top right etc
        }
      </div>
    </div>
  );
}

type ItemProps = {
  item: GroceryItem;
  handleCheckbox: (itemId: string) => void;
  handleItem: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string | undefined,
  ) => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    id: string | undefined,
  ) => void;
  handleDelete: (item: GroceryItem) => void;
};

function DropItem(
  props: ItemProps & {
    handleReorder: (dragId: string, hoverId: string) => void;
  },
) {
  const [, drop] = useDrop(() => ({
    accept: 'shopping-item',
    drop: (item: any) => {
      console.log({ item, original: props.item });
      props.handleReorder(item.id, props.item.id ?? '');
    },
  }));

  return (
    <div ref={drop}>
      <Item {...props} />
    </div>
  );
}

function Item({
  item,
  handleCheckbox,
  handleItem,
  handleKeyDown,
  handleDelete,
}: ItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'shopping-item',
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <li
      ref={item.fetched ? null : drag}
      className={classNames(
        'bg-rosey rounded-lg px-2 py-4 flex items-center gap-2',
        {
          'line-through': item.fetched,
          'opacity-50': isDragging,
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
  );
}

function deleteModal(
  deleteModalOpen: boolean,
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  deleteList: () => void,
) {
  return (
    <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
      <div className="p-4">
        <h2 className="font-bold">Are you sure?</h2>
        <p>
          This action is irreversible. You will lose all the items in this list.
        </p>
        <div className="mt-2 flex gap-2">
          <button
            className="bg-cream hover:bg-gray-700 text-white py-2 px-4 rounded"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-rose-200 hover:bg-rose-700 text-white py-2 px-4 rounded"
            onClick={() => {
              deleteList();
              setDeleteModalOpen(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
