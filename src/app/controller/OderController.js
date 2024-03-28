import * as Yup from 'yup'
import Products from '../models/Products'
import Category from '../models/Category'
import Order from '../schemas/Order'
import User from '../models/User'


class OrderController{
    async store(req, res){

        const schema = Yup.object().shape({
            products: Yup.array().required().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                    quantity: Yup.number().required()
                })
            )
        })

        try{
            await schema.validateSync(req.body, {abortEarly: false})
        }catch(err){
            return res.status(400).json({error: err.errors})
        }

        const productsId = req.body.products.map((product)=>product.id)

        const updateProducts = await Products.findAll({
            where:{
                id: productsId,
            },
            include:[
                { 
                    model: Category,
                    as: 'category',
                    attributes:['name'],
                }
            ]
        })

        const editedProduct = updateProducts.map((product)=>{

            const productFindIndex = req.body.products.findIndex( requestProducts => requestProducts.id === product.id)

            const newProducts= {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                url: product.url,
                quantity:  req.body.products[productFindIndex].quantity
            }

            return newProducts
        })
        
        const order = {
            user:{
                id:req.userId,
                name: req.username
            },
            products: editedProduct,
            status: 'pedido realizado'
        }

        const orderResponde = await Order.create(order)

        return res.status(201).json(orderResponde)
    }

    async index(req,res){
        const orders = await Order.find()
        return res.json(orders)
    }


    async update(req, res){

        const schema = Yup.object().shape({
            status: Yup.string().required()
        })

        try{
            await schema.validateSync(req.body, {abortEarly: false})
        }catch(err){
            return res.status(400).json({error: err.errors})
        }

        const {admin: isAdmin} = await User.findByPk(req.userId)

        if(!isAdmin){
            return res.status(401).json()
        }

        const {id} = req.params
        const {status} = req.body

        try{
            await Order.updateOne({_id: id},{status})
        }catch(err){
            return res.status(400).json({error: err.message})
        }

        return res.status(200).json({message:'Status updated'})
    }
}

export default new OrderController()