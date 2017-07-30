export const TextDecoPlugin = (element, value) => {
  const text = $(element).text();

  $(element).text(text === '없음' ? '없는 항목입니다.' : `+ ${text} +`);
};