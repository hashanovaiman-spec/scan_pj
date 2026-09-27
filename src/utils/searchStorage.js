const SEARCH_STORAGE_KEY = 'scan:lastSearch';

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
};

export const saveLastSearch = ({ form, payload }) => {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(
      SEARCH_STORAGE_KEY,
      JSON.stringify({ form, payload })
    );
  } catch {
    // Если sessionStorage недоступен, поиск всё равно продолжит работать.
  }
};

export const loadLastSearch = () => {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(SEARCH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object' || !parsed.payload) {
      return null;
    }

    return {
      form: parsed.form && typeof parsed.form === 'object' ? parsed.form : null,
      payload: parsed.payload,
    };
  } catch {
    return null;
  }
};

export const clearLastSearch = () => {
  const storage = getStorage();
  if (!storage) return;

  storage.removeItem(SEARCH_STORAGE_KEY);
};
