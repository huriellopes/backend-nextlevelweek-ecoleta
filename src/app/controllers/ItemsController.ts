import { Request, Response } from 'express'
import knex from '../../database/connection'

class ItemsController {
  async index(_req: Request, res: Response) {
    const items = await knex('items').select('*')

    const serializedItems = items.map(item => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.0.160:3333/uploads/${item.image}`
      }
    })

    return res.status(200).json({ status: 200, serializedItems })
  }
}

export default ItemsController
