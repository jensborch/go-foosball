export function toLocaleDateString(
  date: string | undefined
): string | undefined {
  return date === undefined ? undefined : new Date(date).toLocaleDateString();
}

export function responsiveTxt(
  txt: string | null | undefined,
  length: number
): string {
  return txt
    ? txt.substring(0, length) + (txt.length > length ? "..." : "")
    : "";
}
