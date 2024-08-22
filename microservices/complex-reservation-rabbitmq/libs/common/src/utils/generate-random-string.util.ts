export function generateRandomString(length = 13) {
  const charset = 'abcdefghijklmnopqrstuvwxyz_-';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}
