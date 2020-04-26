'use strect'

require('dotenv').config()
const express = require('express')
const superagent = require('superagent')
const pg = require('pg')
const methodOverride = require('method-override')




// =======================main var==========================
const app = express();
const PORT = process.env.PORT || 3000
const client = new pg.Client(process.env.DATABASE_URL)

// ================================uses===================

app.use(express.static('./public')); 
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

client.connect()
.then(()=>{
app.listen(PORT,()=>{
    console.log(`i am a live ${PORT}` )
})

})

// ========================rout 
app.get('/', homePageHandler )
app.get('/add', addHandler )
app.get('/myClection', myClectionHandler )
app.get('/ditales/:detal_id', detalesHandler )
app.put('/update/:update_id', updateHandler )
app.put('/delete/:delete_id', deleteHandler )








// =========================================


function addHandler(req,res){
    let {name,img,level} =req.query
    let sql = 'INSERT INTO degemon_table (name,img,level)VALUES ($1,$2,$3);'
    let safValues =[name,img,level];
    client.query(sql,safValues)
    .then(result=>{
        res.redirect('/myClection')
    })

}

function myClectionHandler(req,res){
    let sql = 'SELECT * FROM degemon_table;'
    
    client.query(sql)
    .then(result=>{
        res.render('pages/myCliction ', {degetal:result.rows})
    })

}

function detalesHandler(req,res){
    let param = req.params.detal_id
    let {name,img,level} =req.query
    let sql = 'SELECT * FROM degemon_table WHERE id=$1;'
    let safValues =[param]
    client.query(sql,safValues) 
     .then(result=>{
        res.render('pages/details ', {majd:result.rows[0]})
    })

}

function updateHandler (req,res){

    let param = req.params.detal_id
    let {name,img,level} =req.query
    let sql = 'UPDATE degemon_table SET  name=$1, img=$2 level=$3, WHERE id=$4;'
    let safValues=  [name,img,level,param ]
    client.query(sql,safValues)
    .then(result=>{
        res.redirect(`/ditales/${params}`)
    })


}
 function deleteHandler(req,res){
    let param = req.params.delete_id
    let sql ='DELETE FROM degemon_table WHERE id=$1'
    let safValues = [param]
    client.query(sql,safValues)
    .then(result=>{
        res.redirect(`/myCliction`)
    })

     
 }
















function homePageHandler(req,res){
    let url ='https://digimon-api.herokuapp.com/api/digimon'
    superagent.get(url)
    .then(result =>{
        let resultArray = result.body.map(val=>{
            return new Degemon(val)
        })
        res.render('index' , {degemonArray :resultArray })
    })
}

function Degemon (val){
this.name = val.name
this.img = val.img
this.level = val.level

}
