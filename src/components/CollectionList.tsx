import { GroceryLists } from '../types/groceries-list';

export type CollectionListProps = {
  collections: Array<GroceryLists>;
  onChange?: (collection: GroceryLists) => void;
};

export function CollectionList({ collections, onChange }: CollectionListProps) {
  return (
    <select
      className="text-primary bg-primary-background"
      onChange={(e) => {
        const selectedCollection = collections.find(
          (collection) => collection.id === e.target.value,
        );
        if (selectedCollection) {
          onChange && onChange(selectedCollection);
        }
      }}
    >
      {collections.map((collection) => (
        <option key={collection.id} value={collection.id}>
          {collection.name}
        </option>
      ))}
    </select>
  );
}
