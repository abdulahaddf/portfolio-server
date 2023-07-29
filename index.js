const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wg0iu7v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10000,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect((err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    const articlesCollection = client.db("portfolio").collection("articles");
    const projectsCollection = client.db("portfolio").collection("projects");
    //get all articles
    app.get("/articles", async (req, res) => {
      const result = await articlesCollection
        .find()
        .sort({ createAt: -1 })
        .toArray();
      res.send(result);
    });
    //get articles by ID
    app.get("/singlearticles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await articlesCollection.findOne(query);
      res.send(result);
    });

    //adding articles
    app.post("/articles", async (req, res) => {
      const newarticles = req.body;
      newarticles.createAt = new Date();
      console.log(newarticles);
      const result = await articlesCollection.insertOne(newarticles);
      res.send(result);
    });

    // delete articles
    app.delete("/singlearticles/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await articlesCollection.deleteOne(query);
      res.send(result);
    });

    //projects api---------------------------------------------------------
    //get all projects
    app.get("/projects", async (req, res) => {
      const result = await projectsCollection
        .find()
        .sort({ createAt: -1 })
        .toArray();
      res.send(result);
    });
    //get projects by ID
    app.get("/singleprojects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectsCollection.findOne(query);
      res.send(result);
    });

    //adding projects
    app.post("/projects", async (req, res) => {
      const newprojects = req.body;
      newprojects.createAt = new Date();
      console.log(newprojects);
      const result = await projectsCollection.insertOne(newprojects);
      res.send(result);
    });

    // delete projects
    app.delete("/singleprojects/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await projectsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("portfolio server is running");
});

app.listen(port, () => {
  console.log(`portfolio Server is running on port: ${port}`);
});
