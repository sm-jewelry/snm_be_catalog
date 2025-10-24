import app from "./src/app.js"
import mongoose from "mongoose"

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hydra-demo"

mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ MongoDB connected")
  app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`))
}).catch(err => console.error(err))
