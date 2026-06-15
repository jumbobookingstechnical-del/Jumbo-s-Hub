const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let DB_FILE = "db.json";

/* ================= DATABASE HELPERS ================= */

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

/* ================= PRODUCTS ================= */

app.get("/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

/* ================= ORDERS ================= */

app.post("/order", (req, res) => {
  const db = readDB();

  const order = {
    id: Date.now(),
    items: req.body.items,
    total: req.body.total,
    status: "paid",
  };

  db.orders.push(order);
  writeDB(db);

  res.json({ success: true, order });
});

/* ================= ADMIN ================= */

app.get("/admin/orders", (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

app.listen(3000, () => {
  console.log("Trendify backend running on port 3000");
});
