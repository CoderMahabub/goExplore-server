const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const mongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

// DB Connection  Start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwtvo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

//Root Get
app.get('/', (req, res) => {
    res.send('goExplore the World!')
})

// DB MAIN PART STARTS HERE
client.connect(err => {
    const packageCollection = client.db("goExplore").collection("packages");
    const blogCollection = client.db("goExplore").collection("blogs");
    const ordersCollection = client.db("goExplore").collection("orders");

    // Get All The Packages
    app.get('/packages', async (req, res) => {
        const result = await packageCollection.find({}).toArray();
        res.send(result);
    })

    // Get All Blogs
    app.get('/blogs', async (req, res) => {
        const result = await blogCollection.find({}).toArray();
        res.send(result);
    })

    // Post Booking Orders
    app.post('/addOrders', (req, res) => {
        ordersCollection.insertOne(req.body).then((result) => {
            res.send(result.insertedId);
        })
    })

    // Get All Orders
    app.get('/allOrders', async (req, res) => {
        const result = await ordersCollection.find({}).toArray();
        res.send(result);
    })

    // Delete Single Booking
    app.delete('/deleteBooking/:id', async (req, res) => {
        const id = req.params.id;
        const result = await ordersCollection.deleteOne({ _id: ObjectId(id) });
        res.send(result)
    })

    // Get Single Booking
    app.get('/singleOrder/:id', (req, res) => {
        ordersCollection.findOne({ _id: ObjectId(req.params.id) }).then(result => {
            console.log(result);
            res.send(result)
        });
    })
    // Update Booking Status
    app.put('/update/:id', (req, res) => {
        const id = req.params.id;
        const updatedInfo = req.body;
        ordersCollection.updateOne({ _id: ObjectId(id) }, {
            $set: {
                status: updatedInfo.status,
            }
        })
            .then(result => console.log(result))
    })

    // Post Single Package
    app.post('/packages', (req, res) => {
        console.log(req.body);
        packageCollection.insertOne(req.body).then(result => {
            res.send(result.insertedId);
        })
    })

    // Delete Single Package
    app.delete('/deletePackage/:id', async (req, res) => {
        const id = req.params.id;
        const result = await packageCollection.deleteOne({ _id: ObjectId(id) });
        res.send(result)
    })


    // client.close();
});

// App Listen
app.listen(port, () => {
    console.log(`Running server at http://localhost:${port}`)
})