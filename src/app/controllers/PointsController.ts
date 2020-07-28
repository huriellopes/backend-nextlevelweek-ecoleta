import { Request, Response } from 'express'
import knex from '../../database/connection'

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('points.city', String(city))
      .where('points.uf', String(uf))
      .distinct()
      .select('points.*')

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.0.109:3333/uploads/points/${point.image}`
      }
    })

    return res.status(200).json({ status: 200, serializedPoints })
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    try {
      const point = await knex('points').where('id', id).first()

      if (!point) return res.status(404).json({ status: 404, error: 'Point not found' })

      const serializedPoint = {
        ...point,
        image_url: `http://192.168.0.109:3333/uploads/points/${point.image}`
      }

      const items = await knex('items')
        .join('point_items', 'items.id', '=', 'point_items.item_id')
        .where('point_items.point_id', id)
        .select('items.title')

      return res.status(200).json({ status: 200, serializedPoint, items })
    } catch (err) {
      return res.status(400).json({ status: 400, error: 'Points list failed' })
    }
  }

  async create(req: Request, res: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body

    const trx = await knex.transaction()
    try {
      const point = {
        image: req.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
      }

      const insertedIds = await trx('points').insert(point)

      const point_id = insertedIds[0]

      const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
          return {
            item_id,
            point_id,
          }
      })

      await trx('point_items').insert(pointItems)

      await trx.commit()

      return res.status(201).json({ status: 201, data: {id: point_id,...point} })
    } catch (err) {
      await trx.rollback()
      return res.status(400).json({ status: 400, error: 'Points created failed' })
    }
  }
}

export default PointsController
