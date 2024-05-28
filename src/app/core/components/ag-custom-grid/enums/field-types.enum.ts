export const FieldTypes = {
  text: 'text',
  number: 'number',
  rangeNumber: 'rangNumber',
  rangeDate: 'rangeDate',
  radio: 'radio',
  select: 'select',
} as const;
type FieldTypesKeys = keyof typeof FieldTypes;
export type FieldTypesValues = (typeof FieldTypes)[FieldTypesKeys];
