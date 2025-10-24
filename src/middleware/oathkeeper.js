import jwt from "jsonwebtoken"
import jwksClient from "jwks-rsa"

const client = jwksClient({
  jwksUri: process.env.HYDRA_JWKS_URL || "http://localhost:4444/.well-known/jwks.json",
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err, null)
    const signingKey = key.getPublicKey()
    callback(null, signingKey)
  })
}

/**
 * ✅ Middleware:
 * 1. Ensure request aaya hai Oathkeeper se
 * 2. Hydra JWT verify karo
 * 3. JWT claims vs Oathkeeper headers match check karo
 */
export const verifyOathkeeper = (req, res, next) => {

  // Step 1: Ensure request Oathkeeper se hi aayi hai
  if (req.headers["x-proxy"] !== "oathkeeper") {
    return res.status(403).json({ message: "Access only via Oathkeeper proxy" })
  }

  const userHeader = req.headers["x-oathkeeper-user"]
  const roleHeader = req.headers["x-oathkeeper-role"]

  // Step 2: JWT extract from Authorization
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" })
  }

  const token = authHeader.split(" ")[1]

  // Step 3: Verify Hydra JWT
  jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message)
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    // Step 4: Compare Hydra claims vs Oathkeeper headers
    const jwtSub = decoded.sub
    const jwtRole = decoded.ext?.role || decoded.role

    if (jwtSub !== userHeader) {
      return res.status(403).json({ message: "User mismatch between Hydra token and Oathkeeper headers" })
    }

    if (jwtRole !== roleHeader) {
      return res.status(403).json({ message: "Role mismatch between Hydra token and Oathkeeper headers" })
    }

    // Step 5: Attach safe user to request
    req.user = {
      id: jwtSub,
      role: jwtRole,
      projects: decoded.ext?.projects || [],
      token: decoded,
    }

    next()
  })
}
