export function generateUrlParams(
  params: Record<
    string,
    string | number | boolean | Array<string | number | boolean> | undefined
  >
): string {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((v) => urlParams.append(key, String(v)));
      } else {
        urlParams.append(key, String(value));
      }
    }
  }
  const paramString = urlParams.toString();
  return paramString ? `?${paramString}` : "";
}
