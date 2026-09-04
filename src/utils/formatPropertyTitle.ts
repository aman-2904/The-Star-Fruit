export function formatPropertyTitle(title?: string | null, lsId?: string | null): string {
  if (!title) return '';
  if (!lsId) return title;
  const displayId = lsId.replace(/^LS/i, 'LZ');
  return `${displayId} | ${title}`;
}
