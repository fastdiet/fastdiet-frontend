import { TFunction } from "i18next";


export const getGenderOptions = (t: TFunction) => [
  { id: '1', label: t("male"), value: 'male' },
  { id: '2', label: t("female"), value: 'female' },
];