import { Router, type Router as ExpressRouter } from 'express'

const healthRouter: ExpressRouter = Router()

healthRouter.get('/', (_request, response) => {
  response.json({ status: 'ok' })
})

export default healthRouter
