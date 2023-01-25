//express서버 만들기
const express = require("express");
const cors = require("cors");
//mysql부르기
const mysql = require("mysql");
//서버 생성 ---> express()호출
const app = express();
//프로세서의 주소 포트번호 지정
const port = 8080;
const multer = require("multer");
//서버의 upload를 클라이언트 접근가능하도록 설정 
app.use("/upload", express.static("upload"));
//json형식의 데이터를 처리할수 있도록 설정
app.use(express.json());
//브라우저의 CORS이슈를 막기 위해 사용하는 코드 
app.use(cors());
//diskStorage() ---> 파일을 저장할때의 모든 제어 기능을 제공
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/');
    },
    filename: (req,file,cb)=>{
        const newFilename = file.originalname;
        cb(null, newFilename);
    }
})
const upload = multer({ storage: storage });
app.post('/upload', upload.single('file'), (req, res) => {
    res.send({
        imageUrl: req.file.filename
    })
});

//연결선 만들기
const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    port: "3306",
    database: "shopping"
})
//연결하기
conn.connect();

//get요청시 응답 app.get(경로, 콜백함수)
app.get('/products', (req, res)=>{
    conn.query('select * from products',function(error, result, fields){
        res.send(result);
    });
    
})
app.get("/products/:id", (req, res)=>{
    const params = req.params; //{id: 2}
    const { id } = params;
    conn.query(`select * from products where p_id=${id}`,
    function(error, result, fields){
        res.send(result);
    });
})
//addProduct post요청이 오면 처리 
//req => 요청하는 객체 res => 응답하는 객체
app.post("/addProduct",async (req, res) => {
    const { p_name, p_price, p_desc, p_img, p_quantity } = req.body;
    conn.query("insert into products(p_name,p_price, p_desc, p_img, p_quantity) values(?,?,?,?,?)",
    [p_name, p_price, p_desc, p_img, p_quantity],
    (err,result, fields)=>{
        res.send("ok");
    }
    )
})

//서버를 구동
app.listen(port, ()=>{
    console.log('서버가 돌아가고 있습니다.');
})