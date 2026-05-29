const express = require('express')
const dotenv = require('dotenv')
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { createRemoteJWKSet, jwtVerify } = require('jose-cjs');
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



const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)




//  JWT Token
const verifyToken = async (req, res, next) => {
    const authHeader = req?.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json({ Message: "Unauthorized" });
    }
    // console.log(token)

    try {
        const { payload } = await jwtVerify(token, JWKS)
        console.log(payload)
        next()

    } catch (error) {
        return res.status(403).json({ message: "Forbidden" })
    }

}




async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const db = client.db("studynook")
        const roomCollection = db.collection("rooms")
        const bookingCollection = db.collection("bookings")


        // See all the Room
        // app.get('/room', async (req, res) => {
        //     const result = await roomCollection.find().toArray()
        //     res.json(result)

        // })

        app.get('/room', async (req, res) => {

            const {
                search,
                amenities,
                minPrice,
                maxPrice,
                floor,
                userId
            } = req.query;

            let query = {};

            if (userId) {
                query.userId = userId;
            }


            if (search) {
                query.roomName = {
                    $regex: `^${search}`,
                    $options: "i"
                };
            }

            if (amenities) {
                const amenitiesArray = Array.isArray(amenities)
                    ? amenities
                    : amenities.split(",");

                query.amenities = {
                    $in: amenitiesArray
                };
            }


            if (minPrice || maxPrice) {
                query.pricePerHour = {};

                if (minPrice !== undefined && minPrice !== "") {
                    query.pricePerHour.$gte = Number(minPrice);
                }

                if (maxPrice !== undefined && maxPrice !== "") {
                    query.pricePerHour.$lte = Number(maxPrice);
                }
            }


            if (floor !== undefined && floor !== "") {
                query.floor = Number(floor);
            }

            const result = await roomCollection.find(query).toArray();

            res.send(result);
        });







        // Add Rooms
        app.post('/room', async (req, res) => {
            const roomData = {
                ...req.body,
                createdAt: new Date()
            };
            // req.body
            // console.log(roomData)
            const result = await roomCollection.insertOne(roomData)
            res.json(result)
        })


        // Single Book Details
        app.get('/room/:id', verifyToken, async (req, res) => {
            const { id } = req.params
            const result = await roomCollection.findOne({ _id: new ObjectId(id) })
            res.json(result);
        })


        // Booking Modal
        // app.post("/booking", verifyToken, async (req, res) => {
        //     const bookingData = req.body;
        //     const result = await bookingCollection.insertOne(bookingData)
        //     res.json(result);
        // })



        app.post("/booking", verifyToken, async (req, res) => {

            const bookingData = req.body;

            const {
                roomId,
                date,
                startTime,
                endTime
            } = bookingData;


            const alreadyBooked = await bookingCollection.findOne({
                roomId: roomId,
                date: date,
                startTime: startTime,
                endTime: endTime
            });


            if (alreadyBooked) {
                return res.status(400).send({
                    success: false,
                    message: "This room is already booked for this time slot"
                });
            }

            const result = await bookingCollection.insertOne(bookingData);

            await roomCollection.updateOne(
                { _id: new ObjectId(roomId) },
                {
                    $inc: {
                        bookingsCount: 1
                    }
                }
            );

            res.send({
                success: true,
                message: "Room booked successfully",
                result
            });
        });




        // My Booking Show
        app.get("/booking/:userId", async (req, res) => {
            const { userId } = req.params;
            // const bookingData = req.body;
            const result = await bookingCollection.find({
                userId: userId
            }).toArray()
            res.json(result);
        })



        // Cancel Romm Booking
        app.delete('/booking/:bookingId', verifyToken, async (req, res) => {
            const { bookingId } = req.params;
            const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) })
            res.json(result);
        })




        // EditModal Patch
        app.patch('/room/:id', verifyToken, async (req, res) => {
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
        app.delete('/room/:id', verifyToken, async (req, res) => {
            const { id } = req.params;
            const result = await roomCollection.deleteOne({ _id: new ObjectId(id) })
            res.json(result);
        })



        // Featured Romm
        app.get('/featured', async (req, res) => {
            const result = await roomCollection
                .find()
                .sort({ _id: -1 })
                .limit(6)
                .toArray();

            res.send(result);
        });



        // await client.db("admin").command({ ping: 1 });
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