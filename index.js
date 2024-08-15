const express= require('express')
const cors=require('cors')
const app= express()
const port=process.env.PORT||5012
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

//middleware-------
app.use(cors())
app.use(express.json())

//vFWsaSJ3bxwjGoBn   
//Electra


 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mnncxar.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const itemsCollection = client.db("Electra").collection('Items');

    //get operation------
    app.get("/items", async(req,res)=>{
        const cursor=await itemsCollection.find()
        const items=await cursor.toArray(cursor)
        res.send(items)
    })
    
    app.get('/itemsCount', async(req, res)=>{
        const count= await itemsCollection.estimatedDocumentCount()
        res.send({count})
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req,res)=>{
    res.send('Store management is running')
})

app.listen(port, ()=>{
    console.log(`Electra is running on port ${port}`)
})