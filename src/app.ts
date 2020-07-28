import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import cors from 'cors'
import compression from 'compression'
import routes from './routes'
import { errors } from 'celebrate'

dotenv.config()

const app = express()

app.use(cors()) // origin: 'https://www.site.com.br'
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors())

export default app
