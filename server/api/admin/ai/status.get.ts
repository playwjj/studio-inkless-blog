export default defineEventHandler(async (event) => {
  await requireAuth(event)
  return { available: isAIAvailable(event) }
})
