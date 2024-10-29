const express = require('express')
const mysql =require('mysql')
const cors = require('cors')
xlsx = require('xlsx')
const bodyParser = require('body-parser');

const app = express()
app.use(cors())

let rese = [];

const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'dataa'
})
app.use(bodyParser.json());

    var workbook = xlsx.readFile("Predictions.xlsx")
    let worksheet = workbook.Sheets[workbook.SheetNames[0]]
    let range = xlsx.utils.decode_range(worksheet["!ref"])

    const tableName = 'dataset';

    db.query(`TRUNCATE TABLE ${tableName}`, (err, result) => {
      if (err) throw err;
      console.log(`Table ${tableName} truncated successfully.`);
    });

    for(let row = range.s.r; row<=range.e.r; row++){
        let data= [];
        for(let col = range.s.c; col<=range.e.c;col++){
                let cell = worksheet[xlsx.utils.encode_cell({r:row,c:col})]
                data.push(cell.v)
        }
        console.log(data)

        let sql1 = "INSERT INTO `dataset` (`temperature`,`humidity`,`moisture`,`soiltype`,`croptype`,`nitrogen`,`potassium`,`phosporus`,`fertilizername`) VALUES(?,?,?,?,?,?,?,?,?)"
       
        db.query(sql1,data,(err,results,fields)=>{
            if(err){
                return console.log(err.message)
            }
            console.log('User ID' + results.insertedID)
        })
    }

   

app.get('/', (re,res)=>{
    return res.json('From Backend Side');
})

app.get('/fertilizer', (req,res)=>{
    const sql = 'select * from user';
    db.query(sql,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})
let arr;
app.post('/recomend', (req,res)=>{
    // res.setHeader('Content-Type', 'application/json');
    // res.send({ message: 'Hello World' });
    
     const  name  = req.body.temperature;
     const nit = req.body.nitrogen;
     const pot = req.body.potassium;
     const pos = req.body.phosphorous;
     const soil = req.body.soiltype;
     const crop = req.body.croptype;
    
     let query = 'SELECT * FROM dataset where nitrogen= ? AND potassium = ? AND phosporus = ? AND soiltype = ? AND croptype = ? ' 
  
    db.query(query, [ nit, pot, pos, soil , crop ], (err, rows) => { 
        if(err) throw err; 
        var rde = rows[0].fertilizername;
        console.log(rde); 
        console.log(rows)
        
    return JSON.stringify(rows);
        
        //console.log(rde); 
        // console.log('accountNumber is : ', rows[0].fertilizername);
        // let resulta = rows[0].fertilizername;
        // console.log("Fertilizer Name" , resulta)
        // return res.json(resulta);
        // return JSON.stringify(resulta);
         //res.json({ message: 'Data received successfully', data: { resulta } });
    }); 
     console.log(soil,nit,pot,pos,crop);
     
})

app.get('/rec', function(req, res) {


    const  name  = req.body.temperature;
     const nit = req.body.nitrogen;
     const pot = req.body.potassium;
     const pos = req.body.phosphorous;
     const soil = req.body.soiltype;
     const crop = req.body.croptype;
    
     let query = 'SELECT * FROM dataset where nitrogen= ? AND potassium = ? AND phosporus = ? AND soiltype = ? AND croptype = ? ' 
  
    db.query(query, [ nit, pot, pos, soil , crop ], (err, rows) => { 
        if(err) throw err; 
        
        console.log(rows)
        return JSON.stringify(rows);
    }); 
  });


app.listen(8081,()=>{
   console.log('Listening....') 
})

