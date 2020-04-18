export const getElapsedTime = (epochTimestamp?: number) => {
  if (epochTimestamp != null)
    return Number((Date.now() / 1000 - epochTimestamp).toFixed(0))
  return 0
}
