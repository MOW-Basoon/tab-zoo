// Chrome compares at most four numeric components, treating missing ones as zero.
function components(version) {
  if (typeof version !== 'string' || !/^(?:0|[1-9]\d{0,4})(?:\.(?:0|[1-9]\d{0,4})){0,3}$/.test(version)) {
    throw new Error(`Invalid Chrome version: ${version}`);
  }
  const numbers = version.split('.').map(Number);
  if (numbers.some(n => n > 65535) || numbers.every(n => n === 0)) {
    throw new Error(`Invalid Chrome version: ${version}`);
  }
  return numbers;
}

export function compareVersions(left, right) {
  const a = components(left);
  const b = components(right);
  for (let i = 0; i < 4; i++) {
    const difference = (a[i] ?? 0) - (b[i] ?? 0);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}
