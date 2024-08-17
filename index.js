const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jecns.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    const ProductsCollection = client.db('Jobtask').collection('products')
    const BransCollection = client.db('Jobtask').collection('brand')
    const CategoryCollection = client.db('Jobtask').collection('category')

   //All Product
    app.get('/products', async (req, res) => {
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page) - 1;

      const brands = req.query.brands || [];
      const categories = req.query.categories || [];
      const minPrice = parseFloat(req.query.minPrice);
      const maxPrice = parseFloat(req.query.maxPrice);

      const sorting = req.query.sorting
      const search = req.query.search || ''

      const query = {};

      //Searching
      if (search) {
        query.productName = { $regex: search, $options: 'i' };
      }

      //Sorting
      const options = {
        sort: {}
      };
      if (sorting === 'acs') {
        options.sort.price = 1;
      } else if (sorting === 'dcs') {
        options.sort.price = -1;
      } else if (sorting === 'date-acs') {
        options.sort.creationDate = 1;
      }

      //Filtering
      if (brands.length > 0) {
        query.brandName = { $in: Array.isArray(brands) ? brands : [brands] };
      }

      if (categories.length > 0) {
        query.category = { $in: Array.isArray(categories) ? categories : [categories] };
      }

      if (minPrice || maxPrice) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }


      const result = await ProductsCollection
        .find(query)
        .sort(options.sort)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

   //Count Product for pages
    app.get('/products-count', async (req, res) => {
      const brands = req.query.brands || [];
      const categories = req.query.categories || [];
      const minPrice = parseFloat(req.query.minPrice) || 0;
      const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;
      const search = req.query.search || ''
      const query = {};
      if (search) {
        query.productName = { $regex: search, $options: 'i' };
      }

      if (brands.length > 0) {
        query.brandName = { $in: Array.isArray(brands) ? brands : [brands] };
      }

      if (categories.length > 0) {
        query.category = { $in: Array.isArray(categories) ? categories : [categories] };
      }

      if (minPrice || maxPrice) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }

      const count = await ProductsCollection.countDocuments(query);
      res.send({ count });
    })

    //Brands
    app.get('/All-brand', async (req, res) => {
      const result = await BransCollection.find().toArray()
      res.send(result)
    })

    //Category 
    app.get('/All-category', async (req, res) => {
      const result = await CategoryCollection.find().toArray()
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Assignmnet-14 is running')
})

app.listen(port, () => {
  console.log(`Assignmnet-14 is running on ${port}`);
})