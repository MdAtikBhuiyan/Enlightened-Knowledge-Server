const express = require('express');
const cors = require('cors');


require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;


// middleware 
app.use(cors())
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bbvd3eh.mongodb.net/?retryWrites=true&w=majority`;

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

        const allBookCollection = client.db('libraryBooks').collection('allBooks')


        // getting all categories book and all books 
        app.get('/allBooks', async (req, res) => {
            const category = req.query;
            // console.log('category', category);

            let query = {};
            if (req.query?.category) {
                query = {
                    category: req.query.category
                }
            }
            const result = await allBookCollection.find(query).toArray()
            res.send(result)
        })

        // single book details
        app.get('/singleBook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allBookCollection.findOne(query)
            res.send(result)
        })

        // adding books
        app.post('/addBooks', async (req, res) => {

            const addData = req.body;
            // console.log('add data', addData);
            const result = await allBookCollection.insertOne(addData)
            res.send(result)

        })
        // update book info
        app.put('/updateBook/:id', async (req, res) => {
            const data = req.body;
            const id = req.params.id;
            // console.log("updated data", data);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updateData = {
                $set: {
                    img: data.img,
                    name: data.name,
                    quantity: data.quantity,
                    author: data.author,
                    category: data.category,
                    rating: data.rating,
                    description: data.description
                }
            }

            const result = await allBookCollection.updateOne(filter, updateData, options)
            res.send(result)
        })








        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Library app listening on port ${port}`)
})