export function formatPropertyTitle(title?: string | null, lsId?: string | null): string {
  if (!title) return '';
  if (!lsId) return title;
  return `${lsId} | ${title}`;
}
