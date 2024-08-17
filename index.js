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

   
    app.get('/itemsCount', async(req, res)=>{
        const count= await itemsCollection.estimatedDocumentCount()
        res.send({count})
    })



// Search products by name
  app.get("/item", async(req,res)=>{
    const { q } = req.query;
    const items=await itemsCollection.find({ productName: new RegExp(q, 'i') }).toArray()
    res.send(items)
    console.log('search',items)
    //console.log('res',res)
})

// sorting according to latest date , ascending and descending start
  app.get("/shortedItem", async(req,res)=>{
    const { q } = req.query;
    const page=parseInt(req.query.page)
        const size=parseInt(req.query.size)
    let sortCriteria;

    if (q === 'latest') {
        sortCriteria = { productCreationDateTime: -1 }; // Sort by latest products first
      } else if (q === 'dsc') {
        sortCriteria = { price: -1 }; // Sort by price, highest to lowest
      } else {
        sortCriteria = { price: 1 }; // Sort by price, lowest to highest (default)
      }
    const items=await itemsCollection.find()
    .sort(sortCriteria)
    .skip(page * size)
    .limit(size)
    .toArray()
    res.send(items)
    console.log('search',items)
})
// sorting according to latest date , ascending and descending start

//filter for band name, catagory, min price, max price
app.get("/filterItem", async(req,res)=>{
    const  q  = req.query;
    let filter={}
    if(q.brandName){
        filter.brandName=new RegExp(q.brandName, 'i')
    }
    if(q.categoryName){
        filter.categoryName=new RegExp(q.categoryName, 'i')
    }
    if (q.minPrice) {
        filter.price = { ...filter.price, $gte: Number(q.minPrice) };
      }
    if (q.maxPrice) {
        filter.price = { ...filter.price, $lte: Number(q.maxPrice) };
      }
    //const items=await itemsCollection.find({ brandName: new RegExp(q.brandName, 'i') }).toArray()
    const items=await itemsCollection.find(filter).toArray()
    res.send(items)
    console.log('filter',q)
    
    
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