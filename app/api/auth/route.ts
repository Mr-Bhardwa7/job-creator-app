export async function POST(request: Request) {
  try {
    const { username, authKey } = await request.json()

    // Validate input
    if (!username || !authKey) {
      return Response.json({ error: "Username and authKey are required" }, { status: 400 })
    }

    // Mock authentication - simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock token generation
    const now = Math.floor(Date.now() / 1000)
    const token = `mock_token_${username}_${Date.now()}`

    return Response.json(
      {
        token,
        expiresIn: 3600,
        issueAt: now,
        issuer: "Job Creator API",
        tokenType: "Bearer",
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json({ error: "Authentication failed" }, { status: 500 })
  }
}
