const startYear = 1883;
const endYear = 2173;
const hijriStartYear = 1350;
const hijriEndYear = 1599;

export const MILADY_YEARS_ARRAY: number[] = [];

export const HIJRI_YEARS_ARRAY: number[] = [];

export const MILADY_MONTHS_ARRAY: { name: string; numberOfDays: number }[] = [
  { name: 'january', numberOfDays: 31 },
  { name: 'february', numberOfDays: 28 },
  { name: 'march', numberOfDays: 31 },
  { name: 'april', numberOfDays: 30 },
  { name: 'may', numberOfDays: 31 },
  { name: 'june', numberOfDays: 30 },
  { name: 'july', numberOfDays: 31 },
  { name: 'august', numberOfDays: 31 },
  { name: 'september', numberOfDays: 30 },
  { name: 'october', numberOfDays: 31 },
  { name: 'november', numberOfDays: 30 },
  { name: 'december', numberOfDays: 31 },
];
export const HIJRI_MONTHS_ARRAY: string[] = [
  'muharram',
  'safar',
  'rabi_1',
  'rabi_2',
  'jumada_1',
  'jumada_2',
  'rajab',
  'shaaban',
  'ramadan',
  'shawwal',
  'dhu_al_qidah',
  'dhu_al_hijjah',
];

for (let year = startYear; year <= endYear; year++) {
  MILADY_YEARS_ARRAY.push(year);
}

for (let year = hijriStartYear; year <= hijriEndYear; year++) {
  HIJRI_YEARS_ARRAY.push(year);
}
