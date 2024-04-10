const express = require("express");
const cors = require("cors");
const user = require("./db/user");
const product = require("./db/product");
const jwt = require("jsonwebtoken");
const jwtkey = "e-comm";
require("./db/config");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  let data = new user(req.body);
  let result = await data.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtkey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send("Something went wrong");
    }
    res.send({ result, auth: token });
  });
});

app.post("/login", async (req, res) => {
  let data = await user.findOne(req.body).select("-password");
  if (req.body.email && req.body.password) {
    if (data) {
      jwt.sign({ data }, jwtkey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send("Something went wrong");
        }
        res.send({ data, auth: token });
      });
    } else {
      res.send("No user found");
    }
  } else {
    res.send("Enter both the data");
  }
});

app.post("/add-product", async (req, res) => {
  let data = new product(req.body);
  let result = await data.save();
  res.send(result);
});

app.get("/products", async (req, res) => {
  let data = await product.find();
  if (data.length > 0) {
    res.send(data);
  } else {
    res.send("No products found");
  }
});

app.delete("/product/:id", async (req, res) => {
  let data = await product.deleteOne({ _id: req.params.id });
  res.send(data);
});

app.get("/product/:id", async (req, res) => {
  let data = await product.findOne({ _id: req.params.id });
  if (data) {
    res.send(data);
  } else {
    res.send("No data found");
  }
});

app.put("/product/:id", async (req, res) => {
  let data = await product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(data);
});

app.get("/search/:key", async (req, res) => {
  let data = await product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
    ],
  });
  res.send(data);
});

function verifyToken(req, res, next) {
  let token = req.headers["Authorization"];
  if (token) {
    token = token.split(" ")[1];
    console.log("middleware called if", token);
    jwt.verify(token, jwtkey, (err, valid) => {
      if (err) {
        res.status(401).send("Please provide valid token");
      } else {
        next();
      }
    });
  } else {
    res.status(403).send("Please add token with header");
  }
}

app.listen(5500, () => {
  console.log("Server runnig on port", 5500);
});
