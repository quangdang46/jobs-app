export function convertSearchParamsToQueryString(
  searchParams: Record<string, string | string[] | undefined>
) {
  const searchParamsString = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        searchParamsString.append(key, v);
      });
    } else {
      if (value) {
        searchParamsString.set(key, value);
      }
    }
  });
  return searchParamsString.toString();
}
