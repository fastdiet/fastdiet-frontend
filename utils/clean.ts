export const getShortSummary = (htmlString?: string, sentenceLimit = 2): string => {
  if (!htmlString) return "";

  let text = htmlString.replace(/<[^>]+>/g, ' ');

  text = text.replace(/\s\s+/g, ' ').trim();

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  return sentences.slice(0, sentenceLimit).join(' ').trim();
};