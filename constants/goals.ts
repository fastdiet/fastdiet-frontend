import { TFunction } from "i18next";

export const getGoalOptions = (t: TFunction) => [
  {
    id: '1',
    label: t("goal.lose_weight.title"),
    description: t("goal.lose_weight.description"),
    value: 'lose_weight',
  },
  {
    id: '2',
    label: t("goal.maintain_weight.title"),
    description: t("goal.maintain_weight.description"),
    value: 'maintain_weight',
  },
  {
    id: '3',
    label: t("goal.gain_weight.title"),
    description: t("goal.gain_weight.description"),
    value: 'gain_weight',
  },
];