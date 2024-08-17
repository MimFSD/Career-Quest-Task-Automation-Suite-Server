const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const products = require("./products.json");
const app = express();
// middleware
app.use(express.json());
//Must remove "/" from your production URL
app.use(
    cors({
        origin: ["http://localhost:5173"],
    }),
);
const uri = process.env.MONGODB_URI;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = client.db("ProductPulseDB");
        const productsCollection = db.collection("products");

        app.get("/seed", async (req, res) => {
            await productsCollection.deleiteMany();
            await productsCollection.deleteMany();
            await productsCollection.insertMany(products);
            return res.send({ message: "seed successfully" });
        });
@@ -77,6 +77,16 @@ async function run() {
            res.send({ count });
        });

        app.get("/categorization", async (req, res) => {
            const brandNames = await productsCollection
                .aggregate([{ $group: { _id: "$brand" } }, { $project: { _id: 0, brand: "$_id" } }])
                .toArray();
            const categories = await productsCollection
                .aggregate([{ $group: { _id: "$category" } }, { $project: { _id: 0, category: "$_id" } }])
                .toArray();
            res.send({ brandNames, categories });
        });
       
    } finally {
     
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Product Pulse is running...");
});
app.listen(port, () => {
  console.log("Product Pulse server running on", port);
});