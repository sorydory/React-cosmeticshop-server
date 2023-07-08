const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
const port = 8081;
const multer = require("multer");

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use("/upload", express.static("upload"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    const newFilename = file.originalname;
    cb(null, newFilename);
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.send({
    imageUrl: req.file.filename,
  });
});

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  port: "3306",
  database: "shop",
  authPlugins: {
    mysql_native_password: () =>
      require("mysql2/lib/auth/plugins/mysql_native_password"),
  },
});

conn.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.get("/products", (req, res) => {
  conn.query("select * from products", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  conn.query(
    `select * from products where p_id=${id}`,
    function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    }
  );
});

app.post("/addProduct", (req, res) => {
  const { p_name, p_price, p_desc, p_img, p_quantity } = req.body;
  conn.query(
    "insert into products(p_name,p_price, p_desc, p_img, p_quantity) values(?,?,?,?,?)",
    [p_name, p_price, p_desc, p_img, p_quantity],
    (err, result, fields) => {
      if (err) throw err;
      res.send("ok");
    }
  );
});

app.listen(port, () => {
  console.log("서버가 돌아가고 있습니다.");
});
