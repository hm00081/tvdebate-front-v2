export default {
  textClear(text: string) {
    const reSpace = new RegExp(/\s{2,}/, 'gi');
    const reDot = new RegExp(/\.{2,}/, 'gi');
    return text
      .trim()
      .replace(reSpace, ' ')
      .replace(reDot, '.')
      .replace(':', '');
  }
};
