import i18n from "@/i18n";

export const getWeekDateRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const currentLanguage = i18n.language;
  const formatter = new Intl.DateTimeFormat(currentLanguage, {
    day: '2-digit',
    month: 'long',
  });
  
  return {
    startDate: formatter.format(monday),
    endDate: formatter.format(sunday),
  };
};