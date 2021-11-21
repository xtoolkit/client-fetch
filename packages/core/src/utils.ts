export function cloneValue(value: any): any {
  if (Array.isArray(value)) {
    return value.map(x => cloneValue(x));
  }
  if (value === null) return null;
  const vt = typeof value;
  if (vt === 'string') return '' + value;
  if (vt === 'object') {
    const o: Record<string, any> = {};
    for (const key in value) {
      o[key] = cloneValue(value[key]);
    }
    return o;
  }
  return value;
}

export function deepMergeObject(
  a: Record<string, any>,
  b: Record<string, any>
) {
  const ia = cloneValue(a);
  const ib = cloneValue(b);
  for (const key in ib) {
    const tb = typeof ib[key];
    const ta = typeof ia[key];
    if (
      (ta === 'undefined' && tb !== 'undefined') ||
      tb !== 'object' ||
      ib[key] === null
    ) {
      ia[key] = ib[key];
    } else if (tb === 'object') {
      ia[key] =
        ta === 'object' && ia[key] !== null
          ? deepMergeObject(ia[key], ib[key])
          : ib[key];
    }
  }
  return ia;
}
