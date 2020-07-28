import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

export default {
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, path.resolve(__dirname, '..', '..', 'uploads', 'points'))
    },
    filename: (request, file, callback) => {
      const hash = crypto.randomBytes(6).toString('hex')

      const fileName = `${hash}-${file.originalname}`

      callback(null, fileName)
    }
  })

  
}
