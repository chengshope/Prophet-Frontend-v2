export function addUniqueId(existingIds, newId) {
  if (!Array.isArray(existingIds)) {
    throw new Error('existingIds must be an array');
  }
  return Array.from(new Set([...existingIds, newId]));
}
