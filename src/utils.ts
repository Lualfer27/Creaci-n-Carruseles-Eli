export function generateRandomColorSequence(count: number, palette: { name: string, hex: string }[]) {
  const result: { name: string, hex: string }[] = [];
  let lastIndex = -1;
  const n = palette.length;

  for (let i = 0; i < count; i++) {
    // Try to pick a color different from the last one
    let candidateIndex = Math.floor(Math.random() * n);
    if (n > 1) {
      while (candidateIndex === lastIndex) {
        candidateIndex = Math.floor(Math.random() * n);
      }
    }
    result.push(palette[candidateIndex]);
    lastIndex = candidateIndex;
  }
  return result;
}
