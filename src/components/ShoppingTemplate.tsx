import {
  createShoppingTemplate,
  deleteTemplate,
  updateTemplate,
} from '../queries/templates';
import { GroceryItem, TemplateList } from '../types/groceries-list';
import { printHumanReadableDate } from '../utils/date';
import { ShoppingList } from './ShoppingList';

export type TemplateListProps = {
  collectionId: string;
  template?: TemplateList;
};

function saveTemplate(
  items: GroceryItem[],
  editMode: boolean,
  collectionId: string,
  groceryList?: TemplateList,
  listName?: string,
) {
  if (groceryList !== undefined && editMode) {
    updateTemplate({
      ...groceryList,
      items,
    });
  } else {
    createShoppingTemplate(collectionId, {
      name: listName || `Template for ${printHumanReadableDate(new Date())}`,
      date: printHumanReadableDate(new Date()),
      items,
    });
  }
}

export function ShoppingTemplate({
  collectionId,
  template,
}: TemplateListProps) {
  return (
    <ShoppingList
      templateMode={true}
      collectionId={collectionId}
      groceryList={template}
      saveFn={saveTemplate}
      deleteFn={deleteTemplate}
    />
  );
}
