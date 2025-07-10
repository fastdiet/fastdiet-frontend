import { TFunction } from "i18next";

export const getActivityOptions = (t: TFunction) => [
  {
    id: '1',
    label: t("activity.sedentary.title"),
    description: t("activity.sedentary.description"),
    value: 'sedentary',
  },
{
    id: '2',
    label: t("activity.light.title"),
    description: t("activity.light.description"),
    value: 'light',
},
{
    id: '3',
    label: t("activity.moderate.title"),
    description: t("activity.moderate.description"),
    value: 'moderate',
},
{
    id: '4',
    label: t("activity.high.title"),
    description: t("activity.high.description"),
    value: 'high',
},
{
    id: '5',
    label: t("activity.very_high.title"),
    description: t("activity.very_high.description"),
    value: 'very_high',
},
];