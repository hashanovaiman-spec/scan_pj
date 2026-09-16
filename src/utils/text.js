export const formatDate = (value) => {
  if (!value) return '';

  return new Intl.DateTimeFormat('ru-RU').format(
    new Date(value)
  );
};

const decodeEntities = (value = '') => {
  if (!value) return '';

  const textarea = document.createElement('textarea');
  let result = value;

  for (let i = 0; i < 3; i += 1) {
    textarea.innerHTML = result;
    const decoded = textarea.value;

    if (decoded === result) {
      break;
    }

    result = decoded;
  }

  return result;
};

export const stripMarkup = (markup = '') => {
  const decoded = decodeEntities(markup);

  const prepared = decoded
    .replace(/<\/?(sentence|entity|scandoc)[^>]*>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ');

  const doc = new DOMParser().parseFromString(
    prepared,
    'text/html'
  );

  return (doc.body.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const extractImageUrl = (markup = '') => {
  const decoded = decodeEntities(markup);

  const doc = new DOMParser().parseFromString(
    decoded,
    'text/html'
  );

  const image = doc.querySelector('img');

  return image?.getAttribute('src') || '';
};
