import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

import User from '../models/User'

class SessionController{
    async store(req,res){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        })

        const userEmailOrPasswordIncorrect = ()=>{
            return res.status(400).json({error: "make sure your password or email are current"})
        }

        if( !(await schema.isValid(req.body)))userEmailOrPasswordIncorrect()
        
        const {email, password} = req.body
        
        const user = await User.findOne({
            where:{email}
        })

        if(!user)userEmailOrPasswordIncorrect()

        if(!(await user.checkPassword(password))){
            return res.status(401).json({error: "make sure your password or email are current"})
        }

        return res.status(200).json({
            id: user.id, 
            email,
            name: user.name,
            admin: user.admin,
            token: jwt.sign({id: user.id,name: user.name},authConfig.secret,{
                expiresIn: authConfig.expiresIn
            })
        })
    }
}

export default new SessionController()