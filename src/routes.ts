import express from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import multer from 'multer'
import multerConfig from './config/multer'

import PointsController from './app/controllers/PointsController'
import ItemsController from './app/controllers/ItemsController'

const routes = express.Router()
const upload = multer(multerConfig)

const pointsController = new PointsController()
const itemsController = new ItemsController()

routes.get('/items', itemsController.index)

routes.get(
  '/points',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      city: Joi.string().required(),
      uf: Joi.string().required(),
      items: Joi.string().required()
    })
  }, {
    abortEarly: false
  }),
  pointsController.index
)
routes.get(
  '/points/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required()
    })
  },{
    abortEarly: false
  }),
  pointsController.show
)
routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required().pattern(new RegExp('^[1-6]$'))
    })
  }, {
    abortEarly: false
  }),
  pointsController.create
)

export default routes
