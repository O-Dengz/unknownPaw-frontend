export const resolvePreviewSrc = (raw: string) => {
  if (!raw) return ''
  if (raw.startsWith('blob:') || raw.startsWith('http')) return raw
  if (raw.startsWith('/')) return `http://localhost:8080${raw}`
  return `http://localhost:8080/unknownPaw/${raw}`
}
