export const getShortSummary = (htmlString?: string, sentenceLimit = 2): string => {
  if (!htmlString) return "";

  let text = htmlString.replace(/<[^>]+>/g, ' ');

  text = text.replace(/\s\s+/g, ' ').trim();

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  return sentences.slice(0, sentenceLimit).join(' ').trim();
};


export const formatAmount = (amount: number) => {
  if (amount < 1) {
    return parseFloat(amount.toFixed(2)).toString();
  }

  if (amount < 10) {
    return parseFloat(amount.toFixed(1)).toString();
  }

  return Math.round(amount).toString();
};