const {MongoClient,ObjectID} = require('mongodb')

const databaseURL = process.env.MONGODB_URL
const databaseName = 'Task_Manager'

MongoClient.connect(databaseURL,{useNewUrlParser:true},(error,client)=>{
    if(error)
        return console.log("Cannot connect")

    console.log('Connected to database....')


    const db = client.db(databaseName)

    const updatePromise =  db.collection('Users').deleteMany({name:'deep kumar'})

    updatePromise.then((res)=>{
        console.log(res)
    }).catch((error)=>{
        console.log(error)
    })
})