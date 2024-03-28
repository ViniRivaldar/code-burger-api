module.exports= {
    dialect: "postgres",
    host:"localhost",
    username:"postgres",
    password:process.env.PASSORD,
    database:process.env.DATABASE,
    define:{
        timespamps: true,
        underscored:true,
        underscoredall:true
    }
}