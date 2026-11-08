export const normalizeEmail = ({ value }: { value: unknown }) => {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
};

export const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;
