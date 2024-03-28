import Sequelize from "sequelize";
import mongoose from "mongoose";

import User from "../app/models/User"

import configDatabase from "../config/database"
import Products from "../app/models/Products";
import Category from '../app/models/Category'


const models = [User, Products, Category]



class Database {
    constructor(){
        this.init()
        this.mongo()

    }
    init(){
        this.connection = new Sequelize(configDatabase)
        models.map( model=>model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models))
    }
    
    mongo(){
        this.mongoConnection= mongoose.connect(process.env.URL_MONGO)
        .then(()=>console.log('mongo connected ...'))
        .catch((err)=>console.log(err))
    }
}
export default new Database()
