import { TemplateList } from '../types/groceries-list';

type TemplatePickerProps = {
  templates?: TemplateList[];
  onSelect: (templateId: string) => void;
};

export function TemplatePicker({ templates, onSelect }: TemplatePickerProps) {
  if (templates === undefined) {
    return null;
  }

  return (
    <select
      className="w-full p-2 rounded-md border border-gray-300"
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select a template</option>
      {templates.map((item) => {
        return (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        );
      })}
    </select>
  );
}
