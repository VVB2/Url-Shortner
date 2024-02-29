import express from 'express'
import { generateURL } from '../controllers/generateController.js'
import { redirectURL } from '../controllers/redirectController.js'

const mainRouter = express.Router()

//@route - /api/v1/generate
mainRouter.post('/generate', generateURL)

//@route - /api/v1/[slug]
mainRouter.get('/:shortUrl', redirectURL)

export default mainRouter