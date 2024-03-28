import {Router} from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controller/UserController'
import SessionController from './app/controller/SessionController'
import ProductController from './app/controller/ProductController'
import authMiddleware from './app/middleware/auth'
import CategoryController from './app/controller/CategoryController'
import OderController from './app/controller/OderController'

const upload = multer(multerConfig)

const routes = new Router()

routes.post('/users',UserController.store)
routes.post('/sessions',SessionController.store)
 
routes.use(authMiddleware)

routes.post('/products',upload.single('file'), ProductController.store)
routes.get('/products', ProductController.index)
routes.put('/products/:id', upload.single('file'), ProductController.update)

routes.post('/categories', upload.single('file'), CategoryController.store)
routes.get('/categories', CategoryController.index)
routes.put('/categories/:id', upload.single('file'), CategoryController.update)

routes.post('/orders',OderController.store)
routes.put('/orders/:id',OderController.update)
routes.get('/orders',OderController.index)

export default routes