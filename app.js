const express = require('express');
const app = express();

bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const mongoose = require('mongoose');
let conn = mongoose.createConnection('mongodb://arnab:1234@cluster0-shard-00-00-g2oxb.mongodb.net:27017,cluster0-shard-00-01-g2oxb.mongodb.net:27017,cluster0-shard-00-02-g2oxb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',{useNewUrlParser: true});
let Schema = new mongoose.Schema({
    _id: Object,
    uid: String,
    title: String,
    story: String
},{collection:'articles'});
var db = conn.model('db',Schema);

app.get('/', (req,res)=>{
    db.find({},(err,result)=>{
        res.render('home', {data: result});        
    });    
})

app.get('/new', (req,res)=>{
    res.render('newArticle');
})

app.post('/submit', urlEncodedParser, (req,res)=>{
    let uid = 'a'+Date.now();
    console.log(uid);
    conn.collection('articles').insertOne({
        uid: uid,
        title: req.body.title,
        story: req.body.story
    })
    res.redirect('/');
})

app.get('/article/:uri',(req,res)=>{
    db.findOne({uid:req.params.uri},(req,request)=>{
        console.log(request);
        res.render('article',{title:request.title, story:request.story});
    })
})

app.listen('8080',()=>{
    console.log('App running on port 8080');
});