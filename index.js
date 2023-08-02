require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//midlleware
app.use(cors());
app.use(express.json());







const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zhsy6ko.mongodb.net/?retryWrites=true&w=majority`;

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
            //     await client.connect();



            const collegesCollection = client.db("collegeDB").collection("college")
            const usersCollection = client.db("collegeDB").collection("user")


            app.get('/colleges', async (req, res) => {
                  const result = await collegesCollection.find().toArray();
                  res.send(result)
            })
            app.get('/colleges/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await collegesCollection.findOne(query);
                  res.send(result);

            })
            app.get('/colleges/search/:name', async (req, res) => {
                  const name = req.params.name;
                  const query = { college_name: { $regex: new RegExp(name, 'i') } }; // Case-insensitive search
                  const result = await collegesCollection.find(query).toArray();
                  res.send(result);
            });



            app.post('/users', async (req, res) => {
                  const { name, email, phone, subject, address, dateOfBorth, image, college } = req.body;
                  const newUser = {
                        name,
                        email,
                        phone,
                        subject,
                        address,
                        dateOfBorth,
                        image,
                        college

                  }
                  console.log(newUser);
                  const result = await usersCollection.insertOne(newUser);
                  res.send(result)
            })
            // app.get('/users', async (req, res) => {
            //       const result = await usersCollection.find().toArray()
            //       res.send(result)
            // })

            app.get('/users/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { email: email };
                  const result=await usersCollection.findOne(query);
                  // console.log(result);
                  res.send(result)
            })

            app.get('/user/:id', async (req, res) => {
                  const id = req.params.id;
                 
                  const query = { _id: new ObjectId(id) };

                  const result = await usersCollection.findOne(query);
                  res.send(result);

            })
            app.put('/user/:id', async (req, res) => {

                  const id = req.params.id;
                  // console.log("update", id);
                  const body = req.body;
                  console.log(body);
                  const { phone, subject, address, college } = body;
                  const filter = { _id: new ObjectId(id) }
                  const updateDoc = {
                        $set: {
                              phone, 
                              subject, 
                              address, 
                              college 
                        }
                  }
                  // console.log("update", updateDoc);
                  const result = await usersCollection.updateOne(filter, updateDoc)
                  res.send(result)
            })


            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
            // Ensures that the client will close when you finish/error
            //     await client.close();
      }
}
run().catch(console.dir);










app.get('/', async (req, res) => {
      res.send("college server is running")
})
app.get('/test', async (req, res) => {
      res.send("college server is testing")
})


app.listen(port, () => {
      console.log("college server is running");
})