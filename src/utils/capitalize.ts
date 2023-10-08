// Capitalizes the first character of a string
export const capitalize = (str: string) => {
  const firstCharacter = str.charAt(0).toUpperCase();
  const firstCharacterRemoved = str.slice(1);

  const capitalized = firstCharacter + firstCharacterRemoved;

  return capitalized;
};
