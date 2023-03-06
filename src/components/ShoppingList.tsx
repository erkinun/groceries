import { useState } from 'react';

function printHumanReadableDate(date: Date) {
  return date.toLocaleDateString();
}

export function ShoppingList() {
  // TODO use the shopping list type later on
  // TODO also might use the existing list to edit
  // TODO add checkboxes to the items
  // TODO clear bottom input when handleItem is called
  const [items, setItems] = useState<string[]>([]);

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

  // TODO remove the styling later on
  return (
    <div style={{ border: '1px solid black' }}>
      <h2>Shopping list</h2>

      <h3>{printHumanReadableDate(new Date())}</h3>

      <h4>Items</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>
            {
              // TODO don't add a new item, just edit the item
            }
            <input
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
    </div>
  );
}
