import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs"

const router = express.Router()

// Upload folder backend me ensure karo
const uploadDir = "public/uploads/catalogs"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Multer config
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

// POST /api/upload
router.post("/", upload.single("file"), (req, res) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:5000"
  const fileUrl = `${baseUrl}/uploads/catalogs/${req.file.filename}`
  res.json({ url: fileUrl })
})

export default router
