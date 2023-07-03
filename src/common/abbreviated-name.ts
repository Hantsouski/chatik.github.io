export const abbreviatedName = (name: string | undefined) => {
  if (!name) {
    return '👻';
  }

  const words = name.split(' ');

  return `${words[0][0]} ${words.length > 1 ? words[words.length - 1]?.[0] : ''}`;
};
