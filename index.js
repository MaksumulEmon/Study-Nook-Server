const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()
const uri = process.env.MONGODB_URI;


const app = express()
const PORT = process.env.PORT

app.use(cors());
app.use(express.json())



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

        const db = client.db("studynook")
        const roomCollection = db.collection("rooms")


        // See all the Room
        app.get('/room', async (req, res) => {
            const result = await roomCollection.find().toArray()
            res.json(result)

        })

        // Add Rooms
        app.post('/room', async (req, res) => {
            const roomData = req.body
            console.log(roomData)
            const result = await roomCollection.insertOne(roomData)
            res.json(result)
        })


        // Single Book Details

        app.get('/room/:id', async (req, res) => {
            const { id } = req.params
            const result = await roomCollection.findOne({ _id: new ObjectId(id) })
            res.json(result);
        })



        // EditModal Patch
        app.patch('/room/:id', async (req, res) => {
            const { id } = req.params;
            const updatedData = req.body;
            console.log(updatedData);

            const result = await roomCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            )

            res.json(result);
        })


        // DeleteModal Room
        app.delete('/room/:id', async(req, res) =>{
            const {id} = req.params;
            const result = await roomCollection.deleteOne({_id: new ObjectId(id)})
            res.json(result);
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send("Server is running fine !")
})


app.listen(PORT, () => {
    console.log(`server is Runnning on Port ${PORT}`)
})