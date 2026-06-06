/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images')
const BACKUP_DIR = path.join(__dirname, '..', 'public', 'images', '_original')
const SUBFOLDER = process.argv[2] || ''
const TARGET_DIR = SUBFOLDER ? path.join(IMAGES_DIR, SUBFOLDER) : IMAGES_DIR
const BACKUP_TARGET = SUBFOLDER ? path.join(BACKUP_DIR, SUBFOLDER) : BACKUP_DIR

async function compress() {
  if (!fs.existsSync(BACKUP_TARGET)) fs.mkdirSync(BACKUP_TARGET, { recursive: true })

  const files = fs.readdirSync(TARGET_DIR).filter(f =>
    /\.(jpg|jpeg|png)$/i.test(f) && !f.startsWith('.')
  )

  console.log(`📦 Found ${files.length} images to compress\n`)

  let totalBefore = 0
  let totalAfter = 0

  for (const file of files) {
    const filePath = path.join(TARGET_DIR, file)
    const backupPath = path.join(BACKUP_TARGET, file)

    // Backup original
    if (!fs.existsSync(backupPath)) fs.copyFileSync(filePath, backupPath)

    const before = fs.statSync(filePath).size
    totalBefore += before

    const ext = path.extname(file).toLowerCase()
    const isJPEG = ext === '.jpg' || ext === '.jpeg'

    try {
      const image = sharp(backupPath)
      const metadata = await image.metadata()

      // Resize if width > 1400px
      const targetWidth = Math.min(metadata.width || 1400, 1400)

      let pipeline = image.resize(targetWidth, null, { withoutEnlargement: true })

      if (isJPEG) {
        pipeline = pipeline.jpeg({ quality: 75, mozjpeg: true })
      } else {
        // PNG: convert to JPEG-style compression unless has transparency
        const hasAlpha = metadata.hasAlpha
        if (hasAlpha) {
          pipeline = pipeline.png({ quality: 75, compressionLevel: 9, palette: true })
        } else {
          // No alpha - save as PNG with palette
          pipeline = pipeline.png({ quality: 75, compressionLevel: 9, palette: true })
        }
      }

      await pipeline.toFile(filePath + '.tmp')

      // Replace original
      fs.unlinkSync(filePath)
      fs.renameSync(filePath + '.tmp', filePath)

      const after = fs.statSync(filePath).size
      totalAfter += after

      const reduction = ((before - after) / before * 100).toFixed(1)
      console.log(`✓ ${file}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${reduction}%)`)
    } catch (e) {
      console.error(`✗ ${file}: ${e.message}`)
    }
  }

  const totalReduction = ((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)
  console.log(`\n🎉 Total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB (-${totalReduction}%)`)
}

compress()
