function validateUrl(url) {
  // eslint-disable-next-line no-useless-escape
  const regex = /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i;
  if (regex.test(url)) {
    return url;
  }
  throw new Error('Введен некорректный url');
}

module.exports = { validateUrl };

// /https?:\/\/(www\.)?[0-9a-z\-\._~:\/?#\[]@!$&'\(\)*\+,;=]{2,}#?$/i
