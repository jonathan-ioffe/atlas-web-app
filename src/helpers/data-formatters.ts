export const getElapsedTime = (epochTimestamp: number) => {
  return Number((Date.now() / 1000 - epochTimestamp).toFixed(0))
}
