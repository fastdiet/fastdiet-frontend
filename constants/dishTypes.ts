import { TFunction } from "i18next";

export  const getDishTypesOptions = (t: TFunction) => [
    { id: '1', label: t('constants.meals.breakfast'), value: 'Breakfast' },
    { id: '2', label: t('constants.meals.lunch'), value: 'Lunch' },
    { id: '3', label: t('constants.meals.dinner'), value: 'Dinner' },
];

